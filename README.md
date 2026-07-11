# Kinetic Portfolio

A minimal, fast personal portfolio built with [Astro](https://astro.build) in hybrid SSR mode. Showcases projects, skills, and contact information; the contact form sends email through [Resend](https://resend.com). Deployed as a Docker container behind a Caddy reverse proxy.

---

## Tech stack

| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| Framework     | Astro 4 (hybrid output, `@astrojs/node` standalone adapter) |
| Styling       | Modular CSS (design tokens + per-section stylesheets)       |
| Language      | HTML, TypeScript, JavaScript (jQuery for DOM scripting)     |
| Email         | Resend (contact form API route)                             |
| Tooling       | Prettier (with `prettier-plugin-astro`), `astro check`      |
| Container     | Docker (multi-stage build, Node runtime)                    |
| Reverse Proxy | Caddy (SSL via Let's Encrypt)                               |

---

## Getting started

### Prerequisites

- **Local development:** Node.js v20+
- **Production:** Docker & Docker Compose

### Local development

```bash
git clone https://github.com/tof-98/kinetic-portfolio.git
cd kinetic-portfolio
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

The dev server starts at `http://localhost:4321` with hot reload.

### Environment variables

| Variable           | Purpose                                                 |
| ------------------ | ------------------------------------------------------- |
| `RESEND_API_KEY`   | API key for Resend, used by `/api/contact` to send mail |
| `CONTACT_TO_EMAIL` | Address that receives contact form submissions          |

The site runs without them — only sending mail through the contact form fails.

### Scripts

```bash
npm run dev            # dev server with hot reload
npm run build          # production build (outputs to dist/)
npm run preview        # preview production build locally
npm run check          # astro check (TypeScript/Astro diagnostics)
npm run format         # prettier --write on src/
npm run format:check   # prettier --check on src/
```

---

## Docker

### Start

```bash
docker-compose up -d --build
```

Site available at `http://localhost:3000` (mapped to port 4321 inside the container).

To make the contact form work in the container, pass the environment variables in — e.g. add to `docker-compose.yml`:

```yaml
services:
  portfolio:
    env_file: .env
```

### Stop

```bash
docker-compose down
```

### After code changes

```bash
docker-compose up -d --build
```

The multi-stage Dockerfile builds the Astro project in one Node stage, then copies the output into a slim Node image that runs the standalone server (`node ./dist/server/entry.mjs`).

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
├── public/               # Static assets served as-is (favicon, CV)
├── src/
│   ├── assets/           # Images, optimized by Astro at build time
│   ├── components/       # Astro components (Hero, About, Work, Stack, Experience, …)
│   ├── data/             # Content (portfolio.ts) and site metadata (site.ts)
│   ├── layouts/          # Page layout
│   ├── lib/              # Shared constants
│   ├── pages/            # Routes (index.astro, api/contact.ts)
│   ├── scripts/          # Client-side TypeScript, one module per section
│   └── styles/           # Modular CSS: tokens, base, one file per section
├── Dockerfile            # Multi-stage build: Node build → Node standalone server
├── docker-compose.yml    # Container config (host port 3000 → container 4321)
├── .env.example          # Required environment variables
├── .prettierrc.json      # Formatting config
├── astro.config.mjs      # Hybrid output + node adapter
├── tsconfig.json
└── package.json
```

---

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss larger changes.

## Contact

Reach out via the contact section on the site, or open an issue on GitHub.
