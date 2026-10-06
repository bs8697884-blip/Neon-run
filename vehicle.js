import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createVehicles(scene) {

    const vehicles = {

        cars: [],

        traffic: [],


        findNearestVehicle(
            position,
            maxDistance
        ) {

            let nearest = null;

            let distance =
                maxDistance;


            for (
                const car of this.cars
            ) {

                const d =
                    car.group.position.distanceTo(
                        position
                    );


                if (
                    d < distance
                ) {

                    nearest = car;

                    distance = d;

                }

            }


            return nearest;

        }

    };


    /* PARKED / DRIVABLE CARS */

    const positions = [

        [-10, 10],
        [12, -10],
        [25, 30],
        [-30, -25],
        [70, 50]

    ];


    positions.forEach(
        position => {

            const car =
                createCar(
                    scene,
                    position[0],
                    position[1]
                );


            vehicles.cars.push(
                car
            );

        }
    );


    /* TRAFFIC */

    for (
        let i = 0;
        i < 30;
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


        vehicles.traffic.push(
            car
        );

    }


    return vehicles;
}


/* =========================
   CREATE CAR
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
                0.7,
                4
            ),
            new THREE.MeshStandardMaterial({
                color:
                    new THREE.Color(
                        Math.random() * 0.6,
                        Math.random() * 0.3,
                        Math.random() * 0.3
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
                1.9
            ),
            new THREE.MeshStandardMaterial({
                color: 0x151515
            })
        );


    roof.position.y =
        1.25;


    /* WHEELS */

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

        [-1.1, 0.4, -1.35],
        [1.1, 0.4, -1.35],
        [-1.1, 0.4, 1.35],
        [1.1, 0.4, 1.35]

    ];


    for (
        const p of wheelPositions
    ) {

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


        group.add(wheel);

    }


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


    scene.add(group);


    return {

        group: group,

        speed: 0,

        traffic: false,

        horizontal: false

    };

}


/* =========================
   UPDATE VEHICLES
========================= */

export function updateVehicles(
    vehicles,
    state,
    delta,
    player
) {

    for (
        const car of vehicles.traffic
    ) {

        if (car.horizontal) {

            car.group.position.x +=
                car.speed * delta;

        } else {

            car.group.position.z +=
                car.speed * delta;

        }


        if (
            car.group.position.x > 520
        ) {

            car.group.position.x =
                -520;

        }


        if (
            car.group.position.x < -520
        ) {

            car.group.position.x =
                520;

        }


        if (
            car.group.position.z > 520
        ) {

            car.group.position.z =
                -520;

        }


        if (
            car.group.position.z < -520
        ) {

            car.group.position.z =
                520;

        }

    }


    /* Simple collision */

    if (
        state.inVehicle &&
        player.vehicle
    ) {

        for (
            const traffic of vehicles.traffic
        ) {

            const distance =
                player.vehicle.group.position
                    .distanceTo(
                        traffic.group.position
                    );


            if (
                distance < 3
            ) {

                player.vehicle.speed *=
                    -0.4;

                state.health -=
                    delta * 3;

                state.wanted =
                    Math.min(
                        5,
                        state.wanted + delta
                    );

            }

        }

    }

}
