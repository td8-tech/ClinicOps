-- Update Trigger to handle Clinic Creation on Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_clinic_id uuid;
  v_role text;
begin
  -- Scenario 1: User is registering a NEW Clinic (clinic_name provided in metadata)
  IF new.raw_user_meta_data->>'clinic_name' IS NOT NULL THEN
    insert into public.clinicas (nome)
    values (new.raw_user_meta_data->>'clinic_name')
    returning id into v_clinic_id;
    
    v_role := 'admin';
    
  -- Scenario 2: User is being INVITED to an existing Clinic (clinica_id provided in metadata)
  ELSIF new.raw_user_meta_data->>'clinica_id' IS NOT NULL THEN
    v_clinic_id := (new.raw_user_meta_data->>'clinica_id')::uuid;
    v_role := coalesce(new.raw_user_meta_data->>'role', 'recepcao');
    
  -- Scenario 3: Validation Error (Block signup if no clinic info)
  ELSE
    RAISE EXCEPTION 'É obrigatório vincular o usuário a uma clínica (Nova ou Existente).';
  end if;

  insert into public.profiles (id, clinica_id, role, full_name)
  values (
    new.id,
    v_clinic_id,
    v_role,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;
