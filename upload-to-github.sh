#!/bin/bash

# DataPak Store - GitHub Upload Script
# 
# Instructions:
# 1. Create a new repository on GitHub.com
# 2. Copy the repository URL 
# 3. Replace YOUR_USERNAME and YOUR_REPOSITORY_NAME in the URL below
# 4. Run this script or execute the commands manually

echo "=== DataPak Store GitHub Upload ==="
echo ""

# Replace with your actual GitHub repository URL
GITHUB_URL="https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git"

echo "Current status:"
git status

echo ""
echo "Adding remote origin: $GITHUB_URL"
git remote add origin $GITHUB_URL

echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Upload completed!"
echo "🌐 Your project is now available on GitHub"
echo "📁 Repository URL: $GITHUB_URL"

echo ""
echo "Next steps:"
echo "1. Visit your GitHub repository"
echo "2. Update the README.md if needed"
echo "3. Consider adding topics/tags for discoverability"
echo "4. Set up GitHub Pages for deployment (optional)"