import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export function createMissionSystem(
  scene,
  state
) {

  const missions = {

    active: false,

    index: 0,

    target:
      new THREE.Vector3(),

    timer: 0,

    completed: 0

  };


  startMission(
    missions,
    state
  );


  return missions;
}


/* =========================
   START MISSION
========================= */

function startMission(
  missions,
  state
) {

  missions.active =
    true;

  missions.timer =
    90;


  missions.target.set(
    THREE.MathUtils.randFloat(
      -400,
      400
    ),
    0,
    THREE.MathUtils.randFloat(
      -400,
      400
    )
  );


  const mission =
    document.getElementById(
      "mission"
    );


  mission.textContent =
    "MISSION: Reach the marked location";

}


/* =========================
   UPDATE
========================= */

export function updateMissions(
  missions,
  state,
  delta,
  player
) {

  if (
    !missions.active
  )
    return;


  missions.timer -=
    delta;


  const distance =
    player.group.position.distanceTo(
      missions.target
    );


  /* Mission completion */

  if (
    distance < 12
  ) {

    missions.active =
      false;

    missions.completed++;


    const reward =
      100 +
      missions.completed * 50;


    state.money +=
      reward;


    state.wanted =
      Math.max(
        0,
        state.wanted - 1
      );


    document.getElementById(
      "mission"
    ).textContent =
      `MISSION COMPLETE +$${reward}`;


    setTimeout(
      () => {

        startMission(
          missions,
          state
        );

      },
      2500
    );

  }


  /* Mission timeout */

  if (
    missions.timer <= 0
  ) {

    missions.active =
      false;


    document.getElementById(
      "mission"
    ).textContent =
      "MISSION FAILED";


    setTimeout(
      () => {

        startMission(
          missions,
          state
        );

      },
      2000
    );

  }


  /* Wanted system */

  if (
    state.wanted > 0
  ) {

    state.wanted -=
      0.01 * delta;

    state.wanted =
      Math.max(
        0,
        state.wanted
      );

  }

}
