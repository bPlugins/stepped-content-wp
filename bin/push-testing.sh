#!/usr/bin/env bash
#
# npm run push:testing
#
# Copies ONLY the shipping files (the same list as the `zip` script) plus the
# CI workflows from `development` onto the `testing` branch and pushes it.
# GitHub then runs every check against that exact tree (testing.yml).
#
# Run from `development` with a clean tree, after `npm run bundle`.
set -euo pipefail

SHIP=(build includes languages vendor index.php readme.txt)   # keep in sync with package.json "zip"
CI=(.github)                                                   # workflows must exist on the pushed branch
SRC_BRANCH=development
DST_BRANCH=testing
MAIN_FILE=index.php

cd "$(git rev-parse --show-toplevel)"
MAIN_DIR=$(pwd)
repo_url=$(git remote get-url origin | sed -E 's#(git@github.com:|https://([^@]+@)?github.com/)##; s#\.git$##')

# ---- preflight ----------------------------------------------------------------
cur=$(git branch --show-current)
[ "$cur" = "$SRC_BRANCH" ] || { echo "✖ Run this from '$SRC_BRANCH' (you are on '$cur')"; exit 1; }
git diff --quiet && git diff --cached --quiet || { echo "✖ Uncommitted changes. Commit or stash first."; exit 1; }

VERSION=$(grep -m1 -iE '^[[:space:]]*\*?[[:space:]]*Version:' "$MAIN_FILE" | sed -E 's/.*Version: *//' | tr -d '\r ')
STABLE=$(grep -m1 -iE '^[[:space:]]*Stable tag:' readme.txt | sed -E 's/.*Stable tag: *//' | tr -d '\r ')
[ -n "$VERSION" ] || { echo "✖ Could not read Version: from $MAIN_FILE"; exit 1; }
[ "$VERSION" = "$STABLE" ] || { echo "✖ $MAIN_FILE Version ($VERSION) ≠ readme.txt Stable tag ($STABLE)"; exit 1; }
CONST=$(grep -m1 -E "define\( *'[A-Z_]+_VERSION'" "$MAIN_FILE" | grep -oE "'[0-9]+\.[0-9]+\.[0-9]+'" | tr -d "'")   # cache-busts the assets
[ -z "$CONST" ] || [ "$CONST" = "$VERSION" ] || { echo "✖ $MAIN_FILE _VERSION define ($CONST) ≠ Version header ($VERSION) — update the define too"; exit 1; }
[ -f build/index.asset.php ] || { echo "✖ build/ is missing or stale — run: npm run bundle"; exit 1; }
for p in "${SHIP[@]}"; do [ -e "$p" ] || { echo "✖ Shipping path missing: $p"; exit 1; }; done

src_sha=$(git rev-parse --short HEAD)
git fetch -q origin

# ---- build the testing tree in a throwaway worktree ----------------------------
WT=$(mktemp -d "${TMPDIR:-/tmp}/testing.XXXXXX")
cleanup() { cd "$MAIN_DIR" && git worktree remove --force "$WT" 2>/dev/null || true; }
trap cleanup EXIT

if git ls-remote --exit-code --heads origin "$DST_BRANCH" >/dev/null 2>&1; then
	git worktree add -q "$WT" -B "$DST_BRANCH" "origin/$DST_BRANCH"
else
	echo "• '$DST_BRANCH' does not exist on origin yet — creating it as an orphan branch"
	git worktree add -q --detach "$WT" HEAD
	git -C "$WT" checkout -q --orphan "$DST_BRANCH"
	git -C "$WT" rm -rfq --cached . >/dev/null 2>&1 || true
fi

# wipe everything except .git, then export the shipping set from the COMMIT
# (git archive, not cp: untracked or ignored files in the working folder never
# reach testing, so the tested tree is exactly HEAD)
find "$WT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
git archive --format=tar HEAD -- "${SHIP[@]}" "${CI[@]}" | tar -x -C "$WT"
printf 'node_modules\n*.zip\n.DS_Store\n' > "$WT/.gitignore"   # stripped again from the release zip

cd "$WT"
git add -A
if git diff --cached --quiet; then
	echo "• $DST_BRANCH already matches development @ $src_sha — nothing to push"
	exit 0
fi
git commit -qm "Testing build $VERSION (development @ $src_sha)"
git push -q -u origin "$DST_BRANCH"
echo "✔ Pushed $DST_BRANCH: $VERSION from development @ $src_sha"
echo "  Checks: https://github.com/$repo_url/actions/workflows/testing.yml"
echo "  When green:  npm run release"
