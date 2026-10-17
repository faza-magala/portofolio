# Modern Fullstack Developer Portfolio

A production-ready, light-themed developer portfolio built for an aspiring Fullstack Developer. Designed with editorial typography, subtle blue accents, strict TypeScript architecture, and accessibility (WCAG 2.2 AA) principles.

---

## 1. Project Overview

This portfolio website highlights an authentic early-career developer journey with clean code, responsive layouts, and transparent project presentations. It avoids exaggerated claims, fake awards, or fabricated testimonials, focusing instead on engineering quality, security awareness, and continuous learning.

### Key Highlights:
- **Design Identity**: Refined, light-mode palette centered on primary blue (`#3898EC`), accent blue (`#60B5FF`), and crisp card surfaces (`#FFFFFF` on `#F8FBFF`).
- **Accessible (WCAG 2.2 AA)**: Includes skip-to-content links, visible focus indicators, screen-reader landmarks, and respects `prefers-reduced-motion`.
- **Honest Content Architecture**: Clearly differentiates proficient technologies from active learning topics, with realistic sample project templates that handle missing URLs gracefully without broken links.
- **Privacy & Security First**: Zero client-side credential exposure, strict URL protocol validation (`isSafeUrl`), safe external link attributes (`rel="noopener noreferrer"`), and pre-configured Vercel security headers (CSP, HSTS, X-Content-Type-Options).
- **Fast & Lightweight**: Zero bloated animation libraries; ~76 kB total gzipped bundle size across vendor and application code.

---

## 2. Technology Stack

