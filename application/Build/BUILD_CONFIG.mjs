import { fileURLToPath } from "node:url";
import { basename, dirname, join } from "node:path";

export const BUILD_CONFIG_APPLICATION_ID = basename(join(dirname(fileURLToPath(import.meta.url)), "..", ".."));
