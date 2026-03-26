/**
 * header.js
 * Dynamically injects the header into the #header-container element.
 * Supports dynamic titles via data-title attribute or document title.
 */

$(function () {
    const $headerContainer = $('#header-container');
    if (!$headerContainer.length) return;

    // Determine the page title
    // Priority: 1. data-title attribute, 2. document title (before |), 3. Default "Dashboard"
    const pageTitle = $headerContainer.data('title') || 
                      (document.title ? document.title.split('|')[0].trim() : 'Dashboard');

    const headerHTML = `
      <div class="header-bar">
        <div class="header-left-side">
          <i class="sidebar-toggle-header ph ph-list color-label cursor-pointer font-20px"></i>
          <h2 class="header-title">${pageTitle}</h2>
        </div>

        <div class="header-right-side">
            <!-- Font Size & Theme Group -->
            <div class="ui-control-set">
              <button class="fontDecreaseBtn ui-btn-icon" title="Decrease Font">
                <i class="ph ph-text-aa font-12px"></i>
              </button>
              <div class="ui-divider-v"></div>
              <button class="fontIncreaseBtn ui-btn-icon" title="Increase Font">
                <i class="ph ph-text-aa font-12px"></i>
              </button>
              <div class="ui-divider-v"></div>
              <button class="themeToggleBtn ui-btn-icon" title="Toggle Theme">
                <i class="themeIcon ph ph-moon"></i>
              </button>
            </div>

            <!-- Back Button -->
            <button class="ui-btn-pill" id="backBtn">
              <i class="ph-bold ph-arrow-u-up-left"></i>
              <span>Back</span>
            </button>
        </div>
      </div>
    `;

    $headerContainer.html(headerHTML);
    $(document).trigger('headerInjected');

    // Back Button Logic
    $(document).on('click', '#backBtn', function () {
        const backTarget = $headerContainer.data('back');
        if (backTarget) {
            window.location.href = backTarget;
        } else if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "dashboard.html";
        }
    });
});
