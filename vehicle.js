import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createVehicles(scene) {

  const vehicles = {

    cars: [],

    traffic: [],

    findNearestVehicle(position, distance) {

      let closest = null;

      let closestDistance =
        distance;


      for (
        const car of vehicles.cars
      ) {

        const d =
          car.group.position.distanceTo(
            position
          );


        if (
          d < closestDistance
        ) {

          closest =
            car;

          closestDistance =
            d;

        }

      }


      return closest;

    }

  };


  /* =========================
     PLAYER CARS
  ========================= */

  const carPositions = [

    [-12, 0, 5],
    [12, 0, -10],
    [25, 0, 30],
    [-30, 0, -25],
    [70, 0, 50]

  ];


  carPositions.forEach(
    position => {

      const car =
        createCar(
          scene,
          position[0],
          position[2]
        );

      vehicles.cars.push(
        car
      );

    }
  );


  /* =========================
     TRAFFIC
  ========================= */

  for (
    let i = 0;
    i < 35;
    i++
  ) {

    const horizontal =
      Math.random() > 0.5;


    const lane =
      Math.round(
        THREE.MathUtils.randFloat(
          -480,
          480
        ) / 80
      ) * 80;


    const travel =
      THREE.MathUtils.randFloat(
        -480,
        480
      );


    let x;
    let z;


    if (horizontal) {

      x = travel;
      z = lane;

    } else {

      x = lane;
      z = travel;

    }


    const traffic =
      createTrafficCar(
        scene,
        x,
        z,
        horizontal
      );


    vehicles.traffic.push(
      traffic
    );

  }


  return vehicles;
}


/* =========================
   CAR
========================= */

function createCar(
  scene,
  x,
  z
) {

  const group =
    new THREE.Group();


  const body =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        2.2,
        0.65,
        4.2
      ),
      new THREE.MeshStandardMaterial({
        color:
          new THREE.Color(
            Math.random(),
            Math.random() * 0.4,
            Math.random() * 0.4
          )
      })
    );


  body.position.y =
    0.7;


  const roof =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.7,
        0.65,
        2
      ),
      new THREE.MeshStandardMaterial({
        color: 0x111111
      })
    );


  roof.position.y =
    1.25;


  roof.position.z =
    -0.15;


  const wheels =
    [];


  const wheelGeometry =
    new THREE.CylinderGeometry(
      0.38,
      0.38,
      0.3,
      12
    );


  const wheelMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x080808
    });


  const wheelPositions = [

    [-1.05, 0.4, -1.4],
    [1.05, 0.4, -1.4],
    [-1.05, 0.4, 1.4],
    [1.05, 0.4, 1.4]

  ];


  wheelPositions.forEach(
    p => {

      const wheel =
        new THREE.Mesh(
          wheelGeometry,
          wheelMaterial
        );


      wheel.rotation.z =
        Math.PI / 2;


      wheel.position.set(
        p[0],
        p[1],
        p[2]
      );


      wheels.push(
        wheel
      );

      group.add(
        wheel
      );

    }
  );


  group.add(
    body,
    roof
  );


  group.position.set(
    x,
    0,
    z
  );


  group.castShadow = true;


  scene.add(
    group
  );


  return {

    group,

    speed: 0,

    wheels

  };

}


/* =========================
   TRAFFIC CAR
========================= */

function createTrafficCar(
  scene,
  x,
  z,
  horizontal
) {

  const car =
    createCar(
      scene,
      x,
      z
    );


  car.traffic = true;

  car.horizontal =
    horizontal;

  car.speed =
    THREE.MathUtils.randFloat(
      8,
      18
    );


  if (
    Math.random() > 0.5
  ) {

    car.speed *= -1;

  }


  return car;
}


/* =========================
   UPDATE
========================= */

export function updateVehicles(
  vehicles,
  state,
  delta,
  player
) {

  /* Traffic */

  vehicles.traffic.forEach(
    car => {

      if (car.horizontal) {

        car.group.position.x +=
          car.speed * delta;

      } else {

        car.group.position.z +=
          car.speed * delta;

      }


      if (
        car.group.position.x >
        520
      ) {

        car.group.position.x =
          -520;

      }


      if (
        car.group.position.x <
        -520
      ) {

        car.group.position.x =
          520;

      }


      if (
        car.group.position.z >
        520
      ) {

        car.group.position.z =
          -520;

      }


      if (
        car.group.position.z <
        -520
      ) {

        car.group.position.z =
          520;

      }

    }
  );


  /* Vehicle collision */

  if (
    state.inVehicle &&
    player.vehicle
  ) {

    vehicles.traffic.forEach(
      traffic => {

        const distance =
          player.vehicle.group
            .position
            .distanceTo(
              traffic.group.position
            );


        if (
          distance < 3
        ) {

          player.vehicle.speed *=
            -0.4;

          state.health -=
            2 * delta;

          state.wanted =
            Math.min(
              5,
              state.wanted + 0.01
            );

        }

      }
    );

  }

}
