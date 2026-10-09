// Bundles the Agent Pets canvas renderer into one static module for the Work section.
// The renderer lives in the Agent Pets repository (GPL-3.0-or-later, same author); point
// AGENT_PETS_SRC at its app/src folder if the checkout is not a sibling of this repo.
import { build } from "esbuild";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(process.env.AGENT_PETS_SRC ?? path.join(here, "../../../Agent Pets/app/src"));

await build({
  entryPoints: [path.join(here, "perch.ts")],
  outfile: path.join(here, "../../public/pets/perch.js"),
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  legalComments: "inline",
  banner: { js: "/*! Agent Pets renderer © Marcel Moskwa, GPL-3.0-or-later, https://github.com/Marczelloo/agent-pets */" },
  plugins: [
    {
      name: "agent-pets-src",
      setup(b) {
        b.onResolve({ filter: /^@pets\// }, (args) => {
          const base = path.join(src, args.path.slice("@pets/".length));
          return { path: existsSync(`${base}.ts`) ? `${base}.ts` : path.join(base, "index.ts") };
        });
      },
    },
  ],
});
console.log("public/pets/perch.js built from", src);
