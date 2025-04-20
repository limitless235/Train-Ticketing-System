'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

interface TrainData {
    train_number: string;
    train_name: string;
    source_station_name: string;
    destination_station_name: string;
  }
  

interface ScheduleData {
  stop_number: number;
  station_name: string;
  station_code: string;
  arrival_time: string;
  departure_time: string;
  distance_km: number | null;
  seats_1a: number;
  seats_2a: number;
  seats_3a: number;
  seats_sl: number;
}

interface SeatAvailability {
  '1A': number;
  '2A': number;
  '3A': number;
  'SL': number;
}

// --- Supabase Client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Component ---
export default function TrainDetailsPage() {
  const params = useParams();
  const trainNumber = typeof params.train_number === 'string'
    ? params.train_number
    : Array.isArray(params.train_number)
      ? params.train_number[0]
      : null;

  const [train, setTrain] = useState<TrainData | null>(null);
  const [schedule, setSchedule] = useState<ScheduleData[]>([]);
  const [seats, setSeats] = useState<SeatAvailability>({
    '1A': 0,
    '2A': 0,
    '3A': 0,
    'SL': 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!trainNumber) {
        setError('No train number provided');
        setLoading(false);
        return;
      }
      try {
        // Fetch train details
        const { data: trainData, error: trainError } = await supabase
          .from('trains')
          .select('*')
          .eq('train_number', trainNumber)
          .single();
        if (trainError || !trainData) throw trainError || new Error('Train not found');

        setTrain({
            train_number: trainData.train_number,
            train_name: trainData.train_name,
            source_station_name: trainData.source_station_name,
            destination_station_name: trainData.destination_station_name,
          });
          

        // Fetch schedule (with seat info)
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('train_schedule')
          .select('*')
          .eq('train_number', trainNumber)
          .order('stop_number', { ascending: true });

        if (scheduleError) throw scheduleError;
        setSchedule(scheduleData || []);

        // Set seat availability from first schedule entry
        if (scheduleData && scheduleData.length > 0) {
          setSeats({
            '1A': scheduleData[0].seats_1a,
            '2A': scheduleData[0].seats_2a,
            '3A': scheduleData[0].seats_3a,
            'SL': scheduleData[0].seats_sl,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [trainNumber]);

  const generatePrice = (trainNumber: string, className: keyof SeatAvailability): number => {
    let hash = 0;
    for (let i = 0; i < trainNumber.length; i++) hash += trainNumber.charCodeAt(i);
    for (let i = 0; i < className.length; i++) hash += className.charCodeAt(i) * 7;
    switch(className) {
      case '1A': return 3000 + (hash % 1500);
      case '2A': return 1800 + (hash % 600);
      case '3A': return 1100 + (hash % 300);
      case 'SL': return 400 + (hash % 100);
      default: return 1000;
    }
  };

  const seatRows = () => {
    const seatData = [
      { cls: '1A' as const, desc: 'AC First Class' },
      { cls: '2A' as const, desc: 'AC 2 Tier' },
      { cls: '3A' as const, desc: 'AC 3 Tier' },
      { cls: 'SL' as const, desc: 'Sleeper Class' },
    ];
    return seatData.map(seat => (
      <tr key={seat.cls}>
        <td style={tdCell}>{seat.cls}</td>
        <td style={tdCell}>{seat.desc}</td>
        <td style={tdCell}>{seats[seat.cls]}</td>
        <td style={tdCell}>₹{train ? generatePrice(train.train_number, seat.cls) : 'N/A'}</td>
        <td style={tdCell}>
          {train ? (
            <Link
  href={{
    pathname: '/client/book-tickets',
    query: {
      train_number: train.train_number,
      train_name: train.train_name,
      source_station_name: train.source_station_name,
      destination_station_name: train.destination_station_name,
      class: seat.cls,
      price: generatePrice(train.train_number, seat.cls),
    }
  }}
  style={bookSeatStyle}
>
  Book Seat
</Link>

          ) : (
            <span style={errorTextStyle}>Data unavailable</span>
          )}
        </td>
      </tr>
    ));
  };

  if (loading) return (
    <div style={loadingContainerStyle}>
      <div style={loadingTextStyle}>Loading train details...</div>
    </div>
  );
  if (error) return (
    <div style={errorContainerStyle}>
      <div style={errorTextStyle}>Error: {error}</div>
    </div>
  );

  return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <div style={navContainerStyle}>
          <Link href="/client/dashboard" style={navButtonStyle}>🏠 Home</Link>
          <Link href="/client/search-trains" style={navButtonStyle}>Search Trains</Link>
          <Link href="/view-profile" style={navButtonStyle}>View Profile</Link>
          <Link href="/fare-enquiry" style={navButtonStyle}>Fare Enquiry</Link>
          <Link href="/book-tickets" style={navButtonStyle}>Book Tickets</Link>
        </div>
      </div>

      <div style={mainContentStyle}>
        <h1 style={mainHeadingStyle}>Train Details</h1>
        {train ? (
          <div style={detailsContainer}>
            <table style={detailsTableStyle}>

              <tbody>
                <tr>
                  <td style={labelCell}>Train Name:</td>
                  <td style={valueCell}>{train.train_name}</td>
                </tr>
                <tr>
  <td style={labelCell}>From:</td>
  <td style={valueCell}>{train.source_station_name}</td>
</tr>
<tr>
  <td style={labelCell}>To:</td>
  <td style={valueCell}>{train.destination_station_name}</td>
</tr>

              </tbody>
            </table>
          </div>
        ) : (
          <p style={noDataTextStyle}>No train details available.</p>
        )}

        <h2 style={sectionHeadingStyle}>Full Schedule</h2>
        {schedule.length > 0 ? (
          <div style={tableContainer}>
            <table style={scheduleTableStyle}>
              <thead>
                <tr>
                  <th style={thCell}>Stop #</th>
                  <th style={thCell}>Station Name</th>
                  <th style={thCell}>Code</th>
                  <th style={thCell}>Arrival</th>
                  <th style={thCell}>Departure</th>
                  <th style={thCell}>Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((stop) => (
                  <tr key={stop.stop_number} style={scheduleRowStyle}>
                    <td style={tdCell}>{stop.stop_number}</td>
                    <td style={tdCell}>{stop.station_name}</td>
                    <td style={tdCell}>{stop.station_code}</td>
                    <td style={tdCell}>{stop.arrival_time}</td>
                    <td style={tdCell}>{stop.departure_time}</td>
                    <td style={tdCell}>{stop.distance_km ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={noDataTextStyle}>No schedule information available.</p>
        )}

        {train && (
          <div style={seatAvailabilityContainer}>
            <h2 style={sectionHeadingStyle}>Seat Availability</h2>
            <div style={tableContainer}>
              <table style={seatTableStyle}>
                <thead>
                  <tr>
                    <th style={thCell}>Class</th>
                    <th style={thCell}>Description</th>
                    <th style={thCell}>Available</th>
                    <th style={thCell}>Price</th>
                    <th style={thCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {seatRows()}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles ---
const pageContainerStyle: React.CSSProperties = {
  background: '#111',
  minHeight: '100vh',
  color: '#111'
};
const headerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #a855f7 0%, #6d28d9 100%)',
  padding: '16px 0',
  marginBottom: '32px'
};
const navContainerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap' as const,
};
const navButtonStyle: React.CSSProperties = {
  background: '#2563eb',
  color: '#fff',
  fontWeight: 700,
  padding: '8px 18px',
  borderRadius: 8,
  textDecoration: 'none',
  transition: 'background 0.2s'
};
const mainContentStyle: React.CSSProperties = {
  maxWidth: '700px',
  margin: '0 auto',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 6px 32px 0 rgba(0,0,0,0.15)',
  padding: '32px',
  marginBottom: '40px'
};
const mainHeadingStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  marginBottom: '20px'
};
const detailsContainer: React.CSSProperties = {
  marginBottom: '32px'
};
const detailsTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse'
};
const labelCell: React.CSSProperties = {
  fontWeight: 600,
  background: '#f3f4f6',
  color: '#111',
  padding: '12px 16px',
  border: '1px solid #e5e7eb',
  width: '30%'
};
const valueCell: React.CSSProperties = {
  color: '#111',
  padding: '12px 16px',
  border: '1px solid #e5e7eb',
  fontWeight: 500,
  background: '#fff'
};
const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  marginBottom: '16px',
  marginTop: '16px'
};
const tableContainer: React.CSSProperties = {
  overflowX: 'auto',
  marginBottom: '32px'
};
const scheduleTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fafafa'
};
const scheduleRowStyle: React.CSSProperties = {
  background: '#fff',
  borderBottom: '1px solid #eee'
};
const seatTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fafafa'
};
const thCell: React.CSSProperties = {
  color: '#111',
  fontWeight: 700,
  background: '#e5e7eb',
  padding: '10px 14px',
  border: '1px solid #e5e7eb'
};
const tdCell: React.CSSProperties = {
  color: '#111',
  background: '#fff',
  padding: '10px 14px',
  border: '1px solid #e5e7eb',
  fontWeight: 500
};
const bookSeatStyle: React.CSSProperties = {
  background: '#2563eb',
  color: '#fff',
  fontWeight: 700,
  padding: '6px 16px',
  borderRadius: 6,
  textDecoration: 'none',
  display: 'inline-block'
};
const errorTextStyle: React.CSSProperties = {
  color: 'red',
  fontWeight: 700
};
const loadingContainerStyle: React.CSSProperties = {
  background: '#111',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
const loadingTextStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: '28px',
  fontWeight: 'bold'
};
const errorContainerStyle: React.CSSProperties = {
  background: '#111',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
const noDataTextStyle: React.CSSProperties = {
  color: '#111',
  fontWeight: 500
};
const seatAvailabilityContainer: React.CSSProperties = {
  marginTop: '32px'
};
