export { default } from "./main.mjs";
export const config = {
  name: "server handler",
  generator: "nuxt@4.2.1",
  path: "/*",
  nodeBundler: "none",
  includedFiles: ["**"],
  excludedPath: ["/.netlify/*","/asterisk_truck/_nuxt/builds/meta/*","/asterisk_truck/_nuxt/builds/*","/asterisk_truck/_fonts/*","/asterisk_truck/_nuxt/*"],
  preferStatic: true,
};