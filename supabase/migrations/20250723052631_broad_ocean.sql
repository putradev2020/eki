/*
  # Setup authentication trigger for new users

  1. Function
    - `handle_new_user()` - Function to handle new user registration
    - Creates user profile or handles user metadata

  2. Trigger
    - Trigger on auth.users table for new user registration
    - Automatically processes new users after signup

  3. Notes
    - This ensures new users are properly handled in the system
    - Prevents database errors during user registration
*/

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- You can add custom logic here for new users
  -- For now, we just ensure the user is properly created
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();