const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lon2 - lon1);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const sortByDistance = (locations, userLocation) =>
  locations
    .map((location) => ({
      ...location,
      distanceKm: calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        location.latitude,
        location.longitude
      ),
    }))
    .sort((first, second) => first.distanceKm - second.distanceKm);

export const formatDistance = (distanceKm) =>
  distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m`
    : `${distanceKm.toFixed(2).replace('.', ',')} km`;

export const buildGoogleMapsDirectionsUrl = (latitude, longitude) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}`;
