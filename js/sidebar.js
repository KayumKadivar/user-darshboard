
$(function () {
    const sidebarHTML = `
    <aside class="app-sidebar w-60">
      <div class="sidebar-header px-4">
        <div class="logo-wrapper">
          <img src="assets/images/gnfc-full-logo.png"
            onerror="this.onerror=null;this.src='assets/images/gnfc-logo.png';" class="logo-img" alt="GNFC Logo">
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- Dashboard -->
        <a href="dashboard.html" class="sidebar-link" data-id="dashboard">
          <i class="ph ph-bold ph-squares-four"></i>
          <span class="sidebar-text">Dashboard</span>
        </a>
     
        <a href="#" class="sidebar-link" data-id="plants">
          <i class="ph ph-bold ph-buildings"></i>
          <span class="sidebar-text">Plants</span>
        </a>

        <!-- Logs -->
        <a href="#" class="sidebar-link" data-id="shift_logbook_officer">
          <i class="ph ph-bold ph-notebook"></i>
          <span class="sidebar-text">Officer Logbook</span>
        </a>

        <a href="technicianlogbook.html" class="sidebar-link" data-id="technician_logbook">
          <i class="ph ph-bold ph-factory"></i>
          <span class="sidebar-text">Technician Logbook</span>
        </a>
   
        <!-- Compliance -->
        <a href="#" class="sidebar-link" data-id="iso">
          <i class="ph ph-bold ph-certificate"></i>
          <span class="sidebar-text">ISO/OHSAS/CPCB</span>
        </a>

        <!-- Jobs & Utility -->
        <a href="#" class="sidebar-link" data-id="job_list">
          <i class="ph ph-bold ph-list-bullets"></i>
          <span class="sidebar-text">Jub List</span>
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

        <a href="#" class="sidebar-link" data-id="opr_job_reg">
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
    $('.sidebar-container').html(sidebarHTML);

    // --- Sidebar & Profile Logic ---
    const $sidebar = $('.app-sidebar');
    const $toggleBtn = $('.sidebar-toggle-header');
    const $sidebarTexts = $('.sidebar-text');
    const $userInfo = $('.user-info');
    const $userAvatar = $('.user-avatar');

    // Load User Info from localStorage
    const currentUserName = localStorage.getItem('currentUserName') || 'Admin User';
    $('.user-name').text(currentUserName);
    $('.user-avatar').attr('src', `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=2c3235&color=fff`);

    // Sidebar Toggle Function
    const updateSidebarUI = (collapsed) => {
        const $currentToggleBtn = $('.sidebar-toggle-header, #sidebarToggleBtn');
        if (collapsed) {
            $sidebar.removeClass('w-60').addClass('w-20');
            $sidebarTexts.addClass('hidden');
            $userInfo.addClass('hidden');
            $userAvatar.addClass('hidden');
            $currentToggleBtn.removeClass('ph-sidebar-simple').addClass('ph-list');
        } else {
            $sidebar.removeClass('w-20').addClass('w-60');
            $sidebarTexts.removeClass('hidden');
            $userInfo.removeClass('hidden');
            $userAvatar.removeClass('hidden');
            $currentToggleBtn.removeClass('ph-list').addClass('ph-sidebar-simple');
        }
    };

    // Initialize Sidebar State from localStorage
    let isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    updateSidebarUI(isCollapsed);

    // Event Listener for Toggle (using delegation to work with dynamic headers)
    $(document).on('click', '.sidebar-toggle-header, #sidebarToggleBtn', function () {
        isCollapsed = !isCollapsed;
        localStorage.setItem('sidebarCollapsed', isCollapsed);
        updateSidebarUI(isCollapsed);
    });

    // Sign Out Logic
    const logout = () => {
        localStorage.removeItem('sidebarCollapsed');
        localStorage.removeItem("userRole");
        localStorage.removeItem("currentUserName");
        window.location.href = "Login.html";
    };

    $('.sign-out-btn, .ph-sign-out').on('click', logout);
    
    // Listen for header injection to update toggle icon
    $(document).on('headerInjected', function() {
        updateSidebarUI(localStorage.getItem('sidebarCollapsed') === 'true');
    });

    // Highlight Active Sidebar Item
    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
    $(".sidebar-link").removeClass("active");
    $(`.sidebar-link[href="${currentPage}"]`).addClass("active");
});
