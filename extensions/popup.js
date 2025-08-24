let chatBox = document.getElementById("chat");

function addMessage(role, text) {
  let div = document.createElement("div");
  div.className = "msg " + role;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getPageText() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tab.id, { action: "extract_text" }, (res) => {
      resolve(res?.content || "");
    });
  });
}

async function sendToPython(content, question) {
  const res = await fetch("http://127.0.0.1:8000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, question })
  });
  const data = await res.json();
  return data.answer;
}

document.getElementById("summarize").addEventListener("click", async () => {
  let text = await getPageText();
  addMessage("user", "[Summarize Page]");
  let answer = await sendToPython(text, "Summarize this page");
  addMessage("bot", answer);
});

document.getElementById("send").addEventListener("click", async () => {
  let input = document.getElementById("question");
  let question = input.value.trim();
  if (!question) return;
  addMessage("user", question);
  let text = await getPageText();
  let answer = await sendToPython(text, question);
  addMessage("bot", answer);
  input.value = "";
});
