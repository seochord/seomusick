# SEO MUSICK - Project Blueprint

## Overview
SEO MUSICK is a personal portfolio website for Seo Eui-seung, a Bible Believer, Social Worker, and Music Maker. The site showcases his musical works, blog posts, and personal biography.

## Current Status
- Single-page application (SPA) architecture with section-based navigation.
- Content is partially data-driven using `data.js`.
- Admin dashboard allows managing Hero, Latest Release, Works, About, and Blog sections.
- Styling is handled in `style.css` (global) and internal CSS in `index.html` and `admin.html`.

## Implemented Features
### Keyboard Shortcuts
- **Hard Refresh**: Pressing `Ctrl + 5` will force a hard refresh of the application.

### Social Media Integration
- **Sidebar Links**: YouTube and Instagram icons in the left sidebar.

### Admin Dashboard (`admin.html`)
- **Left Sidebar Navigation**: Redesigned for better usability.
- **Hero Management**: Update eye-catch text and title.
- **Latest Release Management**: Update the featured release in the sidebar (Title, Desc, Link).
- **Works Management**: CRUD operations for albums/works.
- **About Management**: Update verse, reference, and biography text.
- **Blog Management**: CRUD operations for blog links.

### Dynamic Rendering
- `main.js` now dynamically renders the Sidebar (Latest Release), Hero, Works, and About sections using data from `data.js`.

## Planned Changes
1. **Firebase Integration**: Move from `data.js` to Firestore for real-time updates and persistence without manual code changes.
2. **Authentication**: Secure the admin page with Firebase Auth.
3. **Image Upload**: Implement image uploading for album covers and about page.
