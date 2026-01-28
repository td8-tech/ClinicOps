-- Fix Auditoria Foreign Key to allow joining with Profiles
-- Currently auditoria.user_id references auth.users
-- But profiles.id ALSO references auth.users
-- To enable easy joining in PostgREST (Supabase), we need a clear path.

-- Let's make auditoria.user_id ALSO reference public.profiles(id)
-- Since public.profiles.id is a PK (and FK to auth.users), this is valid and safe.

alter table public.auditoria
  drop constraint auditoria_user_id_fkey,
  add constraint auditoria_user_id_fkey
  foreign key (user_id)
  references public.profiles(id)
  on delete set null;
