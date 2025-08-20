#!/bin/bash

# TAS Affiliate Management System Startup Script

echo "Starting TAS Affiliate Management System..."

# Check if we're in the correct directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "Error: Please run this script from the root directory of the TAS Affiliate Management System"
  exit 1
fi

# Start backend in background
echo "Starting backend server..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start frontend in background
echo "Starting frontend server..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

echo "Servers started successfully!"
echo "Backend API available at: http://localhost:3000"
echo "Frontend app available at: http://localhost:5173"

echo ""
echo "To stop the servers, run: ./stop.sh"

# Save PIDs to file for stopping later
echo "$BACKEND_PID" > backend.pid
echo "$FRONTEND_PID" > frontend.pid