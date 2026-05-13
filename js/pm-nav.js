$(function () {
  const $navContainer = $("#pm-nav-container");
  if (!$navContainer.length) return;

  const currentPath = window.location.pathname;
  const currentFile = currentPath.split("/").pop() || "pm_master.html";

  const navItems = [
    { label: "ALL", url: "pm_report.html" },
    { label: "PM PENDING REPORT", url: "pm_pending_report.html" },
    { label: "PM MONTHLY STATUS", url: "pm_monthly_status.html" },
    { label: "PM OVER REPORT", url: "pm_over_report.html" },
    { label: "PM FROM LOGBOOK", url: "pm_from_logbook.html" },
  ];

  const categoryItems = [
    { label: "PM Detail (T/X)", url: "pm_detail_tx.html" },
    { label: "PM Detail (C/V)", url: "pm_detail_cv.html" },
    { label: "PM Detail (SW)", url: "pm_detail_sw.html" },
    { label: "PM Detail (AT)", url: "pm_detail_at.html" },
    { label: "PM Detail (VIB)", url: "pm_detail_vib.html" },
    { label: "PM Detail (Other)", url: "pm_detail_other.html" },
  ];

  const generateButtons = (items) => {
    return items
      .map((item) => {
        const isActive = currentFile === item.url ? "is-active" : "";
        return `<button class="toolbar-btn ${isActive}" onclick="window.location.href='${item.url}'">${item.label}</button>`;
      })
      .join("");
  };

  const navHTML = `
        <div class="flex flex-col gap-16px">

         <div class="jbd-card">
              <div class="jbd-card-header">
                <h3 class="font-14px fw-700 color-blue text-uppercase  flex items-center gap-8px">
                  <i class="ph-bold ph-list-bullets"></i> PM Details Categories
                </h3>
              </div>
              <div class="p-16px flex flex-wrap gap-8px">
                ${generateButtons(categoryItems)}
              </div>
            </div>

            <!-- Navigation Sections -->
            <div class="jbd-card">
              <div class="jbd-card-header">
                <h3 class="font-14px fw-700 color-blue text-uppercase  flex items-center gap-8px">
                  <i class="ph-bold ph-navigation-arrow"></i> PM Reports & Status
                </h3>
              </div>
              <div class="p-16px flex flex-wrap gap-8px">
                <button class="toolbar-btn ${currentFile === "pm_master.html" ? "is-active" : ""}" onclick="window.location.href='pm_master.html'">PM MASTER</button>
                ${generateButtons(navItems)}
              </div>
            </div>

            <!-- Detail Categories -->
           
        </div>
    `;

  $navContainer.html(navHTML);
});
