Below is a clean, professional, publication‑ready **README.md** for Smirky.  
No emojis. No fluff. Just a clear, well‑structured document that positions Smirky as a serious static site generator with a Tailwind‑based default theme and Fabform integration.

You can drop this directly into your repository.

---

# Smirky  
A lightweight, theme‑friendly static website generator powered by Markdown and Node.js. Smirky focuses on clarity, simplicity, and extensibility, making it an ideal choice for blogs, documentation sites, and small business websites.

Smirky ships with a default Tailwind CSS theme that includes a fully functional contact form powered by the Fabform backend service. You can use the included theme as‑is or create your own custom themes with complete control over layout, styling, and structure.

---

## Features

- Markdown‑based content and pages  
- Clean, minimal templating system  
- Theme‑driven architecture  
- Built‑in blog system with tags  
- Tailwind CSS default theme  
- Fabform‑powered contact form integration  
- Zero configuration required  
- Fast builds and simple folder structure  

---

## Folder Structure

A typical Smirky project looks like this:

```
project/
  smirky/
    smirky.js
  content/
  pages/
  theme/
    layout.html
    index.html
    page.html
    post.html
    blog.html
    tags.html
    partials/
      head.html
      navbar.html
      footer.html
      blog_post_card.html
      tag_pill.html
    assets/
    site.json
  dist/
```

---

## Installation

Smirky can be installed locally within your project:

```
npm install smirky
```

Or used directly via npx:

```
npx smirky
```

---

## Usage

Smirky is designed to be simple and predictable. Once your content, pages, and theme are in place, you can build your site with a single command.

### Build your site

```
npm run build
```

This generates a fully static website inside the `dist/` directory.

### Development mode

If you prefer to rebuild manually during development:

```
npm run dev
```

---

## Content and Pages

Smirky uses two types of Markdown files:

### Pages  
Stored in `/pages`, each file becomes a standalone route:

```
/pages/about.md → /about/index.html
```

### Blog Posts  
Stored in `/content`, each file becomes a blog post:

```
/content/my-first-post.md → /blog/my-first-post/index.html
```

Both support front‑matter:

```yaml
---
title: About Us
slug: about
tags: [company, mission]
---
```

---

## Default Theme

Smirky includes a Tailwind CSS theme located in the `/theme` directory. It provides:

- Responsive layout  
- Navigation bar  
- Blog index and post templates  
- Tag pages  
- Footer  
- Contact form powered by Fabform  

### Fabform Integration

The default theme includes a ready‑to‑use contact form that posts directly to Fabform.  
To enable it, update the form action in your theme’s HTML:

```
<form action="https://fabform.io/f/your-form-id" method="POST">
```

No backend code is required.

---

## Creating Your Own Themes

Smirky is fully theme‑driven. A theme consists of:

- HTML templates  
- Partials  
- Assets (CSS, JS, images)  
- A `site.json` configuration file  

You can create a new theme by duplicating the default theme and modifying:

- Layout structure  
- Tailwind classes or CSS framework  
- Partials  
- Blog card design  
- Tag pill design  

Smirky does not enforce any styling framework. You may use Tailwind, Bootstrap, custom CSS, or anything else.

### Required template placeholders

Every theme must include the following tokens:

```
{{ head }}
{{ navbar }}
{{ footer }}
{{ content }}
{{ title }}
```

Smirky replaces these during the build process.

---

## Deployment

Since Smirky outputs a fully static site, you can deploy the `dist/` folder to any static hosting provider:

- Netlify  
- Vercel  
- GitHub Pages  
- Cloudflare Pages  
- AWS S3  
- Any static file server  

---

## License

MIT License  
Copyright © Geoffrey Callaghan

---
