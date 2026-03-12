# SEO MUSICK - Project Blueprint

## Overview
SEO MUSICK is a personal portfolio website for Seo Eui-seung, a Bible Believer, Social Worker, and Music Maker. The site showcases his musical works and personal biography with a dynamic navigation system.

### Hero Layout Reversion & Slogan Management
- **Hero Design**: The hero section has been streamlined for a cleaner, more focused look. The "SEO MUSICK" title has been removed to prioritize the visual content and mission statement.
- **Slogan Position**: The mission statement ("Music of Faith for the Broken") is now positioned **above** the YouTube video, serving as a primary introduction to the visual content.
- **YouTube Integration**: The home screen features a dynamic YouTube video embed at its center, showcasing the latest content. 
    - **Removal of Labels**: "Latest from YouTube" and "View Channel" labels have been removed from below the video to minimize visual clutter.
    - **Surgical Alignment**: The video dimensions and the slogan text above it are now perfectly aligned at a maximum width of `720px`, creating a balanced, centered column.
- **Social Media Expansion**: Added **TikTok** (`@seomusick`) to the sidebar social links alongside YouTube and Instagram for broader engagement.
- **Backend Security**: Moved YouTube Data API calls to **Firebase Cloud Functions** to hide the API Key from the frontend. The key is now stored securely in Firebase Secrets.
- **Admin Slogan & YouTube Control**: Added management for both English and Korean slogans, and the YouTube Playlist ID in the Admin panel.
- **Full Persistence**: Admin changes to Hero (Eye Catch, Title, Slogan EN/KO, YouTube Playlist ID) are saved to `localStorage` and reflected on the home screen.

## Visual Design & Branding
...

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
- Home screen balances a minimal eye-catch and the artist's mission statement.

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
### YouTube API Security Enhancement (Firebase Functions Proxy)
- **Current Issue**: Calling YouTube API directly from the client requires an API Key in `main.js`, which is a security risk.
- **Solution**: Use Firebase Cloud Functions as a proxy.
- **Implementation**:
    - Frontend calls the `getLatestVideo` Cloud Function with `playlistId`.
    - Cloud Function retrieves the `API_KEY` from Firebase Secrets.
    - Cloud Function calls the YouTube Data API and returns the video ID and title.
- **Benefits**: The API Key is never exposed to the client, and we can add additional logic (like caching or rate limiting) in the backend.

### Works Management Enhancement (Images & Links)
- **Album Art Integration**: Add an `image` field to each work item in `data.js` and `admin.js`.
- **Admin Photo Upload/Path**: Update the admin page (`admin.html` and `admin.js`) to allow entering an image path (or eventually uploading) for each work.
- **Visual Grid in Admin**: Display a small thumbnail of the album art in the admin panel's works list for better visual management.
- **Enhanced Display in Works Page**:
    - Update `main.js` and `index.html` to display the album art alongside the work details.
    - The layout will be adjusted to accommodate a square or rectangular thumbnail (approx. 100-120px) for each entry.
    - Ensure that clicking the image (or the item) navigates to the provided external link.
- **Responsive Design**: Ensure the album art scales gracefully on mobile devices.

### Dynamic Rendering
- `main.js` now dynamically renders all sections using data from `data.js` (with `localStorage` overrides for real-time updates).

### Blog Embed Optimization
- **Full-Width Embed**: The blog (Tistory) is embedded using an `iframe` that fills the available container width.
- **Responsive Height**: The embed height is dynamically calculated to fit the viewport (`calc(100vh - 380px)`), with a minimum height of 600px to ensure readability.
- **Visual Polish**: The embed container features a subtle shadow, border, and rounded corners to match the site's modern classic aesthetic.
