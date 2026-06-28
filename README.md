# Kinetic Portfolio

A minimal, fast personal portfolio built with [Astro](https://astro.build). Showcases projects, skills, and contact information — deployed as a Docker container behind a Caddy reverse proxy.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 4 |
| Styling | CSS (global stylesheet) |
| Language | HTML, JavaScript, TypeScript |
| Container | Docker (multi-stage build) |
| Server | Nginx (static file serving) |
| Reverse Proxy | Caddy (SSL via Let's Encrypt) |

---

## Getting started

### Prerequisites

- **Local development:** Node.js v18+
- **Production:** Docker & Docker Compose

### Local development

```bash
git clone https://github.com/tof-98/kinetic-portfolio.git
cd kinetic-portfolio
npm install
npm run dev
```

The dev server starts at `http://localhost:4321` with hot reload.

### Build & preview

```bash
npm run build      # outputs to dist/
npm run preview    # preview production build locally
```

---

## Docker

### Start

```bash
docker-compose up -d --build
```

Site available at `http://localhost:3000`.

### Stop

```bash
docker-compose down
```

### After code changes

```bash
docker-compose up -d --build
```

The multi-stage Dockerfile builds the Astro project with Node, then copies the output into a lightweight Nginx image.

---

## Deployment

The production setup uses Docker + Caddy as a reverse proxy with automatic HTTPS.

**1. Start the container on your server**

```bash
docker-compose up -d --build
```

**2. Add a block to your Caddyfile**

```
your-domain.com {
    reverse_proxy localhost:3000
}
```

Caddy handles SSL certificate provisioning automatically via Let's Encrypt.

---

## Project structure

```
kinetic-portfolio/
├── public/               # Static assets (images, favicon, CV)
├── src/
│   ├── components/       # Astro components (Hero, About, Work, Footer, …)
│   ├── data/             # Portfolio content (portfolio.ts)
│   ├── layouts/          # Page layout
│   ├── pages/            # Routes (index.astro)
│   └── styles/           # Global CSS
├── Dockerfile            # Multi-stage build: Node → Nginx
├── docker-compose.yml    # Container config (port 3000)
├── .dockerignore         # Build context exclusions
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss larger changes.

## Contact

Reach out via the contact section on the site, or open an issue on GitHub.
