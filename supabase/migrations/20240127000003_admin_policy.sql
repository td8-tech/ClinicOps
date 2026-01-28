-- Policy for Super Admin to view all clinics
-- Note: Replace 'admin@clinicops.com' with your actual super admin email or use a role check if you implement roles later.

create policy "Super Admin View All Clinics"
  on public.clinicas
  for select
  using (
    auth.email() = 'admin@clinicops.com' -- Change this to your email for testing!
  );
