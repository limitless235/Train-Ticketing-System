import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SeatColumns = 'seats_1a' | 'seats_2a' | 'seats_3a' | 'seats_sl';

export async function POST(request: Request) {
  try {
    const { train_number, class: className } = await request.json();
    
    // Validate class input
    const validClasses = ['1A', '2A', '3A', 'SL'];
    if (!validClasses.includes(className)) {
      return NextResponse.json(
        { success: false, error: 'Invalid class specified' },
        { status: 400 }
      );
    }

    // Convert class to column name format
    const seatColumn = `seats_${className.toLowerCase()}` as SeatColumns;

    // Get current seat availability
    const { data, error } = await supabase
      .from('trains')
      .select('seats_1a, seats_2a, seats_3a, seats_sl') // Select all seat columns
      .eq('train_number', train_number)
      .single();

    if (error) throw error;

    // Type assertion to handle seat column access
    const trainData = data as Record<SeatColumns, number>;
    
    // Calculate new seat count
    const currentSeats = trainData[seatColumn] || 0;
    const newSeatCount = Math.max(currentSeats - 1, 0);

    // Update seats
    const { error: updateError } = await supabase
      .from('trains')
      .update({ [seatColumn]: newSeatCount })
      .eq('train_number', train_number);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating seats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update seats' },
      { status: 500 }
    );
  }
}
