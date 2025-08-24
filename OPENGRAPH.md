# Open Graph Metadata Guide for Laluvan

This document explains the Open Graph metadata implementation for optimal social media sharing and SEO.

## Overview

Open Graph metadata allows social media platforms to display rich previews when your website is shared. This implementation includes:

- **Open Graph tags** for Facebook, LinkedIn, and other platforms
- **Twitter Card tags** for Twitter-specific optimization
- **Structured data** using Schema.org markup for search engines
- **Favicon and app icons** for various platforms

## Meta Tags Implemented

### Open Graph Tags (Facebook, LinkedIn, etc.)

```html
<!-- Basic Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://laluvan.com/">
<meta property="og:title" content="Laluvan - Dark Atmospheric Music">
<meta property="og:description" content="Experience the haunting sounds of Laluvan...">
<meta property="og:image" content="https://laluvan.com/images/og-image.jpg">

<!-- Image dimensions and alt text -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Laluvan - Dark atmospheric music artist">

<!-- Additional Open Graph -->
<meta property="og:site_name" content="Laluvan">
<meta property="og:locale" content="en_US">
```

### Twitter Card Tags

```html
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://laluvan.com/">
<meta property="twitter:title" content="Laluvan - Dark Atmospheric Music">
<meta property="twitter:description" content="Experience the haunting sounds of Laluvan...">
<meta property="twitter:image" content="https://laluvan.com/images/og-image.jpg">
<meta property="twitter:image:alt" content="Laluvan - Dark atmospheric music artist">
```

### SEO Meta Tags

```html
<meta name="description" content="Experience the haunting sounds of Laluvan...">
<meta name="keywords" content="Laluvan, dark electronic music, atmospheric ambient...">
<meta name="author" content="Laluvan">
<meta name="robots" content="index, follow">
```

### Favicon and App Icons

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
```

## Structured Data (Schema.org)

The website includes structured data for music artists using Schema.org markup:

```json
{
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "Laluvan",
    "description": "Dark atmospheric electronic music artist",
    "url": "https://laluvan.com",
    "genre": ["Dark Electronic", "Atmospheric Ambient", "Glitch Music"],
    "image": "https://laluvan.com/images/og-image.jpg",
    "sameAs": [
        "https://open.spotify.com/artist/laluvan",
        "https://music.apple.com/artist/laluvan",
        "https://www.instagram.com/laluvanmusic/",
        "https://www.tiktok.com/@laluvan",
        "https://www.youtube.com/@LaluvanMusic"
    ],
    "album": [
        {
            "@type": "MusicAlbum",
            "name": "Void Echoes",
            "description": "Atmospheric ambient with glitch textures"
        }
    ]
}
```

## Required Assets

### Open Graph Image

**File**: `/images/og-image.jpg`  
**Dimensions**: 1200 × 630 pixels  
**Format**: JPG or PNG  
**File size**: Under 8MB  

**Design Guidelines**:
- Include the Laluvan logo/name prominently
- Use dark atmospheric aesthetics matching the website
- Ensure text is readable at small sizes
- Avoid placing important elements near edges

### Favicon Files

- **favicon.ico** - 16×16, 32×32, 48×48 pixels (multi-size ICO)
- **favicon-16x16.png** - 16×16 pixels
- **favicon-32x32.png** - 32×32 pixels  
- **apple-touch-icon.png** - 180×180 pixels

## Customization Guide

### Update URLs

Replace `https://laluvan.com` with your actual domain in:
- `og:url`
- `twitter:url`
- `url` in structured data
- Social media links in structured data

### Update Social Media Links

Modify the `sameAs` array in structured data with actual social media URLs:

```json
"sameAs": [
    "https://open.spotify.com/artist/YOUR_SPOTIFY_ID",
    "https://music.apple.com/artist/YOUR_APPLE_ID",
            "https://www.instagram.com/laluvanmusic/",
    "https://www.tiktok.com/@YOUR_TIKTOK",
            "https://www.youtube.com/@LaluvanMusic"
]
```

### Update Music Information

Modify the album information in structured data to match your actual releases:

```json
"album": [
    {
        "@type": "MusicAlbum",
        "name": "Your Album Name",
        "description": "Your album description",
        "url": "https://your-domain.com/album-url"
    }
]
```

## Testing Tools

### Facebook Sharing Debugger
- URL: https://developers.facebook.com/tools/debug/
- Use to test Open Graph tags and refresh cached data

### Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- Test Twitter Card implementation

### Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- Validate structured data markup

### LinkedIn Post Inspector
- URL: https://www.linkedin.com/post-inspector/
- Test LinkedIn sharing appearance

## Best Practices

### Image Optimization
- Use high-quality images (1200×630 for Open Graph)
- Optimize file size for faster loading
- Include descriptive alt text
- Test appearance on various devices

### Content Guidelines
- Keep titles under 60 characters
- Keep descriptions under 160 characters
- Use relevant keywords naturally
- Ensure content matches the actual page

### Social Media Integration
- Update social media URLs regularly
- Monitor social media analytics
- A/B test different images and descriptions
- Keep content fresh and engaging

## Troubleshooting

### Common Issues

1. **Images not displaying**: Check image URL accessibility and dimensions
2. **Cached data**: Use Facebook Debugger to refresh cached content
3. **Missing tags**: Ensure all required Open Graph tags are present
4. **Structured data errors**: Validate JSON-LD markup with Google's tool

### Debugging Steps

1. Validate HTML markup
2. Check meta tag syntax
3. Test with social media debugging tools
4. Verify image accessibility
5. Check structured data validation

## Future Enhancements

Consider adding these features as your website grows:

- **Dynamic Open Graph tags** based on page content
- **Multiple image sizes** for different platforms
- **Video Open Graph tags** for music videos
- **Enhanced structured data** for events and merchandise
- **Social media analytics** integration

---

For questions about Open Graph implementation, refer to:
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/best-practices/)
