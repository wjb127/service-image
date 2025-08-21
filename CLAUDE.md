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

## Updated Project Information (2025.08.21)

### Current Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4, shadcn/ui (New York style)
- **AI Integration**: Claude 4 Sonnet (2025.05 version)
- **Image Export**: html-to-image library

### Template System
The project now features 5 template categories with V2 versions:
1. **IT Service** (`landing-thumbnail-v2.tsx`)
2. **YouTube** (`youtube-template-v2.tsx`)
3. **Instagram** (`instagram-template-v2.tsx`)
4. **Product** (`product-template-v2.tsx`) - Beauty & F&B
5. **Design Service** (`design-service-template-v2.tsx`)

### UI Architecture
- **Top Toolbar System**: Word/PPT-style toolbar UI (`components/ui/toolbar.tsx`)
- **AI Assistant**: Right sidebar that pushes main content left when expanded
- **Code View**: Toggle to see generated HTML/CSS for each template
- **Responsive Layout**: Main content adapts when AI panel opens

### Environment Variables
Create `.env.local` file with:
```
NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_api_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key (optional)
```

### Development Server
```bash
npm run dev  # Runs on port 3007 (if 3000 is occupied)
```

### Key Features
- Real-time design preview
- AI-powered design modifications via natural language
- Multiple theme options per template
- Custom background image upload
- Font selection (Korean fonts supported)
- Square crop optimization for platforms like Kmong
- HTML/CSS code generation

### Important Notes
- Always run `notify` after completing tasks
- API keys must never be committed to Git
- All templates use V2 versions with top toolbar
- AI Assistant should not block main content