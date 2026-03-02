# SEO MUSICK - Project Blueprint

## Overview
SEO MUSICK is a personal portfolio website for Seo Eui-seung, a Bible Believer, Social Worker, and Music Maker. The site showcases his musical works and personal biography with a dynamic navigation system.

## Current Status
- Single-page application (SPA) architecture with hash-based section navigation.
- Content is fully data-driven using `data.js` and supports session-based persistence via `localStorage`.
- Admin dashboard allows managing Hero, Latest Release, Works, About, and Navigation Menu.
- UI and system messages are fully localized in Korean.

## Implemented Features
### Dynamic Navigation
- **Menu Management**: The sidebar navigation and Hero CTA buttons are rendered dynamically from `NAV_DATA`.
- **Admin Control**: Menu items can be added, renamed, hidden, or deleted from the Admin page.

### Admin Dashboard (`admin.html`)
- **Localization**: All UI labels, buttons, and alert messages are translated into Korean.
- **Preview Persistence**: Changes to "About" and "Menu" are saved to `localStorage` for immediate preview on the main site.
- **Hero Management**: Update eye-catch text and title.
- **Latest Release Management**: Update the featured release in the sidebar (Title, Desc, Link).
- **Works Management**: CRUD operations for albums/works.
- **About Management**: Update verse, reference, and biography text.
- **Menu Management**: CRUD operations for the site's navigation menu.

### Dynamic Rendering
- `main.js` now dynamically renders the Navigation, Sidebar (Latest Release), Hero, Works, and About sections using data from `data.js` (with `localStorage` overrides).
