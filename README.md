# 📘 Kindle Auto Translator

A Chrome extension that automatically translates Japanese text from Kindle Cloud Reader to Simplified Chinese using OpenAI's GPT-4o mini API.

## ✨ Features

- 🌐 **Automatic Translation**: Translates Japanese Kindle pages to Simplified Chinese
- ⌨️ **Keyboard Shortcut**: Quick access via `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)
- 🎨 **Beautiful Overlay UI**: Easy-to-read translation display with smooth animations
- 🔒 **Secure Storage**: Your OpenAI API key is stored locally and securely
- 🎯 **Smart Text Extraction**: Focuses on reading content, avoiding navigation elements
- 🚀 **Fast & Efficient**: Uses GPT-4o mini for quick, cost-effective translations

## 📋 Requirements

- **Google Chrome** (or Chromium-based browser like Edge, Brave, etc.)
- **OpenAI API Key** - Get one from [platform.openai.com](https://platform.openai.com/api-keys)
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

### Option 2: Package as CRX (Optional)

For a more permanent installation, you can package the extension:

1. Go to `chrome://extensions/`
2. Click "Pack extension"
3. Select the extension directory
4. Install the generated `.crx` file

## 🔧 Setup

1. **Get an OpenAI API Key**
   - Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Sign in or create an account
   - Click "Create new secret key"
   - Copy the key (starts with `sk-...`)

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
- Keys never transmitted except to OpenAI's API
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
- Host permissions for Kindle domains and OpenAI API

### API Usage
- **Model**: GPT-4o mini (cost-effective, fast)
- **Temperature**: 0.3 (balanced between accuracy and creativity)
- **Max tokens**: 4000 (handles long pages)

## 💰 Cost Estimation

GPT-4o mini is very affordable:
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens
- Average Kindle page: ~500-1000 tokens
- **Cost per page**: Less than $0.001 (fraction of a cent)

## 🐛 Troubleshooting

### Translation not working?

1. **Check you're on a Kindle page**
   - Must be on `read.amazon.co.jp` or `read.amazon.com`
   - Extension only works on actual book pages, not the library

2. **Verify API key**
   - Click extension icon
   - Click "Show Key" to verify it's correct
   - Make sure it starts with `sk-`
   - Check your OpenAI account has available credits

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

### API quota exceeded?

- Check your OpenAI account balance
- Verify you're within your usage limits
- Consider adding payment method if using free tier

## 🔄 Customization

### Change Target Language
Edit `content.js`, line 334:
```javascript
content: "You are a professional Japanese to Chinese translator..."
```
Change to your desired language pair.

### Change Keyboard Shortcut
Edit `manifest.json`, lines 27-32:
```json
"suggested_key": {
  "default": "Ctrl+Shift+T",
  "mac": "Command+Shift+T"
}
```

### Adjust Translation Display Time
Edit `content.js` to modify overlay and translation box behavior.

## 🤝 Contributing

This is a local extension for personal use, but feel free to:
- Fork the repository
- Suggest improvements
- Report bugs
- Share with friends!

## 📜 License

This project is for personal use. OpenAI API usage is subject to OpenAI's terms of service.

## ⚠️ Disclaimer

- This extension is not affiliated with Amazon or Kindle
- You are responsible for your OpenAI API usage and costs
- Respect copyright and only translate books you own
- Translation quality depends on the GPT-4o mini model

## 🎯 Future Enhancements

Potential features to add:
- [ ] Support for more language pairs
- [ ] Save translations to local storage
- [ ] Export translations to file
- [ ] Adjustable font size and styling
- [ ] Translation history
- [ ] Batch translate multiple pages
- [ ] Support for other e-reader platforms

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Check Chrome console for error messages
3. Verify OpenAI API key and account status

---

**Enjoy your Japanese reading with instant Chinese translations!** 📚✨

