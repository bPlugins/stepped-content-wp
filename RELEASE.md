# Release process

Branches: `development` (all files, daily work) → `testing` (shipping files only, generated) → tag `x.y.z` → `main` (released source).

## One-time setup
1. `git checkout -b development && git push -u origin development` (and make it the default branch on GitHub)
2. GitHub → Settings → Actions → General → Workflow permissions → **Read and write**
3. Free plugin only: Settings → Secrets → `SVN_USERNAME`, `SVN_PASSWORD` (wordpress.org committer)
4. Optional but recommended: `brew install gh && gh auth login` (lets `npm run release` verify the testing run is green)

## Every release
1. On `development`: bump `Version:` and the `STP_VERSION` define in `index.php`, and `Stable tag:` + changelog in `readme.txt`. Commit.
2. `npm run ship` → bundle, commit the rebuilt `build/` + `languages/`, push development, copy shipping files to `testing`, push.
   (`npm run push:testing` alone if you already bundled and committed.)
3. Watch Actions → **Testing branch**: lint, PHP 7.4 compatibility, Plugin Check, WP-CLI smoke on PHP 8.1 + 8.3.
4. Green → `npm run release` → tags `testing` as the version, fast-forwards `main`.
   Actions → **Release** re-runs the checks on the tag and publishes the GitHub Release
   (free plugin: also commits to WordPress.org SVN).
5. Pro only: `npm run fs-deploy` (or `npm run release:freemius` to do 4 + 5 together).

Shipping list lives in two places — keep them in sync: `package.json` → `zip`, and `SHIP=(...)` in `bin/push-testing.sh` + `bin/release.sh`.
