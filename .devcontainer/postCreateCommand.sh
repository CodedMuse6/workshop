#!/bin/bash
set -e

echo "Installing Firebase CLI..."
npm install -g firebase-tools

echo "Installing project dependencis..."
npm install

# Install functions dependencies if folder exists
if[ -d "functions" ]; then
cd functions
npm install
cd..
fi


echo "Creating client/.env from GitHub Codespaces secrets..."

cat <<EOF > ./client/.env
VITE_FIREBASE_API_KEY = $FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN = $FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID = $FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET = $FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER = $FIREBASE_MESSAGING_SENDER
VITE_FIREBASE_APP_ID = $FIREBASE_APP_ID
EOF

echo "client/.env file created."
