import { NextResponse } from 'next/server';
import { supabase } from 'src/app/lib/supabaseClient';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return NextResponse.json({ success: true, stations: [] });
  }

  try {
    const { data: stations, error } = await supabase
      .from('stations')
      .select('station_name, station_code')
      .ilike('station_name', `%${query}%`);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      stations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, stations: [], message: error.message },
      { status: 500 }
    );
  }
}
