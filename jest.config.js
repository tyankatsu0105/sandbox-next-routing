const swcConfig = require("./.jest/swc");

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", swcConfig],
  },
  testEnvironment: "jsdom",
};
