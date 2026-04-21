# Nexus WebRTC App

A modular React application for WebRTC functionality with authentication.

## Project Structure

```
nexus-webrtc-app/
├── public/
│   └── index.html          # Main HTML template
├── src/
│   ├── api/                # API services
│   │   └── authService.js  # Authentication service (mock)
│   ├── assets/             # Static assets (images, icons)
│   ├── components/         # Reusable UI components
│   │   └── ui/
│   │       └── Avatar.jsx  # Avatar component
│   ├── context/            # React contexts
│   │   └── AuthContext.jsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components for routing
│   ├── types/              # TypeScript types (if using TS)
│   ├── utils/              # Utility functions
│   │   └── jwt.js          # JWT utilities
│   ├── App.jsx             # Main App component
│   ├── index.css           # Global styles with Tailwind
│   └── index.js            # App entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## Features

- **Authentication**: Mock login/register with JWT tokens
- **Modular Structure**: Organized folders for scalability
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Lucide React icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or extract the project
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Packages Required

### Dependencies
- `react`: ^18.2.0 - UI library
- `react-dom`: ^18.2.0 - React DOM rendering
- `lucide-react`: ^0.263.1 - Icon library

### Dev Dependencies
- `tailwindcss`: ^3.3.0 - Utility-first CSS framework
- `autoprefixer`: ^10.4.14 - CSS post-processing
- `postcss`: ^8.4.21 - CSS processing tool
- `@vitejs/plugin-react`: ^4.0.0 - Vite plugin for React
- `vite`: ^4.3.9 - Fast build tool and dev server

## Usage

The app currently displays a placeholder screen. To add WebRTC functionality:

1. Add WebRTC components in `src/components/`
2. Implement routing in `src/pages/`
3. Use the AuthContext for user management
4. Add custom hooks in `src/hooks/`

## Contributing

This is a modular setup. Extend by adding new folders and components as needed.