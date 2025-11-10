# 📘 Kindle Auto Translator (Google Gemini)

A Chrome extension that automatically translates Japanese text from Kindle Cloud Reader to Simplified Chinese using Google's Gemini 1.5 Flash API.

## ✨ Features

- 🌐 **Automatic Translation**: Translates Japanese Kindle pages to Simplified Chinese
- ⌨️ **Keyboard Shortcut**: Quick access via `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)
- 🎨 **Beautiful Overlay UI**: Easy-to-read translation display with smooth animations
- 🔒 **Secure Storage**: Your Google API key is stored locally and securely
- 🎯 **Smart Text Extraction**: Focuses on reading content, avoiding navigation elements
- 🚀 **Fast & Free**: Uses Gemini 1.5 Flash - generous free tier!

## 📋 Requirements

- **Google Chrome** (or Chromium-based browser like Edge, Brave, etc.)
- **Google API Key** - Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Active internet connection

## 🚀 Installation

### Option 1: Load as Unpacked Extension (Development)

1. **Download the extension files**
   - Clone or download this repository to your local machine

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Or click the menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `kindle-auto-translate` folder
   - The extension should now appear in your extensions list

5. **Pin the extension** (optional)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Kindle Auto Translator" and click the pin icon

## 🔧 Setup

1. **Get a Google API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key (starts with `AIza...`)

2. **Configure the extension**
   - Click the extension icon in Chrome toolbar
   - Paste your API key in the input field
   - Click "💾 Save API Key"
   - You'll see a success message when saved

3. **You're ready!** 🎉

## 📖 How to Use

1. **Navigate to Kindle Cloud Reader**
   - Go to [read.amazon.co.jp](https://read.amazon.co.jp) or [read.amazon.com](https://read.amazon.com)
   - Open a Japanese book

2. **Trigger Translation**
   
   **Method 1: Keyboard Shortcut** (Recommended)
   - Press `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)
   
   **Method 2: Extension Popup**
   - Click the extension icon
   - Click "🌐 Translate Current Page"

3. **View Translation**
   - A loading overlay will appear while extracting text
   - The translation will display in a beautiful overlay
   - Close by clicking the ✕ button or pressing `Esc`

## 🎨 Features Breakdown

### Smart Text Extraction
The extension intelligently extracts text from the Kindle reading area while avoiding:
- Navigation menus
- Headers and footers
- Hidden elements
- Script and style tags

### Beautiful UI
- **Loading Overlay**: Shows translation progress
- **Translation Box**: 
  - Centered modal with gradient background
  - Easy-to-read typography
  - Scrollable content for long texts
  - Close button and ESC key support
  - Click outside to dismiss

### Security
- API keys stored in Chrome's local storage (encrypted by browser)
- Keys never transmitted except to Google's API
- Masked display in settings to prevent shoulder surfing
- Toggle visibility option for verification

## 🛠️ Technical Details

### File Structure
```
kindle-auto-translate/
├── manifest.json       # Extension configuration
├── background.js       # Service worker for commands & messaging
├── content.js         # Main translation logic (runs on Kindle pages)
├── popup.html         # Extension popup UI
├── popup.js           # Popup functionality
└── README.md          # This file
```

### Permissions Explained
- `activeTab`: Access current tab to inject translation UI
- `scripting`: Execute scripts on Kindle pages
- `storage`: Store API key securely
- Host permissions for Kindle domains and Google Gemini API

### API Usage
- **Model**: Gemini 1.5 Flash (fast, free tier available)
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Temperature**: 0.3 (balanced between accuracy and creativity)
- **Max tokens**: 4000 (handles long pages)

## 💰 Cost Estimation

**Google Gemini 1.5 Flash - FREE Tier:**
- **15 requests per minute** (RPM) - Free
- **1 million tokens per day** - Free
- **1,500 requests per day** - Free

**For typical usage:**
- Average Kindle page: 500-1000 tokens
- You can translate **hundreds of pages per day for FREE!**
- Well within the free tier limits for personal use

**Paid tier** (if you exceed free limits):
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- Still very affordable: ~$0.0005 per page

## 🐛 Troubleshooting

### Translation not working?

1. **Check you're on a Kindle page**
   - Must be on `read.amazon.co.jp` or `read.amazon.com`
   - Extension only works on actual book pages, not the library

2. **Verify API key**
   - Click extension icon
   - Click "Show Key" to verify it's correct
   - Make sure it starts with `AIza`
   - Get a new key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. **Check browser console**
   - Right-click → Inspect → Console tab
   - Look for `[Kindle Translator]` messages
   - Any error messages will appear here

4. **Reload the extension**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the extension
   - Reload the Kindle page

### "No text found" error?

- Wait for the page to fully load
- Try clicking next/previous page and back
- Some pages may have images instead of text (manga, etc.)

### API errors?

- **403 Forbidden**: Make sure you've enabled the Gemini API in Google AI Studio
- **429 Rate Limit**: You've exceeded the free tier limits (wait or upgrade)
- **400 Bad Request**: Check your API key is valid

## 🔄 Customization

### Change Target Language
Edit `content.js`, line 333:
```javascript
text: `You are a professional Japanese to Chinese translator...`
```
Change to your desired language pair.

### Change Gemini Model
Edit `content.js`, line 323:
```javascript
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
```
You can use:
- `gemini-1.5-flash` (fastest, free tier)
- `gemini-1.5-pro` (most capable, paid)
- `gemini-2.0-flash-exp` (experimental)

### Change Keyboard Shortcut
Edit `manifest.json`, lines 27-32:
```json
"suggested_key": {
  "default": "Ctrl+Shift+T",
  "mac": "Command+Shift+T"
}
```

## 🎯 Advantages of Gemini API

✅ **Generous Free Tier** - 1,500 requests per day  
✅ **Fast Response** - Gemini 1.5 Flash is optimized for speed  
✅ **High Quality** - Excellent translation quality  
✅ **Easy Setup** - Simple API key from Google AI Studio  
✅ **No Credit Card** - Free tier doesn't require payment info  

## ⚠️ Disclaimer

- This extension is not affiliated with Amazon, Kindle, or Google
- You are responsible for your API usage
- Respect copyright and only translate books you own
- Translation quality depends on the Gemini model

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Check Chrome console for error messages
3. Verify Google API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

**Enjoy your Japanese reading with instant Chinese translations!** 📚✨

**Powered by Google Gemini 1.5 Flash**
