// Content script for Kindle Auto Translator
// Runs on Kindle Cloud Reader pages

console.log("[Kindle Translator] Content script loaded");

// Global state
let isTranslating = false;
let currentTranslationBox = null;

// ============================================================================
// UI FUNCTIONS
// ============================================================================

/**
 * Show loading overlay with message
 */
function showOverlay(message = "Processing...") {
  let overlay = document.getElementById("kt-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "kt-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.7)",
      color: "#fff",
      fontSize: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "2147483647", // Maximum z-index
      opacity: "0",
      transition: "opacity 0.3s ease",
      backdropFilter: "blur(4px)"
    });
    
    const messageDiv = document.createElement("div");
    messageDiv.id = "kt-overlay-message";
    Object.assign(messageDiv.style, {
      background: "rgba(0, 0, 0, 0.9)",
      padding: "30px 50px",
      borderRadius: "15px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
      textAlign: "center",
      maxWidth: "400px"
    });
    messageDiv.textContent = message;
    
    overlay.appendChild(messageDiv);
    document.body.appendChild(overlay);
    
    // Trigger reflow for transition
    setTimeout(() => overlay.style.opacity = "1", 10);
  } else {
    const messageDiv = document.getElementById("kt-overlay-message");
    if (messageDiv) {
      messageDiv.textContent = message;
    }
    overlay.style.opacity = "1";
  }
}

/**
 * Hide and remove overlay
 */
function hideOverlay(delay = 300) {
  const overlay = document.getElementById("kt-overlay");
  if (overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, delay);
  }
}

/**
 * Show translation in a beautiful overlay box
 */
function showTranslation(originalText, translatedText) {
  // Remove existing translation box if any
  if (currentTranslationBox) {
    currentTranslationBox.remove();
  }

  const box = document.createElement("div");
  box.id = "kt-translation-box";
  currentTranslationBox = box;

  Object.assign(box.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "900px",
    maxHeight: "80vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    color: "#fff",
    padding: "0",
    borderRadius: "16px",
    zIndex: "2147483646",
    fontSize: "16px",
    lineHeight: "1.8",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    opacity: "0",
    transition: "opacity 0.3s ease"
  });

  // Header
  const header = document.createElement("div");
  Object.assign(header.style, {
    padding: "20px 25px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.2)"
  });

  const title = document.createElement("strong");
  title.textContent = "📖 中文翻译 (Chinese Translation)";
  title.style.fontSize = "18px";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  Object.assign(closeBtn.style, {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s"
  });
  closeBtn.onmouseover = () => closeBtn.style.background = "rgba(255, 255, 255, 0.2)";
  closeBtn.onmouseout = () => closeBtn.style.background = "rgba(255, 255, 255, 0.1)";
  closeBtn.onclick = () => box.remove();

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Content area
  const content = document.createElement("div");
  Object.assign(content.style, {
    padding: "25px",
    overflowY: "auto",
    flex: "1",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word"
  });

  // Check if translation was successful
  if (translatedText.startsWith("⚠️")) {
    content.innerHTML = `<div style="color: #ffeb3b; font-size: 18px; text-align: center; padding: 20px;">${translatedText}</div>`;
  } else {
    // Split into paragraphs for better readability
    const paragraphs = translatedText.split(/\n\n+/);
    const formattedText = paragraphs
      .map(p => `<p style="margin-bottom: 15px;">${p.trim()}</p>`)
      .join("");
    content.innerHTML = formattedText;
  }

  // Footer with info
  const footer = document.createElement("div");
  Object.assign(footer.style, {
    padding: "15px 25px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    background: "rgba(0, 0, 0, 0.2)"
  });
  footer.textContent = "Translated with Google Gemini • Press Esc to close";

  box.appendChild(header);
  box.appendChild(content);
  box.appendChild(footer);
  document.body.appendChild(box);

  // Trigger animation
  setTimeout(() => box.style.opacity = "1", 10);

  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      box.remove();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  // Close on background click
  box.addEventListener("click", (e) => {
    if (e.target === box) {
      box.remove();
    }
  });
}

// ============================================================================
// TEXT EXTRACTION
// ============================================================================

/**
 * Extract text from the current Kindle page
 * Focuses on the reading area to avoid navigation elements
 */
