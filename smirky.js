#!/usr/bin/env node

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// --------------------------------------------------
// Directories
// --------------------------------------------------
const CONTENT_DIR = "./content";
const PAGES_DIR = "./pages";
const THEME_DIR = "./theme";
const OUTPUT_DIR = "./dist";

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function slugify(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

// --------------------------------------------------
// SUPER SIMPLE TEMPLATE ENGINE
// One final pass over the entire HTML
// --------------------------------------------------
function applyTemplate(html, vars) {
  let out = html;
  for (const key in vars) {
    const token = `{{ ${key} }}`;
    out = out.split(token).join(vars[key] ?? "");
  }
  return out;
}

// --------------------------------------------------
// Load theme files
// --------------------------------------------------
function readTheme(file) {
  return fs.readFileSync(path.join(THEME_DIR, file), "utf8");
}

const layoutTemplate = readTheme("layout.html");
const indexTemplate = readTheme("index.html");
const pageTemplate = readTheme("page.html");
const postTemplate = readTheme("post.html");
const blogTemplate = readTheme("blog.html");
const tagsTemplate = readTheme("tags.html");

// Partials
const headPartial = readTheme("partials/head.html");
const navbarPartial = readTheme("partials/navbar.html");
const footerPartial = readTheme("partials/footer.html");
const blogPostCardTemplate = readTheme("partials/blog_post_card.html");
const tagPillTemplate = readTheme("partials/tag_pill.html");

// Site config
const siteConfig = JSON.parse(
  fs.readFileSync(path.join(THEME_DIR, "site.json"), "utf8")
);

// --------------------------------------------------
// Copy static assets
// --------------------------------------------------
function copyAssets() {
  const src = path.join(THEME_DIR, "assets");
  const dest = path.join(OUTPUT_DIR, "assets");

  ensureDir(dest);

  for (const file of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
  }

  console.log("Assets copied");
}

// --------------------------------------------------
// Navbar builder
// --------------------------------------------------
function buildNavbarLinks(currentSlug) {
  const files = fs.existsSync(PAGES_DIR)
    ? fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md"))
    : [];

  const links = files.map((file) => {
    const raw = fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
    const { data } = matter(raw);

    const slug = slugify(data.slug || path.basename(file, ".md"));
    const title = data.title || slug;

    const isActive = slug === currentSlug;
    const cls = isActive
      ? "text-indigo-600 font-semibold"
      : "text-slate-700 hover:text-slate-900";

    return `<a href="/${slug}/" class="${cls}">${title}</a>`;
  });

  // Blog link
  links.push(
    `<a href="/blog/" class="${
      currentSlug === "blog"
        ? "text-indigo-600 font-semibold"
        : "text-slate-700 hover:text-slate-900"
    }">Blog</a>`
  );

  // Tags link
  links.push(
    `<a href="/tags/" class="${
      currentSlug === "tags"
        ? "text-indigo-600 font-semibold"
        : "text-slate-700 hover:text-slate-900"
    }">Tags</a>`
  );

  return links.join("\n      ");
}

// --------------------------------------------------
// Tag pills & blog cards
// --------------------------------------------------
function renderTagPills(tags) {
  return (tags || [])
    .map((tag) =>
      applyTemplate(tagPillTemplate, {
        tag_name: tag,
        tag_slug: slugify(tag)
      })
    )
    .join("\n");
}

function renderBlogCards(posts) {
  return posts
    .map((post) =>
      applyTemplate(blogPostCardTemplate, {
        title: post.title,
        url: post.url,
        date: post.date,
        tags: renderTagPills(post.tags)
      })
    )
    .join("\n");
}

// --------------------------------------------------
// NEW renderPage() — assemble first, replace last
// --------------------------------------------------
function renderPage(innerHTML, vars) {
  const navbarLinks = buildNavbarLinks(vars.currentSlug || "");

  // Build page/post HTML from the chosen template
  const pageHtml = applyTemplate(vars.template, {
    ...vars,
    content: innerHTML
  });

  // Assemble full HTML BEFORE variable replacement
  let fullHtml = layoutTemplate
    .replace("{{ head }}", headPartial)
    .replace("{{ navbar }}", navbarPartial)
    .replace("{{ footer }}", footerPartial)
    .replace("{{ content }}", pageHtml);

  // Final variable pass — replaces everywhere
  fullHtml = applyTemplate(fullHtml, {
    ...vars,
    site_title: siteConfig.site.title,
    site_description: siteConfig.site.description,
    site_footer: siteConfig.site.footer,
    navbar_links: navbarLinks
  });

  return fullHtml;
}

// --------------------------------------------------
// Collect tags
// --------------------------------------------------
function collectTags(posts) {
  const tagMap = {};

  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      const key = slugify(tag);
      if (!tagMap[key]) {
        tagMap[key] = { name: tag, posts: [] };
      }
      tagMap[key].posts.push(post);
    });
  });

  return tagMap;
}

