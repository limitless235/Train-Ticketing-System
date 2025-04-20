'use client';

import { useState } from 'react';
import { Input } from 'src/app/components/ui/input';
import { Button } from 'src/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/app/components/ui/card';
import { Label } from 'src/app/components/ui/label';
import { Skeleton } from 'src/app/components/ui/skeleton';
import { ScrollArea } from 'src/app/components/ui/scroll-area';

export default function LiveTrainStatus() {
  const [trainNo, setTrainNo] = useState('');
  const [startDay, setStartDay] = useState(0);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    if (!trainNo) {
      setError('Please enter a train number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/live-status?trainNo=${trainNo}&startDay=${startDay}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const { success, data, error: apiError } = await res.json();
      if (!success) throw new Error(apiError || 'Train not found');
      setStatus(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card className="shadow-xl rounded-2xl border border-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Live Train Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={e => { e.preventDefault(); handleCheckStatus(); }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <Label>Train Number</Label>
              <Input
                type="text"
                placeholder="e.g., 12951"
                value={trainNo}
                onChange={(e) => setTrainNo(e.target.value)}
              />
            </div>
            <div>
              <Label>Start Day (0 = Today)</Label>
              <Input
                type="number"
                min={0}
                max={2}
                value={startDay}
                onChange={(e) => setStartDay(Number(e.target.value))}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !trainNo}
              className="w-full col-span-2 mt-4"
            >
              {loading ? 'Checking...' : 'Check Status'}
            </Button>
          </form>

          {error && (
            <div className="text-red-600 font-medium">{error}</div>
          )}

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          )}

          {status && (
            <ScrollArea className="max-h-[300px] rounded-md border p-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-muted-foreground">
                  {status.train_name} ({status.train_number})
                </h2>
                <p><strong>Current Station:</strong> {status.current_station?.station_name}</p>
                <p><strong>Last Location:</strong> {status.position}</p>
                <p><strong>Delay:</strong> {status.current_station?.late_by} mins</p>
                <div>
                  <strong>Route:</strong>
                  <ul className="list-disc ml-6 mt-1 text-sm">
                    {status.route?.map((stop: any, index: number) => (
                      <li key={index} className={stop.has_arrived ? 'text-green-600' : stop.has_departed ? 'text-yellow-600' : 'text-gray-600'}>
                        {stop.station.name} - {stop.arrival_status} / {stop.departure_status} ({stop.late_by} mins late)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
