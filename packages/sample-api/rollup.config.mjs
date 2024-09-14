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
        entryFileNames: '[name].js',
    },
    plugins: [typescript(), nodeResolve({ exportConditions: ["node"], }), json(), commonjs()]
}