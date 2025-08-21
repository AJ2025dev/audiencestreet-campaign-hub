#!/bin/bash

# Script to push the TAS Affiliate Management System to GitHub
# Usage: ./push-to-github.sh

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "Git is not installed. Please install Git and try again."
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: This script must be run from the tas-affiliate-management-system directory"
    echo "Please navigate to the correct directory and try again."
    exit 1
fi

echo "Initializing git repository..."
git init

echo "Adding all files to git..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit: TAS Affiliate Management System"

echo "Adding remote origin..."
git remote add origin https://github.com/AJ2025dev/tas-affiliate-management-system.git

echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "Code has been pushed to GitHub repository: https://github.com/AJ2025dev/tas-affiliate-management-system"
echo "Please verify that the push was successful and check your GitHub repository."