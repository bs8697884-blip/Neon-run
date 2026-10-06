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
} from "./vehicle.js";

import {
    createMissionSystem,
    updateMissions
} from "./missions.js";


/* =========================
   GAME STATE
========================= */

const state = {

    started: false,

    money: 250,

    health: 100,

    wanted: 0,

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
    new THREE.Color(0x8faabd);

scene.fog =
    new THREE.Fog(
        0x8faabd,
        100,
        650
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
        1000
    );

camera.position.set(
    0,
    7,
    12
);


/* =========================
   RENDERER
========================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.shadowMap.enabled = true;

document
    .getElementById("game")
    .appendChild(renderer.domElement);


/* =========================
   LIGHT
========================= */

const ambient =
    new THREE.HemisphereLight(
        0xffffff,
        0x344455,
        2
    );

scene.add(ambient);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sun.position.set(
    150,
    250,
    100
);

sun.castShadow = true;

scene.add(sun);


/* =========================
   GAME WORLD
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
   KEYBOARD
========================= */

window.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

        state.keys[key] = true;

        if (key === "e") {

            toggleVehicle();

        }

    }
);


window.addEventListener(
    "keyup",
    function(event) {

        const key =
            event.key.toLowerCase();

        state.keys[key] = false;

    }
);


/* =========================
   MOBILE CONTROLS
========================= */

document
    .querySelectorAll("[data-key]")
    .forEach(button => {

        const key =
            button.dataset.key;


        button.addEventListener(
            "pointerdown",
            function(event) {

                event.preventDefault();

                state.keys[key] = true;

                if (key === "e") {

                    toggleVehicle();

                }

            }
        );


        button.addEventListener(
            "pointerup",
            function(event) {

                event.preventDefault();

                state.keys[key] = false;

            }
        );


        button.addEventListener(
            "pointercancel",
            function() {

                state.keys[key] = false;

            }
        );

    });


/* =========================
   PLAY BUTTON
========================= */

const startButton =
    document.getElementById("start");


startButton.addEventListener(
    "click",
    function() {

        state.started = true;

        document
            .getElementById("overlay")
            .style.display = "none";

        document
            .getElementById("hint")
            .textContent =
            "WASD move • E enter car • Shift run";

    }
);


/* =========================
   VEHICLE TOGGLE
========================= */

function toggleVehicle() {

    if (!state.started)
        return;


    if (state.inVehicle) {

        player.exitVehicle();

        state.inVehicle = false;

        document
            .getElementById("hint")
            .textContent =
            "WASD move • E enter car • Shift run";

        return;

    }


    const nearest =
        vehicles.findNearestVehicle(
            player.group.position,
            5
        );


    if (nearest) {

        player.enterVehicle(
            nearest
        );

        state.inVehicle = true;

        document
            .getElementById("hint")
            .textContent =
            "WASD drive • E exit";

    }

}


/* =========================
   HUD
========================= */

function updateHUD() {

    document.getElementById("money")
        .textContent =
        Math.floor(state.money);

    document.getElementById("health")
        .textContent =
        Math.max(
            0,
            Math.floor(state.health)
        );

    document.getElementById("wanted")
        .textContent =
        Math.max(
            0,
            Math.floor(state.wanted)
        );

}


/* =========================
   CAMERA
========================= */

function updateCamera() {

    const target =
        player.getCameraTarget();


    const desired =
        new THREE.Vector3();


    desired.copy(
        target.position
    );


    desired.y += 6;

    desired.z += 10;


    camera.position.lerp(
        desired,
        0.08
    );


    const lookAt =
        target.position.clone();


    lookAt.y += 1.4;


    camera.lookAt(
        lookAt
    );

}


/* =========================
   MINIMAP
========================= */

const minimap =
    document.getElementById(
        "minimap"
    );

const map =
    minimap.getContext("2d");


function updateMinimap() {

    const size = 160;

    map.clearRect(
        0,
        0,
        size,
        size
    );


    map.fillStyle =
        "#182018";

    map.fillRect(
        0,
        0,
        size,
        size
    );


    map.strokeStyle =
        "#555";

    map.lineWidth = 5;


    for (
        let i = -500;
        i <= 500;
        i += 80
    ) {

        const x =
            size / 2 +
            (
                i -
                player.group.position.x
            ) * 0.35;


        const y =
            size / 2 +
            (
                i -
                player.group.position.z
            ) * 0.35;


        map.beginPath();

        map.moveTo(
            x,
            0
        );

        map.lineTo(
            x,
            size
        );

        map.stroke();


        map.beginPath();

        map.moveTo(
            0,
            y
        );

        map.lineTo(
            size,
            y
        );

        map.stroke();

    }


    map.fillStyle =
        "white";


    map.beginPath();

    map.arc(
        size / 2,
        size / 2,
        5,
        0,
        Math.PI * 2
    );

    map.fill();

}


/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    function() {

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

        updateMinimap();

        updateHUD();

    }


    renderer.render(
        scene,
        camera
    );

}


animate();
