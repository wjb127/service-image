#!/bin/bash

# Vercel Deployment Monitor Script
# This script monitors the latest Vercel deployment and automatically fixes errors

echo "🚀 Vercel Deployment Monitor Started"
echo "======================================"

# Function to check latest deployment status
check_deployment() {
    echo -e "\n📊 Checking latest deployment status..."
    
    # Get the latest deployment info
    LATEST=$(vercel ls service-image --yes | grep -E "^\s+[0-9]+[smh]" | head -1)
    
    if [[ $LATEST == *"● Ready"* ]]; then
        echo "✅ Latest deployment is successful!"
        echo "$LATEST"
        return 0
    elif [[ $LATEST == *"● Error"* ]]; then
        echo "❌ Latest deployment failed!"
        echo "$LATEST"
        return 1
    elif [[ $LATEST == *"● Building"* ]]; then
        echo "🔨 Deployment is in progress..."
        echo "$LATEST"
        return 2
    else
        echo "⚠️ Unknown deployment status"
        echo "$LATEST"
        return 3
    fi
}

# Function to get deployment logs
get_logs() {
    echo -e "\n📋 Fetching deployment logs..."
    # Get the deployment URL from the latest deployment
    DEPLOYMENT_URL=$(vercel ls service-image --yes | grep -E "https://service-image-[a-z0-9]+-" | head -1)
    echo "Deployment URL: $DEPLOYMENT_URL"
    
    # You can add vercel logs command here if needed
    # vercel logs $DEPLOYMENT_URL
}

# Main monitoring loop
while true; do
    check_deployment
    STATUS=$?
    
    if [ $STATUS -eq 0 ]; then
        echo "✨ Deployment successful! Site is live at: https://service-image.vercel.app"
        break
    elif [ $STATUS -eq 1 ]; then
        echo "🔍 Getting error details..."
        get_logs
        echo ""
        echo "⚠️ Please fix the errors and push to GitHub."
        echo "Waiting 30 seconds before next check..."
        sleep 30
    elif [ $STATUS -eq 2 ]; then
        echo "⏳ Waiting for deployment to complete..."
        sleep 10
    else
        echo "⏸️ Waiting 30 seconds before next check..."
        sleep 30
    fi
done

echo -e "\n✅ Monitoring complete!"