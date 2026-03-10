# SEO MUSICK - Project Blueprint

## Overview
SEO MUSICK is a personal portfolio website for Seo Eui-seung, a Bible Believer, Social Worker, and Music Maker. The site showcases his musical works and personal biography with a dynamic navigation system.

### Hero Layout Reversion & Slogan Management
- **Hero Design**: Reverted to the classic layout where "SEO MUSICK" is the primary title and the slogan is the subtitle. This restores the artist's brand identity while maintaining the mission statement.
- **Admin Slogan Control**: Added management for both English and Korean slogans in the Admin panel.
- **Full Persistence**: Admin changes to Hero (Eye Catch, Title, Slogan EN/KO) are saved to `localStorage` and reflected on the home screen.

## Visual Design & Branding
### Ocean & Harbor Palette (Inspired by `about.jpeg`)
- **Primary Color**: `#335C81` (Deep Harbor Blue) - Used for logos, primary headers, and active states.
- **Secondary Color**: `#5891AD` (Sky Blue) - Used for secondary elements and hover states.
- **Accent Color**: `#E9C46A` (Harbor Yellow) - Used for subtle highlights and call-to-action accents.
- **Muted Color**: `#64748B` (Cool Slate Gray) - Used for descriptions and less prominent text.
- **Backgrounds**: `#FFFFFF` (Pure White) and `#F8FAFC` (Cool Off-white/Gray) to maintain a clean, modern feel.
- **Borders**: `rgba(51, 92, 129, 0.12)` - Soft blue-tinted borders for subtle separation.

## Current Status
- Single-page application (SPA) architecture with hash-based section navigation.
- Content is fully data-driven using `data.js` and supports session-based persistence via `localStorage` for all sections.
- Admin dashboard allows managing Hero, Latest Release, Works, About, and Navigation Menu.
- Admin access is protected by a simple password.
- UI and system messages are fully localized in Korean.
- Home screen balances artist name and mission statement.

## Implemented Features
### Admin Security
- **Password Protection**: Access to `admin.html` requires a password (`seomusick2026`).
- **Session Auth**: Authorization is stored in `sessionStorage` to maintain access during the browser session.

### Dynamic Navigation
- **Menu Management**: The sidebar navigation and Hero CTA buttons are rendered dynamically from `NAV_DATA`.
- **Admin Control**: Menu items can be added, renamed, hidden, or deleted from the Admin page.

### Admin Dashboard (`admin.html`)
- **Localization**: All UI labels, buttons, and alert messages are translated into Korean.
- **Full Persistence**: Changes to Hero, Latest Release, Works, About, and Menu are saved to `localStorage` for immediate preview.
- **Hero Management**: Update eye-catch text, title, and slogans (EN/KO).
- **Latest Release Management**: Update the featured release in the sidebar (Title, Desc, Link).
- **Works Management**: CRUD operations for albums/works.
- **About Management**: Update verse, reference, and biography text.
- **Menu Management**: CRUD operations for the site's navigation menu. Supports both internal section navigation and external links.
- **Admin Access**: A dedicated (yet subtle) link added to the sidebar for easier management.

## Planned Changes
### Admin Page Activation & Menu Enhancement
- **Admin Link**: Add a subtle "Admin" link at the bottom of the sidebar to provide direct access to `admin.html`.
- **Enhanced Menu Management**: 
    - Update `admin.js` and `admin.html` to support external URLs in the menu management section.
    - Update `main.js` to handle both hash-based navigation (for internal sections) and direct links (for external targets like YouTube, Instagram, etc.).
    - This allows users to add menu items that behave exactly like the links in the "Works" section.


### Dynamic Rendering
- `main.js` now dynamically renders all sections using data from `data.js` (with `localStorage` overrides for real-time updates).

### Blog Embed Optimization
- **Full-Width Embed**: The blog (Tistory) is embedded using an `iframe` that fills the available container width.
- **Responsive Height**: The embed height is dynamically calculated to fit the viewport (`calc(100vh - 380px)`), with a minimum height of 600px to ensure readability.
- **Visual Polish**: The embed container features a subtle shadow, border, and rounded corners to match the site's modern classic aesthetic.
