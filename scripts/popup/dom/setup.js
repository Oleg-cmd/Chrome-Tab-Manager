import { setupTabsTriggers } from "./tabsTriggers.js";
import { setupTabActions } from "./tabActions.js";
import { setupSessionActions } from "./sessionActions.js";
import { updateTabList } from "../tabs/tabs.js";
import { updateSessionList } from "../sessions/updateSessionList.js";

export function setupEventHandlers() {
  document.addEventListener("DOMContentLoaded", function () {
    setupTabsTriggers();
    setupTabActions();
    setupSessionActions();

    const tabList = document.getElementById("tab-list");
    const sessionList = document.getElementById("session-list");

    updateTabList(tabList);
    updateSessionList(sessionList);
  });
}
