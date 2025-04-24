-- Enable Supabase auth if not already enabled
-- This is typically done through the Supabase dashboard, but we include it here for documentation

-- Add a trigger to create a user record when a new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (name, email, is_admin, balance)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'name', 'New User'), NEW.email, FALSE, 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Create row level security policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User can only see and update their own profile (by email)
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() IS NOT NULL AND email = auth.email());

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() IS NOT NULL AND email = auth.email());

-- Anyone can view races and players (but not update them unless admin)
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view races" ON public.races
  FOR SELECT USING (true);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view players" ON public.players
  FOR SELECT USING (true);

-- Users can only see their own bets
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bets" ON public.bets
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND email = auth.email())
  );

-- Allow users to place bets
CREATE POLICY "Users can place bets" ON public.bets
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND email = auth.email())
  );

-- Create admin policies
-- Admins can do everything
CREATE POLICY "Admins can do anything" ON public.users
  USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.users WHERE email = auth.email() AND is_admin = TRUE));

CREATE POLICY "Admins can update races" ON public.races
  FOR ALL USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.users WHERE email = auth.email() AND is_admin = TRUE));

CREATE POLICY "Admins can update players" ON public.players
  FOR ALL USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.users WHERE email = auth.email() AND is_admin = TRUE));

CREATE POLICY "Admins can manage all bets" ON public.bets
  FOR ALL USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.users WHERE email = auth.email() AND is_admin = TRUE)); 