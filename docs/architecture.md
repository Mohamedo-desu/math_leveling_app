# Architecture

## Overview

The Math Leveling App is a modern, gamified mental math training application built with React Native, Expo, and TypeScript. The architecture emphasizes modularity, scalability, and performance, with a clear separation between UI, state management, business logic, and backend integration.

## Directory Structure

```
src/
├── components/      # Reusable UI components (e.g., QuestionCard, StreakBadge)
├── constants/       # App-wide constants (colors, spacing)
├── context/         # Theme context and provider
├── hooks/           # Custom React hooks
├── screens/         # Main app screens (Home, Settings, RootLayout)
├── services/        # Business logic and versioning services
├── store/           # Zustand state management (stats, streaks, questions)
├── styles/          # Style definitions
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
backend/
  src/
    models/          # Mongoose models (AppVersion, Feedback)
    routes/          # Express API endpoints (version, feedback)
    index.js         # Express app entry point
assets/
  images/            # App images
  screenshots/       # App screenshots
```

## Key Components

### UI Components

- `QuestionCard`: Displays the current math question and answer choices
- `StreakBadge`: Shows the user's current streak and streak status
- `ChoicesGrid`: Renders answer options in a grid
- `CustomText`: Typography component for consistent text styling

### Screens

- `HomeScreen`: Main training interface with questions, streak, and level
- `SettingsScreen`: App settings, analytics, theme toggle, and strict mode
- `RootLayout`: Navigation and screen management

### Services

- `versionService`: Handles app version checks and update logic

## State Management

### Zustand Store

- Centralized state management using Zustand
- Slices for:
  - **Stats**: Tracks correct/wrong answers, questions, levels, and strict mode
  - **Streak**: Manages daily streaks, reminders, and streak inactivity
  - **Questions**: Handles current question, answer validation, and progression
  - **Navigation**: Manages current screen (if custom navigation is used)
  - **Orientation**: Tracks device orientation for responsive UI
- Persistent storage with MMKV for fast, secure offline data

## Theming

- Theme context provides light/dark mode with system detection
- Centralized color palette and smooth theme transitions
- Theme preference is persisted locally

## Data Flow

### Math Training Flow

1. App generates a random math question (addition/subtraction)
2. User selects an answer from the grid
3. App validates the answer, updates stats, and provides feedback
4. On correct answers, user levels up and streak is updated
5. Streak reminders are scheduled via notifications
6. All progress and stats are stored locally for offline use

### Streak & Analytics

- Streak is incremented daily upon level up
- Streak inactivity triggers reminders
- Lifetime stats and wrong answers are tracked and can be reset

## Backend API

- **Version API**: Provides latest app version info for update checks
- **Feedback API**: Accepts user feedback submissions
- **Health Endpoint**: For uptime monitoring
- MongoDB for persistent storage of versions and feedback

## Performance & Offline

- MMKV ensures fast, persistent local storage
- All training and analytics features work offline
- Efficient state updates and memoized components for smooth UX

## Security & Best Practices

- Type safety with TypeScript
- Input validation for all user actions
- Secure storage for sensitive data
- Modular, isolated components and state slices

## Testing

- Unit tests for core logic and state slices (expandable)
- Manual and automated UI testing recommended for future development
