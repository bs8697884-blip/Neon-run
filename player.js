import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createPlayer(scene) {

  const group =
    new THREE.Group();


  /* =========================
     BODY
  ========================= */

  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.55,
        1.4,
        6,
        10
      ),
      new THREE.MeshStandardMaterial({
        color: 0x202020
      })
    );

  body.position.y =
    1.3;

  body.castShadow = true;


  /* =========================
     HEAD
  ========================= */

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.4,
        12,
        12
      ),
      new THREE.MeshStandardMaterial({
        color: 0xc78b68
      })
    );

  head.position.y =
    2.55;

  head.castShadow = true;


  /* =========================
     JACKET
  ========================= */

  const jacket =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.1,
        1.2,
        0.6
      ),
      new THREE.MeshStandardMaterial({
        color: 0x171717
      })
    );

  jacket.position.y =
    1.45;

  jacket.castShadow = true;


  group.add(
    body,
    jacket,
    head
  );


  group.position.set(
    0,
    0,
    10
  );


  scene.add(
    group
  );


  const player = {

    group,

    speed: 7,

    sprintSpeed: 12,

    vehicle: null,

    previousPosition:
      new THREE.Vector3()

  };


  player.exitVehicle =
    function() {

      if (!player.vehicle)
        return;


      player.group.position.copy(
        player.vehicle.group.position
      );

      player.group.position.x +=
        3;


      player.vehicle =
        null;

    };


  player.enterVehicle =
    function(vehicle) {

      player.vehicle =
        vehicle;

      player.group.visible =
        false;

    };


  player.getCameraTarget =
    function() {

      if (
        player.vehicle
      ) {

        return player.vehicle.group;

      }

      return player.group;

    };


  return player;
}


/* =========================
   PLAYER UPDATE
========================= */

export function updatePlayer(
  player,
  state,
  delta,
  vehicles
) {

  if (
    state.inVehicle &&
    player.vehicle
  ) {

    updateVehiclePlayer(
      player,
      state,
      delta
    );

    return;

  }


  const direction =
    new THREE.Vector3();


  if (state.keys["w"])
    direction.z -= 1;

  if (state.keys["s"])
    direction.z += 1;

  if (state.keys["a"])
    direction.x -= 1;

  if (state.keys["d"])
    direction.x += 1;


  if (
    direction.lengthSq() > 0
  ) {

    direction.normalize();


    const speed =
      state.keys["shift"]
        ? player.sprintSpeed
        : player.speed;


    player.group.position.add(
      direction.multiplyScalar(
        speed * delta
      )
    );


    player.group.rotation.y =
      Math.atan2(
        direction.x,
        direction.z
      );

  }

}


/* =========================
   VEHICLE CONTROL
========================= */

function updateVehiclePlayer(
  player,
  state,
  delta
) {

  const vehicle =
    player.vehicle;


  if (!vehicle)
    return;


  if (state.keys["w"]) {

    vehicle.speed +=
      12 * delta;

  }


  if (state.keys["s"]) {

    vehicle.speed -=
      15 * delta;

  }


  vehicle.speed =
    THREE.MathUtils.clamp(
      vehicle.speed,
      -10,
      35
    );


  if (!state.keys["w"] &&
      !state.keys["s"]) {

    vehicle.speed *=
      0.96;

  }


  let steering = 0;


  if (state.keys["a"])
    steering = 1;

  if (state.keys["d"])
    steering = -1;


  vehicle.group.rotation.y +=
    steering *
    vehicle.speed *
    0.025 *
    delta;


  const forward =
    new THREE.Vector3(
      0,
      0,
      1
    );


  forward.applyQuaternion(
    vehicle.group.quaternion
  );


  vehicle.group.position.add(
    forward.multiplyScalar(
      vehicle.speed *
      delta
    )
  );


  player.group.position.copy(
    vehicle.group.position
  );

}
