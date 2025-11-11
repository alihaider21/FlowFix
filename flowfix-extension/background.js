// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "flowfix-correct",
    title: "FlowFix: Correct grammar",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "flowfix-correct" || !info.selectionText) return;

  // POST selected text to your Flask endpoint
  fetch("http://127.0.0.1:5000/correct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: info.selectionText })
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.corrected) {
        // Inject a script that replaces the user's selection with corrected text
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (corrected) => {
            try {
              // If focus is on an input/textarea or contenteditable, replace accordingly
              const active = document.activeElement;
              if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA") && typeof active.selectionStart === "number") {
                const start = active.selectionStart;
                const end = active.selectionEnd;
                const old = active.value || "";
                active.value = old.slice(0, start) + corrected + old.slice(end);
                const pos = start + corrected.length;
                active.setSelectionRange(pos, pos);
                active.focus();
                return true;
              }

              if (active && active.isContentEditable) {
                // For contentEditable element with selection inside it
                const sel = window.getSelection();
                if (sel && sel.rangeCount) {
                  const range = sel.getRangeAt(0);
                  range.deleteContents();
                  const node = document.createTextNode(corrected);
                  range.insertNode(node);
                  // Move caret after inserted node
                  range.setStartAfter(node);
                  sel.removeAllRanges();
                  sel.addRange(range);
                }
                return true;
              }

              // Fallback: use document selection (works in most normal pages)
              const sel = window.getSelection();
              if (!sel || !sel.rangeCount) return false;
              const range = sel.getRangeAt(0);
              range.deleteContents();
              const node = document.createTextNode(corrected);
              range.insertNode(node);
              // place caret after inserted text
              range.setStartAfter(node);
              sel.removeAllRanges();
              sel.addRange(range);
              return true;
            } catch (err) {
              // swallow errors to avoid user-facing alerts
              console.error("FlowFix injection error:", err);
              return false;
            }
          },
          args: [data.corrected]
        });
      } else {
        // silently log the server error; could add chrome.notifications if desired
        console.error("FlowFix server returned no corrected text:", data);
      }
    })
    .catch(err => {
      console.error("FlowFix fetch error:", err);
      // optionally, show a chrome notification here if you want visible feedback
    });
});
