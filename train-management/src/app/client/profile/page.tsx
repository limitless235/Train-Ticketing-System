// src/app/client/profile/page.tsx
'use client';
import { useEffect, useState } from 'react';
import type { Database } from '@/types/database';
import { supabase } from '@/utils/supabase/client'


type Profile = Database['public']['Tables']['profiles']['Row'];
type Ticket = Database['public']['Tables']['tickets']['Row'] & {
    trains: Database['public']['Tables']['trains']['Row'] | null; // Add null union type
  };
  
export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileError) setProfile(profileData);

      // Fetch tickets with train data
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          trains (*)
        `)
        .eq('user_id', user.id);

      if (!ticketsError) setTickets(ticketsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      
      {profile && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Age:</strong> {profile.age}</p>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Your Tickets</h2>
      {tickets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Train Number</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Passenger Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} className="border-b">

<td className="p-3">{ticket.trains?.train_number || 'N/A'}</td>                  <td className="p-3">{ticket.class}</td>
                  <td className="p-3">{ticket.name}</td>
                  <td className="p-3">₹{ticket.price}</td>
                  <td className="p-3">
                    {new Date(ticket.booked_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No tickets found</p>
      )}
    </div>
  );
}
