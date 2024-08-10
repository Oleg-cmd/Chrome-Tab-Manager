export function exportSession(index) {
  chrome.storage.local.get("sessions", function (data) {
    const sessions = data.sessions || [];
    const session = sessions[index];
    const blob = new Blob([JSON.stringify(session)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
