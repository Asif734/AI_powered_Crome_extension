function extractText() {
  let text = "";
  document.querySelectorAll("p, h1, h2, h3, h4, span").forEach(el => {
    text += el.innerText + " ";
  });
  return text.trim();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "extract_text") {
    sendResponse({ content: extractText() });
  }
});
