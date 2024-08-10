import { updateTabList } from "../tabs/tabs.js";

export function setupTabActions() {
  const tabList = document.getElementById("tab-list");
  const closeAllButton = document.getElementById("close-all");
  const closeRightButton = document.getElementById("close-right");
  const closeLeftButton = document.getElementById("close-left");

  closeAllButton.addEventListener("click", function () {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({}, function (tabs) {
        const tabIds = tabs.map((tab) => tab.id);
        chrome.tabs.remove(tabIds, () => {
          updateTabList(tabList);
        });
      });
    }
  });

  closeRightButton.addEventListener("click", function () {
    if (chrome && chrome.tabs) {
      chrome.tabs.query(
        { currentWindow: true, active: true },
        function (activeTabs) {
          if (activeTabs.length > 0) {
            const activeTabIndex = activeTabs[0].index;
            chrome.tabs.query({ currentWindow: true }, function (tabs) {
              const tabIds = tabs
                .filter((tab) => tab.index > activeTabIndex)
                .map((tab) => tab.id);
              chrome.tabs.remove(tabIds, () => {
                updateTabList(tabList);
              });
            });
          }
        }
      );
    }
  });

  closeLeftButton.addEventListener("click", function () {
    if (chrome && chrome.tabs) {
      chrome.tabs.query(
        { currentWindow: true, active: true },
        function (activeTabs) {
          if (activeTabs.length > 0) {
            const activeTabIndex = activeTabs[0].index;
            chrome.tabs.query({ currentWindow: true }, function (tabs) {
              const tabIds = tabs
                .filter((tab) => tab.index < activeTabIndex)
                .map((tab) => tab.id);
              chrome.tabs.remove(tabIds, () => {
                updateTabList(tabList);
              });
            });
          }
        }
      );
    }
  });
}
