import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createPlayer(scene) {

    const group =
        new THREE.Group();


    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.55,
                1.3,
                6,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x202020
            })
        );


    body.position.y = 1.2;

    body.castShadow = true;


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.4,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0xc68a68
            })
        );


    head.position.y = 2.4;

    head.castShadow = true;


    group.add(
        body,
        head
    );


    group.position.set(
        0,
        0,
        20
    );


    scene.add(group);


    const player = {

        group,

        speed: 7,

        sprintSpeed: 12,

        vehicle: null,


        exitVehicle() {

            if (!this.vehicle) {
                return;
            }


            this.group.position.copy(
                this.vehicle.group.position
            );


            this.group.position.x += 3;


            this.group.visible =
                true;


            this.vehicle = null;

        },


        enterVehicle(vehicle) {

            this.vehicle =
                vehicle;

            this.group.visible =
                false;

        },


        getCameraTarget() {

            if (this.vehicle) {
                return this.vehicle.group;
            }

            return this.group;

        }

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

        updateVehicleMovement(
            player,
            state,
            delta
        );

        return;

    }


    /* =========================
       TOUCH + KEYBOARD INPUT
    ========================= */

    let x =
        state.joystickX || 0;

    let y =
        state.joystickY || 0;


    /*
     * Keyboard still works on
     * computers.
     */

    if (state.keys["a"]) {
        x -= 1;
    }

    if (state.keys["d"]) {
        x += 1;
    }

    if (state.keys["w"]) {
        y -= 1;
    }

    if (state.keys["s"]) {
        y += 1;
    }


    const direction =
        new THREE.Vector3(
            x,
            0,
            y
        );


    if (
        direction.lengthSq() <
        0.001
    ) {

        return;

    }


    direction.normalize();


    const running =
        state.runPressed ||
        state.keys["shift"];


    const speed =
        running
            ? player.sprintSpeed
            : player.speed;


    /*
     * Move relative to camera.
     */

    const cameraAngle =
        state.cameraYaw || 0;


    const rotatedX =
        direction.x *
            Math.cos(cameraAngle)
        -
        direction.z *
            Math.sin(cameraAngle);


    const rotatedZ =
        direction.x *
            Math.sin(cameraAngle)
        +
        direction.z *
            Math.cos(cameraAngle);


    const movement =
        new THREE.Vector3(
            rotatedX,
            0,
            rotatedZ
        );


    player.group.position.add(
        movement.multiplyScalar(
            speed * delta
        )
    );


    /*
     * Rotate character toward
     * movement direction.
     */

    player.group.rotation.y =
        Math.atan2(
            movement.x,
            movement.z
        );

}


/* =========================
   VEHICLE MOVEMENT
========================= */

function updateVehicleMovement(
    player,
    state,
    delta
) {

    const vehicle =
        player.vehicle;


    if (!vehicle) {
        return;
    }


    /*
     * Joystick Y:
     *
     * up    = negative
     * down  = positive
     */

    let throttle =
        -(state.joystickY || 0);


    let steering =
        state.joystickX || 0;


    /*
     * Keyboard support.
     */

    if (state.keys["w"]) {
        throttle = 1;
    }

    if (state.keys["s"]) {
        throttle = -1;
    }

    if (state.keys["a"]) {
        steering = -1;
    }

    if (state.keys["d"]) {
        steering = 1;
    }


    /* =========================
       ACCELERATION
    ========================= */

    if (
        throttle > 0.05
    ) {

        vehicle.speed +=
            18 *
            throttle *
            delta;

    } else if (
        throttle < -0.05
    ) {

        vehicle.speed +=
            20 *
            throttle *
            delta;

    } else {

        vehicle.speed *=
            Math.pow(
                0.05,
                delta
            );

    }


    vehicle.speed =
        THREE.MathUtils.clamp(
            vehicle.speed,
            -12,
            35
        );


    /* =========================
       STEERING
    ========================= */

    if (
        Math.abs(steering) >
        0.05
    ) {

        vehicle.group.rotation.y +=
            steering *
            vehicle.speed *
            0.025 *
            delta;

    }


    /* =========================
       DRIVE FORWARD
    ========================= */

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


    /*
     * Keep the player attached
     * to the vehicle.
     */

    player.group.position.copy(
        vehicle.group.position
    );

}
