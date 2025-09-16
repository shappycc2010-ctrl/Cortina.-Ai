#!/bin/bash
# Requires: npm install -g render-cli

# Example usage: ./setup_render.sh cortina-api cortina-ui

API_SERVICE=$1
UI_SERVICE=$2

# Create Postgres database (optional)
render create database cortina-db --plan starter

# Set environment variables for API
render env:set $API_SERVICE JWT_SECRET=$(openssl rand -hex 32)
render env:set $API_SERVICE CORTINA_API_TOKEN="changeme"
render env:set $API_SERVICE DATABASE_URL=$(render connection-string cortina-db)
render env:set $API_SERVICE TWILIO_ACCOUNT_SID=""
render env:set $API_SERVICE TWILIO_AUTH_TOKEN=""
render env:set $API_SERVICE TWILIO_PHONE_NUMBER=""
render env:set $API_SERVICE SENTRY_DSN=""

# Set environment variables for UI
render env:set $UI_SERVICE REACT_APP_API_URL="https://cortina-api.onrender.com"

echo "Render setup complete."
