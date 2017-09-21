#!/bin/bash
if [ "$1" = "" ]; then
	echo Usage\)
	echo \ \ \$ $0 start
	echo \ \ \$ $0 start debug
	echo \ \ \$ $0 stop
	exit
fi
TIMESTAMP=$(date +%s)
if [ -e logs ]; then
## do nothing#
	:
else
## mkdir
	mkdir -p logs
fi

if [ "$1" = "start" ]; then 
	if [ -e express.pid ]; then
		PID=$(cat express.pid)
		echo Express Server \($PID\) is currently running. Shutdown.
		##kill $PID
		##rm -rf express.pid
	else
		node ./server.js >> logs/node.log &
		sleep 1
		ps -ef | grep node|grep -v grep |awk '{print $2}' > express.pid
		sleep 1
		PID=$(cat express.pid)
		echo Express Server \($PID\) Start \: $(date) >> logs/express.log
		echo Express Server \($PID\) Start \: $(date)
	fi
else
	if [ -e express.pid ]; then
		PID=$(cat express.pid)
		kill $PID
		rm -rf express.pid
		echo Express Server \($PID\) Stop \: $(date) > logs/express.log
		echo Express Server \($PID\) Stop \: $(date)
		echo   >> logs/express.log
	else
		echo No PID File, Express Server is not running.
	fi
fi 
