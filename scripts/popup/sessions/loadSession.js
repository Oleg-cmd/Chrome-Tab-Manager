export function loadSession(index) {
  chrome.storage.local.get("sessions", function (data) {
    const sessions = data.sessions || [];
    const sessionTabs = sessions[index].tabs;

    console.log("Loading session");

    chrome.windows.create({}, function (newWindow) {
      sessionTabs.forEach((tab) => {
        chrome.tabs.create({ windowId: newWindow.id, url: tab.url });
      });
    });

    console.log("Session loaded");
  });
}
