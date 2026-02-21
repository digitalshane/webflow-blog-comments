import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/comments-embed/comments-embed.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  outfile: "public/comments-embed.min.js",
});

console.log("Built public/comments-embed.min.js");