// --------------------------------------------------
// Build static pages
// --------------------------------------------------
function buildPages() {
  if (!fs.existsSync(PAGES_DIR)) return;

  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md"));

  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
    const { data, content: md } = matter(raw);

    const slug = slugify(data.slug || path.basename(file, ".md"));
    const html = marked(md);

    const final = renderPage(html, {
      title: data.title || slug,
      currentSlug: slug,
      template: pageTemplate
    });

    const outDir = path.join(OUTPUT_DIR, slug);
    ensureDir(outDir);
    fs.writeFileSync(path.join(outDir, "index.html"), final);

    console.log(`Page → /${slug}/`);
  });
}

// --------------------------------------------------
// Build blog posts
// --------------------------------------------------
function buildPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = [];

  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content: md } = matter(raw);

    const slug = slugify(data.slug || path.basename(file, ".md"));
    const html = marked(md);

    const title =
      data.title ||
      slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const tags = data.tags || [];
    const tagPills = renderTagPills(tags);

    const final = renderPage(html, {
      title,
      currentSlug: "blog",
      template: postTemplate,
      tag_pills: tagPills
    });

    const outDir = path.join(OUTPUT_DIR, "blog", slug);
    ensureDir(outDir);
    fs.writeFileSync(path.join(outDir, "index.html"), final);

    posts.push({
      title,
      url: `/blog/${slug}/`,
      date: data.date || "",
      tags
    });

    console.log(`Post → /blog/${slug}/`);
  });

  return posts;
}

// --------------------------------------------------
// Blog index
// --------------------------------------------------
function buildBlogIndex(posts) {
  const listHtml = renderBlogCards(
    posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  );

  const final = renderPage(listHtml, {
    title: "Blog",
    currentSlug: "blog",
    template: blogTemplate
  });

  const outDir = path.join(OUTPUT_DIR, "blog");
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, "index.html"), final);

  console.log("Blog index → /blog/");
}

// --------------------------------------------------
// Tags index
// --------------------------------------------------
function buildTagsPage(tagMap) {
  const tagLinks = Object.values(tagMap)
    .map((t) =>
      applyTemplate(tagPillTemplate, {
        tag_name: `${t.name} (${t.posts.length})`,
        tag_slug: slugify(t.name)
      })
    )
    .join("\n");

  const final = renderPage(tagLinks, {
    title: "Tags",
    currentSlug: "tags",
    template: tagsTemplate
  });

  const outDir = path.join(OUTPUT_DIR, "tags");
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, "index.html"), final);

  console.log("Tags index → /tags/");
}

// --------------------------------------------------
// Tag pages
// --------------------------------------------------
function buildTagPages(tagMap) {
  Object.values(tagMap).forEach((tag) => {
    const listHtml = renderBlogCards(tag.posts);

    const final = renderPage(listHtml, {
      title: `Posts tagged "${tag.name}"`,
      currentSlug: "tags",
      template: blogTemplate
    });

    const outDir = path.join(OUTPUT_DIR, "tags", slugify(tag.name));
    ensureDir(outDir);
    fs.writeFileSync(path.join(outDir, "index.html"), final);

    console.log(`Tag → /tags/${slugify(tag.name)}/`);
  });
}

// --------------------------------------------------
// Home page
// --------------------------------------------------
function buildHome() {
  const final = renderPage("", {
    title: siteConfig.site.title,
    currentSlug: "home",
    template: indexTemplate
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), final);
  console.log("Home → /");
}

// --------------------------------------------------
// Build everything
// --------------------------------------------------
function build() {
  ensureDir(OUTPUT_DIR);

  console.log("Building...");

  copyAssets();

  const posts = buildPosts();
  buildPages();

  const tagMap = collectTags(posts);
  buildBlogIndex(posts);
  buildTagsPage(tagMap);
  buildTagPages(tagMap);

  buildHome();
  console.log("Done.");
}

build();

