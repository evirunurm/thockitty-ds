#!/usr/bin/env bash
# Build tokens only if tokens.json has changed since last build.

HASH_FILE="src/tokens/.tokens-hash"
CURRENT_HASH=$(md5sum tokens.json | cut -d ' ' -f1)

if [ -f "$HASH_FILE" ] && [ "$(cat "$HASH_FILE")" = "$CURRENT_HASH" ]; then
  echo "Tokens unchanged, skipping build."
  exit 0
fi

echo "Building tokens..."
npx style-dictionary build --config sd.config.mjs

mkdir -p tokens
echo "$CURRENT_HASH" > "$HASH_FILE"
