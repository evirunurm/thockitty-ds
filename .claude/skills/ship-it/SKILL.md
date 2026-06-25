---
name: ship-it
description: >
  Use this skill when the user is done with an implementation and wants to ship it — create a branch,
  commit the changes, open a pull request, and optionally add the `ai-review` label. Trigger on phrases
  like "ship it", "I'm done", "create a PR", "wrap this up", "push this", "open a PR for this",
  "commit and PR", "done with this feature", or anything that signals the user wants to publish their
  finished work. This skill handles the full git + GitHub workflow from staged changes through PR creation.
  Always use this skill rather than doing the git steps ad-hoc.
compatibility:
  tools:
    - Bash
    - Read
  cli:
    - git
    - gh  # GitHub CLI — https://cli.github.com — must be authenticated (`gh auth login`)
---

# Ship It

Turn finished work into a branch + commit + PR in one smooth flow.

## Overview

1. Understand what changed and why
2. Create (or use) the right branch
3. Stage and commit with a good message
4. Push and open a PR
5. Add `ai-review` label if warranted

---

## Step 1 — Understand the changes

Run these together to get the full picture:

```bash
git status
git diff
git diff --cached
```

Read the changed files if needed to understand intent, not just filenames.

The goal: be able to answer "what is this change, and why does it exist?"

---

## Step 2 — Branch

**Naming convention:** `<type>/<short-kebab-description>`

Types: `feat`, `fix`, `chore`, `ci`, `docs`, `refactor`, `test`

Examples:
- `feat/button-component`
- `fix/color-token-typo`
- `chore/update-deps`

**If already on the right branch** (not `main`), skip creation.
**If on `main`**, create and switch to a new branch:

```bash
git checkout -b feat/your-branch-name
```

Name the branch after the *substance* of the change, not the task ("feat/icon-size-tokens" not "feat/my-changes").

---

## Step 3 — Commit

Use [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<optional scope>): <short description>
```

Examples:
- `feat(tokens): add icon size scale`
- `fix(button): correct hover state border color`
- `chore: upgrade storybook to v8`

**Rules:**
- Lowercase, no period at the end
- Keep the summary under 72 characters
- If there are logically separate concerns in the changes, split into multiple commits

Stage and commit:

```bash
git add <relevant files>
git commit -m "feat(tokens): add icon size scale"
```

Don't use `git add .` blindly — check `git status` first and add only what belongs in this PR.

---

## Step 4 — Push and create PR

Push the branch:

```bash
git push -u origin HEAD
```

Create the PR with `gh`:

```bash
gh pr create \
  --title "<conventional commit summary — same style as commit message>" \
  --body "$(cat <<'EOF'
## What
<one or two sentences describing the change>

## Why
<the motivation — what problem or goal>

## How
<any notable implementation decisions, optional>

## Checklist
- [ ] Component exports updated (if new component)
- [ ] Stories added or updated
- [ ] Types are correct and exported if needed
- [ ] No console errors or warnings
EOF
)"
```

The PR title should match the commit message style: `feat(tokens): add icon size scale`.

---

## Step 5 — `ai-review` label

Reserve this label for genuinely high-stakes changes — the kind where a mistake would be hard to undo or would ripple across consumers. Examples:

- Breaking changes to the public API (renamed/removed exports, changed prop types)
- Significant architecture decisions (new patterns, restructuring how the DS is consumed)
- Security or accessibility-critical logic

**Always ask the user before adding the label**, even if you think it qualifies:

> "This looks like it could warrant an `ai-review` — want me to add the label so Claude reviews the PR?"

Only add it if they say yes:

```bash
gh pr edit --add-label "ai-review"
```

If the label doesn't exist yet on the repo, create it first:

```bash
gh label create "ai-review" --color "5319e7" --description "Request Claude AI review"
```

When in doubt, don't suggest it. Most PRs should not get this label.

---

## Handling edge cases

**Untracked files you shouldn't commit** (`.env`, build artifacts): flag them to the user before staging.

**gh not installed**: tell the user to install it from https://cli.github.com and run `gh auth login`, then offer to finish the steps manually with git commands and a direct GitHub URL to open the PR.

**Merge conflicts or dirty state**: resolve or stash before branching. Don't force anything.

**Already have a PR open for this branch**: use `gh pr view` to check, then update instead of creating a new one.
