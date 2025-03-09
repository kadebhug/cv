#!/bin/bash

# Script to deploy Firestore rules
# Make sure to run 'firebase login' first if not already logged in

echo "🔥 Deploying Firestore rules..."

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
  echo "❌ Firebase CLI not found. Installing..."
  npm install -g firebase-tools
fi

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Check the exit status
if [ $? -eq 0 ]; then
  echo "✅ Firestore rules deployed successfully!"
  exit 0
else
  echo "❌ Failed to deploy Firestore rules!"
  exit 1
fi 