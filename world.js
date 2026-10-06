import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createCity(scene) {

    const city = {

        roads: [],

        buildings: [],

        trees: [],

        lights: []

    };


    /* GROUND */

    const ground =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                1100,
                1100
            ),
            new THREE.MeshStandardMaterial({
                color: 0x30352f
            })
        );


    ground.rotation.x =
        -Math.PI / 2;


    ground.receiveShadow = true;


    scene.add(ground);


    /* ROADS */

    const spacing = 80;


    for (
        let i = -480;
        i <= 480;
        i += spacing
    ) {

        createRoad(
            scene,
            i,
            true,
            city
        );

        createRoad(
            scene,
            i,
            false,
            city
        );

    }


    /* BUILDINGS */

    for (
        let x = -440;
        x <= 440;
        x += 80
    ) {

        for (
            let z = -440;
            z <= 440;
            z += 80
        ) {

            if (
                Math.abs(x) < 40 &&
                Math.abs(z) < 40
            ) {

                continue;

            }


            createBuilding(
                scene,
                x,
                z,
                city
            );

        }

    }


    /* TREES */

    for (
        let i = 0;
        i < 130;
        i++
    ) {

        const x =
            THREE.MathUtils.randFloat(
                -500,
                500
            );

        const z =
            THREE.MathUtils.randFloat(
                -500,
                500
            );


        if (
            Math.abs(
                Math.round(x / 80) * 80 - x
            ) < 12
        ) {

            continue;

        }


        if (
            Math.abs(
                Math.round(z / 80) * 80 - z
            ) < 12
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


    return city;
}


/* =========================
   ROAD
========================= */

function createRoad(
    scene,
    position,
    vertical,
    city
) {

    const width = 12;

    const length = 1000;


    const geometry =
        vertical
            ? new THREE.BoxGeometry(
                width,
                0.1,
                length
            )
            : new THREE.BoxGeometry(
                length,
                0.1,
                width
            );


    const material =
        new THREE.MeshStandardMaterial({
            color: 0x242424
        });


    const road =
        new THREE.Mesh(
            geometry,
            material
        );


    if (vertical) {

        road.position.set(
            position,
            0.05,
            0
        );

    } else {

        road.position.set(
            0,
            0.05,
            position
        );

    }


    road.receiveShadow = true;


    scene.add(road);


    city.roads.push(road);

}


/* =========================
   BUILDING
========================= */

function createBuilding(
    scene,
    x,
    z,
    city
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
            10,
            65
        );


    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );


    const colors = [
        0x252525,
        0x303030,
        0x3a3a3a,
        0x454545,
        0x202a30
    ];


    const material =
        new THREE.MeshStandardMaterial({
            color:
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ]
        });


    const building =
        new THREE.Mesh(
            geometry,
            material
        );


    building.position.set(
        x +
        THREE.MathUtils.randFloat(
            -18,
            18
        ),

        height / 2,

        z +
        THREE.MathUtils.randFloat(
            -18,
            18
        )
    );


    building.castShadow = true;

    building.receiveShadow = true;


    scene.add(building);


    city.buildings.push(
        building
    );

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
                0.5,
                0.7,
                4,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x51351f
            })
        );


    trunk.position.set(
        x,
        2,
        z
    );


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                3,
                8,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x23582b
            })
        );


    leaves.position.set(
        x,
        6,
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
   CITY UPDATE
========================= */

export function updateCity(
    city,
    state,
    delta
) {

    /* Reserved for future:
       weather,
       day/night,
       pedestrians,
       ambient animation.
    */

}
