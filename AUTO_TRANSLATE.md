# 🎉 Auto-Translate Feature Guide

## ✨ New Feature: Automatic Text Detection & Translation

Your Kindle Auto Translator now has **TWO translation modes**!

---

## 📖 **Two Translation Modes**

### **Mode 1: Full Page Translation** (Existing)
- Press `Cmd+Shift+T` (Mac) or `Ctrl+Shift+T` (Windows/Linux)
- Translates the **entire page**
- Shows result in a **large centered modal**
- User-triggered, on-demand

### **Mode 2: Auto Text Snippets** (NEW!)
- **Automatically detects** Japanese text on the page
- Translates **up to 5 text snippets** automatically
- Shows small **blue popups** near each text
- Updates when you turn pages
- **No manual action needed!**

---

## 🚀 **How Auto-Translation Works**

### **Automatic Detection:**
1. Extension loads when you open a Kindle book
2. Waits 2 seconds for page to load
3. Scans for Japanese text (hiragana, katakana, kanji)
4. Finds up to 5 text snippets on the page
5. Translates each snippet to Chinese
6. Shows translation in small blue popup

### **Page Turn Detection:**
- MutationObserver watches for DOM changes
- When you turn pages, waits 1 second for page to stabilize
- Automatically translates new text
- Old popups are removed

### **Smart Filtering:**
- Only translates text with 10+ characters
- Limits each snippet to 500 characters
- Skips navigation, menus, and UI elements
- Only processes Japanese text
- Remembers what's already translated (no duplicates)

---

## 🎨 **Auto-Popup Features**

### **Visual Design:**
- 🔵 Blue background (rgba 42, 82, 152)
- 📍 Positioned near the original text
- 🎯 Shows translation + original snippet
- 💫 Smooth fade in/out animations

### **Interaction:**
- **Click** popup to dismiss immediately
- **Auto-dismiss** after 10 seconds
- Multiple popups can show at once (up to 5)

### **Example Popup:**
```
┌────────────────────────────┐
│ 这是翻译的中文文本           │
│ ────────────────────────   │
│ 原文: これは日本語のテキスト... │
└────────────────────────────┘
```

---

## ⚙️ **Configuration**

You can customize the auto-translation behavior by editing `content.js` (line 446):

```javascript
const AUTO_TRANSLATE_CONFIG = {
  enabled: true,          // Set to false to disable auto-translation
  minTextLength: 10,      // Minimum characters to trigger
  maxTextLength: 500,     // Maximum characters per snippet
  debounceDelay: 1000,    // Wait time after page change (ms)
  popupClass: "kt-auto-translate-popup"
};
```

### **To Disable Auto-Translation:**
Change line 447 to:
```javascript
enabled: false,
```

### **To Translate More Text:**
Change line 609 to increase max snippets:
```javascript
const maxNodes = 10; // Increase from 5 to 10
```

---

## 🔄 **How Both Modes Work Together**

| Feature | Full Page Mode | Auto-Snippet Mode |
|---------|---------------|-------------------|
| **Trigger** | Manual (hotkey) | Automatic |
| **Scope** | Entire page | Top 5 snippets |
| **Display** | Large modal | Small popups |
| **Duration** | User dismisses | 10 sec auto-dismiss |
| **Position** | Centered | Near text |
| **Background** | Gradient overlay | Transparent |

### **Intelligent Coordination:**
- Auto-translate **pauses** when you use full-page mode
- Both use the same Google Gemini API
- Both share the same API key
- Rate limiting prevents API overuse (500ms delay between snippets)

---

## 💡 **Usage Tips**

### **For Best Results:**

1. **Let Pages Load**
   - Wait 2-3 seconds after opening a book
   - Auto-translation triggers after stabilization

2. **Page Turning**
   - Turn page normally in Kindle
   - Translation updates automatically after 1 second
   - Old popups are removed

3. **Manual Override**
   - Press `Cmd/Ctrl+Shift+T` anytime for full page
   - Auto-popups won't interfere