function extractKindleText() {
  let text = "";
  
  // Try to find the main Kindle reading frame
  const kindleFrame = document.querySelector("#KindleReaderIFrame, iframe[title*='Kindle'], iframe[title*='Book']");
  const searchRoot = kindleFrame ? kindleFrame.contentDocument || kindleFrame.contentWindow.document : document;
  
  // Look for common Kindle reader elements
  const readers = searchRoot.querySelectorAll(
    "[id*='reader'], [class*='reader'], [id*='column'], [class*='column'], " +
    "[id*='page'], [class*='page'], main, article"
  );
  
  if (readers.length > 0) {
    // Extract from reader elements
    readers.forEach(reader => {
      const walker = searchRoot.createTreeWalker(
        reader, 
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Skip hidden elements and scripts
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const style = window.getComputedStyle(parent);
            if (style.display === "none" || style.visibility === "hidden") {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE") {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      let node;
      while ((node = walker.nextNode())) {
        const str = node.textContent.trim();
        if (str && str.length > 0 && !/^[\s\n\r]+$/.test(str)) {
          text += str + " ";
        }
      }
    });
  } else {
    // Fallback: extract all text from body
    const walker = searchRoot.createTreeWalker(
      searchRoot.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const style = window.getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden") {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE") {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    let node;
    while ((node = walker.nextNode())) {
      const str = node.textContent.trim();
      if (str && str.length > 0 && !/^[\s\n\r]+$/.test(str)) {
        text += str + " ";
      }
    }
  }
  
  // Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();
  
  return text;
}

// ============================================================================
// TRANSLATION
// ============================================================================

/**
 * Translate text using Google Gemini API
 */
async function translateWithGemini(text) {
  return new Promise((resolve) => {
    chrome.storage.local.get("google_api_key", async (data) => {
      const key = data.google_api_key;
      
      if (!key || key === "********" || key.length < 20) {
        resolve("⚠️ 未找到 API 密钥\n\nNo API key found. Please set your Google API key in the extension popup.\n\n请在扩展弹出窗口中设置您的 Google API 密钥。");
        return;
      }

      try {
        showOverlay("🌐 正在翻译... Translating...");
        
        // Try different model names based on availability
        // Common models: gemini-pro, gemini-1.5-flash-latest, gemini-1.5-pro-latest
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`;
        
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a professional Japanese to Chinese translator. Translate the given Japanese text into fluent, natural Simplified Chinese (简体中文). Maintain the original tone, style, and nuance. Preserve paragraph breaks. Do not add any explanations or notes - only provide the translation.\n\nPlease translate this Japanese text to Simplified Chinese:\n\n${text}`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 4000,
              topP: 0.95,
              topK: 40
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Google Gemini API error:", errorData);
          
          if (response.status === 400) {
            resolve("⚠️ API 密钥无效\n\nInvalid API key. Please check your Google API key in the extension settings.\n\n请检查扩展设置中的 Google API 密钥。");
          } else if (response.status === 429) {
            resolve("⚠️ 已超出配额\n\nAPI quota exceeded. Please check your Google Cloud account.\n\n已超出 API 配额，请检查您的 Google Cloud 账户。");
          } else if (response.status === 403) {
            resolve("⚠️ API 访问被拒绝\n\nAPI access denied. Make sure Gemini API is enabled in your Google Cloud project.\n\n请确保在 Google Cloud 项目中启用了 Gemini API。");
          } else {
            const errorMsg = errorData.error?.message || "Unknown error";
            resolve(`⚠️ 翻译失败\n\nTranslation failed (Error ${response.status}): ${errorMsg}\n\n翻译失败，请重试。`);
          }
          return;
        }

        const result = await response.json();
        const translation = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        
        if (!translation) {
          resolve("⚠️ 未返回翻译\n\nNo translation was returned from the API.\n\nAPI 未返回翻译结果。");
          return;
        }
        
        resolve(translation);
      } catch (err) {
        console.error("Translation error:", err);
        resolve(`⚠️ 网络错误\n\nNetwork or API request error: ${err.message}\n\n网络或 API 请求错误。`);
      }
    });
  });
}

/**
 * Main translation function
 */
async function performTranslation() {
  if (isTranslating) {
    console.log("Translation already in progress");
    return;
  }
  
  isTranslating = true;
  
  try {
    showOverlay("🔍 正在提取文本... Extracting text...");
    
    // Wait a bit for the page to stabilize
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const text = extractKindleText();

    if (!text || text.length < 10) {
      showOverlay("❌ 未找到文本\n\nNo readable text found on this page.");
      setTimeout(() => {
        hideOverlay();
        isTranslating = false;
      }, 2000);
      return;
    }
    
    console.log(`Extracted ${text.length} characters for translation`);

    const translated = await translateWithGemini(text);
    hideOverlay();
    
    showTranslation(text, translated);
  } catch (error) {
    console.error("Translation error:", error);
    showOverlay(`❌ Error: ${error.message}`);
    setTimeout(() => {
      hideOverlay();
    }, 3000);
  } finally {
    isTranslating = false;
  }
}

// ============================================================================
// MESSAGE LISTENERS
// ============================================================================

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "KINDLE_TRANSLATE_TRIGGER") {
    performTranslation();
    sendResponse({ success: true });
  }
  return true; // Keep message channel open for async response
});

