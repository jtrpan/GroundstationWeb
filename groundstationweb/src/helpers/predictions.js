import rungeKutta4 from 'ode-rk4';

/* Predictions.js takes in information about an object being dropped from a moving
plane and calculates the object's predicted distance (x-position) from its origin (x0, y0)
once it reaches the ground (y = height = 0).

It requires a system of 4 ODEs, and uses an implementation of RungeKutta (rk4) in ode-rk4 library.
to solve the system.

All units are calculated in metric system. The program assumes an input in ft and thus produces an output in ft.
Initial altitude is in ft, velocity should be in [m/s].

The code below is based on the following paper
 https://www.phys.uconn.edu/~rozman/Courses/P2200_14F/downloads/glider/glider-2014-11-05.pdf
 All variable names have been translated to descriptive variables
 ## notation indicates the equivalent variable used in the paper for reference
 [ ] notation indicates units
*/

const CDA_CL = 0.9;
const CDA_CD = 0.3;
const PAYLOAD_CD = 3.75;

// ----------- Constants-----------
// ________________________________
const m2ft = 3.281; // #of ft in 1 m
const gravity = 9.81; // ## g [m/s^2]

// air density at sea level & 15ºC, may need to be adjusted
const airDensity = 1.2; // ## rho -> 𝞺 [kg/m^3]

export const predict = (currentAngle, currentAltitude, initialVelocity, velocityScalingFactor, derivFunctions) => {
  // -----------Dependent Variables-----------
  // __________________________________________

  // Check that altitude is non-negative:
  if (currentAltitude < 0) {
    currentAltitude = 0.0;
  }

  // scaling factors for dimensionless variables, no units.
  // √[(m * g) /(1/2)(𝞺)(Cd or Cl)(S)], ### dragOrLiftScalingFactor = Cd or Cl based on desired application, S = wingArea, 𝞺 = air density
  const distanceScalingFactor = (velocityScalingFactor ** 2) / gravity; // ## lc -> = vt^2/g

  // Initial Conditions
  const initialDistance = 0/m2ft; // ## x0 [m] -> initial distance in x position of object, corresponds to pos of plane at drop
  const initialHeight = currentAltitude/m2ft; // ## y0 [m]
  const initialAngle = currentAngle; // ## theta, [rad] -> angle w.r.t horizon, doesn't need to be dimensionless


  // -----------Dimensionless Variables----------- (see linked paper for more info)
  // ______________________________________________
  const initialDistanceScaled = initialDistance/distanceScalingFactor;
  const initialHeightScaled = initialHeight/distanceScalingFactor;
  const initialVelocityScaled = initialVelocity/velocityScalingFactor;


  // ----------- Runge Kutta Integrator Variables-----------
  // _______________________________________________________
  const initialConditions = [initialVelocityScaled, initialAngle, initialDistanceScaled, initialHeightScaled]; // initial conditions in RK4 to be solved for
  const numberOfSteps = 90; // number of maximum steps taken by RK4 to solve the system
  const initalTime = 0; // start time
  const h = 2.0 * Math.PI / numberOfSteps; // small number used as a coefficient in Runge Kutta Method


  // Function to unscale variables after being solved using RK4
  const unscale = (output) => {
    return [
      output[0] * velocityScalingFactor, // returns unscaled velocity
      output[1], // returns angle w.r.t horizon
      output[2] * distanceScalingFactor * m2ft, // returns unscaled x position
      output[3] * distanceScalingFactor * m2ft, // returns unscaled y position
    ];
  };


  // ----------- Solve System of ODE & return result-----------
  // _______________________________________________________
  const rk4Solver = rungeKutta4(initialConditions, derivFunctions, initalTime, h);

  let output;
  // solve ODE using RK4, stop once object has hit the ground (y[3] = height = 0)
  do {
    output = rk4Solver.step();
  } while (output.y[3] > 0); // check if object has reach ground

  return unscale(output.y)[2]; // return x position after object reaches ground
};

// Prediction Setup for an object dropped from a plane
export const predictPayload = (altitude, velocity, headwind, angle) => {
  if (velocity <= 0.05) {
    return 0;
  }

  // coeffDrag = PAYLOAD_CD, //## Cd
  const mass = 0.5; // ## m [kg]
  const wingArea = 0.019; // ## S [m^2]
  const velocityScalingFactor = Math.sqrt(mass * gravity/(0.5 * airDensity * PAYLOAD_CD * wingArea)); // ## vt
  const headwindScaled = headwind/velocityScalingFactor;

  // dydt[] = derivative functions for each of θ, v, x, y.
  // y -> y[0] = v, y[1] = theta
  const derivFunctions = (dydt, y) => {
    dydt[0] = -Math.sin(y[1]) - (y[0] * y[0]); // ## dvdt
    dydt[1] = -Math.cos(y[1]) / y[0]; // ## dθdt
    dydt[2] = y[0] * Math.cos(y[1]) - headwindScaled; // ## dxdt
    dydt[3] = y[0] * Math.sin(y[1]); // ## dydt
  };

  return predict(angle, altitude, velocity, velocityScalingFactor, derivFunctions);
};

// Prediction setup for a glider released from a plane
export const predictCDA = (altitude, velocity, headwind, angle) => {
  if (velocity <= 0.05) {
    return 0;
  }
  // coeffLift = CDA_CL,// ## Cl
  // coeffDrag = CDA_CD,// ## Cd
  headwind -= velocity;
  const mass = 0.227; // ## m [kg]
  const wingArea = 0.056; // ## S [m^2]
  const headwindFOS = 0.25; // scale headwind (increase) and scale tailwind (decrease) to assume worst case effect of headwind
  const velocityScalingFactor = Math.sqrt(mass * gravity/(0.5 * airDensity * CDA_CL* wingArea)); // ## vt
  let headwindScaled;

  if (headwind > 0) {
    headwindScaled = headwind*(1.0 + headwindFOS)/velocityScalingFactor;
  } else {
    headwindScaled = headwind*(1.0 - headwindFOS)/velocityScalingFactor;
  }


  const liftToDragRatio = CDA_CL/CDA_CD; // ## R -> Glide Ratio

  // dydt[] = derivative functions for each of θ, v, x, y.
  // y -> y[0] = v, y[1] = theta
  const deriv = (dydt, y) => {
    dydt[0] = -Math.sin(y[1]) - (y[0] ** 2)/liftToDragRatio; // ## dvdt
    dydt[1] = -Math.cos(y[1]) / y[0] + y[0]; // ## dθdt
    dydt[2] = y[0] * Math.cos(y[1]) - headwindScaled; // ## dxdt // scaledHeadwind needs to be constant
    dydt[3] = y[0] * Math.sin(y[1]); // ## dydt
  };
  return predict(angle, altitude, velocity, velocityScalingFactor, deriv);
};
