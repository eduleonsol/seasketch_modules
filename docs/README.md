# SeaSketch MPA Analysis Configuration

This directory contains the configuration files for the SeaSketch MPA Analysis module. The files are:

- `config.json`: The main configuration file that SeaSketch uses to discover the geoprocessing services
- `index.html`: A simple redirect page that points to the configuration file
- `.nojekyll`: Tells GitHub Pages not to process this directory with Jekyll
- `_headers`: Contains CORS headers configuration for better compatibility

## How to Use

Once this repository is deployed to GitHub Pages, you can use the GitHub Pages URL in your SeaSketch project to connect to the geoprocessing services.

Example URL: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

## Testing with SeaSketch

In the SeaSketch admin panel:
1. Go to "Geoprocessing" -> "Services"  
2. Click "Add Service"
3. Enter the GitHub Pages URL for this repository
4. Save and test the connection