console.log("[Kindle Translator] Ready! Press Cmd/Ctrl+Shift+T to translate.");

// ============================================================================
// AUTO-DETECT AND TRANSLATE FEATURE
// ============================================================================

// Configuration for auto-translation
const AUTO_TRANSLATE_CONFIG = {
  enabled: true, // Set to false to disable auto-translation
  minTextLength: 10, // Minimum characters to trigger translation
  maxTextLength: 500, // Maximum characters per snippet
  debounceDelay: 1000, // Wait time after page change before translating
  popupClass: "kt-auto-translate-popup"
};

// State for auto-translation
let autoTranslateTimeout = null;
let currentAutoPopups = new Set();
let processedTextNodes = new WeakSet();

/**
 * Remove all auto-translate popups
 */
function removeAutoPopups() {
  currentAutoPopups.forEach(popup => {
    if (popup && popup.parentNode) {
      popup.remove();
    }
  });
  currentAutoPopups.clear();
}

/**
 * Create a small popup near text element
 */
function createAutoPopup(text, translatedText, element) {
  const popup = document.createElement("div");
  popup.className = AUTO_TRANSLATE_CONFIG.popupClass;
  
  Object.assign(popup.style, {
    position: "absolute",
    background: "rgba(42, 82, 152, 0.95)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: "1.5",
    maxWidth: "300px",
    zIndex: "2147483645",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(8px)",
    wordWrap: "break-word",
    cursor: "pointer",
    transition: "opacity 0.2s",
    fontFamily: "system-ui, -apple-system, sans-serif"
  });
  
  // Content
  const contentDiv = document.createElement("div");
  contentDiv.style.marginBottom = "4px";
  contentDiv.textContent = translatedText;
  
  // Original text (smaller)
  const originalDiv = document.createElement("div");
  originalDiv.style.fontSize = "11px";
  originalDiv.style.opacity = "0.8";
  originalDiv.style.marginTop = "4px";
  originalDiv.style.borderTop = "1px solid rgba(255,255,255,0.3)";
  originalDiv.style.paddingTop = "4px";
  originalDiv.textContent = `原文: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`;
  
  popup.appendChild(contentDiv);
  popup.appendChild(originalDiv);
  
  // Click to dismiss
  popup.addEventListener("click", () => {
    popup.style.opacity = "0";
    setTimeout(() => {
      popup.remove();
      currentAutoPopups.delete(popup);
    }, 200);
  });
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (popup.parentNode) {
      popup.style.opacity = "0";
      setTimeout(() => {
        popup.remove();
        currentAutoPopups.delete(popup);
      }, 200);
    }
  }, 10000);
  
  // Position near the element
  try {
    const rect = element.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  } catch (e) {
    // Fallback position
    popup.style.top = "100px";
    popup.style.left = "20px";
  }
  
  document.body.appendChild(popup);
  currentAutoPopups.add(popup);
  
  // Fade in
  setTimeout(() => popup.style.opacity = "1", 10);
}

/**
 * Translate text snippet using Gemini API
 */
