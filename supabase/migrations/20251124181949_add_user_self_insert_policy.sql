/*
  # Add User Self-Insert Policy
  
  This migration adds a policy to allow users to insert their own records
  when signing up via magic link authentication.
  
  ## Changes
  - Add INSERT policy for users table to allow authenticated users to create their own record
*/

-- Allow users to insert their own record
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
