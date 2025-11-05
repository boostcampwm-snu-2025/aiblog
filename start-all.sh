set -e

# Start frontend project
echo "Frontend starting on :5173 ..."
cd ./aiblog-fe
npm install
npm run dev &

# Start backend server
echo "Backend starting on :3000 ..."
cd ../aiblog-be
npm install
npm run dev

wait
