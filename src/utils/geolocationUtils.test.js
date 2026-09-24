import { describe, expect, it } from 'vitest';
import {
  calculateDistanceKm,
  sortByDistance,
  formatDistance,
  buildGoogleMapsDirectionsUrl,
} from './geolocationUtils';

describe('geolocation utilities', () => {
  it('returns zero for identical coordinates', () => {
    expect(calculateDistanceKm(-6.2, 106.8, -6.2, 106.8)).toBe(0);
  });

  it('calculates a realistic distance in kilometers', () => {
    expect(calculateDistanceKm(0, 0, 0, 1)).toBeCloseTo(111.19, 1);
  });

  it('sorts locations from nearest to farthest without mutating the source', () => {
    const locations = [
      { id: 'far', latitude: 0, longitude: 2 },
      { id: 'near', latitude: 0, longitude: 0.5 },
    ];
    const sorted = sortByDistance(locations, { latitude: 0, longitude: 0 });

    expect(sorted.map((location) => location.id)).toEqual(['near', 'far']);
    expect(locations.map((location) => location.id)).toEqual(['far', 'near']);
    expect(sorted[0].distanceKm).toBeCloseTo(55.6, 1);
  });

  it('formats short and long distances for Indonesian UI', () => {
    expect(formatDistance(0.45)).toBe('450 m');
    expect(formatDistance(1.234)).toBe('1,23 km');
  });

  it('builds a Google Maps directions URL from destination coordinates', () => {
    expect(buildGoogleMapsDirectionsUrl(-6.2, 106.8)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-6.2%2C106.8'
    );
  });
});
