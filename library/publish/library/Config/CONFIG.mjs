import { BUILD_CONFIG_APPLICATION_ID } from "@publish-utils/build-config/BUILD_CONFIG.mjs";

export const CONFIG_ENV_PREFIX = `${BUILD_CONFIG_APPLICATION_ID}-`.replaceAll("-", "_").toUpperCase();
