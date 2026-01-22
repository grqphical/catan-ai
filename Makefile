SHELL := /bin/bash

.PHONY: all run-frontend run-server

all:
	@$(MAKE) run-frontend & $(MAKE) run-server & wait

run-frontend:
	@echo "Starting Frontend..."
	@cd frontend && npm install && npm run dev

run-server:
	@echo "Starting Server..."
	@source ./venv/bin/activate && fastapi dev server.py