-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create clinicas table
create table public.clinicas (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  status_assinatura text default 'active',
  created_at timestamp with time zone default now()
);

-- Enable RLS on clinicas
alter table public.clinicas enable row level security;

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  clinica_id uuid references public.clinicas(id) on delete cascade,
  role text check (role in ('admin', 'medico', 'recepcao')) not null default 'recepcao',
  full_name text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create pacientes table
create table public.pacientes (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid references public.clinicas(id) on delete cascade not null,
  nome text not null,
  cpf text,
  data_nascimento date,
  telefone text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on pacientes
alter table public.pacientes enable row level security;

-- Create atendimentos table
create table public.atendimentos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid references public.clinicas(id) on delete cascade not null,
  paciente_id uuid references public.pacientes(id) on delete cascade not null,
  profissional_id uuid references public.profiles(id) on delete set null,
  data_hora timestamp with time zone not null,
  descricao text,
  status text default 'agendado',
  created_at timestamp with time zone default now()
);

-- Enable RLS on atendimentos
alter table public.atendimentos enable row level security;

-- Create auditoria table
create table public.auditoria (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid references public.clinicas(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  acao text not null,
  tabela text not null,
  detalhes jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS on auditoria
alter table public.auditoria enable row level security;

-- Documentos
create table public.documentos (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid references public.clinicas(id) on delete cascade not null,
  paciente_id uuid references public.pacientes(id) on delete cascade not null,
  nome_arquivo text not null,
  url text not null,
  tipo text,
  created_at timestamp with time zone default now()
);
alter table public.documentos enable row level security;

-- RLS Policies

-- Helper function to get current user's clinic_id
create or replace function public.get_my_clinic_id()
returns uuid as $$
  select clinica_id from public.profiles where id = auth.uid()
$$ language sql security definer;

-- Clinicas policies
create policy "Clinicas viewable by members" on public.clinicas
  for select using (id = public.get_my_clinic_id());

create policy "Clinicas createable by auth users" on public.clinicas
  for insert with check (auth.role() = 'authenticated');

-- Profiles policies
create policy "Profiles viewable by clinic members" on public.profiles
  for select using (clinica_id = public.get_my_clinic_id());

create policy "Profiles updatable by self" on public.profiles
  for update using (id = auth.uid());

-- Pacientes policies
create policy "Pacientes viewable by clinic members" on public.pacientes
  for select using (clinica_id = public.get_my_clinic_id());

create policy "Pacientes insertable by clinic members" on public.pacientes
  for insert with check (clinica_id = public.get_my_clinic_id());

create policy "Pacientes updatable by clinic members" on public.pacientes
  for update using (clinica_id = public.get_my_clinic_id());

create policy "Pacientes deletable by admins" on public.pacientes
  for delete using (clinica_id = public.get_my_clinic_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Atendimentos policies
create policy "Atendimentos viewable by clinic members" on public.atendimentos
  for select using (clinica_id = public.get_my_clinic_id());

create policy "Atendimentos insertable by clinic members" on public.atendimentos
  for insert with check (clinica_id = public.get_my_clinic_id());

-- Documentos policies
create policy "Documentos viewable by clinic members" on public.documentos
  for select using (clinica_id = public.get_my_clinic_id());

create policy "Documentos insertable by clinic members" on public.documentos
  for insert with check (clinica_id = public.get_my_clinic_id());

-- Trigger for new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, clinica_id, role, full_name)
  values (
    new.id,
    (new.raw_user_meta_data->>'clinica_id')::uuid,
    coalesce(new.raw_user_meta_data->>'role', 'recepcao'),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
