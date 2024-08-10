export function openEditModal(sessionIndex) {
  chrome.storage.local.get("sessions", function (data) {
    const sessions = data.sessions || [];
    const session = sessions[sessionIndex];

    const modalContent = `
        <div class="modal">
          <div class="modal-header">
            <h2 contenteditable="true" id="edit-session-name">${
              session.name
            }</h2>
            <button class="close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="edit-tab-list">
                ${session.tabs
                  .map(
                    (tab, tabIndex) => `
                  <tr data-tab-index="${tabIndex}">
                    <td contenteditable="true" class="modal-title">${tab.title}</td>
                    <td contenteditable="true" class="modal-url">${tab.url}</td>
                    <td>
                      <button class="delete-tab" data-tab-index="${tabIndex}">Delete</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="save-session">Save</button>
          </div>
        </div>
      `;

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");
    modalContainer.innerHTML = modalContent;

    document.body.appendChild(modalContainer);

    modalContainer
      .querySelector(".close-modal")
      .addEventListener("click", () => {
        document.body.removeChild(modalContainer);
      });

    modalContainer.querySelectorAll(".delete-tab").forEach((button) => {
      button.addEventListener("click", (e) => {
        const tabIndex = parseInt(e.target.getAttribute("data-tab-index"));
        session.tabs.splice(tabIndex, 1);
        document.querySelector(`tr[data-tab-index="${tabIndex}"]`).remove();
      });
    });

    modalContainer
      .querySelector(".save-session")
      .addEventListener("click", () => {
        session.name = document.getElementById("edit-session-name").innerText;
        const editedTabs =
          modalContainer.querySelectorAll("tr[data-tab-index]");
        session.tabs = Array.from(editedTabs).map((row, rowIndex) => {
          const tabIndex = parseInt(row.getAttribute("data-tab-index"));
          return {
            ...session.tabs[tabIndex],
            title: row.querySelector(".modal-title").innerText,
            url: row.querySelector(".modal-url").innerText,
          };
        });

        sessions[sessionIndex] = session;
        chrome.storage.local.set({ sessions: sessions }, function () {
          console.log("Session updated");
          document.body.removeChild(modalContainer);
          updateSessionList(document.getElementById("session-list"));
        });
      });
  });
}
