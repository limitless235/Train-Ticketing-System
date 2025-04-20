import { NextResponse } from 'next/server';
import { supabase } from 'src/app/lib/supabaseClient';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const startStation = url.searchParams.get('startStation');
  const endStation = url.searchParams.get('endStation');

  if (!startStation || !endStation) {
    return NextResponse.json(
      { success: false, message: 'Start and destination stations are required.' },
      { status: 400 }
    );
  }

  try {
    const { data: trains, error: trainError } = await supabase
      .from('trains')
      .select('*')
      .eq('source_station_name', startStation)
      .eq('destination_station_name', endStation);

    if (trainError) throw trainError;

    const trainNumbers = trains.map((train) => train.train_number);

    const { data: schedule, error: scheduleError } = await supabase
      .from('train_schedule')
      .select('*')
      .in('train_number', trainNumbers);

    if (scheduleError) throw scheduleError;

    return NextResponse.json({
      success: true,
      trains,
      schedule,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
