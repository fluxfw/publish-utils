import { BUILD_CONFIG_APPLICATION_ID } from "@publish-utils/build-config/BuildConfig/BUILD_CONFIG.mjs";

export const CONFIG_ENV_PREFIX = `${BUILD_CONFIG_APPLICATION_ID}-`.replaceAll("-", "_").toUpperCase();
