limactl stop --force cakeelizabeth.lima
lsof -ti :5173 | xargs kill -9