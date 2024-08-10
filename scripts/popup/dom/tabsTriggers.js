export function setupTabsTriggers() {
  const tabsTriggers = document.querySelectorAll(".tabs-trigger");
  const tabsContents = document.querySelectorAll(".tabs-content");

  tabsTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = trigger.getAttribute("data-target");

      tabsTriggers.forEach((t) => t.classList.remove("active"));
      tabsContents.forEach((c) => (c.style.display = "none"));

      trigger.classList.add("active");
      document.getElementById(target).style.display = "block";
    });
  });

  // Set the default active tab
  document.querySelector(".tabs-trigger").click();
}
