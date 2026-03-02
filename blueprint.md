# SEO MUSICK - Project Blueprint

## Overview
SEO MUSICK is a personal portfolio website for Seo Eui-seung, a Bible Believer, Social Worker, and Music Maker. The site showcases his musical works and personal biography with a dynamic navigation system.

## Current Status
- Single-page application (SPA) architecture with hash-based section navigation.
- Content is fully data-driven using `data.js`.
- Admin dashboard allows managing Hero, Latest Release, Works, About, and Navigation Menu.
- Styling is handled in `style.css` (global) and internal CSS in `index.html` and `admin.html`.

## Implemented Features
### Dynamic Navigation
- **Menu Management**: The sidebar navigation and Hero CTA buttons are rendered dynamically from `NAV_DATA`.
- **Admin Control**: Menu items can be added, renamed, hidden, or deleted from the Admin page.

### Admin Dashboard (`admin.html`)
- **Left Sidebar Navigation**: Redesigned for better usability.
- **Hero Management**: Update eye-catch text and title.
- **Latest Release Management**: Update the featured release in the sidebar (Title, Desc, Link).
- **Works Management**: CRUD operations for albums/works.
- **About Management**: Update verse, reference, and biography text.
- **Menu Management**: CRUD operations for the site's navigation menu.

### Dynamic Rendering
- `main.js` now dynamically renders the Navigation, Sidebar (Latest Release), Hero, Works, and About sections using data from `data.js`.

## Recent Changes
- **Removed Blog Management**: Blog creation was removed from the admin dashboard to focus on core portfolio content and navigation.
- **SPA Logic Refinement**: Centralized navigation rendering to ensure consistency between the sidebar and home page buttons.
