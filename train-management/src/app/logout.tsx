import { supabase } from 'src/app/lib/supabaseClient';
import { Button } from 'src/app/components/ui/button'

const LogoutButton = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return <Button onClick={handleLogout}>Logout</Button>
}

export default LogoutButton
