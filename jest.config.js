export default {
  preset: "ts-jest/presets/default-esm", // ts-jest ESM preset
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/*.test.ts"],
};
