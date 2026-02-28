# SEO MUSICK - Project Blueprint

## Overview
SEO MUSICK is a personal portfolio website for Seo Eui-seung, a Bible Believer, Social Worker, and Music Maker. The site showcases his musical works, blog posts, and personal biography.

## Current Status
- Single-page application (SPA) architecture with section-based navigation.
- All content is currently hardcoded in `index.html`.
- Styling is handled in `index.html` (internal CSS).
- Basic navigation script is in `index.html`.

## Planned Changes: Admin Integration
To make the site manageable without manual HTML editing, we will transition to a data-driven approach using Firebase.

### Steps
1. **Initialize Firebase**: Setup Firestore to store `works`, `blog`, and `about` data.
2. **Data Migration**: Move current hardcoded content to Firestore.
3. **Dynamic Rendering**: Update `main.js` to fetch data from Firestore and render components using Web Components or template literals.
4. **Admin Dashboard (`admin.html`)**:
    - Build a secure dashboard to manage content.
    - Implement CRUD (Create, Read, Update, Delete) operations for Works and Blog.
    - Implement Update operation for About and Hero sections.
5. **Authentication**: (Optional but recommended) Add Firebase Auth to protect the admin page.

## Implemented Features
### Keyboard Shortcuts
- **Hard Refresh**: Pressing `Ctrl + 5` will force a hard refresh of the application, clearing the cache and reloading all assets from the server.

## Data Structure (Draft)
- `works`: Collection of { year, genre, title, desc, credit, link }
- `activities`: Collection of { period, name, desc, award }
- `blog`: Collection of { tag, title, date, url }
- `about`: Object with { verse, verseRef, content[] }
- `hero`: Object with { eye, title, pillars[] }
