#!/bin/bash

# Database Backup Script for NexBoard
# Run this script to backup your Supabase database

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="nexboard_backup_${TIMESTAMP}.sql"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔄 Starting NexBoard database backup..."

# Check if required env vars are set
if [ -z "$SUPABASE_DB_URL" ]; then
    echo -e "${RED}❌ Error: SUPABASE_DB_URL not set${NC}"
    echo "Get your database URL from Supabase Dashboard > Settings > Database"
    echo "Format: postgresql://postgres:[password]@[host]:5432/postgres"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Run pg_dump
echo "📦 Creating backup: $BACKUP_FILE"
pg_dump "$SUPABASE_DB_URL" > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
echo "🗜️  Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

echo -e "${GREEN}✅ Backup completed: $BACKUP_DIR/${BACKUP_FILE}.gz${NC}"
echo "📊 Backup size: $(du -h "$BACKUP_DIR/${BACKUP_FILE}.gz" | cut -f1)"

# Keep only last 7 backups
echo "🧹 Cleaning old backups (keeping last 7)..."
cd "$BACKUP_DIR"
ls -t nexboard_backup_*.sql.gz | tail -n +8 | xargs -r rm
cd ..

echo -e "${GREEN}✅ Backup process complete!${NC}"
