// Когда расширение устанавливается или обновляется
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed or updated");

  // Установка начальных значений в локальное хранилище
  chrome.storage.local.get(["sessions"], (data) => {
    if (!data.sessions) {
      chrome.storage.local.set({ sessions: [] }, () => {
        console.log("Initialized sessions");
      });
    }
  });

  // Создание периодического будильника для автосохранения сессий
  chrome.alarms.create("autoSaveSessions", { periodInMinutes: 1 });
});

// Обработка событий будильника
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoSaveSessions") {
    autoSaveSessions();
  }
});

// Функция для автосохранения сессий
function autoSaveSessions() {
  chrome.tabs.query({}, (tabs) => {
    const tabInfoArray = tabs.map((tab) => {
      return {
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        active: tab.active,
        date: new Date().toLocaleString(),
        metaInfo: {}, // Можно добавить любую другую мета-информацию
      };
    });

    chrome.storage.local.get(["sessions"], (data) => {
      const sessions = data.sessions || [];
      const now = new Date();
      const sessionName = `AutoSave ${now.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      const newSession = {
        name: sessionName,
        tabs: tabInfoArray,
      };

      sessions.push(newSession);

      // Ограничение количества автосохраненных сессий (например, до 10)
      if (sessions.length > 3) {
        sessions.shift(); // Удаление самой старой сессии
      }

      chrome.storage.local.set({ sessions: sessions }, () => {
        console.log("Auto-saved session");
      });
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getSessionData") {
    chrome.storage.local.get(["sessions"], (data) => {
      sendResponse(data.sessions);
    });
    return true;
  }

  if (message.type === "saveSession") {
    const session = message.session;
    chrome.storage.local.get(["sessions"], (data) => {
      const sessions = data.sessions || [];
      sessions.push(session);
      chrome.storage.local.set({ sessions: sessions }, () => {
        sendResponse({ status: "success" });
      });
    });
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log(`Tab ${tabId} URL changed to ${changeInfo.url}`);
    // Можно выполнить задачу при изменении URL вкладки
  }
});
