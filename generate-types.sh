#!/bin/sh

source .env

# check if src/types folder exists
if [ ! -d "src/types" ]; then
  mkdir src/types
fi
# Generate types
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/supabase.ts