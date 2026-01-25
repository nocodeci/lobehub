#!/bin/bash
cd backend
source venv/bin/activate
export OPENAI_API_KEY=$(grep OPENAI_API_KEY ../.env.local | cut -d '=' -f2)
python3 -m app.main
