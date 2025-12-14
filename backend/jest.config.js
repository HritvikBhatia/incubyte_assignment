const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  // Ignore compiled files in 'dist' to prevent duplicate tests running
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  transform: {
    ...tsJestTransformCfg,
  },
};