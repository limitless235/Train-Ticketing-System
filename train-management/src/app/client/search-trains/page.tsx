'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from 'src/app/components/ui/input';
import { Button } from 'src/app/components/ui/button';
import { Card, CardContent } from 'src/app/components/ui/card';
import { motion } from 'framer-motion';
import { FaHome, FaUserCircle } from 'react-icons/fa';

interface Station {
  station_name: string;
  station_code: string;
}

interface Train {
  train_number: string; // Changed from train_no to train_number
  train_name: string;
  source_station_name: string;
  destination_station_name: string;
}

const SearchResults = ({ trains }: { trains: Train[] }) => {
  return (
    <div className="space-y-3">
      {trains.map((train) => (
        <div key={train.train_number}>
          <Link href={`/client/search-trains/${train.train_number}`}>
            <span className="text-blue-600 hover:underline cursor-pointer font-medium">
              {train.train_name} ({train.train_number})
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};


export default function SearchTrainsPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState<Station[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Station[]>([]);
  const [results, setResults] = useState<Train[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = async (query: string, setFn: Function) => {
    if (!query) {
      setFn([]);
      return;
    }

    const res = await fetch('/api/stations-search?query=' + encodeURIComponent(query));
    const data = await res.json();
    if (data.success) setFn(data.stations);
  };

  const handleSearch = async () => {
    if (!source || !destination) {
      setError('Please enter both source and destination');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/train-search?startStation=${source}&endStation=${destination}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setResults(data.trains);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white">

      {/* Header */}
      <header className="flex items-center justify-between bg-white text-black px-4 py-3 shadow-md">
        <div className="flex items-center space-x-4">
          <Link href="/client/dashboard">
            <button className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow">
              <FaHome className="mr-2" /> Home
            </button>
          </Link>
          <Link href="/client/search-trains">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow">
              Search Trains
            </button>
          </Link>
          <Link href="/client/profile">
            <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow">
              View Profile
            </button>
          </Link>
          <Link href="/client/fare-enquiry">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow">
              Fare Enquiry
            </button>
          </Link>
          <Link href="/client/book-tickets">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
              Book Tickets
            </button>
          </Link>
          <Link href="/logout">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow">
              Logout
            </button>
          </Link>
        </div>
        <Link href="/client/profile">
          <FaUserCircle className="text-3xl text-gray-700 hover:text-black transition-colors cursor-pointer" />
        </Link>
      </header>

      {/* Main Layout */}
      <main className="flex p-10 gap-6">
        {/* Sidebar */}
        <aside className="bg-white text-black p-6 rounded-xl shadow-lg w-72">
          <h2 className="text-xl font-bold mb-4">Client Dashboard</h2>
          <div className="space-y-3">
            <Link href="/client/search-trains">
              <button className="w-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg shadow">
                Search Trains
              </button>
            </Link>
            <Link href="/client/profile">
              <button className="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow">
                View Profile
              </button>
            </Link>
            <Link href="/client/fare-enquiry">
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow">
                Fare Enquiry
              </button>
            </Link>
            <Link href="/client/book-tickets">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                Book Tickets
              </button>
            </Link>
            <Link href="/logout">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow">
                Logout
              </button>
            </Link>
          </div>
        </aside>

        {/* Train Search Content */}
        <motion.section
          className="bg-white text-black p-6 rounded-xl shadow-lg flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">🚆 Search Trains</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-6"
          >
            <Card className="p-6 space-y-4 border border-gray-200 shadow-lg rounded-xl bg-white">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Source Station</label>
                <Input
                  placeholder="Enter Starting station"
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    fetchStations(e.target.value, setSourceSuggestions);
                  }}
                  list="source-options"
                  className="bg-white text-black"
                />
                <datalist id="source-options">
                  {sourceSuggestions.map((station, idx) => (
                    <option key={idx} value={station.station_name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Destination Station</label>
                <Input
                  placeholder="Enter destination station"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    fetchStations(e.target.value, setDestinationSuggestions);
                  }}
                  list="destination-options"
                  className="bg-white text-black"
                />
                <datalist id="destination-options">
                  {destinationSuggestions.map((station, idx) => (
                    <option key={idx} value={station.station_name} />
                  ))}
                </datalist>
              </div>

              <Button
                className="w-full mt-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Trains'}
              </Button>
            </Card>
          </form>

          {error && <div className="text-red-600 mt-4 text-center">{error}</div>}

          {/* Display Search Results */}
          {results && results.length > 0 && (
            <div className="mt-6 space-y-4">
              <SearchResults trains={results} />
            </div>
          )}

          {results && results.length === 0 && (
            <div className="text-gray-500 mt-4 text-center">No trains found.</div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
