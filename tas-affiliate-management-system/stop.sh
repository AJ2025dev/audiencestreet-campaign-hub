#!/bin/bash

# Stop script for TAS Affiliate Management System

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping TAS Affiliate Management System...${NC}"

# Find and kill processes related to the application
PIDS=$(pgrep -f "tas-affiliate-management-system" 2>/dev/null || true)

if [ -z "$PIDS" ]; then
  echo -e "${GREEN}No running TAS Affiliate Management System processes found.${NC}"
else
  echo -e "${YELLOW}Killing processes: $PIDS${NC}"
  kill $PIDS 2>/dev/null || true
  echo -e "${GREEN}TAS Affiliate Management System stopped.${NC}"
fi

# Also try to kill processes by port
PORTS="3000 3001 5173"

for PORT in $PORTS; do
  PID=$(lsof -ti:$PORT 2>/dev/null || true)
  if [ ! -z "$PID" ]; then
    echo -e "${YELLOW}Killing process on port $PORT (PID: $PID)${NC}"
    kill $PID 2>/dev/null || true
  fi
done

echo -e "${GREEN}Stop script completed.${NC}"