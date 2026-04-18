import { createClient } from '@/utils/supabase/server';
import Navigation from './Navigation';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <Navigation isLoggedIn={!!user} />;
}
