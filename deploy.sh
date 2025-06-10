#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
rm -f deploy-package.zip
zip -r deploy-package.zip \
  dist/ \
  package.json \
  package-lock.json \
  tsconfig.json

echo "✅ Deployment package created: deploy-package.zip"
echo "📝 Next steps:"
echo "1. Go to your SeaSketch admin panel"
echo "2. Navigate to Geoprocessing > Services"
echo "3. Click 'Add Service'"
echo "4. Upload the deploy-package.zip file"
echo "5. Set the handler to 'default'"
echo "6. Save the service"

# Make the script executable
chmod +x deploy.sh
