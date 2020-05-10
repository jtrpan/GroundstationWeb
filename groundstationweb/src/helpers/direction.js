const toDeg = (rad) => {
  return rad * 180 / Math.PI;
};

const toRad = (angle) => {
  return angle * Math.PI / 180;
};

// returns angle between last two positions, which depicts direction of plane's movement
// Similar to relative bearing
export const getDirection = (oldData, newData) => {
  if (oldData == null || oldData == null) return 0;

  const newLat = toRad(newData.latitude);
  const oldLat = toRad(oldData.latitude);
  const newLong = toRad(newData.longitude);
  const oldLong = toRad(oldData.longitude);

  const y = Math.sin(newLong-oldLong) * Math.cos(newLat);
  const x = Math.cos(oldLat)*Math.sin(newLat)
        - Math.sin(oldLat)*Math.cos(newLat)*Math.cos(newLong -oldLong);
  const bearing = toDeg(Math.atan2(y, x));

  return bearing;
};
