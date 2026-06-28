# Kinetic Portfolio

Main portfolio site built with Astro.

A minimal, fast personal portfolio showcasing projects and contact information. The site uses Astro with standard web technologies (HTML, CSS, JavaScript, and a bit of TypeScript).

## Features

- Fast, static site built with Astro
- Simple, responsive layout
- Static assets served from the `public/` folder
- Containerized with Docker, served via Nginx

## Tech stack

- Astro
- HTML
- CSS
- JavaScript
- TypeScript (config only)
- Docker (multi-stage build)
- Nginx (static file serving in container)

## Prerequisites

**Local development:**
- Node.js (v18+ recommended)

**Production / Docker:**
- Docker
- Docker Compose

## Getting started (local)

1. Clone the repo

   git clone https://github.com/tof-98/kinetic-portfolio.git
   cd kinetic-portfolio

2. Install dependencies

   npm install

3. Run the dev server

   npm run dev

4. Build for production

   npm run build

5. Preview the production build locally

   npm run preview

## Docker (production)

1. Build and start container

   docker-compose up -d --build

2. Site available at localhost:3000

3. Stop container

   docker-compose down

After code changes, rebuild:

   docker-compose up -d --build

## Project structure

- public/ — static assets (images, icons, CV)
- src/components/ — Astro components (Hero, About, Work, Footer, etc.)
- src/data/ — portfolio data (portfolio.ts)
- src/layouts/ — page layout
- src/pages/ — Astro pages
- src/styles/ — global CSS
- package.json — scripts and dependencies
- astro.config.mjs — Astro configuration
- tsconfig.json — TypeScript configuration
- Dockerfile — multi-stage build (Node builder → Nginx image)
- docker-compose.yml — container configuration (port 3000)
- .dockerignore — build context exclusions

## Deployment

Production runs as Docker container behind Caddy as reverse proxy.

1. Start container on server

   docker-compose up -d --build

2. Add entry to Caddyfile

   deine-domain.de {
       reverse_proxy localhost:3000
   }

Caddy handles SSL automatically via Let's Encrypt.

## Contributing

Contributions are welcome — open an issue or send a PR.

## Contact

If you'd like to reach me, check the contact section on the site or open an issue here on GitHub.
