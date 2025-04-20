'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BookingPage() {
  const searchParams = useSearchParams();

  // Query parameters
  const trainNumber = searchParams.get('train_number');
  const trainName = searchParams.get('train_name');
  const trainClass = searchParams.get('class');
  const price = searchParams.get('price');
  const fromStation = searchParams.get('source_station_name');
  const toStation = searchParams.get('destination_station_name');

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    aadhar: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!formData.name || !formData.age || !formData.aadhar) {
      alert('Please fill all passenger details.');
      return;
    }
    setBookingConfirmed(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6',
      padding: 24
    }}>
      <div style={{
        maxWidth: 500,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        padding: 32,
        marginTop: 40
      }}>
        {!bookingConfirmed ? (
          <>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#1e293b' }}>Passenger Details</h1>
            <div style={{
              marginBottom: 24,
              background: '#f9fafb',
              borderRadius: 8,
              padding: 18,
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: '#334155' }}>Journey Details</h2>
              <p style={{ color: '#1e293b' }}><strong>Train:</strong> {trainName} ({trainNumber})</p>
              <p>
                <span style={{ color: '#111' }}><strong>From:</strong></span>
                <span style={{ color: '#111', marginLeft: 6 }}>
                  {fromStation || <span style={{ color: 'red' }}>Not Provided</span>}
                </span>
              </p>
              <p>
                <span style={{ color: '#111' }}><strong>To:</strong></span>
                <span style={{ color: '#111', marginLeft: 6 }}>
                  {toStation || <span style={{ color: 'red' }}>Not Provided</span>}
                </span>
              </p>
              <p style={{ color: '#1e293b' }}><strong>Class:</strong> {trainClass}</p>
              <p style={{ color: '#1e293b' }}><strong>Price:</strong> ₹{price}</p>
            </div>
            <form className="space-y-4" onSubmit={handleConfirmBooking}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontWeight: 500 }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1', marginBottom: 12 }}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontWeight: 500 }}>Age</label>
                <input
                  type="number"
                  name="age"
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1', marginBottom: 12 }}
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, color: '#334155', fontWeight: 500 }}>Aadhar Number</label>
                <input
                  type="text"
                  name="aadhar"
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e1', marginBottom: 12 }}
                  value={formData.aadhar}
                  onChange={handleInputChange}
                  required
                  maxLength={12}
                  pattern="\d{12}"
                />
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 6,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#2563eb',
                  border: 'none',
                  fontSize: 16,
                  cursor: 'pointer'
                }}
              >
                Confirm Booking
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#16a34a', textAlign: 'center' }}>Ticket</h1>
            <div style={{
              marginBottom: 20,
              background: '#f9fafb',
              borderRadius: 8,
              padding: 18,
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: '#334155' }}>Journey Details</h2>
              <p style={{ color: '#1e293b' }}><strong>Train:</strong> {trainName} ({trainNumber})</p>
              <p style={{ color: '#1e293b' }}><strong>From:</strong> {fromStation || <span style={{color: 'red'}}>Not Provided</span>}</p>
              <p style={{ color: '#1e293b' }}><strong>To:</strong> {toStation || <span style={{color: 'red'}}>Not Provided</span>}</p>
              <p style={{ color: '#1e293b' }}><strong>Class:</strong> {trainClass}</p>
              <p style={{ color: '#1e293b' }}><strong>Price:</strong> ₹{price}</p>
            </div>
            <div style={{
              marginBottom: 20,
              background: '#f9fafb',
              borderRadius: 8,
              padding: 18,
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: '#334155' }}>Passenger Details</h2>
              <p style={{ color: '#1e293b' }}><strong>Name:</strong> {formData.name}</p>
              <p style={{ color: '#1e293b' }}><strong>Age:</strong> {formData.age}</p>
              <p style={{ color: '#1e293b' }}><strong>Aadhar:</strong> {formData.aadhar}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: 12,
                  background: '#16a34a',
                  color: '#fff',
                  borderRadius: 6,
                  fontWeight: 700,
                  border: 'none',
                  fontSize: 16,
                  cursor: 'pointer'
                }}
              >
                Print Ticket
              </button>
              <Link href="/client/dashboard" style={{ flex: 1 }}>
                <button style={{
                  width: '100%',
                  padding: 12,
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: 6,
                  fontWeight: 700,
                  border: 'none',
                  fontSize: 16,
                  cursor: 'pointer'
                }}>
                  Home
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
