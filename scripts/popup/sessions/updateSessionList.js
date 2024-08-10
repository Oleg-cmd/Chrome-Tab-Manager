import { deleteSession } from "./deleteSession.js";
import { exportSession } from "./exportSession.js";
import { loadSession } from "./loadSession.js";
import { openEditModal } from "./openEditModal.js";
import { returnSession } from "./returnSession.js";

export function updateSessionList(sessionList) {
  chrome.storage.local.get("sessions", function (data) {
    const sessions = data.sessions || [];
    sessionList.innerHTML = "";

    sessions.forEach((session, index) => {
      let listItem = document.createElement("tr");
      listItem.innerHTML = `
          <td>
            <div class="session-name" contenteditable="true" data-index="${index}">${session.name}</div>
          </td>
          <td>
            <div class="tabs-count">${session.tabs.length} tabs</div>
          </td>
          <td class="text-center">
            <div class="dropdown">
              <button class="btn icon-btn">
                <img src="/icons/drop.png" alt="drop">
              </button>
              <div class="dropdown-content">
                <button class="load-session" data-index="${index}">Load</button>
                <button class="delete-session" data-index="${index}">Delete</button>
                <button class="export-session" data-index="${index}">Export</button>
                <button class="return-session" data-index="${index}">Return</button>
                <button class="edit-session" data-index="${index}">Edit</button>
              </div>
            </div>
          </td>
        `;

      const sessionName = listItem.querySelector(".session-name");
      sessionName.addEventListener("blur", (e) => {
        const index = e.target.getAttribute("data-index");
        sessions[index].name = e.target.innerText;
        chrome.storage.local.set({ sessions: sessions }, function () {
          console.log("Session name updated");
        });
      });

      const dropdownButton = listItem.querySelector(".btn.icon-btn");
      const dropdownContent = listItem.querySelector(".dropdown-content");

      dropdownButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = dropdownButton.getBoundingClientRect();
        dropdownContent.style.top = `${rect.bottom}px`;
        dropdownContent.style.left = `${rect.left}px`;
        dropdownContent.style.display = "block";
      });

      document.addEventListener("click", () => {
        dropdownContent.style.display = "none";
      });

      listItem
        .querySelector(".load-session")
        .addEventListener("click", () => loadSession(index));
      listItem
        .querySelector(".delete-session")
        .addEventListener("click", () => deleteSession(index, sessionList));
      listItem
        .querySelector(".export-session")
        .addEventListener("click", () => exportSession(index));
      listItem
        .querySelector(".return-session")
        .addEventListener("click", () => returnSession(index));
      listItem
        .querySelector(".edit-session")
        .addEventListener("click", () => openEditModal(index));

      sessionList.appendChild(listItem);
    });
  });
}
