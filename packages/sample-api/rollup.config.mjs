import nodeResolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import json from "@rollup/plugin-json"

export default {
    input: "src/index.ts",
    output: {
        dir: "build",
        format: "esm",
        sourcemap: true,
        entryFileNames: '[name].mjs',
        // Shim to resolve __dirname in esm mode when bundled
        banner: `
            import { fileURLToPath } from "node:url";
            import {dirname as pathDirname} from "node:path";
            const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
            const __dirname = pathDirname(__filename); // get the name of the directory
        `
    },
    plugins: [typescript(), nodeResolve({ exportConditions: ["node"], }), json(), commonjs()]
}