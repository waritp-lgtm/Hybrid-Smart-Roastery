#!/bin/bash
# ================================================================
# Eight Coffee Roasters — Database Backup Script
# Runs via Docker cron at 02:00 AM daily
# Stores backup on NAS at /nas/backup/
# ================================================================

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/nas/backup"
BACKUP_FILE="${BACKUP_DIR}/eight_coffee_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

echo "🔄 [$(date)] Starting database backup..."

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Dump and compress
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created: ${BACKUP_FILE} (${SIZE})"
else
    echo "❌ Backup FAILED!"
    exit 1
fi

# Remove backups older than RETENTION_DAYS
echo "🗑️  Removing backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -name "eight_coffee_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

REMAINING=$(ls -1 "${BACKUP_DIR}" | wc -l)
echo "📦 Backup complete. ${REMAINING} backup(s) retained."
