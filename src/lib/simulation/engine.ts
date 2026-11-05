import { INITIAL_STATE, type SimulationState } from "@/types/simulation";
import type { MissionConfig } from "@/lib/mission/missionConfig";
import {
  calculatePowerState,
  injectFault,
} from "./power/powerEngine";
import { ComponentControl, applyComponentControl } from "./componentControl";

export function createSimulation() {
  let state: SimulationState = { ...INITIAL_STATE };

  return {
    getState: () => state,

    tick: (dt = 1) => {
      state = calculatePowerState(state, dt);
      return state;
    },

    fault: (type: string) => {
      state = injectFault(state, type);
      return state;
    },

    clearFault: (expectedType: string | null) => {
      if (
        !expectedType ||
        !state.faultActive ||
        state.faultType !== expectedType
      ) {
        return state;
      }

      state = {
        ...state,
        faultActive: false,
        faultType: null,
      };

      return state;
    },

    controlComponent: (control: ComponentControl) => {
      state = applyComponentControl(state, control);
      return state;
    },

    setSpaceWeather: (
      mode:
        | "NORMAL"
        | "HIGH_SOLAR"
        | "RADIATION_BURST"
        | "SOLAR_STORM"
        | "MAGNETIC_DISTURBANCE"
    ) => {
      state = calculatePowerState({
        ...state,
        spaceWeatherMode: mode,
        faultActive:
          mode === "NORMAL" ? state.faultActive : true,
        faultType:
          mode === "NORMAL" ? state.faultType : `SPACE_WEATHER_${mode}`,
      });

      return state;
    },


    applyMission: (mission: MissionConfig) => {
      const solarMultiplier =
        mission.solar === "Deployable Array"
          ? 1.18
          : mission.solar === "High-Efficiency Array"
            ? 1.10
            : 1.0;

      const batteryBase =
        mission.battery === "High-Capacity Battery"
          ? 88
          : mission.battery === "Radiation-Hardened Battery"
            ? 84
            : 78;

      const commsBase =
        mission.communications === "High-Gain Deep Space"
          ? 99
          : mission.communications === "X-Band"
            ? 95
            : mission.communications === "S-Band"
              ? 88
              : 76;

      const payloadLoad =
        mission.payload === "Spectrometer"
          ? 8
          : mission.payload === "Radiometer"
            ? 5
            : mission.payload === "Magnetometer"
              ? 4
              : 2;

      const solarArray = Math.max(
        0,
        Math.min(100, mission.power * solarMultiplier)
      );

      const battery = Math.max(
        0,
        Math.min(100, batteryBase + mission.power * 0.08)
      );

      const communicationHealth = Math.max(
        0,
        Math.min(100, commsBase)
      );

      const totalLoad = Math.max(
        10,
        22 + payloadLoad + mission.power * 0.12
      );

      const generatedPower = Math.max(
        20,
        solarArray * 0.94
      );

      const powerMargin = Math.max(
        0,
        Math.min(100, mission.power)
      );

      const missionHealth = Math.max(
        0,
        Math.min(
          100,
          mission.missionScore -
            mission.risk * 0.08 +
            (mission.science - 60) * 0.05
        )
      );

      state = {
        ...state,

        solarArray,
        battery,
        generatedPower,
        totalLoad,
        powerMargin,

        communicationHealth,
        communicationBaseHealth: commsBase,

        missionHealth,
        missionBaseHealth: missionHealth,
        missionPayloadLoad: payloadLoad,

        faultActive: false,
        faultType: null,
      };

      return state;
    },    reset: () => {
      state = { ...INITIAL_STATE };
      return state;
    },
  };
}
