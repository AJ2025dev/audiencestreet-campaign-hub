#!/bin/bash

# Start script for TAS Affiliate Management System

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting TAS Affiliate Management System...${NC}"

# Check if required environment variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
  echo -e "${YELLOW}Warning: Database environment variables not set. Using default values from .env file.${NC}"
fi

# Start backend
echo -e "${GREEN}Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Start frontend
echo -e "${GREEN}Starting frontend server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to stop both servers
stop_servers() {
  echo -e "${YELLOW}Stopping servers...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  echo -e "${GREEN}Servers stopped.${NC}"
  exit 0
}

# Trap SIGINT and SIGTERM to stop servers gracefully
trap stop_servers SIGINT SIGTERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

echo -e "${GREEN}TAS Affiliate Management System stopped.${NC}"