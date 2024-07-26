import { basename, join } from "node:path";

export const BUILD_CONFIG_APPLICATION_ID = basename(join(import.meta.dirname, "..", "..", "..", ".."));
