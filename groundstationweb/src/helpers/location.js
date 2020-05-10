const newLatitudeOfObject = (currentLatRad, angularDistance, directionRad) => {
  return Math.asin(Math.sin(currentLatRad)*Math.cos(angularDistance)
        + Math.cos(currentLatRad)*Math.sin(angularDistance)*Math.cos(directionRad));
};

const newLongitudeOfObject = (currentLatRad, currentLongRad, newLatRad, angularDistance, directionRad) => {
  return currentLongRad + Math.atan2(Math.sin(directionRad)*Math.sin(angularDistance)*Math.cos(currentLatRad),
    Math.cos(angularDistance)-Math.sin(currentLatRad)*Math.sin(newLatRad));
};

const toDegrees = (rad) => {
  return rad * 180 / Math.PI;
};

const toRadians = (angle) => {
  return angle * Math.PI / 180;
};

// Calculate the angular distance w.r.t mean earth radius
// Assumes distance in ft;
const calcAngularDistance = (distance) => {
  const earthRadius = 6378100; // average earth radius in m;
  const feetInM = 3.218; // number of ft in 1m
  const distanceInM = distance / feetInM;

  return distanceInM / earthRadius;
};

// Calculate new position of object in degrees (latitude & longitude)
// based on https://www.movable-type.co.uk/scripts/latlong.html#dest-point
const calculateNewPositionOfObject = (currentLatitude, currentLongitude, distance, direction) => {
  const angularDistance = calcAngularDistance(distance);

  const currentLatRad = toRadians(currentLatitude);
  const currentLongRad = toRadians(currentLongitude);
  const directionRad = toRadians(direction);

  const newLatitudeRadians = newLatitudeOfObject(currentLatRad, angularDistance, directionRad);
  const newLongitudeRadians = newLongitudeOfObject(currentLatRad, currentLongRad,
    newLatitudeRadians, angularDistance, directionRad);

  return [toDegrees(newLatitudeRadians), toDegrees(newLongitudeRadians)];
};

export const predictLoc = (currentData, distance) => {
  if (currentData == null || distance == null) {
    return [0, 0];
  }

  const { latitude } = currentData;
  const { longitude } = currentData;
  const { direction } = currentData;

  return calculateNewPositionOfObject(latitude, longitude, distance, direction);
};
