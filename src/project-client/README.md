# MPA Project Client

This directory contains the client-side code for the Marine Protected Area (MPA) analysis module in SeaSketch.

## Project Structure

- `index.ts` - Main entry point for the project client
- `config.ts` - Configuration settings for the MPA module
- `components/` - React components (to be added)
- `hooks/` - Custom React hooks (to be added)
- `utils/` - Utility functions (to be added)

## Configuration

The `config.ts` file contains various settings that control the behavior of the MPA module:

- `title`: Display name of the module
- `description`: Module description
- `version`: Module version
- `debug`: Enable/disable debug logging
- `analysis`: Default analysis settings
- `ui`: UI-related configuration including basemaps and default viewport

## Adding New Features

1. **Actions**: Register new actions in the `registerActions` method of the `ProjectClient` class
2. **Components**: Add new React components in the `components` directory
3. **Hooks**: Add custom hooks in the `hooks` directory
4. **Utils**: Add utility functions in the `utils` directory

## Development

To develop the project client:

1. Make sure you have the latest dependencies installed
2. Run the development server: `npm run dev`
3. The client will be available at `http://localhost:3000`

## Building for Production

To build the project client for production:

```bash
npm run build
```

This will create optimized production builds of your client-side code.
