import { join } from "node:path";
import { readFile } from "node:fs/promises";

export class GetGithubRepository {
    /**
     * @returns {Promise<GetGithubRepository>}
     */
    static async new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getGithubRepository(path) {
        let [
            ,
            repository
        ] = (await readFile(join(path, ".git", "config"), "utf8")).match(/\[remote "origin"\]\s+url *= *(.+)\s/);

        if (repository.startsWith("git@github.com:")) {
            repository = repository.substring(15);
        } else {
            if (repository.startsWith("https://github.com/") || (repository.startsWith("https://") && repository.includes("@github.com/"))) {
                repository = new URL(repository).pathname.substring(1);
            } else {
                throw new Error(`No github repository ${repository}"!`);
            }
        }

        if (repository.endsWith(".git")) {
            repository = repository.substring(0, repository.length - 4);
        }

        return repository;
    }
}
