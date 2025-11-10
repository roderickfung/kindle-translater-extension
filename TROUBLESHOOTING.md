# 🔧 Gemini API Troubleshooting Guide

## ❌ Error: "models/gemini-1.5-flash is not found"

This error occurs when the model name doesn't match what's available in the Gemini API.

---

## ✅ **SOLUTION: I've Updated the Code**

I've changed the model from `gemini-1.5-flash` to `gemini-pro` which is the most stable and widely available.

### **What Changed:**
```javascript
// OLD (doesn't work):
const apiUrl = `...v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

// NEW (should work):
const apiUrl = `...v1beta/models/gemini-pro:generateContent?key=${key}`;
```

---

## 🧪 **Test Your API Key**

Before using the extension, let's verify your API key works:

### **Option 1: Test in Terminal/Command Line**

**Mac/Linux:**
```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "こんにちは"
      }]
    }]
  }'
```

**Windows (PowerShell):**
```powershell
$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "こんにちは"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY_HERE" -Method Post -Body $body -ContentType "application/json"
```

Replace `YOUR_API_KEY_HERE` with your actual API key.

### **Option 2: Test in Browser Console**

1. Open any webpage
2. Press `F12` to open Developer Tools
3. Go to Console tab
4. Paste this code (replace YOUR_API_KEY with your actual key):

```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: 'こんにちは' }]
    }]
  })
})
.then(r => r.json())
.then(data => console.log('Success!', data))
.catch(err => console.error('Error:', err));
```

---

## 🎯 **Available Model Names**

Different model names work depending on your API key type:

| Model Name | API Version | Availability |
|------------|-------------|--------------|
| `gemini-pro` | v1beta | ✅ Most stable, widely available |
| `gemini-1.5-pro-latest` | v1beta | ⚠️ Requires newer API key |
| `gemini-1.5-flash-latest` | v1beta | ⚠️ Requires newer API key |
| `gemini-1.5-flash` | v1beta | ❌ Usually doesn't work |
| `gemini-1.5-flash-002` | v1beta | ⚠️ May work with some keys |

**I've set it to `gemini-pro` which should work for most users.**

---

## 🔑 **API Key Types**

There are two types of Google API keys:

### **Type 1: Google AI Studio (Recommended)**
- Get from: https://aistudio.google.com/app/apikey
- Format: Starts with `AIza...`
- ✅ Works with: `gemini-pro`, `gemini-1.5-pro-latest`
- ✅ Simpler setup
- ✅ Free tier available

### **Type 2: Google Cloud Console**
- Get from: https://console.cloud.google.com/
- Requires: Project setup, billing enabled
- More complex setup

**Make sure you're using a Google AI Studio key!**

---

## 📋 **Step-by-Step: Getting the Right Key**

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey

2. **Create API Key**
   - Click "Create API Key"
   - Select "Create API key in new project" (easiest)

3. **Copy the Key**
   - Copy the entire key (starts with `AIza...`)
   - It should be 39 characters long

4. **Test the Key**
   - Use one of the test methods above
   - Make sure it returns a success response

5. **Add to Extension**
   - Click extension icon
   - Paste the key
   - Click "Save API Key"

---

## 🐛 **Common Errors & Fixes**

### **404 Error: Model Not Found**
✅ **FIXED** - Updated to use `gemini-pro`
- Reload the extension
- Test again

### **400 Error: Bad Request**
**Cause:** Invalid API key or wrong format
**Fix:**
- Verify key starts with `AIza`
- Get a new key from Google AI Studio
- Make sure you copied the entire key

### **403 Error: Permission Denied**
**Cause:** API not enabled or restricted key
**Fix:**
- Go to https://aistudio.google.com/
- Create a new API key in a new project
- Make sure Gemini API is enabled

### **429 Error: Rate Limit**
**Cause:** Too many requests
**Fix:**
- Wait a few minutes
- Free tier: 15 requests/minute, 1,500/day
- Reduce translation frequency

---

## 🔄 **Alternative Models (If Needed)**

If `gemini-pro` doesn't work, you can try these alternatives:

### **Option A: Try gemini-1.5-pro-latest**

Edit `content.js` line 325:
```javascript
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${key}`;
```

### **Option B: Try gemini-1.5-flash-002**

Edit `content.js` line 325:
```javascript
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${key}`;
```

### **Option C: Use v1 API instead of v1beta**

Edit `content.js` line 325:
```javascript
const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${key}`;
```

---

## 🧪 **Debugging Checklist**

Before reporting issues, verify:

- [ ] API key starts with `AIza`
- [ ] API key is 39 characters long
- [ ] Got key from https://aistudio.google.com/app/apikey
- [ ] Tested key with curl/browser console (see above)
- [ ] Extension is reloaded after changes
- [ ] Kindle page is fully loaded
- [ ] Browser console shows no other errors (F12)

---

## 📊 **Check Your API Status**

Visit these URLs to check your API status:

1. **Google AI Studio Dashboard**
   - https://aistudio.google.com/
   - See your API usage and limits

2. **Test API Directly**
   - Use the test commands above
   - Verify you get a valid response

---

## 💡 **What to Try Next**

1. **First: Reload Extension**
   ```
   1. Go to chrome://extensions/
   2. Click refresh icon on Kindle Auto Translator
   3. Test translation again
   ```

2. **If Still Failing: Test Your Key**
   - Use the curl command above
   - Check what error you get
   - Report back the exact error message

3. **If Key Works But Extension Doesn't:**
   - Open browser console (F12)
   - Try translation
   - Look for error messages
   - Share the console output

---

## 📞 **Need More Help?**

If it still doesn't work, please provide:

1. ✅ Where you got your API key (Google AI Studio or Cloud Console?)
2. ✅ First 4 characters of your key (e.g., "AIza")
3. ✅ Result from the curl test above
4. ✅ Any console errors (press F12 in Chrome)
5. ✅ What model name you're trying to use

---

## ✅ **Expected Success**

If everything works, you should see:

1. ✅ Extension loads without errors
2. ✅ Click translate or press `Cmd+Shift+T`
3. ✅ See "Translating..." overlay
4. ✅ Translation appears in beautiful modal
5. ✅ No error messages

---

**Current Settings:**
- Model: `gemini-pro`
- API Version: `v1beta`
- Endpoint: `generativelanguage.googleapis.com`

**This should work with most Google AI Studio API keys!**

