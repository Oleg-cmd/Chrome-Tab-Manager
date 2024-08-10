export async function returnSession(index) {
  chrome.storage.local.get("sessions", async function (data) {
    const sessions = data.sessions || [];
    const sessionTabs = sessions[index].tabs;

    try {
      // Сначала загружаем сессию
      await new Promise((resolve, reject) => {
        chrome.windows.create({}, function (newWindow) {
          sessionTabs.forEach((tab) => {
            chrome.tabs.create(
              { windowId: newWindow.id, url: tab.url },
              function () {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  resolve();
                }
              }
            );
          });
        });
      });

      console.log("Session loaded");

      // Закрываем текущее окно
      chrome.windows.getCurrent(function (currentWindow) {
        chrome.windows.remove(currentWindow.id, function () {
          if (chrome.runtime.lastError) {
            console.error(
              "Error closing current window:",
              chrome.runtime.lastError
            );
          } else {
            console.log("Current window closed");
          }
        });
      });
    } catch (error) {
      console.error("Error returning session:", error);
    }
  });
}
