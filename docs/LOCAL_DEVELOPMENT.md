# Local Firebase development

Run `npm run dev`, then open http://127.0.0.1:4174. Node 22 or newer is recommended.

This server injects Firebase's supported App Check debug configuration before the app starts. It creates a device token in `.local/appcheck-debug-token`, outside `public/`, with owner-only file permissions. The ignored `.local/` directory must never be committed or copied into a deployment.

## Register this device once

A Firebase project administrator must register the token for:

- Project: `varelyx-ai-builder-cup`
- Web app: `1:32966208347:web:1bef3397bac296973b087e`
- Firebase Console → Security → App Check → Apps → web app menu → Manage debug tokens

Copy the value from `.local/appcheck-debug-token` into a new debug token entry labelled for this local device. Share it only through a private channel with the project administrator. Alternatively, grant the developer account Firebase App Check Admin (`roles/firebaseappcheck.admin`) on this project so the developer can register the token. Reload the local page afterward.

If the owner supplies a token they have already registered, replace the contents of `.local/appcheck-debug-token` with that UUID and restart the server. Do not paste tokens into GitHub issues, pull requests or public logs.

This token is reused across local browsers on this device. The local configuration endpoint is served only by the loopback-bound development server and rejects unrelated Host, Origin and cross-site requests. Cross-origin resource loading and caching are disabled. Production Hosting continues to deploy only `public/`; its entry HTML is unchanged and contains no debug-token setup.

## Verify after registration

Use a dedicated browser session and synthetic supplier text:

1. Confirm the Firebase server read succeeds locally.
2. Analyze the synthetic disruption and confirm a real Gemini response.
3. Confirm capacity and run PASS → unsafe BLOCK → balanced PASS.
4. Approve the sandbox actions and check the verified Firebase save.
5. Reload; confirm the capacity, receipt and actions are restored.

Anonymous Auth, API-key restrictions, AI Logic availability, database rules and quotas still apply. A registered App Check token does not override those controls. Revoking a device token in Firebase removes its App Check access.

## Current verification: October 17, 2026

Saidur confirmed registration of this device's private token at 07:53 Cambodia time. The local candidate then passed the real Firebase/Gemini flow at 10:25: live extraction, HOLD, reviewed capacity, PASS → BLOCK → PASS, explicit approval, verified Firebase save and exact full-state restoration after reload. See [live QA evidence](LIVE_QA_2026-10-17.md). Production security settings and deployment were unchanged.

The earlier HTTP 403 registration blocker below is resolved for this device. New devices still need their own private registered token. Owner PR/release review remains pending.

## Historical verification: October 16, 2026

Verification: 101 Node tests and 18 browser tests passed; 6 live/capture browser cases remain gated. The device token is ignored by Git and absent from public deployment assets.

The local configuration loads before App Check and the reCAPTCHA error is replaced by the expected unregistered-token HTTP 403. Both the App Check registration API and project metadata access deny `bunchay1280@gmail.com` with permission errors. The device token is ready locally, but owner registration/access remains required; live Gemini and saving are not yet verified locally.

Reference: [Firebase App Check debug provider](https://firebase.google.com/docs/app-check/web/debug-provider).

## Static browser-test mode

`PORT=4173 STATIC_ONLY=1 node scripts/local-server.mjs` serves the unmodified production entry for CI/browser tests. It creates no private device token and returns 404 from `/__local/appcheck.js`. Normal `npm run dev` retains the registered private-device setup. Static-mode tests do not establish live Firebase/App Check availability; use the dedicated live test on the registered development server for that.
