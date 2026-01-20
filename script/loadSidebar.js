document.addEventListener("DOMContentLoaded", async () => {
  const host = document.querySelector("aside.sidebar");
  if (!host) return;

  const html = await fetch("sidebar.html").then(r => r.text());
  host.innerHTML = html;

  initSidebarCollapse(host);
  initializeSidebar();
});

function initSidebarCollapse(host) {
  const btn = host.querySelector("#sidebar-toggle");
  if (!btn) return;

  const saved = localStorage.getItem("sidebarCollapsed");
  if (saved === "1") host.classList.add("is-collapsed");

  btn.addEventListener("click", () => {
    const collapsed = host.classList.toggle("is-collapsed");
    localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
  });
}

function initializeSidebar() {
  const host = document.querySelector("aside.sidebar");
  const menuLinks = document.querySelectorAll("#leftside-navigation .sub-menu > a");

  host.querySelectorAll("#leftside-navigation .sub-menu > ul")
    .forEach(ul => ul.style.display = "none");

  host.addEventListener("click", (e) => {
    // don't open submenus when collapsed
    if (host.classList.contains("is-collapsed")) return;

    const trigger = e.target.closest("#leftside-navigation .sub-menu > a");
    if (!trigger) return;

    e.preventDefault();
    const submenu = trigger.nextElementSibling;
    if (!submenu || submenu.tagName !== "UL") return;

    host.querySelectorAll("#leftside-navigation .sub-menu > ul")
      .forEach(ul => { if (ul !== submenu) ul.style.display = "none"; });

    submenu.style.display = submenu.style.display === "block" ? "none" : "block";
  });
}
