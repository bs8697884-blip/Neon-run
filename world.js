import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createCity(scene) {

  const city = {

    buildings: [],

    trees: [],

    lights: [],

    roads: [],

    size: 1000

  };


  /* =========================
     GROUND
  ========================= */

  const groundGeometry =
    new THREE.PlaneGeometry(
      1200,
      1200
    );

  const groundMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x30352f,
      roughness: 1
    });

  const ground =
    new THREE.Mesh(
      groundGeometry,
      groundMaterial
    );

  ground.rotation.x =
    -Math.PI / 2;

  ground.receiveShadow = true;

  scene.add(ground);


  /* =========================
     ROADS
  ========================= */

  const spacing = 80;

  for (
    let x = -480;
    x <= 480;
    x += spacing
  ) {

    createRoad(
      scene,
      x,
      0,
      true,
      city
    );

  }


  for (
    let z = -480;
    z <= 480;
    z += spacing
  ) {

    createRoad(
      scene,
      0,
      z,
      false,
      city
    );

  }


  /* =========================
     BUILDINGS
  ========================= */

  for (
    let x = -460;
    x <= 460;
    x += spacing
  ) {

    for (
      let z = -460;
      z <= 460;
      z += spacing
    ) {

      if (
        Math.abs(x) < 40 &&
        Math.abs(z) < 40
      ) {

        continue;

      }


      createBuildingBlock(
        scene,
        x,
        z,
        city
      );

    }

  }


  /* =========================
     TREES
  ========================= */

  for (
    let i = 0;
    i < 180;
    i++
  ) {

    const x =
      THREE.MathUtils.randFloat(
        -480,
        480
      );

    const z =
      THREE.MathUtils.randFloat(
        -480,
        480
      );

    if (
      isNearRoad(
        x,
        z
      )
    ) {

      continue;

    }

    createTree(
      scene,
      x,
      z,
      city
    );

  }


  /* =========================
     STREET LIGHTS
  ========================= */

  for (
    let x = -480;
    x <= 480;
    x += spacing
  ) {

    for (
      let z = -480;
      z <= 480;
      z += spacing
    ) {

      createStreetLight(
        scene,
        x + 8,
        z + 8,
        city
      );

    }

  }


  return city;
}


/* =========================
   ROAD
========================= */

function createRoad(
  scene,
  x,
  z,
  vertical,
  city
) {

  const geometry =
    new THREE.BoxGeometry(
      vertical ? 12 : 1000,
      0.12,
      vertical ? 1000 : 12
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0x242424,
      roughness: 0.95
    });

  const road =
    new THREE.Mesh(
      geometry,
      material
    );

  road.position.set(
    x,
    0.06,
    z
  );

  road.receiveShadow = true;

  scene.add(road);

  city.roads.push(
    road
  );


  /* Road markings */

  const markGeometry =
    new THREE.BoxGeometry(
      vertical ? 0.3 : 5,
      0.13,
      vertical ? 5 : 0.3
    );

  const markMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffffff
    });


  for (
    let i = -480;
    i <= 480;
    i += 20
  ) {

    const mark =
      new THREE.Mesh(
        markGeometry,
        markMaterial
      );

    if (vertical) {

      mark.position.set(
        x,
        0.14,
        i
      );

    } else {

      mark.position.set(
        i,
        0.14,
        z
      );

    }

    scene.add(mark);

  }

}


/* =========================
   BUILDING
========================= */

function createBuildingBlock(
  scene,
  x,
  z,
  city
) {

  const count =
    Math.floor(
      THREE.MathUtils.randInt(
        1,
        4
      )
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const width =
      THREE.MathUtils.randFloat(
        18,
        30
      );

    const depth =
      THREE.MathUtils.randFloat(
        18,
        30
      );

    const height =
      THREE.MathUtils.randFloat(
        12,
        70
      );


    const offsetX =
      THREE.MathUtils.randFloat(
        -20,
        20
      );

    const offsetZ =
      THREE.MathUtils.randFloat(
        -20,
        20
      );


    const geometry =
      new THREE.BoxGeometry(
        width,
        height,
        depth
      );


    const material =
      new THREE.MeshStandardMaterial({
        color:
          new THREE.Color(
            THREE.MathUtils.randFloat(
              0.15,
              0.35
            ),
            THREE.MathUtils.randFloat(
              0.15,
              0.35
            ),
            THREE.MathUtils.randFloat(
              0.16,
              0.4
            )
          ),

        roughness: 0.8
      });


    const building =
      new THREE.Mesh(
        geometry,
        material
      );


    building.position.set(
      x + offsetX,
      height / 2,
      z + offsetZ
    );


    building.castShadow = true;

    building.receiveShadow = true;


    scene.add(
      building
    );


    city.buildings.push(
      building
    );

  }

}


/* =========================
   TREE
========================= */

function createTree(
  scene,
  x,
  z,
  city
) {

  const trunk =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.6,
        0.8,
        5,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x553822
      })
    );

  trunk.position.set(
    x,
    2.5,
    z
  );


  const leaves =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        3.5,
        8,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x1e5429
      })
    );

  leaves.position.set(
    x,
    7,
    z
  );


  trunk.castShadow = true;
  leaves.castShadow = true;


  scene.add(
    trunk,
    leaves
  );


  city.trees.push(
    trunk,
    leaves
  );

}


/* =========================
   STREET LIGHT
========================= */

function createStreetLight(
  scene,
  x,
  z,
  city
) {

  const pole =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.12,
        0.16,
        6,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x222222
      })
    );

  pole.position.set(
    x,
    3,
    z
  );


  const lamp =
    new THREE.PointLight(
      0xffddaa,
      1.5,
      35
    );

  lamp.position.set(
    x,
    6,
    z
  );


  scene.add(
    pole,
    lamp
  );


  city.lights.push(
    lamp
  );

}


/* =========================
   ROAD CHECK
========================= */

function isNearRoad(
  x,
  z
) {

  const spacing = 80;

  const nearestX =
    Math.round(
      x / spacing
    ) * spacing;

  const nearestZ =
    Math.round(
      z / spacing
    ) * spacing;


  return (
    Math.abs(
      x - nearestX
    ) < 10
    ||
    Math.abs(
      z - nearestZ
    ) < 10
  );

}


/* =========================
   CITY UPDATE
========================= */

export function updateCity(
  city,
  state,
  delta
) {

  const dayLength =
    180;

  const phase =
    (
      state.time %
      dayLength
    ) / dayLength;


  const angle =
    phase *
    Math.PI *
    2;


  const sun =
    new THREE.Vector3(
      Math.cos(angle),
      Math.sin(angle),
      0
    );


  /* Subtle city animation */

  city.lights.forEach(
    light => {

      light.intensity =
        sun.y < 0
          ? 2
          : 0.15;

    }
  );

}
