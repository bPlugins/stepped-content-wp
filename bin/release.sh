#!/usr/bin/env bash
#
# npm run release
#
# After the `testing` branch is green:
#   1. checks the testing tree still matches development's shipping files
#   2. checks the latest testing.yml run on GitHub succeeded (if `gh` is installed)
#   3. tags the `testing` commit with the plugin version (e.g. 1.0.9) and pushes the tag
#      → release.yml re-runs the checks and deploys
#   4. fast-forwards `main` to `development` (main = released source)
#
# Run from `development` with a clean tree.
set -euo pipefail

SHIP=(build includes languages vendor index.php readme.txt)   # keep in sync with package.json "zip"
SRC_BRANCH=development
TEST_BRANCH=testing
MAIN_BRANCH=main
MAIN_FILE=index.php

cd "$(git rev-parse --show-toplevel)"
repo_url=$(git remote get-url origin | sed -E 's#(git@github.com:|https://([^@]+@)?github.com/)##; s#\.git$##')

# ---- preflight ----------------------------------------------------------------
cur=$(git branch --show-current)
[ "$cur" = "$SRC_BRANCH" ] || { echo "✖ Run this from '$SRC_BRANCH' (you are on '$cur')"; exit 1; }
git diff --quiet && git diff --cached --quiet || { echo "✖ Uncommitted changes. Commit or stash first."; exit 1; }

VERSION=$(grep -m1 -iE '^[[:space:]]*\*?[[:space:]]*Version:' "$MAIN_FILE" | sed -E 's/.*Version: *//' | tr -d '\r ')
STABLE=$(grep -m1 -iE '^[[:space:]]*Stable tag:' readme.txt | sed -E 's/.*Stable tag: *//' | tr -d '\r ')
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "✖ Version '$VERSION' in $MAIN_FILE is not x.y.z"; exit 1; }
[ "$VERSION" = "$STABLE" ] || { echo "✖ $MAIN_FILE Version ($VERSION) ≠ readme.txt Stable tag ($STABLE)"; exit 1; }

git fetch -q origin --tags
git ls-remote --exit-code --heads origin "$TEST_BRANCH" >/dev/null 2>&1 || { echo "✖ No '$TEST_BRANCH' branch on origin — run: npm run push:testing"; exit 1; }
if git rev-parse -q --verify "refs/tags/$VERSION" >/dev/null || git ls-remote --exit-code --tags origin "refs/tags/$VERSION" >/dev/null 2>&1; then
	echo "✖ Tag $VERSION already exists. Bump the version in $MAIN_FILE and readme.txt."; exit 1
fi

# development must be pushed, so main can be fast-forwarded to it on origin
if [ "$(git rev-parse HEAD)" != "$(git rev-parse "origin/$SRC_BRANCH")" ]; then
	echo "✖ Local $SRC_BRANCH differs from origin/$SRC_BRANCH — push first."; exit 1
fi

# ---- 1. testing must contain exactly these shipping files ----------------------
if ! git diff --quiet "origin/$TEST_BRANCH" HEAD -- "${SHIP[@]}"; then
	echo "✖ origin/$TEST_BRANCH is out of date with development's shipping files:"
	git diff --stat "origin/$TEST_BRANCH" HEAD -- "${SHIP[@]}" | tail -n 15
	echo "  Run: npm run push:testing  (then wait for green)"; exit 1
fi
test_sha=$(git rev-parse "origin/$TEST_BRANCH")

# ---- 2. latest testing run must be green ---------------------------------------
if command -v gh >/dev/null 2>&1; then
	run=$(gh run list --repo "$repo_url" --branch "$TEST_BRANCH" --workflow testing.yml --limit 1 \
	      --json conclusion,status,headSha,url -q '.[0] | "\(.status) \(.conclusion) \(.headSha) \(.url)"' 2>/dev/null || true)
	set -- $run
	if [ -z "${1:-}" ]; then
		echo "⚠ Could not read GitHub Actions status (gh not logged in?). Verify testing is green yourself."
	elif [ "$1" != "completed" ]; then
		echo "✖ The latest testing run is still $1: ${4:-}"; exit 1
	elif [ "$2" != "success" ]; then
		echo "✖ The latest testing run finished with '$2': ${4:-}"; exit 1
	elif [ "$3" != "$test_sha" ]; then
		echo "✖ Latest green run is for a different testing commit (${3:0:7} ≠ ${test_sha:0:7}). Wait for the current run."; exit 1
	else
		echo "✔ testing @ ${test_sha:0:7} is green: ${4:-}"
	fi
else
	echo "⚠ 'gh' CLI not installed — not verifying the testing run. (brew install gh && gh auth login)"
	read -r -p "  Is the latest testing run green? [y/N] " yn
	case "$yn" in y|Y|yes|YES) ;; *) exit 1 ;; esac
fi

# ---- 3. tag the testing commit --------------------------------------------------
git tag -a "$VERSION" -m "Release $VERSION" "$test_sha"
git push -q origin "refs/tags/$VERSION"
echo "✔ Tagged $TEST_BRANCH @ ${test_sha:0:7} as $VERSION"
echo "  Release run: https://github.com/$repo_url/actions/workflows/release.yml"

# ---- 4. main = released source --------------------------------------------------
if git push -q origin "$SRC_BRANCH:$MAIN_BRANCH"; then
	echo "✔ $MAIN_BRANCH fast-forwarded to $SRC_BRANCH"
else
	echo "⚠ Could not fast-forward $MAIN_BRANCH to $SRC_BRANCH (diverged?). Tag is pushed; merge main by hand."
fi
