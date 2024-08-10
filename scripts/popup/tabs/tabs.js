export function updateTabList(tabList) {
  if (chrome && chrome.tabs) {
    chrome.tabs.query({}, function (tabs) {
      tabList.innerHTML = "";

      let tabInfoArray = tabs.map((tab) => {
        return {
          id: tab.id,
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
          active: tab.active,
          date: new Date().toLocaleString(),
          metaInfo: {}, // Здесь можно добавить любую другую мета-информацию
        };
      });

      chrome.storage.local.set({ tabInfoArray: tabInfoArray }, function () {
        console.log("Tab information is saved");
      });

      tabInfoArray.forEach(function (tabInfo) {
        let listItem = document.createElement("tr");
        listItem.innerHTML = `
                  <td>
                    <div class="flex">
                      <button class="toggle ${
                        tabInfo.active ? "active" : ""
                      }" aria-label="Pin tab"></button>
                      <span>${tabInfo.title}</span>
                    </div>
                  </td>
                  <td>
                    <div class="url" data-url="${tabInfo.url}">${
          tabInfo.url
        }</div>
                  </td>
                  <td class="text-center">
                    <div class="dropdown">
                      <button class="btn icon-btn">
                        <img src="/icons/drop.png" alt="drop">
                      </button>
                      <div class="dropdown-content">
                        <button class="close-tab" data-tab-id="${
                          tabInfo.id
                        }">Close Tab</button>
                        <button class="duplicate-tab" data-tab-id="${
                          tabInfo.id
                        }">Duplicate Tab</button>
                      </div>
                    </div>
                  </td>
                `;

        const dropdownButton = listItem.querySelector(".icon-btn");
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

        const urlElement = listItem.querySelector(".url");
        urlElement.addEventListener("click", (e) => {
          const url = e.target.getAttribute("data-url");
          navigator.clipboard
            .writeText(url)
            .then(() => {
              console.log("URL copied to clipboard");
            })
            .catch((err) => {
              console.error("Failed to copy URL: ", err);
            });
        });

        const closeTabButton = listItem.querySelector(".close-tab");
        const duplicateTabButton = listItem.querySelector(".duplicate-tab");

        closeTabButton.addEventListener("click", (e) => {
          const tabId = parseInt(e.target.getAttribute("data-tab-id"));

          chrome.tabs.remove(tabId, () => {
            updateTabList(tabList);
          });
        });

        duplicateTabButton.addEventListener("click", (e) => {
          const tabId = parseInt(e.target.getAttribute("data-tab-id"));

          chrome.tabs.duplicate(tabId, () => {
            updateTabList(tabList);
          });
        });

        tabList.appendChild(listItem);
      });
    });
  } else {
    console.error("chrome.tabs API is not available.");
  }
}
