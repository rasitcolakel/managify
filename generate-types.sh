#!/bin/sh

source .env

file="./src/types/supabase.ts"

# check if src/types folder exists
if [ ! -d "src/types" ]; then
  mkdir src/types
fi
# Generate types
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > "$file"


# Add ts-ignore to first line of file src/types/supabase.ts
tsIgnore="/* eslint-disable no-unused-vars */"
firstLine=$(head -n 1 "$file")
if [ "$firstLine" = "$tsIgnore" ]; then
  echo "Types already ignored"
else
  echo "Ignoring types"
  echo "$tsIgnore" | cat - src/types/supabase.ts > temp && mv temp src/types/supabase.ts
fi
