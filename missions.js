import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createMissionSystem(
    scene,
    state
) {

    const mission = {

        active: false,

        target:
            new THREE.Vector3(),

        marker: null,

        timer: 0,

        completed: 0

    };


    /* MISSION MARKER */

    const marker =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                5,
                0.7,
                12,
                32
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffff00
            })
        );


    marker.rotation.x =
        Math.PI / 2;


    marker.visible = false;


    scene.add(marker);


    mission.marker =
        marker;


    startMission(
        mission
    );


    return mission;
}


/* =========================
   START MISSION
========================= */

function startMission(
    mission
) {

    mission.active =
        true;


    mission.timer =
        90;


    mission.target.set(
        THREE.MathUtils.randFloat(
            -400,
            400
        ),
        0.2,
        THREE.MathUtils.randFloat(
            -400,
            400
        )
    );


    mission.marker.position.copy(
        mission.target
    );


    mission.marker.visible =
        true;


    const text =
        document.getElementById(
            "mission"
        );


    if (text) {

        text.textContent =
            "MISSION: Reach the yellow marker";

    }

}


/* =========================
   UPDATE
========================= */

export function updateMissions(
    mission,
    state,
    delta,
    player
) {

    if (
        !mission.active
    ) {

        return;

    }


    mission.timer -=
        delta;


    mission.marker.rotation.z +=
        delta * 2;


    const distance =
        player.group.position.distanceTo(
            mission.target
        );


    if (
        distance < 10
    ) {

        mission.active =
            false;


        mission.marker.visible =
            false;


        mission.completed++;


        const reward =
            100 +
            mission.completed * 50;


        state.money +=
            reward;


        const text =
            document.getElementById(
                "mission"
            );


        if (text) {

            text.textContent =
                "MISSION COMPLETE! +$" +
                reward;

        }


        setTimeout(
            () => {

                startMission(
                    mission
                );

            },
            2000
        );


        return;

    }


    if (
        mission.timer <= 0
    ) {

        mission.active =
            false;


        mission.marker.visible =
            false;


        const text =
            document.getElementById(
                "mission"
            );


        if (text) {

            text.textContent =
                "MISSION FAILED";

        }


        setTimeout(
            () => {

                startMission(
                    mission
                );

            },
            2000
        );

    }

}
