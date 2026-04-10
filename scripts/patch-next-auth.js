/**
 * Patches next-auth's bundled @auth/core to fix a bug in beta.30 where
 * the issuer validation fails for GitHub OAuth because the fallback issuer
 * is hardcoded to "https://authjs.dev" instead of reading the `iss`
 * parameter from the callback response (RFC 9207).
 *
 * Remove this script once next-auth ships a fixed beta or stable release.
 */
const fs = require("fs");
const path = require("path");

const TARGET = path.join(
  __dirname,
  "../node_modules/next-auth/node_modules/@auth/core/lib/actions/callback/oauth/callback.js"
);

const FIND =
  'issuer: provider.issuer ?? "https://authjs.dev", // TODO: review fallback issuer';
const REPLACE =
  'issuer: provider.issuer ?? params?.iss ?? "https://authjs.dev", // Fall back to iss from callback params (RFC 9207)';

if (!fs.existsSync(TARGET)) {
  console.log("patch-next-auth: target file not found, skipping.");
  process.exit(0);
}

const content = fs.readFileSync(TARGET, "utf8");

if (content.includes(REPLACE)) {
  console.log("patch-next-auth: already applied, skipping.");
  process.exit(0);
}

if (!content.includes(FIND)) {
  console.log("patch-next-auth: target string not found — next-auth may have been updated. Review and remove this script.");
  process.exit(0);
}

fs.writeFileSync(TARGET, content.replace(FIND, REPLACE), "utf8");
console.log("patch-next-auth: patched successfully.");
