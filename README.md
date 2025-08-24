# Laluvan - Artist Website

## Features

### Design & Aesthetics
- **Dark Color Palette**: Black and grey tones with white/pale grey text for strong contrast
- **Dark Electronic Style**: Gothic-inspired typography using Playfair Display and Inter fonts
- **Atmospheric Elements**: Smoke overlays, static textures, and glitch effects
- **Minimalist Layout**: Clean, professional design with immersive hero sections

### Interactive Elements
- **Glitch Text Effects**: Animated title with atmospheric overlays
- **Parallax Scrolling**: Subtle background movement for cinematic feel
- **Hover Animations**: Glowing effects and subtle transformations
- **Smooth Transitions**: Fade-in animations and smooth scrolling navigation

### Sections
1. **Hero**: Large artist name with haunting tagline and atmospheric video background
2. **Music**: Track cards with play/download functionality for Void Echoes, Shadow Dance, and Digital Ruins
3. **Merch**: Dark-styled product cards with hover effects for T-shirts, vinyl, and posters
4. **Contact**: Contact form and social media links

### Technical Features
- **Responsive Design**: Mobile-first approach with hamburger navigation
- **Performance Optimized**: Throttled scroll events and efficient animations
- **Accessibility**: Keyboard navigation and semantic HTML
- **Cross-browser Compatible**: Modern CSS with fallbacks
- **Supabase Integration**: Secure mailing list signup with database storage

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)
- Supabase account and project (for mailing list functionality)

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. For development, use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### File Structure
```
new_music/
├── index.html              # Main HTML structure
├── styles.css              # CSS styling and animations
├── script.js               # JavaScript functionality
├── config.js               # Supabase configuration
├── env.example             # Environment variables template
├── SUPABASE_SETUP.md       # Supabase integration guide
└── README.md               # This documentation
```

## Customization

### Colors
The website uses a dark theme with these primary colors:
- **Background**: `#0a0a0a` (Very dark grey)
- **Secondary**: `#1a1a1a` (Dark grey)
- **Accent**: `#a1a1aa` (Medium grey)
- **Text**: `#e8e8e8` (Light grey)
- **White**: `#ffffff` (Pure white)

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body Text**: Inter (sans-serif, modern and readable)

### Adding Content
- **Music Tracks**: Edit the `.track-card` elements in `index.html`
- **Merchandise**: Modify the `.product-card` elements
- **Images**: Replace placeholder divs with actual image elements
- **Contact Info**: Update email and social media links

## Special Features

### Easter Eggs
- **Konami Code**: Press ↑↑↓↓←→←→BA for a special effect
- **Cursor Trail**: Subtle white dot follows your mouse
- **Random Glitches**: Occasional glitch effects on the title

### Keyboard Navigation
- **Arrow Keys**: Navigate between sections
- **Home/End**: Jump to top/bottom of page
- **Page Up/Down**: Scroll by viewport height

## Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

### Mobile Features
- Hamburger navigation menu with full-screen overlay
- Social media icons in mobile menu
- Optimized typography scaling
- Touch-friendly button sizes
- Simplified layouts for small screens

## Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## Music Integration

The website includes placeholder music players that can be easily integrated with:
- **Spotify**: Embed Spotify play buttons
- **SoundCloud**: Add SoundCloud widgets
- **Bandcamp**: Include Bandcamp players
- **Custom Players**: Implement HTML5 audio with custom controls

## Social Media Integration

The website includes social media icons for:
- Spotify
- Apple Music
- TikTok
- Instagram
- YouTube

These are displayed in the desktop header and mobile menu for easy access.

## Image Integration

Replace placeholder elements with actual images:
```html
<!-- Replace this -->
<div class="artwork-placeholder"></div>

<!-- With this -->
<img src="path/to/image.jpg" alt="Description" class="gallery-image">
```

## Performance Tips

- Optimize images for web (WebP format recommended)
- Compress audio files for faster loading
- Use CDN for external fonts and libraries
- Enable browser caching for static assets

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For questions or support, please contact:
- **Email**: contact@laluvan.com

## Future Enhancements

Potential features for future versions:
- Audio visualization with Web Audio API
- Interactive 3D elements with Three.js
- Dark mode toggle
- Language localization
- Blog/news section
- Tour dates integration
- Enhanced mailing list management
- Music streaming integration
- E-commerce functionality for merch
- Analytics dashboard for fan engagement

---

*"Soon.."* - Laluvan
