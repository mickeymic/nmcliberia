# National Muslim Council of Liberia (NMCL) Website

A modern, responsive static website for the National Muslim Council of Liberia built with HTML, CSS, and vanilla JavaScript.

## Features

- **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices
- **Dynamic Content**: All content managed through `content.json` file
- **Hero Slider**: 10-slide automatic slider with navigation controls
- **News Ticker**: Horizontal scrolling news ticker
- **Modern UI**: Professional design with shadows, rounded corners, and smooth transitions
- **Boxed Layout**: Max-width 1200px, centered on page

## File Structure

```
nmcliberia/
├── assets/
│   ├── thumb1.jpg
│   ├── thumb2.jpg
│   ├── ...
│   └── thumb10.jpg
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
├── content.json
└── README.md
```

## Content Management

All website content is stored in `content.json`. To update the website:

1. Open `content.json`
2. Modify the desired content (hero slides, news ticker, main content)
3. Save the file
4. Refresh the website

### Content Structure

- **heroSlides**: Array of 10 slide objects with title, description, and image
- **newsTicker**: Array of news items for the scrolling ticker
- **mainContent**: About section content, mission, and vision
- **navigation**: Main navigation menu items
- **footer**: Footer text

## Features Details

### Header Sections
- **Top Header**: Gray background bar with welcome message
- **Main Header**: Logo (NMCL) and navigation menu
- **News Ticker**: Horizontal scrolling news below main header

### Hero Section
- 10 slides with automatic rotation (5 seconds)
- Navigation arrows and dot indicators
- Pause on hover functionality
- Keyboard navigation support (arrow keys)

### Content Sections
- **About**: Organization information, mission, and vision
- **News**: Latest news and announcements
- **Contact**: Contact information and address

### Responsive Breakpoints
- Desktop: 1200px max-width
- Tablet: 768px and below
- Mobile: 480px and below

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Colors
Primary colors can be modified in `css/style.css`:
- Primary: `#3498db` (blue)
- Dark: `#2c3e50` (dark blue-gray)
- Light: `#f8f9fa` (light gray)

### Fonts
The website uses system fonts for optimal performance:
- `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`

### Images
Replace placeholder images in the `assets/` folder:
- `thumb1.jpg` through `thumb10.jpg` for hero slides
- Recommended size: 300x300px
- Format: JPG, PNG, or WebP

## License

© 2026 National Muslim Council of Liberia. All rights reserved.
