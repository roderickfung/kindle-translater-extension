// Background service worker for Kindle Auto Translator

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "translatePage") {
    triggerTranslation();
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "translate-page") {
    triggerTranslation();
  }
});

// Common function to trigger translation
function triggerTranslation() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;
    
    const tab = tabs[0];
    
    // Check if we're on a Kindle page
    if (tab.url && (tab.url.includes("read.amazon.co.jp") || tab.url.includes("read.amazon.com"))) {
      chrome.tabs.sendMessage(tab.id, { type: "KINDLE_TRANSLATE_TRIGGER" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        }
      });
    } else {
      // Not on Kindle page - show notification
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          alert("⚠️ This extension only works on Kindle Cloud Reader pages.\n\nPlease navigate to:\n• https://read.amazon.co.jp/\n• https://read.amazon.com/");
        }
      });
    }
  });
}
