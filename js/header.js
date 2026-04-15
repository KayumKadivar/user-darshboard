
$(function () {
    const $headerContainer = $('#header-container');
    if (!$headerContainer.length) return;

    const pageTitle = $headerContainer.data('title') || 
                      (document.title ? document.title.split('|')[0].trim() : 'Dashboard');

    const generateBreadcrumbs = () => {
        const breadcrumbData = $headerContainer.data('breadcrumb');
        if (!breadcrumbData) return '';

        const items = breadcrumbData.split(',').map(item => {
            const [label, url] = item.split(':');
            if (url === 'active') {
                return `<span class="plant-nav-item is-active">${label}</span>`;
            }
            return `
                <a href="${url}" class="plant-nav-item">${label}</a>
                <i class="ph-bold ph-caret-right"></i>
            `;
        }).join('');

        return `<div class="plant-nav-section">${items}</div>`;
    };

    const headerHTML = `
      <div class="header-bar">
        <div class="header-left-side">
          <i class="sidebar-toggle-header ph ph-list color-label cursor-pointer font-20px"></i>
          <div class="header-title-section">
            <h2 class="header-title">${pageTitle}</h2>
            ${generateBreadcrumbs()}
          </div>
        </div>

        <div class="header-right-side">
            <!-- Font Size & Theme Group -->
            <div class="ui-control-set">
              <button class="fontDecreaseBtn ui-btn-icon" title="Decrease Font">
                <i class="ph ph-text-aa font-12px"></i>
              </button>
              <div class="ui-divider-v"></div>
              <button class="fontIncreaseBtn ui-btn-icon" title="Increase Font">
                <i class="ph ph-text-aa font-18px"></i>
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
