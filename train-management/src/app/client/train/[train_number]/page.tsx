'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function TrainDetailsPage() {
  const params = useParams();
  const train_number = typeof params.train_number === 'string' 
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
    'SL': 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!train_number) {
      setError('No train number provided');
      setLoading(false);
      return;
    }

    const fetchTrainDetails = async () => {
      try {
        const res = await fetch(`/api/train-details?train_number=${train_number}`);
        const contentType = res.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Server returned HTML: ${text.slice(0, 100)}`);
        }
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch train details');
        }

        setTrain(data.train);
        setSchedule(data.schedule || []);

        const seatData = data.schedule.reduce((acc: SeatAvailability, stop: ScheduleData) => ({
          '1A': acc['1A'] + (stop.seats_1a || 0),
          '2A': acc['2A'] + (stop.seats_2a || 0),
          '3A': acc['3A'] + (stop.seats_3a || 0),
          'SL': acc['SL'] + (stop.seats_sl || 0),
        }), { '1A': 0, '2A': 0, '3A': 0, 'SL': 0 });

        setSeats(seatData);

      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainDetails();
  }, [train_number]);

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
          <a
            href={`/payment?train=${train?.train_number}&class=${seat.cls}`}
            style={{
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: 6,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Book Seat
          </a>
        </td>
      </tr>
    ));
  };

  if (loading) return (
    <div style={{
      background: '#111',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>Loading train details...</div>
    </div>
  );
  
  if (error) return (
    <div style={{
      background: '#111',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ color: '#f00', fontSize: 28, fontWeight: 'bold' }}>Error: {error}</div>
    </div>
  );

  return (
    <div style={{ background: '#111', minHeight: '100vh', color: '#111' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #a855f7 0%, #6d28d9 100%)',
        padding: '16px 0',
        marginBottom: 32
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/client/dashboard" style={navBtnStyle}>🏠 Home</Link>
          <Link href="/client/search-trains" style={navBtnStyle}>Search Trains</Link>
          <Link href="/view-profile" style={navBtnStyle}>View Profile</Link>
          <Link href="/fare-enquiry" style={navBtnStyle}>Fare Enquiry</Link>
          <Link href="/book-tickets" style={navBtnStyle}>Book Tickets</Link>
          <Link href="/logout" style={navBtnStyleRed}>Logout</Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: 700,
        margin: '0 auto',
        background: '#fff',
        color: '#111',
        borderRadius: 16,
        boxShadow: '0 6px 32px 0 rgba(0,0,0,0.15)',
        padding: 32,
        marginBottom: 40,
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Train Details</h1>
        
        {train ? (
          <table style={{ width: '100%', marginBottom: 32, borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={labelCell}>Train Name:</td>
                <td style={valueCell}>{train.train_name}</td>
              </tr>
              <tr>
                <td style={labelCell}>Train Number:</td>
                <td style={valueCell}>{train.train_number}</td>
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
        ) : (
          <p style={{ color: '#111', fontWeight: 500 }}>No train details available.</p>
        )}

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, marginTop: 16 }}>Full Schedule</h2>
        {schedule.length > 0 ? (
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafafa' }}>
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
                  <tr key={stop.stop_number} style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
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
          <p style={{ color: '#111', fontWeight: 500 }}>No schedule information available.</p>
        )}

        {/* Seat Availability Table */}
        {train && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Seat Availability</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafafa' }}>
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

// Styles
const labelCell: React.CSSProperties = {
  fontWeight: 600,
  background: '#f3f4f6',
  color: '#111',
  padding: '12px 16px',
  border: '1px solid #e5e7eb',
  width: '30%',
};

const valueCell: React.CSSProperties = {
  color: '#111',
  padding: '12px 16px',
  border: '1px solid #e5e7eb',
  fontWeight: 500,
  background: '#fff',
};

const thCell: React.CSSProperties = {
  color: '#111',
  fontWeight: 700,
  background: '#e5e7eb',
  padding: '10px 14px',
  border: '1px solid #e5e7eb',
};

const tdCell: React.CSSProperties = {
  color: '#111',
  background: '#fff',
  padding: '10px 14px',
  border: '1px solid #e5e7eb',
  fontWeight: 500,
};

const navBtnStyle: React.CSSProperties = {
  background: '#2563eb',
  color: '#fff',
  fontWeight: 700,
  padding: '8px 18px',
  borderRadius: 8,
  textDecoration: 'none',
  transition: 'background 0.2s',
};

const navBtnStyleRed: React.CSSProperties = {
  ...navBtnStyle,
  background: '#dc2626',
};
