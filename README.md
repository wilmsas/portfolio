# Portfolio Site

A modern portfolio built with Next.js 16, featuring a comprehensive Design Skills Matrix with dark mode support.

## Features

- **Dark Mode**: Full theme support with light/dark/system modes using next-themes
- **Design Skills Matrix**: Interactive proficiency tracking system
  - 5-level scale (Learner → Expert)
  - Baseline + 4 specialty tracks (Strategist, UI Designer, UX Architect, Visual Designer)
  - Radar and polar chart visualizations
  - Learning resource recommendations
  - LocalStorage persistence
- **Responsive Design**: Mobile-first approach with Tailwind CSS v4
- **Type-Safe**: Built with TypeScript and strict type checking
- **Modular Architecture**: Clean component structure for maintainability

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
portfolio/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with ThemeProvider
│   ├── page.tsx             # Home page
│   ├── skills-matrix/       # Skills Matrix page
│   └── globals.css          # Global styles and theme variables
├── components/              # React components
│   ├── skills-matrix/       # Skills Matrix components
│   │   ├── SkillsLaneCard.tsx
│   │   ├── ProficiencyVisualized.tsx
│   │   ├── DetailsPanel.tsx
│   │   ├── LearningResources.tsx
│   │   └── ui/              # UI primitives
│   ├── ui/                  # shadcn/ui components
│   ├── ThemeProvider.tsx    # Theme context provider
│   └── ThemeToggle.tsx      # Theme switcher
├── data/                    # Data layer
│   ├── skills/              # Skills definitions
│   └── learning-resources/  # Learning resources
├── lib/                     # Utilities
├── public/                  # Static assets
└── docs/                    # Documentation
    ├── DARK_MODE.md
    ├── SKILLS_MATRIX_GUIDE.md
    ├── DEPLOYMENT_CHECKLIST.md
    └── RELEASE_NOTES.md
```

## Documentation

- **[Dark Mode Guide](./docs/DARK_MODE.md)** - Theme implementation details
- **[Skills Matrix Guide](./docs/SKILLS_MATRIX_GUIDE.md)** - How to use the Skills Matrix
- **[Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md)** - Pre/post deployment steps
- **[Release Notes](./docs/RELEASE_NOTES.md)** - Version history and changes
- **[Features Implemented](./docs/FEATURES_IMPLEMENTED.md)** - Feature documentation
- **[Refactoring Summary](./docs/REFACTORING_SUMMARY.md)** - Technical details

## Tech Stack

- **Framework**: Next.js 16.0.10 with App Router
- **React**: 19.2.1
- **TypeScript**: Latest
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **Theme**: next-themes for dark mode
- **UI Components**: shadcn/ui
- **Fonts**: Geist Sans & Geist Mono

## Development

### Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build locally
npm run lint         # Run ESLint
```

### Adding New Skills

Skills are defined in `data/skills/`. To add new skills:

1. Edit the appropriate file in `data/skills/`
2. Follow the `Skill` type definition
3. Add learning resources in `data/learning-resources/`

### Theme Customization

Theme colors are defined in `app/globals.css` using CSS custom properties:
- `:root` - Light mode colors
- `.dark` - Dark mode colors
- `@theme` - Tailwind theme mapping

## Deployment

This site is optimized for deployment on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

Or connect your repository to Vercel for automatic deployments.

See [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md) for full details.

## License

Private portfolio project.

## Built With

This project was developed with assistance from [Claude Code](https://claude.com/claude-code).

---

**Version**: 2.0
**Last Updated**: January 2, 2026
