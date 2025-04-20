'use client';
import { useEffect, useState } from 'react';
import { createClient } from 'src/utils/supabase/client';

export default function AdminControls() {
  const supabase = createClient();
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: userDetails } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        // Handle null/undefined by providing a default empty string
        setRole(userDetails?.role ?? '');
      }
    };

    fetchRole();
  }, [supabase]);

  if (role !== 'admin') return null;

  return (
    <div className="flex gap-4">
      <button className="btn">Add Train</button>
      <button className="btn">Edit Train</button>
      <button className="btn">Delete Train</button>
    </div>
  );
}
