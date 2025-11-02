# Icon Requirements for Chrome Extension

Chrome extensions need icons in various sizes. Since we can't create actual image files here, follow these instructions to add icons:

## Required Icon Sizes
- 16x16 - Extension toolbar icon
- 32x32 - Windows taskbar icon  
- 48x48 - Extensions management page
- 128x128 - Chrome Web Store & installation

## Quick Solution: Use an Icon Generator

### Option 1: Use a Free Icon Generator Website
1. Go to: https://www.favicon-generator.org/
2. Create a simple icon with:
   - Background: Blue/Purple gradient (#667eea to #764ba2)
   - Text: "本" or "📘" or "JA→中"
   - Save all sizes (16, 32, 48, 128)

### Option 2: Use Online Tools
- https://www.adobe.com/express/create/logo (Adobe Express - Free)
- https://www.canva.com/ (Canva - Free tier)
- https://www.figma.com/ (Figma - Free)

### Option 3: Simple Emoji Icons
Create solid color PNGs with emoji:
- 📘 (Book emoji)
- 🌐 (Globe emoji)  
- 翻 (Chinese character for translate)

## Icon Design Tips
- **Colors**: Use #667eea (purple-blue) for consistency with popup
- **Simple**: Keep it minimal and recognizable at 16x16
- **Contrast**: Use white icon on colored background
- **Metaphor**: Book, translation arrows, or Japanese/Chinese characters

## Suggested Design Concepts

### Concept 1: Book Icon
```
📘 Simple book emoji
Background: #667eea
```

### Concept 2: Language Arrows
```
JP → 中
White text on #667eea background
```

### Concept 3: Translation Symbol
```
"A↔あ" or "本"
White on purple-blue gradient
```

## File Structure (once you have icons)
```
kindle-auto-translate/
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── ...
```

## Update manifest.json
Once you have the icons, add this to your manifest.json:

```json
{
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_title": "Kindle Translator",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  }
}
```

## Temporary Solution
Until you create proper icons, Chrome will use a default puzzle piece icon. The extension will work perfectly fine without custom icons - they're just for aesthetics!

## Free Icon Resources
- https://www.flaticon.com/ (Free with attribution)
- https://fonts.google.com/icons (Material Icons - Free)
- https://heroicons.com/ (Open source)
- https://www.iconfinder.com/ (Free & paid)

---

**Note**: The extension works perfectly without custom icons. Add them when you have time to make it look more professional!