async function translateSnippet(text) {
  return new Promise((resolve) => {
    chrome.storage.local.get("google_api_key", async (data) => {
      const key = data.google_api_key;
      
      if (!key || key.length < 20) {
        resolve(null); // Silently fail if no API key
        return;
      }

      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`;
        
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Translate this Japanese text to Simplified Chinese. Only provide the translation, no explanations:\n\n${text}`
              }]
            }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1000,
              topP: 0.8,
              topK: 40
            }
          })
        });

        if (!response.ok) {
          console.warn("[Auto Translate] API error:", response.status);
          resolve(null);
          return;
        }

        const result = await response.json();
        const translation = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        resolve(translation);
      } catch (err) {
        console.warn("[Auto Translate] Translation error:", err);
        resolve(null);
      }
    });
  });
}

/**
 * Find and extract text nodes from the page
 */
function findTextNodes(root = document.body) {
  const textNodes = [];
  const maxNodes = 5; // Limit to avoid overwhelming the page
  
  // Look for common Kindle reader elements
  const readerSelectors = [
    '[id*="reader"]',
    '[class*="reader"]',
    '[id*="column"]',
    '[class*="column"]',
    '[id*="page"]',
    '[class*="page"]',
    'main',
    'article'
  ];
  
  let searchRoot = root;
  for (const selector of readerSelectors) {
    const element = root.querySelector(selector);
    if (element) {
      searchRoot = element;
      break;
    }
  }
  
  const walker = document.createTreeWalker(
    searchRoot,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip if already processed
        if (processedTextNodes.has(node)) {
          return NodeFilter.FILTER_REJECT;
        }
        
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        // Skip hidden elements
        const style = window.getComputedStyle(parent);
        if (style.display === "none" || style.visibility === "hidden") {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip scripts, styles, etc.
        const tagName = parent.tagName;
        if (["SCRIPT", "STYLE", "NOSCRIPT", "META", "LINK"].includes(tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Check text content
        const text = node.textContent.trim();
        if (text.length < AUTO_TRANSLATE_CONFIG.minTextLength) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Check if it contains Japanese characters
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
        if (!hasJapanese) {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  let node;
  while ((node = walker.nextNode()) && textNodes.length < maxNodes) {
    textNodes.push(node);
  }
  
  return textNodes;
}

/**
 * Process and translate text nodes automatically
 */
async function autoTranslateVisibleText() {
  if (!AUTO_TRANSLATE_CONFIG.enabled) return;
  if (isTranslating) return; // Don't interfere with manual translation
  
  console.log("[Auto Translate] Detecting text to translate...");
  
  // Remove old popups
  removeAutoPopups();
  
  // Find text nodes
  const textNodes = findTextNodes();
  
  if (textNodes.length === 0) {
    console.log("[Auto Translate] No suitable text found");
    return;
  }
  
  console.log(`[Auto Translate] Found ${textNodes.length} text snippets`);
  
  // Translate each node
  for (const node of textNodes) {
    const text = node.textContent.trim();
    
    // Limit text length
    const textToTranslate = text.substring(0, AUTO_TRANSLATE_CONFIG.maxTextLength);
    
    // Translate
    const translation = await translateSnippet(textToTranslate);
    
    if (translation) {
      // Mark as processed
      processedTextNodes.add(node);
      
      // Show popup near the text
      const element = node.parentElement;
      if (element) {
        createAutoPopup(text, translation, element);
      }
    }
    
    // Small delay between translations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("[Auto Translate] Translation complete");
}

/**
 * Detect page changes and trigger auto-translation
 */
function setupAutoTranslation() {
  console.log("[Auto Translate] Setting up page change detection...");
  
  const observer = new MutationObserver(() => {
    // Clear existing timeout
    clearTimeout(autoTranslateTimeout);
    
    // Debounce: wait for page to stabilize
    autoTranslateTimeout = setTimeout(() => {
      console.log("[Auto Translate] Page content changed, triggering translation...");
      autoTranslateVisibleText();
    }, AUTO_TRANSLATE_CONFIG.debounceDelay);
  });
  
  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Initial translation after page loads
  setTimeout(() => {
    console.log("[Auto Translate] Initial page load, translating...");
    autoTranslateVisibleText();
  }, 2000); // Wait 2 seconds for page to fully load
}

// Initialize auto-translation if enabled
if (AUTO_TRANSLATE_CONFIG.enabled) {
  setupAutoTranslation();
  console.log("[Auto Translate] Feature enabled");
} else {
  console.log("[Auto Translate] Feature disabled");
}
