#!/bin/bash

# Script to kill process using a specific port
PORT=$1

if [ -z "$PORT" ]; then
  echo "Usage: $0 <PORT_NUMBER>"
  echo "Example: $0 5001"
  exit 1
fi

PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "No process found using port $PORT."
else
  echo "Process with PID $PID is using port $PORT. Killing it..."
  kill -9 $PID
  echo "Process $PID killed."
fi

# Verify if the port is free
sleep 1
if [ -z "$(lsof -ti:$PORT)" ]; then
  echo "Port $PORT is now free."
else
  echo "Failed to free port $PORT. Another process might have started."
fi

