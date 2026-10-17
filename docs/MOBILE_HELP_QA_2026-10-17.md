# Mobile contextual help regression · October 17, 2026

## Cause and repair

The mobile help failure in GitHub run 39009548089 was reproduced with a 390×844 viewport and 6× CPU throttling. Event instrumentation showed `focusin` opening `#sourceHelp`, followed by a queued window `scroll` event calling `close()`. The page uses smooth scrolling; finishing a focus/tap scroll could dismiss help immediately after it opened. The original diagnostic failed once in two reproductions; its trace identified the closing listener.

Help now follows its anchor on scroll and resize instead of closing. Both axes are clamped inside the viewport. Existing Escape, outside click, toggle, language change and workspace-change dismissal paths remain in place.

The mobile browser project now uses touch/mobile emulation, and its help check uses a real touchscreen tap. The regression then scrolls the page after opening help, verifies it remains expanded, resizes to 360×780, and checks containment. The existing keyboard-focus, dismissal, capacity help and proof help assertions are retained. No sleeps, increased retries, assertion removals or test skips were introduced.

## Fresh local evidence

- Syntax check passed; **128/128 Node tests passed**.
- **13/13 Python reference tests passed** (four existing dependency deprecation warnings).
- Targeted help behavior passed on all four screen sizes.
- The original slowed-down diagnostic passed with the repaired module.
- Complete CI-mode static-server browser run: **72 passed**, 8 existing opt-in live/capture cases skipped, in 24.2 seconds, with no retries.
- A separate real Gemini/Firebase English flow passed in **14.4 seconds**: capacity 120, balanced PASS → unsafe BLOCK → balanced PASS, explicit human approval, five sandbox actions, verified Firebase save, exact reload state equality and root-link resume.

Local diagnostic/test logs and synthetic live exports are under ignored `.local/help-*`. The existing private development token and production App Check/rules were unchanged. The pushed commit is also subject to the PR's three GitHub checks; use the current PR checks for remote status.

Scope is the help interaction and its regression coverage. Shared decisions remain deferred, and no merge/deployment is performed. Canonical standard/central portfolio access still returns HTTP 404; relevant Linear integration is unavailable, so central tracking remains owner-side pending.
