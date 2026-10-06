import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import {
  createCity,
  updateCity
} from "./world.js";

import {
  createPlayer,
  updatePlayer
} from "./player.js";

import {
  createVehicles,
  updateVehicles
} from "./vehicles.js";

import {
  createMissionSystem,
  updateMissions
} from "./missions.js";


/* =========================
   GAME STATE
========================= */

const state = {

  money: 250,

  health: 100,

  wanted: 0,

  started: false,

  inVehicle: false,

  keys: {},

  time: 0

};


/* =========================
   SCENE
========================= */

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(0x87a8c4);

scene.fog =
  new THREE.Fog(
    0x87a8c4,
    100,
    800
  );


/* =========================
   CAMERA
========================= */

const camera =
  new THREE.PerspectiveCamera(
    65,
    window.innerWidth /
      window.innerHeight,
    0.1,
    1500
  );

camera.position.set(
  0,
  8,
  12
);


/* =========================
   RENDERER
========================= */

const renderer =
  new THREE.WebGLRenderer({
    antialias: true
  });

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

document
  .getElementById("game")
  .appendChild(renderer.domElement);


/* =========================
   LIGHTING
========================= */

const ambient =
  new THREE.HemisphereLight(
    0xffffff,
    0x334455,
    2
  );

scene.add(ambient);


const sun =
  new THREE.DirectionalLight(
    0xffffff,
    3
  );

sun.position.set(
  100,
  200,
  100
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

scene.add(sun);


/* =========================
   CITY
========================= */

const city =
  createCity(scene);


/* =========================
   PLAYER
========================= */

const player =
  createPlayer(scene);


/* =========================
   VEHICLES
========================= */

const vehicles =
  createVehicles(scene);


/* =========================
   MISSIONS
========================= */

const missions =
  createMissionSystem(
    scene,
    state
  );


/* =========================
   INPUT
========================= */

window.addEventListener(
  "keydown",
  event => {

    state.keys[
      event.key.toLowerCase()
    ] = true;

    if (
      event.key.toLowerCase() === "e"
    ) {

      toggleVehicle();

    }

  }
);


window.addEventListener(
  "keyup",
  event => {

    state.keys[
      event.key.toLowerCase()
    ] = false;

  }
);


/* =========================
   MOBILE INPUT
========================= */

document
  .querySelectorAll(
    "[data-key]"
  )
  .forEach(button => {

    const key =
      button.dataset.key;

    button.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        state.keys[key] = true;

      }
    );

    button.addEventListener(
      "pointerup",
      event => {

        event.preventDefault();

        state.keys[key] = false;

      }
    );

    button.addEventListener(
      "pointercancel",
      () => {

        state.keys[key] = false;

      }
    );

    button.addEventListener(
      "pointerleave",
      () => {

        state.keys[key] = false;

      }
    );

  });


/* =========================
   VEHICLE ENTER / EXIT
========================= */

function toggleVehicle() {

  if (!state.started)
    return;

  if (state.inVehicle) {

    state.inVehicle = false;

    player.exitVehicle();

    updateHint();

    return;
  }


  const nearest =
    vehicles.findNearestVehicle(
      player.group.position,
      5
    );

  if (nearest) {

    state.inVehicle = true;

    player.enterVehicle(
      nearest
    );

    updateHint();

  }

}


/* =========================
   HUD
========================= */

function updateHUD() {

  document.getElementById(
    "money"
  ).textContent =
    Math.floor(state.money);

  document.getElementById(
    "health"
  ).textContent =
    Math.max(
      0,
      Math.floor(state.health)
    );

  document.getElementById(
    "wanted"
  ).textContent =
    state.wanted;

}


function updateHint() {

  const hint =
    document.getElementById(
      "hint"
    );

  if (state.inVehicle) {

    hint.textContent =
      "WASD drive • E exit vehicle";

  } else {

    hint.textContent =
      "WASD move • E enter car • Shift sprint";

  }

}


/* =========================
   MINIMAP
========================= */

const mapCanvas =
  document.getElementById(
    "map"
  );

const mapContext =
  mapCanvas.getContext(
    "2d"
  );


function drawMinimap() {

  const ctx =
    mapContext;

  const size =
    mapCanvas.width;

  ctx.clearRect(
    0,
    0,
    size,
    size
  );

  ctx.fillStyle =
    "#182018";

  ctx.fillRect(
    0,
    0,
    size,
    size
  );


  /* Roads */

  ctx.strokeStyle =
    "#555";

  ctx.lineWidth = 8;

  const roadSpacing = 80;

  for (
    let i = -1000;
    i <= 1000;
    i += roadSpacing
  ) {

    const x =
      size / 2 +
      (
        i -
        player.group.position.x
      ) * 0.7;

    const y =
      size / 2 +
      (
        i -
        player.group.position.z
      ) * 0.7;


    ctx.beginPath();

    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(0, y);
    ctx.lineTo(size, y);

    ctx.stroke();

  }


  /* Player */

  ctx.fillStyle =
    "#ffffff";

  ctx.beginPath();

  ctx.arc(
    size / 2,
    size / 2,
    5,
    0,
    Math.PI * 2
  );

  ctx.fill();

}


function updateCamera() {

  const target =
    player.getCameraTarget();

  const desired =
    new THREE.Vector3();

  desired.copy(
    target.position
  );

  desired.y +=
    state.inVehicle
      ? 7
      : 6;

  desired.z +=
    state.inVehicle
      ? 12
      : 9;


  camera.position.lerp(
    desired,
    0.08
  );


  const lookAt =
    target.position.clone();

  lookAt.y += 1.5;

  camera.lookAt(
    lookAt
  );

}


/* =========================
   START GAME
========================= */

document
  .getElementById("start")
  .addEventListener(
    "click",
    () => {

      state.started = true;

      document.getElementById(
        "overlay"
      ).style.display = "none";

      updateHint();

    }
  );


/* =========================
   RESIZE
========================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =========================
   GAME LOOP
========================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );

  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );

  if (state.started) {

    state.time += delta;


    updatePlayer(
      player,
      state,
      delta,
      vehicles
    );


    updateVehicles(
      vehicles,
      state,
      delta,
      player
    );


    updateCity(
      city,
      state,
      delta
    );


    updateMissions(
      missions,
      state,
      delta,
      player
    );


    updateCamera();

    drawMinimap();

    updateHUD();

  }

  renderer.render(
    scene,
    camera
  );

}

animate();
