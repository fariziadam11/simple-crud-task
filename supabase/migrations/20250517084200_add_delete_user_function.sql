-- Create a function to delete a user account
-- This will be called from the client-side
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS json AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the ID of the currently authenticated user
  user_id := auth.uid();
  
  -- Check if user is authenticated
  IF user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not authenticated'
    );
  END IF;

  -- Delete the user from auth.users
  -- Note: This requires that the function has the proper permissions
  -- In production, you might need to use a webhook or server-side function
  BEGIN
    DELETE FROM auth.users WHERE id = user_id;
    RETURN json_build_object(
      'success', true,
      'error', null
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;

-- Create a security policy for the function
COMMENT ON FUNCTION public.delete_user() IS 'Allows users to delete their own account';
