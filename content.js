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
  footer.textContent = "Translated with GPT-4o mini • Press Esc to close";

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
 * Translate text using OpenAI GPT-4o mini
 */
async function translateWithGPT(text) {
  return new Promise((resolve) => {
    chrome.storage.local.get("openai_api_key", async (data) => {
      const key = data.openai_api_key;
      
      if (!key || key === "********" || key.length < 20) {
        resolve("⚠️ 未找到 API 密钥\n\nNo API key found. Please set your OpenAI API key in the extension popup.\n\n请在扩展弹出窗口中设置您的 OpenAI API 密钥。");
        return;
      }

      try {
        showOverlay("🌐 正在翻译... Translating...");
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a professional Japanese to Chinese translator. Translate the given Japanese text into fluent, natural Simplified Chinese (简体中文). Maintain the original tone, style, and nuance. Preserve paragraph breaks. Do not add any explanations or notes - only provide the translation."
              },
              { 
                role: "user", 
                content: `Please translate this Japanese text to Simplified Chinese:\n\n${text}` 
              }
            ],
            temperature: 0.3,
            max_tokens: 4000
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("OpenAI API error:", errorData);
          
          if (response.status === 401) {
            resolve("⚠️ API 密钥无效\n\nInvalid API key. Please check your OpenAI API key in the extension settings.\n\n请检查扩展设置中的 OpenAI API 密钥。");
          } else if (response.status === 429) {
            resolve("⚠️ 已超出配额\n\nAPI quota exceeded. Please check your OpenAI account.\n\n已超出 API 配额，请检查您的 OpenAI 账户。");
          } else {
            resolve(`⚠️ 翻译失败\n\nTranslation failed (Error ${response.status}). Please try again.\n\n翻译失败，请重试。`);
          }
          return;
        }

        const result = await response.json();
        const translation = result.choices?.[0]?.message?.content?.trim() || "";
        
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

    const translated = await translateWithGPT(text);
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
