# Game Project

## Overview

This repository contains interactive game implementations built with modern web technologies.

## Projects

### Bridge & Torch Puzzle

An interactive implementation of the classic Bridge and Torch logic puzzle, where players must help a group of people cross a bridge at night with limited resources.

**Technology Stack:**
- React 19.0.0
- Vite 6.2.0
- JavaScript (ES Modules)

## Prerequisites

Before running any project in this repository, ensure you have the following installed:

- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

## Installation

Navigate to the specific game directory and install dependencies:

```bash
cd bridge-torch-game
npm install
```

## Usage

### Development Mode

To run the application in development mode with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Production Build

To create an optimized production build:

```bash
npm run build
```

The build output will be generated in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
Game/
└── bridge-torch-game/
    ├── src/
    │   ├── components/      # React components
    │   ├── App.jsx         # Main application component
    │   ├── gameLogic.js    # Game logic implementation
    │   ├── index.css       # Application styles
    │   └── main.jsx        # Application entry point
    ├── dist/               # Production build output
    ├── index.html          # HTML template
    ├── package.json        # Project dependencies and scripts
    └── vite.config.js      # Vite configuration
```

## Development

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run preview` - Previews the production build

### Adding New Features

1. Create new components in the `src/components` directory
2. Update game logic in `src/gameLogic.js` as needed
3. Import and integrate components in `App.jsx`
4. Test changes using the development server

## Browser Support

This application supports all modern browsers that are compatible with ES6+ features:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and not licensed for public distribution.

## Contributing

This is a private project. If you have access and would like to contribute:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request with a clear description

## Contact

For questions or issues, please contact the project maintainer.

---

**Last Updated:** February 2026
