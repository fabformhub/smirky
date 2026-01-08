# Smirky — Minimalist Static Website Generator

Smirky is a minimalist static website generator for people who just want to write Markdown and get a website — no ceremony, no plugins, no magic.

It is perfect for building blogs, landing pages, or any static site quickly.

---

## Why Smirky?

* Write Markdown and get a website
* Supports tags in Markdown posts
* Minimal templates with header, navbar, footer, and content
* Blog posts and tag pages generated automatically
* Assets copied automatically
* No complex configuration
* Works with [Fabform.io](https://fabform.io) for contact forms

---

## Features

* Simple Markdown pages (`pages/`)
* Blog posts (`content/`) with tags
* Tag pages (`/tags/`) and blog index (`/blog/`)
* Clean templates and partials (`theme/`)
* Static assets copied automatically (`theme/assets/`)
* Contact forms via [Fabform.io](https://fabform.io)
* Generates everything in `dist/` for deployment

---

## Getting Started

1. Install Smirky globally or as a dev dependency:

```bash
# global installation
npm install -g smirky

# or as a dev dependency in your project
npm install --save-dev smirky
```

2. Create your project structure:

```
my-site/
├── pages/          # Static pages in Markdown
├── content/        # Blog posts in Markdown
├── theme/          # Optional: custom templates, partials, assets
└── package.json
```

3. Add your pages to `pages/` and your blog posts to `content/`:

**Example page**: `pages/about.md`

```md
---
title: About
slug: about
---

## About Smirky

Smirky is a minimalist static site generator. Write Markdown, run Smirky, done.
```

**Example blog post with tags**: `content/my-first-post.md`

```md
---
title: My First Post
date: 2026-01-08
tags:
  - JavaScript
  - Static Sites
---

Hello! This is my first blog post powered by Smirky.
```

> The `tags` field lets Smirky automatically generate tag pages and link posts to them.

4. Build your site:

```bash
npm run build
```

> **Note:** Make sure your `package.json` has this script:

```json
"scripts": {
  "build": "smirky"
}
```

The generated site will be in the `dist/` folder. Deploy it anywhere: Netlify, Vercel, GitHub Pages, etc.

---

## How Themes Work

Smirky uses templates and partials to assemble your pages:

* `layout.html` — main wrapper
* `index.html` — home page
* `page.html` — static pages
* `post.html` — individual blog posts
* `blog.html` — blog index and tag pages
* `tags.html` — tag index

Partials are reusable components:

* `head.html` — meta tags, CSS
* `navbar.html` — navigation bar
* `footer.html` — footer content
* `blog_post_card.html` — blog summary card
* `tag_pill.html` — tag label

Variables such as `{{ title }}`, `{{ content }}`, `{{ tag_pills }}`, `{{ site_title }}` are replaced automatically.

---

## Tags

* Tags are defined in Markdown frontmatter with `tags: [Tag1, Tag2]`
* Smirky generates:

  * `/tags/` — index of all tags
  * `/tags/{tag}/` — all posts with that tag

Tag pages automatically list posts that have the tag. Example URL:

```
/tags/javascript/
```

---

## Contact Forms (Fabform.io)

Smirky works with [Fabform.io](https://fabform.io) for contact forms without a backend.

**Example Contact Form:**

```html
<form
  action="https://fabform.io/f/FORM_ID"
  method="POST"
>
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Send</button>
</form>
```

* Replace `FORM_ID` with your Fabform ID
* Works directly on your static site
* No server, no backend

[Visit Fabform.io](https://fabform.io)

---

## Deployment

After running `npm run build`, deploy the `dist/` folder to any static host:

* [Netlify](https://www.netlify.com/)
* [Vercel](https://vercel.com/)
* [Cloudflare Pages](https://pages.cloudflare.com/)
* [GitHub Pages](https://pages.github.com/)

---

## Philosophy

Smirky is for people who want simple static sites. No plugins, no hidden configs, no ceremony.

**Write Markdown, run Smirky, done.**


