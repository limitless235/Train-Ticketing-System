// src/app/api/train-details/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainNumber = searchParams.get('train_number');

    if (!trainNumber) {
      return NextResponse.json({ error: "Train number is required" }, { status: 400 });
    }

    // Fetch train data
    const { data: train, error: trainError } = await supabase
      .from('trains')
      .select('*')
      .eq('train_number', trainNumber)
      .single();

    if (trainError) throw trainError;

    // Fetch schedule with seat availability
    const { data: schedule, error: scheduleError } = await supabase
      .from('train_schedule')
      .select(`
        stop_number,
        station_name,
        station_code,
        arrival_time,
        departure_time,
        distance_km,
        seats_1a,
        seats_2a,
        seats_3a,
        seats_sl
      `)  // Removed inline comments
      .eq('train_number', trainNumber)
      .order('stop_number', { ascending: true });

    if (scheduleError) throw scheduleError;

    // Calculate total seat availability
    const seatAvailability = schedule.reduce((acc, stop) => ({
      '1A': (acc['1A'] || 0) + (stop.seats_1a || 0),
      '2A': (acc['2A'] || 0) + (stop.seats_2a || 0),
      '3A': (acc['3A'] || 0) + (stop.seats_3a || 0),
      'SL': (acc['SL'] || 0) + (stop.seats_sl || 0),
    }), { '1A': 0, '2A': 0, '3A': 0, 'SL': 0 });

    return NextResponse.json({
      success: true,
      train,
      schedule,
      seatAvailability
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
