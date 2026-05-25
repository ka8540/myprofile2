# Kush Jayesh Ahir Portfolio Website

A polished, responsive personal portfolio website for Kush Jayesh Ahir, a software engineer focused on backend services, cloud-native systems, data platforms, and AI-powered products.

The site is a static HTML/CSS/JavaScript portfolio that presents Kush's professional profile, technical stack, selected projects, work experience, education, research, resume links, and contact options.

## Website Overview

- Name: Kush Jayesh Ahir
- Role: Software Engineer
- Focus areas: Backend engineering, cloud-native systems, data engineering, analytics, AI-powered products
- Location: Chandler, AZ
- Status: Open to Software Engineering roles in 2026
- Email: [kush.ahir2024@gmail.com](mailto:kush.ahir2024@gmail.com)
- GitHub: [ka8540](https://github.com/ka8540)
- LinkedIn: [kush-ahir](https://www.linkedin.com/in/kush-ahir/)
- Resume: [Google Drive resume](https://drive.google.com/file/d/1ZNYicCihzlP0S_pLmAMnvWSAFDNkjqI5/view?usp=sharing)

## Main Sections

The current site is built around a single-page portfolio experience in `index.html`.

### Hero

- Introduces Kush as a software engineer building scalable backend and data systems.
- Includes a typed role rotator with roles such as Backend Engineer, Cloud-Native Engineer, Full-Stack Developer, Data and Analytics Engineer, and AWS Solutions Builder.
- Provides calls to action for the resume, projects, and contact section.
- Includes GitHub, LinkedIn, email, and location links.
- Uses a portrait visual, floating skill cards, glow effects, and a technology marquee.

### Snapshot

Highlights quick credibility metrics:

- 2.5+ years of engineering experience
- 9 shipped projects
- 3 research papers
- 3.71 / 4.0 M.S. GPA at Rochester Institute of Technology

### About

Summarizes Kush's engineering background:

- Backend development with Python and Java
- Flask and Spring Boot APIs
- Cloud deployment on AWS and GCP
- Data systems using PostgreSQL, MySQL, MongoDB, BigQuery, Elasticsearch, and related tools
- Analytics and reporting with SQL, Tableau, and Power BI
- Agile collaboration, sprint delivery, and cross-functional problem solving

The section also lists related coursework, including cloud software systems, software architecture, database design, non-relational data management, data science foundations, software quality assurance, and model-driven development.

### Skills

Skills are grouped into six categories:

- Languages and frameworks: Java, Python, C++, JavaScript, TypeScript, React, Next.js, Node.js, Flask, Spring Boot, Swift
- Cloud and DevOps: AWS, Azure, GCP, Docker, Kubernetes, GitHub Actions, Jenkins, CI/CD, Vercel, Linux
- Databases: PostgreSQL, MySQL, MongoDB, Neo4j, Snowflake, BigQuery, Redis
- Data and analytics: SQL, Power BI, Tableau, Spark, Elasticsearch, ETL pipelines, data visualization
- Testing and QA: Selenium, JUnit, TestNG, Pytest, Playwright, BDD, unit testing
- Practices: Data structures and algorithms, system design, object-oriented design, Agile, CS fundamentals

### Projects

The project section showcases selected work with descriptions, categories, technology tags, and GitHub links.

| Project | Category | Summary | Stack |
| --- | --- | --- | --- |
| [Sendloom](https://github.com/ka8540/Sendloom) | Email Ops / SaaS | Sequence-sending platform for campaign setup, template previews, Gmail SMTP delivery, lead finding, and controlled send execution. | Next.js, PostgreSQL, Redis, SMTP |
| [Examora](https://github.com/ka8540/Examora) | EdTech / AI Workflow | AI-assisted exam authoring platform for question sets, rubrics, and difficulty signals. | React, Node.js, AWS, Playwright |
| [EquiPay](https://github.com/ka8540/EquiPay) | Fintech / Mobile | Group expense-splitting app with real-time balances, receipt OCR, and settlement flows. | React Native, Flask, AWS |
| [PersonaCraft](https://github.com/ka8540/PersonaCraft) | LLM / Conversational AI | Character-chat app for creating GPT-powered personas with traits, lore, and tone. | Python, Flask, LLM |
| [NeoHub](https://github.com/ka8540/NeoHub) | Graph / Visualization | Neo4j and D3 tool for exploring GitHub Archive contribution networks. | Neo4j, D3.js, Data Visualization |
| [CrimeAtlas](https://github.com/ka8540/CrimeAtlas) | Geospatial / Data Platform | MERN crime-intelligence platform mapping LA incidents with Street View enrichment. | MERN, MongoDB, Google Cloud |
| [BudgetWise AI](https://github.com/ka8540/BudgetWise) | Analytics / Cloud | Cloud-hosted personal finance platform with predictive analytics and scalable reporting. | AWS, Docker, Analytics |
| [Price Compare Plus](https://github.com/ka8540/SWEN732-team1) | Mobile / Commerce | React Native shopping companion for cross-retailer price comparison and wishlists. | React Native, APIs, Mobile |
| [ICRS](https://github.com/klsterfx/ICRS) | Decision Support / Education | College recommendation system with scoring and ranking workflows. | Java, Flask, MySQL |

### Experience

The timeline section includes:

- Dashboard Developer Co-op, Rochester Institute of Technology Institutional Research, Data and Analytics, May 2025 - Dec 2025
- Course Assistant, Rochester Institute of Technology, Aug 2024 - May 2025
- Software Engineer Intern, Axisray Pvt Ltd, Jan 2023 - May 2023
- Data Science and AI/ML Engineering Intern, Moon Technolabs Pvt Ltd, May 2022 - Oct 2022

### Education

- M.S. Computer Software Engineering, Rochester Institute of Technology, minor in Data Science, Aug 2023 - Dec 2025, GPA 3.71 / 4.0
- B.E. Electronics and Communication, L. J. Institute of Engineering and Technology / Gujarat Technological University, Aug 2019 - May 2023, CGPA 8.52 / 10

### Research

The research section links to three papers:

- Equifax Data Breach: A Software Architecture Perspective
- Legacy Systems in Open Source: Design Pattern-Based Refactoring
- Review of DISTO: Textual Distractors for MCQ Reading Comprehension via Negative Sampling

### Resume

The resume call-to-action links to a hosted PDF on Google Drive and includes a visual resume preview card.

### Contact

The contact section provides direct links for:

- Email
- LinkedIn
- GitHub
- Resume

## Features

- Static single-page portfolio
- Responsive desktop and mobile layout
- Dark theme by default with light theme toggle
- Theme preference stored in `localStorage`
- Scroll progress indicator
- Sticky navigation with active section highlighting
- Mobile menu with Escape-key close behavior
- Typed role animation in the hero
- IntersectionObserver-based reveal animations
- Reduced-motion support for visitors who prefer less animation
- Dynamic footer year
- SEO title and description meta tags
- Open Graph metadata for social sharing
- Favicons and web app manifest
- Optimized WebP image usage for key visuals

## Tech Stack

This website does not require a framework build step. It is built with:

- HTML5
- CSS3
- Vanilla JavaScript
- Responsive CSS custom properties and design tokens
- WebP, PNG, SVG, ICO, and PDF assets
- Google Fonts

Current page entry points:

- `index.html` - Main page markup and content
- `css/premium.css` - Active visual design system and responsive styling
- `js/main.js` - Active interaction script for theme, navigation, reveals, typed text, and footer year

Additional libraries and legacy assets are included under `lib/`, `css/`, `scss/`, and `js/` for older portfolio versions or experiments.

## Repository Structure

```text
.
|-- index.html                 # Main portfolio page
|-- README.md                  # Project documentation
|-- LICENSE.txt                # License file
|-- css/
|   |-- premium.css            # Active site styling
|   |-- style.css              # Legacy/alternate stylesheet
|   `-- style.min.css          # Minified legacy/alternate stylesheet
|-- js/
|   |-- main.js                # Active site interactions
|   |-- ambientBackground.js   # Particle background experiment/fallback logic
|   |-- reveal.js              # Reusable reveal helper from earlier iteration
|   |-- themeToggle.js         # Legacy theme toggle helper
|   `-- other legacy helpers
|-- img/
|   |-- profile.webp           # About/profile image
|   |-- front2.webp            # Hero portrait image
|   |-- tech/                  # Technology logo SVGs
|   `-- project/media assets
|-- favicon_io-2/              # Favicons and site manifest
|-- lib/                       # Vendor libraries used by older versions/experiments
|-- scss/                      # Bootstrap and custom SCSS sources from older styling
|-- examples/
|   `-- ParticleBackground.tsx # Example particle background component
`-- mail/                      # Legacy contact-form PHP/JS files
```

## Run Locally

Because this is a static site, it can be opened directly in a browser:

```bash
open index.html
```

For a local HTTP server, run:

```bash
python3 -m http.server 4173
```

Then visit:

```text
http://127.0.0.1:4173/
```

No package install or build command is required for the current site.

## Deployment

The site can be deployed on any static hosting service, including:

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages
- Any basic web server that can serve static files

Recommended deployment root:

```text
/
```

Required files for the current website:

- `index.html`
- `css/premium.css`
- `js/main.js`
- `img/`
- `favicon_io-2/`

## Updating Website Content

Most public-facing content lives in `index.html`.

Common updates:

- Change hero text in the `#hero` section.
- Update skill chips in the `#skills` section.
- Add or edit project cards in the `#projects` section.
- Update roles in the `#experience` timeline.
- Update degree, GPA, certificate, or coursework details in `#education`.
- Add research links in `#research`.
- Replace resume links in the hero, resume, and contact sections.
- Update social links in the hero, footer, and contact section.

When adding a new project card, include:

- Project name
- Category
- Short outcome-focused description
- GitHub or live link
- Technology tags
- Accessible `aria-label` for the project link

## Design Notes

- The active design is controlled by `css/premium.css`.
- The page defaults to dark mode through `data-theme="dark"` on the `<html>` element.
- `js/main.js` can switch the site between light and dark themes.
- The layout uses reusable section wrappers, cards, chips, timeline items, and CTA button patterns.
- The visual language emphasizes a premium engineering portfolio: dark surfaces, restrained gradients, crisp typography, technology logos, and focused content hierarchy.

## Accessibility And UX

The site includes:

- Semantic section structure
- Descriptive alt text for key images
- `aria-label` attributes for icon-only links and navigation controls
- Keyboard Escape support for closing the mobile menu
- Reduced-motion handling for scroll and typed animations
- Visible calls to action for resume, projects, and contact
- Responsive navigation for desktop and mobile users

## SEO And Sharing

The page includes:

- Descriptive `<title>`
- Meta description
- Author metadata
- Open Graph type, title, description, and image
- Favicons for multiple sizes
- Apple touch icon
- Web app manifest

## Maintenance Checklist

Before publishing changes:

- Confirm all internal anchors still match section IDs.
- Check external links for GitHub, LinkedIn, resume, certificates, and research papers.
- Verify image paths after replacing assets.
- Test desktop and mobile layouts.
- Test both dark and light themes.
- Confirm the footer year updates automatically.
- Keep `README.md` in sync with visible site content.

## License

This repository includes `LICENSE.txt`. See that file for license details.
