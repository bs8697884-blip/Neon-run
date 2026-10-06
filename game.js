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

    time: 0,

    joystickX: 0,

    joystickY: 0,

    runPressed: false,

    cameraYaw: 0,

    cameraPitch: 0.35

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
    .appendChild(
        renderer.domElement
    );


/* =========================
   LIGHTING
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
   WORLD
========================= */

const city =
    createCity(scene);

const player =
    createPlayer(scene);

const vehicles =
    createVehicles(scene);

const missions =
    createMissionSystem(
        scene,
        state
    );


/* =========================
   KEYBOARD SUPPORT
========================= */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        state.keys[key] = true;

        if (key === "shift") {
            state.runPressed = true;
        }

        if (key === "e") {
            toggleVehicle();
        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        const key =
            event.key.toLowerCase();

        state.keys[key] = false;

        if (key === "shift") {
            state.runPressed = false;
        }

    }
);


/* =========================
   START GAME
========================= */

document
    .getElementById("start")
    .addEventListener(
        "click",
        () => {

            state.started = true;

            document
                .getElementById("overlay")
                .style.display = "none";

            document
                .getElementById("hint")
                .textContent =
                "🕹️ Move • Swipe to look • 🚗 Vehicle";

        }
    );


/* =========================
   VEHICLE
========================= */

function toggleVehicle() {

    if (!state.started) {
        return;
    }


    if (state.inVehicle) {

        player.exitVehicle();

        state.inVehicle = false;

        document
            .getElementById("hint")
            .textContent =
            "🕹️ Move • Swipe to look • 🚗 Vehicle";

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
            "🕹️ Drive • 🚗 Exit";

    }

}


/* =========================
   ACTION BUTTON
========================= */

document
    .getElementById("enterButton")
    .addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            toggleVehicle();

        }
    );


document
    .getElementById("actionButton")
    .addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            /*
             * Reserved for future:
             * missions,
             * shops,
             * NPC interaction,
             * pickups.
             */

        }
    );


/* =========================
   RUN BUTTON
========================= */

const runButton =
    document.getElementById(
        "runButton"
    );


runButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        state.runPressed = true;

    }
);


runButton.addEventListener(
    "pointerup",
    event => {

        event.preventDefault();

        state.runPressed = false;

    }
);


runButton.addEventListener(
    "pointercancel",
    () => {

        state.runPressed = false;

    }
);


runButton.addEventListener(
    "pointerleave",
    () => {

        state.runPressed = false;

    }
);


/* =========================
   VIRTUAL JOYSTICK
========================= */

const joystickZone =
    document.getElementById(
        "joystickZone"
    );

const joystickBase =
    document.getElementById(
        "joystickBase"
    );

const joystickStick =
    document.getElementById(
        "joystickStick"
    );


let joystickPointerId =
    null;


const joystickRadius = 45;


function updateJoystick(
    clientX,
    clientY
) {

    const rect =
        joystickBase.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;


    const centerY =
        rect.top +
        rect.height / 2;


    let x =
        clientX -
        centerX;


    let y =
        clientY -
        centerY;


    const distance =
        Math.sqrt(
            x * x +
            y * y
        );


    if (
        distance >
        joystickRadius
    ) {

        x =
            x /
            distance *
            joystickRadius;

        y =
            y /
            distance *
            joystickRadius;

    }


    state.joystickX =
        x /
        joystickRadius;


    state.joystickY =
        y /
        joystickRadius;


    joystickStick.style.transform =
        `translate(${x}px, ${y}px)`;

}


function resetJoystick() {

    joystickPointerId =
        null;

    state.joystickX = 0;

    state.joystickY = 0;

    joystickStick.style.transform =
        "translate(0px, 0px)";

}


joystickZone.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        joystickPointerId =
            event.pointerId;

        joystickZone.setPointerCapture(
            event.pointerId
        );

        updateJoystick(
            event.clientX,
            event.clientY
        );

    }
);


joystickZone.addEventListener(
    "pointermove",
    event => {

        if (
            event.pointerId !==
            joystickPointerId
        ) {
            return;
        }

        event.preventDefault();

        updateJoystick(
            event.clientX,
            event.clientY
        );

    }
);


joystickZone.addEventListener(
    "pointerup",
    event => {

        if (
            event.pointerId ===
            joystickPointerId
        ) {

            resetJoystick();

        }

    }
);


joystickZone.addEventListener(
    "pointercancel",
    resetJoystick
);


/* =========================
   CAMERA TOUCH
========================= */

const cameraZone =
    document.getElementById(
        "cameraZone"
    );


let cameraPointerId =
    null;

let lastCameraX = 0;

let lastCameraY = 0;


cameraZone.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        cameraPointerId =
            event.pointerId;

        lastCameraX =
            event.clientX;

        lastCameraY =
            event.clientY;

        cameraZone.setPointerCapture(
            event.pointerId
        );

    }
);


cameraZone.addEventListener(
    "pointermove",
    event => {

        if (
            event.pointerId !==
            cameraPointerId
        ) {
            return;
        }

        event.preventDefault();


        const dx =
            event.clientX -
            lastCameraX;


        const dy =
            event.clientY -
            lastCameraY;


        lastCameraX =
            event.clientX;

        lastCameraY =
            event.clientY;


        state.cameraYaw -=
            dx * 0.006;


        state.cameraPitch -=
            dy * 0.004;


        state.cameraPitch =
            THREE.MathUtils.clamp(
                state.cameraPitch,
                -0.2,
                0.8
            );

    }
);


cameraZone.addEventListener(
    "pointerup",
    event => {

        if (
            event.pointerId ===
            cameraPointerId
        ) {

            cameraPointerId =
                null;

        }

    }
);


cameraZone.addEventListener(
    "pointercancel",
    () => {

        cameraPointerId =
            null;

    }
);


/* =========================
   HUD
========================= */

function updateHUD() {

    document
        .getElementById("money")
        .textContent =
        Math.floor(
            state.money
        );


    document
        .getElementById("health")
        .textContent =
        Math.max(
            0,
            Math.floor(
                state.health
            )
        );


    document
        .getElementById("wanted")
        .textContent =
        Math.max(
            0,
            Math.floor(
                state.wanted
            )
        );

}


/* =========================
   CAMERA
========================= */

function updateCamera() {

    const target =
        player.getCameraTarget();


    const distance = 10;


    const horizontal =
        Math.cos(
            state.cameraPitch
        ) *
        distance;


    const desired =
        new THREE.Vector3();


    desired.x =
        target.position.x +
        Math.sin(
            state.cameraYaw
        ) *
        horizontal;


    desired.y =
        target.position.y +
        5 -
        Math.sin(
            state.cameraPitch
        ) * distance;


    desired.z =
        target.position.z +
        Math.cos(
            state.cameraYaw
        ) *
        horizontal;


    camera.position.lerp(
        desired,
        0.10
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
    minimap.getContext(
        "2d"
    );


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
            ) *
            0.35;


        const y =
            size / 2 +
            (
                i -
                player.group.position.z
            ) *
            0.35;


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

        state.time +=
            delta;


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
