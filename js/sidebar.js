$(function () {
  // Determine the base path to the root directory dynamically
  const getBasePath = () => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const pagesIndex = segments.indexOf("pages");
    if (pagesIndex === -1) return "./";

    const depth = segments.length - pagesIndex - 1;
    return "../".repeat(depth);
  };

  const basePath = getBasePath();

  const sidebarHTML = `
    <aside class="app-sidebar w-60">
         <div class="admin-sidebar-logo">
           <img src="${basePath}assets/images/gnfc-sidebar-logo-short.png" alt="GNFC Logo" class="sidebar-logo-img">
           <span class="logo-text">GNFC IIMS</span>
        </div>

      <nav class="sidebar-nav">
        <!-- Dashboard -->
        <a href="${basePath}dashboard.html" class="sidebar-link" data-id="dashboard">
          <i class="ph ph-bold ph-squares-four"></i>
          <span class="sidebar-text">Dashboard</span>
        </a>
     
        <a href="${basePath}pages/plant/plant.html" class="sidebar-link" data-id="plants">
          <i class="ph ph-bold ph-buildings"></i>
          <span class="sidebar-text">Plants</span>
        </a>

        <!-- Logs -->
        <a href="#" class="sidebar-link" data-id="shift_logbook_officer">
          <i class="ph ph-bold ph-notebook"></i>
          <span class="sidebar-text">Officer Logbook</span>
        </a>

        <a href="${basePath}pages/technician_logbook/technicianlogbook.html" class="sidebar-link" data-id="technician_logbook">
          <i class="ph ph-bold ph-factory"></i>
          <span class="sidebar-text">Technician Logbook</span>
        </a>
   
        <!-- Compliance -->
        <a href="${basePath}pages/iso/iso.html" class="sidebar-link" data-id="iso">
          <i class="ph ph-bold ph-certificate"></i>
          <span class="sidebar-text">ISO/CPCB</span>
        </a>

        <!-- Jobs & Utility -->
        <a href="${basePath}pages/joblist/joblist.html" class="sidebar-link" data-id="job_list">
          <i class="ph ph-bold ph-list-bullets"></i>
          <span class="sidebar-text">Job List</span>
        </a>

        <a href="#" class="sidebar-link" data-id="utility">
          <i class="ph ph-bold ph-lightning"></i>
          <span class="sidebar-text">Utility</span>
        </a>

        <a href="#" class="sidebar-link" data-id="cms">
          <i class="ph ph-bold ph-monitor"></i>
          <span class="sidebar-text">CMS</span>
        </a>

           <!-- Plants -->
        <a href="#" class="sidebar-link" data-id="spp">
          <i class="ph ph-bold ph-plant"></i>
          <span class="sidebar-text">SPP</span>
        </a>

        <a href="#" class="sidebar-link" data-id="inst_ws">
          <i class="ph ph-bold ph-desktop"></i>
          <span class="sidebar-text">INST WS</span>
        </a>
      
        <a href="#" class="sidebar-link" data-id="job_analysis">
          <i class="ph ph-bold ph-chart-bar"></i>
          <span class="sidebar-text">Job Analysis</span>
        </a>

        <!-- Communication & Helpers -->
        <a href="#" class="sidebar-link" data-id="send_mail">
          <i class="ph ph-bold ph-envelope"></i>
          <span class="sidebar-text">Send Mail</span>
        </a>

        <a href="#" class="sidebar-link" data-id="helper_details">
          <i class="ph ph-bold ph-users-three"></i>
          <span class="sidebar-text">Helper Details</span>
        </a>

        <!-- System -->
        <a href="#" class="sidebar-link" data-id="user_info">
          <i class="ph ph-bold ph-user"></i>
          <span class="sidebar-text">User Info</span>
        </a>

        <a href="#" class="sidebar-link" data-id="settings">
          <i class="ph ph-bold ph-gear"></i>
          <span class="sidebar-text">Settings</span>
        </a>

        <a href="#" class="sidebar-link" data-id="help">
          <i class="ph ph-bold ph-question"></i>
          <span class="sidebar-text">Help</span>
        </a>

        <a href="${basePath}pages/operationjobregister/ojr.html" class="sidebar-link" data-id="opr_job_reg">
          <i class="ph ph-bold ph-clipboard-text"></i>
          <span class="sidebar-text">OPR. Job Reg</span>
        </a>

        <a href="#" class="sidebar-link" data-id="admin">
          <i class="ph ph-bold ph-shield-check"></i>
          <span class="sidebar-text">Admin</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=2c3235&color=fff" class="user-avatar"
            alt="User">
          <div class="user-info">
            <p class="user-name">Admin User</p>
            <p class="sign-out-btn">Sign out</p>
          </div>
          <i class="ph ph-bold ph-sign-out cursor-pointer font-24px" style="color: var(--typo-label);"></i>
        </div>
      </div>
    </aside>

    <!-- Custom Tooltip Element -->
    <div class="sidebar-tooltip hidden">
      <span class="sidebar-tooltip-text"></span>
      <div class="tooltip-arrow"></div>
    </div>
    `;

  // Inject Sidebar into the container
  $(".sidebar-container").html(sidebarHTML);

  // --- Sidebar & Profile Logic ---
  const $sidebar = $(".app-sidebar");
  const $toggleBtn = $(".sidebar-toggle-header");
  const $sidebarTexts = $(".sidebar-text");
  const $userInfo = $(".user-info");
  const $userAvatar = $(".user-avatar");

  // Load User Info from localStorage
  const currentUserName =
    localStorage.getItem("currentUserName") || "Admin User";
  $(".user-name").text(currentUserName);
  $(".user-avatar").attr(
    "src",
    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=2c3235&color=fff`,
  );

  // Sidebar Toggle Function
   const updateSidebarUI = (collapsed) => {
    const $currentToggleBtn = $(".sidebar-toggle-header, #sidebarToggleBtn");
    const $logoText = $(".logo-text");
    
    if (collapsed) {
      $sidebar.removeClass("w-60").addClass("w-20").addClass("is-collapsed");
      $sidebarTexts.addClass("hidden");
      $userInfo.addClass("hidden");
      $userAvatar.addClass("hidden");
      $currentToggleBtn.removeClass("ph-sidebar-simple").addClass("ph-list");
      $logoText.hide();
    } else {
      $sidebar.removeClass("w-20").addClass("w-60").removeClass("is-collapsed");
      $sidebarTexts.removeClass("hidden");
      $userInfo.removeClass("hidden");
      $userAvatar.removeClass("hidden");
      $currentToggleBtn.removeClass("ph-list").addClass("ph-sidebar-simple");
      $logoText.show();
    }
  };

  // Initialize Sidebar State from localStorage
  let isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  updateSidebarUI(isCollapsed);

  // Event Listener for Toggle (using delegation to work with dynamic headers)
  $(document).on(
    "click",
    ".sidebar-toggle-header, #sidebarToggleBtn",
    function () {
      isCollapsed = !isCollapsed;
      localStorage.setItem("sidebarCollapsed", isCollapsed);
      updateSidebarUI(isCollapsed);
    },
  );

  // Sign Out Logic
  const logout = () => {
    localStorage.removeItem("sidebarCollapsed");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUserName");
    window.location.href = "Login.html";
  };

  $(".sign-out-btn, .ph-sign-out").on("click", logout);

  // Listen for header injection to update toggle icon
  $(document).on("headerInjected", function () {
    updateSidebarUI(localStorage.getItem("sidebarCollapsed") === "true");
  });

  // Highlight Active Sidebar Item
  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";
  $(".sidebar-link").removeClass("active");

  const sidebarActive = window.activeSidebar || window.activePage;
  if (sidebarActive) {
    $(`.sidebar-link[data-id="${sidebarActive}"]`).addClass("active");
  } else {
    // Fallback: match by filename
    $(`.sidebar-link`).each(function () {
      const href = $(this).attr("href");
    });
  }

  // --- Hover Tooltip Logic ---
  const $tooltip = $(".sidebar-tooltip");
  const $tooltipText = $(".sidebar-tooltip-text");

  $(document).on("mouseenter", ".sidebar-link", function () {
    if (!isCollapsed) return;

    const text = $(this).find(".sidebar-text").text();
    const rect = this.getBoundingClientRect();

    $tooltipText.text(text);
    $tooltip
      .css({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
        transform: "translateY(-50%)",
      })
      .removeClass("hidden")
      .addClass("show");
  });

  $(document).on("mouseleave", ".sidebar-link", function () {
    $tooltip.removeClass("show").addClass("hidden");
  });
});
