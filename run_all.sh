#!/bin/sh

set -eu
if (set -o pipefail 2>/dev/null); then
	set -o pipefail
fi

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)

cleanup() {
	if [ "${BACKEND_PID:-}" != "" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
		echo "Stopping backend (PID $BACKEND_PID)"
		kill "$BACKEND_PID"
		wait "$BACKEND_PID" 2>/dev/null || true
	fi
}

trap cleanup EXIT INT TERM

echo "Starting backend on http://localhost:8000"
uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:3000"
cd "$ROOT_DIR/frontend"
npm install
npm run dev