const PACKAGE_JSON_PATH: string = '../../package.json'

// Read package.json to get name and version
/* eslint-disable */
export const packageJson: { name: string, version: string } = require(PACKAGE_JSON_PATH)