4. **Click to Dismiss**
   - Click any popup to remove it
   - They auto-dismiss after 10 seconds anyway

5. **Console Feedback**
   - Press F12 to see console logs
   - Watch for "[Auto Translate]" messages
   - Useful for debugging

---

## 🐛 **Troubleshooting**

### **Auto-translation not working?**

**Check these things:**

1. ✅ **API key is set**
   - Click extension icon
   - Verify key is saved
   - Must start with "AIza"

2. ✅ **On Kindle page**
   - Must be on `read.amazon.co.jp` or `read.amazon.com`
   - Must be viewing a book, not library

3. ✅ **Page has Japanese text**
   - Auto-translate only detects Japanese (hiragana, katakana, kanji)
   - Minimum 10 characters per snippet

4. ✅ **Extension is enabled**
   - Check line 447 in `content.js`
   - Should be `enabled: true`

5. ✅ **Check console**
   - Press F12
   - Look for "[Auto Translate]" messages
   - Should see "Feature enabled" and "Initial page load, translating..."

### **Popups in wrong position?**

- Refresh the page
- Kindle's layout can be tricky
- Popups use `getBoundingClientRect()` which is usually accurate

### **Too many/few popups?**

**To show more snippets:**
Edit line 609 in `content.js`:
```javascript
const maxNodes = 10; // Change from 5 to 10
```

**To show fewer:**
```javascript
const maxNodes = 2; // Show only 2 snippets
```

### **Translations are slow?**

- Rate limiting adds 500ms delay between each snippet
- This prevents hitting API limits
- To speed up, reduce delay at line 726:
```javascript
await new Promise(resolve => setTimeout(resolve, 200)); // Reduced from 500
```

---

## 📊 **API Usage**

### **Cost Estimation:**

With **auto-translation enabled:**
- 5 snippets per page
- Average 200 characters per snippet
- 1000 characters total per page

**Free Tier (Gemini 2.0 Flash):**
- 1,500 requests per day
- Each snippet = 1 request
- **300 page turns per day** within free tier
- Perfect for normal reading!

### **Rate Limiting:**
- 500ms delay between snippets
- Prevents overwhelming the API
- Total time: ~2.5 seconds for 5 snippets

---

## 🎯 **Best Use Cases**

### **Ideal For:**
✅ Casual reading with occasional translations
✅ Learning Japanese (see translations as you read)
✅ Quick comprehension checks
✅ Reading dialogue-heavy text
✅ Getting gist of each paragraph

### **Use Full-Page Mode For:**
✅ Detailed text you want to study
✅ Complex passages
✅ When you want to copy/save translation
✅ When you need to see everything at once

---

## 🔐 **Privacy & Security**

- ✅ All translation happens via Google Gemini API
- ✅ No data sent to any other servers
- ✅ API key stored locally in Chrome
- ✅ Extension only runs on Kindle pages
- ✅ No analytics or tracking

---

## 🚀 **Quick Start**

1. **Install/Reload Extension**
   - Go to `chrome://extensions/`
   - Click refresh icon on your extension

2. **Set API Key** (if not already set)
   - Click extension icon
   - Enter Google API key
   - Click "Save"

3. **Open Kindle Book**
   - Go to read.amazon.co.jp
   - Open any Japanese book

4. **Wait & Watch**
   - After 2 seconds, blue popups will appear
   - Each shows Chinese translation
   - Click to dismiss, or wait 10 seconds

5. **Turn Pages**
   - Turn page normally
   - New translations appear automatically

---

## 🎊 **You Now Have Both!**

**Quick Snippets (Auto):**
- 🤖 Automatic
- 🔵 Small blue popups
- ⚡ Fast, on-demand
- 📍 Near text

**Full Page (Manual):**
- ⌨️ `Cmd/Ctrl+Shift+T`
- 🎨 Large centered modal
- 📖 Complete page translation
- 💾 Can copy/save

---

**Enjoy your enhanced reading experience!** 📚✨

*Both features use Google Gemini 2.0 Flash (experimental) for fast, high-quality translations.*

