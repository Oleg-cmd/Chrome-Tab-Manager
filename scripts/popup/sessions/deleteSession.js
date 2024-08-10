export function deleteSession(index, sessionList) {
  chrome.storage.local.get("sessions", function (data) {
    const sessions = data.sessions || [];
    sessions.splice(index, 1);
    chrome.storage.local.set({ sessions: sessions }, function () {
      console.log("Session deleted");
      updateSessionList(sessionList);
    });
  });
}
