#!/bin/bash

# TAS Affiliate Management System Stop Script

echo "Stopping TAS Affiliate Management System..."

# Check if PID files exist
if [ ! -f "backend.pid" ] || [ ! -f "frontend.pid" ]; then
  echo "Error: PID files not found. The system may not be running."
  exit 1
fi

# Read PIDs from files
BACKEND_PID=$(cat backend.pid)
FRONTEND_PID=$(cat frontend.pid)

# Stop backend
if kill -0 $BACKEND_PID 2>/dev/null; then
  echo "Stopping backend (PID: $BACKEND_PID)..."
  kill $BACKEND_PID
  echo "Backend stopped."
else
  echo "Backend (PID: $BACKEND_PID) is not running."
fi

# Stop frontend
if kill -0 $FRONTEND_PID 2>/dev/null; then
  echo "Stopping frontend (PID: $FRONTEND_PID)..."
  kill $FRONTEND_PID
  echo "Frontend stopped."
else
  echo "Frontend (PID: $FRONTEND_PID) is not running."
fi

# Remove PID files
rm -f backend.pid frontend.pid

# Remove log files
rm -f backend.log frontend.log

echo "TAS Affiliate Management System stopped successfully."