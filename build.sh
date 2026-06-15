#!/bin/bash
set -e

SCHEMA_DIR="prisma"

if [ "$VERCEL" = "1" ] || [ "$NODE_ENV" = "production" ]; then
  echo ">>> Production: switching to PostgreSQL schema"
  cp "$SCHEMA_DIR/schema.postgresql.prisma" "$SCHEMA_DIR/schema.prisma"
  npx prisma generate
  npx prisma migrate deploy
else
  echo ">>> Development: using SQLite schema"
  cp "$SCHEMA_DIR/schema.sqlite.prisma" "$SCHEMA_DIR/schema.prisma"
  npx prisma generate
fi

npx next build
