import { updateSessionList } from "../sessions/updateSessionList.js";

export function setupSessionActions() {
  const saveSessionButton = document.getElementById("save-session");
  const sessionList = document.getElementById("session-list");
  const importSessionButton = document.getElementById("import-session-button");
  const importSessionInput = document.getElementById("import-session");

  saveSessionButton.addEventListener("click", function () {
    if (chrome && chrome.storage) {
      chrome.storage.local.get(["tabInfoArray", "sessions"], function (data) {
        const sessions = data.sessions || [];
        const now = new Date();
        const sessionName = now.toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const newSession = {
          name: sessionName,
          tabs: data.tabInfoArray,
        };
        sessions.push(newSession);
        chrome.storage.local.set({ sessions: sessions }, function () {
          console.log("Session saved");
          updateSessionList(sessionList);
        });
      });
    }
  });

  importSessionButton.addEventListener("click", () => {
    importSessionInput.click();
  });

  importSessionInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const importedSession = JSON.parse(e.target.result);
          chrome.storage.local.get("sessions", function (data) {
            const sessions = data.sessions || [];
            sessions.push(importedSession);
            chrome.storage.local.set({ sessions: sessions }, function () {
              console.log("Imported session added");
              updateSessionList(sessionList);
            });
          });
        } catch (error) {
          console.error("Error parsing JSON: ", error);
        }
      };
      reader.readAsText(file);
    }
  });
}
