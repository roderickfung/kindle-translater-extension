// Popup script for Kindle Auto Translator

const keyInput = document.getElementById("apiKey");
const saveBtn = document.getElementById("saveKey");
const toggleBtn = document.getElementById("toggleKey");
const translateBtn = document.getElementById("translate");
const keyStatus = document.getElementById("keyStatus");

let actualKey = "";
let isKeyVisible = false;

// ============================================================================
// INITIALIZATION
// ============================================================================

// Load existing API key on popup open
chrome.storage.local.get("google_api_key", (data) => {
  if (data.google_api_key && data.google_api_key.length > 0) {
    actualKey = data.google_api_key;
    keyInput.value = "••••••••••••••••••••";
    keyInput.placeholder = "API key is set";
    showStatus("API key is configured ✓", "success");
  } else {
    keyInput.placeholder = "Enter your Google API key (AIza...)";
  }
});

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Save API key
saveBtn.addEventListener("click", () => {
  const key = keyInput.value.trim();
  
  // Don't save if it's the masked value
  if (key === "••••••••••••••••••••" || key.length === 0) {
    showStatus("Please enter a valid API key", "error");
    return;
  }
  
  // Basic validation for Google API keys (they typically start with "AIza" and are 39 characters)
  if (!key.startsWith("AIza") || key.length < 35) {
    showStatus("Invalid API key format. Should start with 'AIza'", "error");
    return;
  }
  
  // Save to secure storage
  chrome.storage.local.set({ google_api_key: key }, () => {
    actualKey = key;
    keyInput.value = "••••••••••••••••••••";
    isKeyVisible = false;
    toggleBtn.textContent = "Show Key";
    showStatus("✅ API key saved securely!", "success");
    
    // Clear status after 3 seconds
    setTimeout(() => {
      keyStatus.style.display = "none";
    }, 3000);
  });
});

// Toggle API key visibility
toggleBtn.addEventListener("click", () => {
  if (!actualKey) {
    showStatus("No API key saved yet", "error");
    return;
  }
  
  if (isKeyVisible) {
    keyInput.value = "••••••••••••••••••••";
    keyInput.type = "password";
    toggleBtn.textContent = "Show Key";
    isKeyVisible = false;
  } else {
    keyInput.value = actualKey;
    keyInput.type = "text";
    toggleBtn.textContent = "Hide Key";
    isKeyVisible = true;
  }
});

// Handle key input changes
keyInput.addEventListener("input", () => {
  // If user starts typing, clear the masked value
  if (keyInput.value.startsWith("•")) {
    keyInput.value = "";
    keyInput.type = "text";
  }
});

// Translate button
translateBtn.addEventListener("click", () => {
  // Check if API key is set
  if (!actualKey) {
    showStatus("⚠️ Please set your API key first", "error");
    return;
  }
  
  // Send message to background script
  chrome.runtime.sendMessage({ action: "translatePage" }, (response) => {
    // Close popup after triggering
    window.close();
  });
});

// Allow Enter key to save
keyInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    saveBtn.click();
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function showStatus(message, type) {
  keyStatus.textContent = message;
  keyStatus.className = `status ${type}`;
  keyStatus.style.display = "block";
}
