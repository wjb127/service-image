# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that generates customizable thumbnail images for a landing page creation service. The app features three distinct design themes (gradient, neon, glassmorphism) with real-time preview and image download capabilities.

## Development Commands

```bash
# Start development server (usually runs on port 3007 if 3000 is occupied)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Core Components

**`components/landing-thumbnail.tsx`**
- Main component implementing the thumbnail generator
- Manages three theme styles: 'gradient', 'neon', 'glassmorphism'
- Uses `html-to-image` library for PNG export functionality
- State management for theme selection and download status

### Styling System

- **Tailwind CSS 3.4** for utility-first styling
- **shadcn/ui** components (New York style) for UI elements
- **Pretendard font** loaded locally from `/public/fonts/`
- CSS-in-JS for theme-specific dynamic styles

### Key Features Implementation

1. **Theme Switching**: Conditional rendering based on `currentTheme` state
2. **Image Export**: Uses `toPng()` from html-to-image with theme-specific background colors
3. **Font System**: Custom font loading through `app/fonts.ts` using Next.js local font

## Project Structure

- `/app` - Next.js 15 app router pages and layouts
- `/components` - React components including main thumbnail generator
- `/components/ui` - shadcn/ui components (Button, Card)
- `/lib/utils` - Utility functions including `cn()` for className merging
- `/public/fonts` - Pretendard font files (.woff2)

## Theme-Specific Configurations

Each theme has distinct visual characteristics:
- **Gradient**: Blue→Purple→Pink gradient, yellow accents
- **Neon**: Black background, cyan/purple glow effects, grid pattern
- **Glassmorphism**: Blurred translucent layers, white/purple tones

## GitHub Repository

Repository: https://github.com/wjb127/service-image

When committing changes, ensure to stage all files including font assets and maintain the existing commit message format.

## Work Completion Notification

**Important**: After completing any significant work in this project, run the following command to send a notification:

```bash
notify
```

This sends a notification to the user's device to alert them that the work has been completed.