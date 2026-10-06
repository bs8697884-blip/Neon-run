import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createPlayer(scene) {

    const group =
        new THREE.Group();


    /* BODY */

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


    body.position.y =
        1.2;


    body.castShadow = true;


    /* HEAD */

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


    head.position.y =
        2.4;


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

        group: group,

        speed: 7,

        sprintSpeed: 12,

        vehicle: null,

        exitVehicle() {

            if (!this.vehicle)
                return;


            this.group.position.copy(
                this.vehicle.group.position
            );


            this.group.position.x += 3;


            this.group.visible = true;

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
   UPDATE PLAYER
========================= */

export function updatePlayer(
    player,
    state,
    delta
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
        direction.lengthSq() === 0
    ) {

        return;

    }


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


    if (!vehicle)
        return;


    if (state.keys["w"]) {

        vehicle.speed +=
            18 * delta;

    }


    if (state.keys["s"]) {

        vehicle.speed -=
            20 * delta;

    }


    if (
        !state.keys["w"] &&
        !state.keys["s"]
    ) {

        vehicle.speed *=
            0.97;

    }


    vehicle.speed =
        THREE.MathUtils.clamp(
            vehicle.speed,
            -12,
            35
        );


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
