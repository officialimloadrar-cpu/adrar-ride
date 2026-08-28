import { useState } from 'react';
import type { Place } from '../services/geocoding';

export function useGeolocation() {
  const [location, setLocation] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          name: 'Current location',
          displayName: 'Current location',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  return { 
    location, 
    loading, 
    error, 
    getLocation,
    position: location,
    getCurrentPosition: getLocation
  };
}