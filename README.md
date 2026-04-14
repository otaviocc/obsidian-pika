# Pika.publish

Pika.publish is a community-maintained plugin for [Obsidian](https://obsidian.md/) that lets you publish notes to your [Pika](https://pika.page) blog — right from your vault.

This community-maintained plugin is not affiliated with Pika or Obsidian.

Does this plugin improve your workflow? Say thanks with a coffee.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/otaviocc)

## Features

- Publish to Pika via the Micropub API
  - **Posts**: publish with title, tags, visibility (Draft/Public), and optional scheduled date.
- Image handling
  - Automatically finds local images in your note (standard Markdown and Obsidian wiki-style image links), uploads them to Pika, and replaces references with hosted URLs.
  - Caches uploaded image mappings in note properties for fast re-publish.
- Categories and tags
  - Default tags and visibility for new posts.
- Obsidian Properties (YAML frontmatter) support
  - Uses `title`, `tags` when present; falls back to filename and defaults otherwise.
  - Saves `url` after successful publishing for easy updates.

## Login

Create an App Token in Pika at `Settings → App tokens`, copy it immediately, and paste it in `Settings → Pika.publish`.

## Quick start

1. Create or open a Markdown note.
2. Optionally add Properties (or YAML) for:
   - `title`: overrides filename as the post title.
   - `tags`: comma-separated list (e.g., `writing, book-notes`).
3. Use the Command Palette and run `Publish Post to Pika`.
4. Review and adjust fields (title, tags, visibility, scheduled date).
5. Confirm to publish. The note's Properties will be updated with the post `url`.

## Commands

- `Publish Post to Pika`: publish or update the current note as a post.

## Settings

- Posts
  - **Categories**: default tags for new posts (comma-separated).
  - **Visibility**: `Draft` or `Public` default for posts.
- Account
  - **App Token**: log in / log out of Pika.

## Properties (YAML frontmatter)

- **title**: used as the post title. Falls back to filename if missing.
- **tags**: comma-separated tags. Falls back to defaults if missing.
- **url**: added by Pika.publish after a successful publish; used to update existing posts.

Example:

```yaml
---
title: My New Post
tags: writing, book-notes
url: https://you.pika.page/posts/my-new-post
---
```

## Editing and updating

- After publishing, the note's `url` is saved in Properties.
- To update a post, edit the note (or title/tags) and run `Publish Post to Pika` again.

## Images

- Supported image syntaxes:
  - Standard Markdown: `![alt](path/to/image.png)`
  - Obsidian wiki-style: `![[path/to/image.png]]`
- Local images are read from your vault, uploaded to Pika's media endpoint, and references are replaced with hosted URLs.
- Relative paths are resolved against the note's folder. Remote image URLs are left unchanged.
- If you need to force reprocessing, remove the `image_urls` Property and re-publish.

## Scheduling posts

- In the post review dialog, set an optional scheduled date/time. The date must be parseable by your system (e.g., `2025-09-12 14:00`). Leave blank to publish immediately.

## Building from source

Clone into your vault's plugins folder:

```bash
cd .obsidian/plugins/
git clone https://github.com/otaviocc/obsidian-pika
```

Install and build:

```bash
cd obsidian-pika
npm i
npm run build
```

Restart Obsidian and enable the plugin under Community Plugins.

## Contributing

1. Fork this repository and follow the build steps above using your fork.
2. Create a feature branch.
3. Commit and push your changes.
4. Open a pull request.

## License

MIT
