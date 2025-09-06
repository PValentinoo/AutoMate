# AutoMate

A modern workflow automation platform built with React, TypeScript, and Tailwind CSS.

## Project Overview

AutoMate is a comprehensive workflow management system that helps users create, manage, and execute automated workflows efficiently.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

Follow these steps to get the project running locally:

```sh
# Step 1: Navigate to the project directory.
cd AutoMate

# Step 2: Install the necessary dependencies.
npm install

# Step 3: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run build:dev` - Build the project in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui components
│   ├── DeveloperButton.tsx
│   └── WorkflowCard.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── DeveloperDashboard.tsx
│   ├── DeveloperLogin.tsx
│   ├── Index.tsx
│   ├── NotFound.tsx
│   └── WorkflowPage.tsx
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Features

- Modern, responsive UI design
- Workflow management system
- Developer dashboard
- Authentication system
- Mobile-friendly interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.