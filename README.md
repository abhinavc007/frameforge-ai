# FrameForge AI

FrameForge AI is an AI-powered storyboard generation platform that converts a written screenplay or story scene into structured anime-style storyboard panels.

It allows users to enter a story, choose a visual style, add character or world notes, and generate cinematic storyboard panels using AI.

## Overview

FrameForge AI is designed for writers, anime creators, students, storytellers, and creative beginners who want to visualize their story ideas before production.

The project demonstrates a complete creative AI workflow:

```text
Story input → Scene analysis → Shot planning → Storyboard captions → AI image generation
```

## Features

- Premium animated landing page
- Creator dashboard
- New project creation flow
- Animated storyboard cube intro
- Screenplay/story input form
- Visual style selection
- Character and world notes support
- AI screenplay analysis
- Scene extraction
- Dynamic shot planning
- Cinematic storyboard captions
- AI-generated anime storyboard panels
- Image persistence using browser session storage
- Polished storyboard result page
- Responsive dark UI
- Smooth animations using Framer Motion

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Pollinations AI
- Browser Session Storage
- Browser Local Storage

## How It Works

1. The user enters a project title, screenplay, visual style, and optional character notes.
2. The screenplay is analyzed and divided into scenes.
3. Each scene is converted into cinematic storyboard shots.
4. Each shot gets a readable caption and a hidden AI visual prompt.
5. The user generates anime-style storyboard panels.
6. Generated panels are displayed and saved during the browser session.

## Main Pages

- Landing Page
- Dashboard
- Create New Project
- Generating Screen
- Storyboard Result Page

## Environment Variables

Create a `.env.local` file in the root directory and add:

```env
POLLINATIONS_KEY=your_api_key_here
```

Do not push `.env.local` to GitHub.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Project Status

FrameForge AI is currently an MVP built for portfolio and learning purposes.

It focuses on demonstrating a real AI-powered creative workflow, polished UI design, animation, and practical storyboard generation from text input.

## Future Improvements

- Real user authentication
- Database-backed project history
- Export storyboard as PDF
- Character reference image support
- Cloud image storage
- Better dashboard project management
- Public sharing links
- Advanced storyboard editing tools

## Author

Built by Abhinav C.