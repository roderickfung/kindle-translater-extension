# Quick Installation Guide - Google Gemini

## 📦 Install in 5 Minutes

### Step 1: Get Your Google API Key (2 min)
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. **Copy the key** - it starts with `AIza...`
5. Save it somewhere safe (you'll need it in Step 3)

> 💡 **Best Part**: Gemini 1.5 Flash has a generous FREE tier!
> - 1,500 requests per day - FREE
> - Perfect for personal use

### Step 2: Install the Extension (1 min)
1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select this folder (`kindle-auto-translate`)
5. ✅ Extension installed!

### Step 3: Add Your API Key (1 min)
1. Click the extension icon in your Chrome toolbar
   - (If you don't see it, click the puzzle piece 🧩 icon first)
2. Paste your API key in the text field
3. Click **💾 Save API Key**
4. Wait for the success message ✅

### Step 4: Test It! (1 min)
1. Go to https://read.amazon.co.jp/
2. Open any Japanese book
3. Press `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Win/Linux)
4. 🎉 Watch the magic happen!

---

## ⌨️ Using the Extension

### Two Ways to Translate:

**Method 1: Keyboard Shortcut** ⭐ Recommended
- Mac: `⌘ Cmd + Shift + T`
- Windows/Linux: `Ctrl + Shift + T`

**Method 2: Click the Button**
- Click the extension icon
- Click "🌐 Translate Current Page"

### Viewing the Translation:
- Translation appears in a beautiful overlay
- **Close it**: Press `Esc` or click the ✕ button
- Click outside the box to dismiss

---

## ❓ Common Questions

**Q: Is my API key safe?**  
A: Yes! It's stored locally in Chrome's encrypted storage. Never shared anywhere except directly with Google Gemini API.

**Q: How much does it cost?**  
A: **FREE!** Gemini 1.5 Flash offers:
- 15 requests per minute - FREE
- 1,500 requests per day - FREE
- 1 million tokens per day - FREE

Perfect for personal use. You can translate hundreds of pages per day without paying!

**Q: Does it work offline?**  
A: No, it needs internet to access the Google Gemini API.

**Q: Can I use it on other websites?**  
A: Currently designed for Kindle Cloud Reader only. It works on:
- read.amazon.co.jp (Japanese site)
- read.amazon.com (International site)

**Q: Can I translate to other languages?**  
A: Yes! Edit the system prompt in `content.js` to change the target language.

**Q: Why isn't it working?**  
A: Check:
- ✅ You're on a Kindle book page (not the library)
- ✅ Your API key is saved correctly  
- ✅ Your API key starts with "AIza"
- ✅ The page has finished loading

---

## 🎯 Pro Tips

1. **Wait for page load**: Let the book page fully load before translating
2. **Free tier is generous**: 1,500 requests per day is plenty for most users
3. **Check your usage**: Monitor at [Google AI Studio](https://aistudio.google.com/)
4. **Pin the extension**: Click the puzzle icon 🧩 and pin for easy access

---

## 🆘 Need Help?

1. Check the full [README.md](README.md) for detailed troubleshooting
2. Open Chrome DevTools (F12) and check Console for errors
3. Try reloading the extension and the Kindle page
4. Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

**Happy Reading!** 📚✨

**Powered by Google Gemini 1.5 Flash - FREE tier available!**
