/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: "./tests/unit",
    moduleNameMapper: {
        "^@/(.*)": "<rootDir>/../../$1",
        "^~~/(.*)": "<rootDir>/../../$1",
    },
};