- **Framework**: [React 18](https://react.dev/) (Functional components with hooks)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-checking enabled)
- **Build Tool**: [Vite 6](https://vitejs.dev/) (Fast HMR & Rollup chunking)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting & Formatting**: ESLint (TypeScript + React rules) & Prettier
- **Hosting / CI**: Optimized for [Vercel](https://vercel.com/) with `vercel.json`

---

## 3. Prerequisites

Before running or deploying the project, ensure you have:
- **Node.js**: Version 18.0.0 or later (Tested with Node.js v26.x and v20.x)
- **npm**: Version 9.0.0 or later

---

## 4. Installation Steps

1. Clone or download the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 5. Local Development Command

Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 6. Production Build Command

To compile TypeScript and bundle optimized static assets for production:
```bash
npm run build
```

The compiled output will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 7. Lint and Type-Check Commands

Run static analysis and strict TypeScript verification:

- **Type Check (Strict TypeScript)**:
  ```bash
  npm run typecheck
  ```
- **Lint (ESLint)**:
  ```bash
  npm run lint
  ```

---

## 8. Project Structure

```text
portofolio/
├── public/
│   ├── favicon.svg             # Minimalist SVG code bracket favicon
│   ├── robots.txt              # Search engine crawler instructions
│   └── sitemap.xml             # Production XML sitemap
├── src/
│   ├── assets/                 # Static visual assets
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Sticky header, scroll spy, mobile drawer
│   │   │   └── Footer.tsx      # Dynamic year, back-to-top, copyright
│   │   ├── sections/
│   │   │   ├── Hero.tsx        # Headline, CTAs, code card, tech badges
│   │   │   ├── About.tsx       # Bio, engineering pillars, snapshot
│   │   │   ├── Skills.tsx      # Filterable skills grid with proficiency tags
│   │   │   ├── Projects.tsx    # Filterable project cards with safe links
│   │   │   ├── LearningJourney.tsx # Transparent learning roadmap
│   │   │   └── Contact.tsx     # Direct email copy & mailto draft helper
│   │   └── ui/
│   │       ├── Badge.tsx       # Semantic status & category badges
│   │       ├── Button.tsx      # Accessible polymorphic button/link
│   │       ├── Card.tsx        # Styled container with subtle hover elevation
│   │       ├── Container.tsx   # Responsive max-width wrapper
│   │       ├── SectionHeading.tsx # Eyebrow, title, description
│   │       └── SocialLinks.tsx # Safe external social profile icons
│   ├── config/
│   │   └── site.ts             # Central personal configuration module
│   ├── data/
│   │   ├── learning.ts         # Active learning milestones data
│   │   ├── projects.ts         # Portfolio projects data
│   │   └── skills.ts           # Technical skills data
│   ├── hooks/
│   │   ├── useReducedMotion.ts # WCAG 2.2 accessibility motion check
│   │   └── useScrollSpy.ts     # Viewport scroll position tracker
│   ├── lib/
│   │   ├── utils.ts            # Class merging (clsx + tailwind-merge)
│   │   └── validators.ts       # Protocol sanitization & email format validation
│   ├── types/
│   │   └── portfolio.ts        # Strict TypeScript interfaces
│   ├── App.tsx                 # Root layout & section composition
│   ├── index.css               # Design system tokens, base styles, scrollbar
│   └── main.tsx                # React 18 StrictMode entry point
├── .env.example                # Documented environment variable template
├── .eslintrc.cjs               # Strict ESLint configuration
├── .gitignore                  # Git exclusions for dependencies and secrets
├── .prettierrc                 # Prettier code formatting rules
├── index.html                  # Semantic HTML5, SEO meta tags, font links
├── package.json                # Project dependencies and npm scripts
├── postcss.config.js           # PostCSS Tailwind and Autoprefixer config
├── tailwind.config.js          # Design system color tokens and typography
├── tsconfig.json               # TypeScript strict configuration
├── tsconfig.node.json          # Vite node build config
└── vercel.json                 # Vercel security headers and caching policy
```

---

## 9. How to Edit Profile Information and Projects

All personal details, skills, and projects are centralized in straightforward, typed configuration files:

1. **Personal Information & Bio**:
   - Open [`src/config/site.ts`](file:///src/config/site.ts).
   - Update `developer.name`, `developer.role`, `developer.headline`, `developer.fullBio`, `developer.location`, and `contact.email`.
   - Update your GitHub and LinkedIn URLs in `contact.githubUrl` and `contact.linkedinUrl`.

2. **Skills & Proficiencies**:
   - Open [`src/data/skills.ts`](file:///src/data/skills.ts).
   - Add, edit, or adjust technologies under `frontend`, `backend`, `databases`, or `tools`.
   - Set `proficiency` to `'Proficient'`, `'Learning'`, or `'Exploring'` to accurately reflect your skill level.

3. **Featured Projects**:
   - Open [`src/data/projects.ts`](file:///src/data/projects.ts).
   - Update titles, descriptions, `techStack`, `category`, and highlight bullets.
   - Supply real `liveDemoUrl` and `sourceCodeUrl` strings when ready. If a project does not have a public demo or repository yet, set the property to `undefined`; the UI will gracefully disable the button rather than generating broken links.

4. **Learning Milestones**:
   - Open [`src/data/learning.ts`](file:///src/data/learning.ts) to update your current technical focus.

---

## 10. Environment Variable Documentation

This application is designed as a secure, static frontend portfolio requiring **no server secrets or database credentials**.

If you wish to configure a custom canonical domain:
- Create a `.env` file based on `.env.example`:
  ```env
  VITE_SITE_URL=https://your-custom-domain.com
  ```

> [!CAUTION]
> Never put private API keys, SMTP credentials, or database secrets in any file prefixed with `VITE_`. Everything prefixed with `VITE_` is baked into client-side JavaScript bundles and publicly visible to anyone inspecting the network tab.

---

## 11. Vercel Deployment Instructions

Deploying this portfolio to Vercel takes less than two minutes:

### Option A: Via Vercel Web Dashboard (Recommended)

1. Push your repository to GitHub or GitLab:
   ```bash
   git add .
   git commit -m "feat: complete developer portfolio"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com/) and click **Add New... -> Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Vercel will build and serve your site with HTTPS enabled automatically.

### Option B: Via Vercel CLI

1. Install the Vercel CLI globally (or run with npx):
   ```bash
   npx vercel
   ```
2. Follow the command-line prompts to link your project.
3. For production deployment:
   ```bash
   npx vercel --prod
   ```

### Assigning a Custom Domain in Vercel:
1. In your project dashboard on Vercel, navigate to **Settings -> Domains**.
2. Enter your custom domain (e.g., `developer.com` or `portfolio.dev`).
3. Add the displayed DNS records (CNAME or A record) at your domain registrar.
4. Update `meta.siteUrl` in [`src/config/site.ts`](file:///src/config/site.ts) and [`public/sitemap.xml`](file:///public/sitemap.xml) with your custom domain.

---

## 12. Security and Maintenance Notes

### Security Protections Implemented:
1. **Content Security Policy & Headers**:
   - Configured in [`vercel.json`](file:///vercel.json) with strict CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
2. **Safe URL Sanitization**:
   - [`src/lib/validators.ts`](file:///src/lib/validators.ts) verifies that all links conform to `https:`, `http:`, or `mailto:` schemes before rendering, protecting against `javascript:` protocol injections.
   - External links automatically include `rel="noopener noreferrer"`.
3. **No Phony Backend / Fake Success States**:
   - The contact section does not claim to send backend emails without a real mail service. Instead, it offers a 100% transparent copy-to-clipboard button and an interactive `mailto:` client draft composer.
4. **Dependency Audit Note**:
   - Running `npm audit` reports devDependency vulnerabilities (`braces` / `postcss-selector-parser`) nested within `tailwindcss v3` build tools. These tools run exclusively at compile-time on your development machine and are **not included** in the production browser bundle. Avoid running `npm audit fix --force` as it introduces breaking changes with Tailwind v4.
