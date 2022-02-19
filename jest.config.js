const { pathsToModuleNameMapper } = require("ts-jest");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: "./tests/unit",
    moduleNameMapper: { "^@/(.*)": "<rootDir>/../../$1" },
};
