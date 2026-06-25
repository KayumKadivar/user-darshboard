function renderOfficerHeader(activeView = 'today') {
    const $container = $('#officer-nav-container');
    if (!$container.length) return;

    const html = `
      <!-- Plant Navigation Container (Top Row Buttons) -->
      <div class="plant-nav-wrapper" style="margin-bottom: 24px;">
          <nav class="plant-nav-links">
              <a href="off_typeofjob_report.html" class="plant-nav-pill">
                  <i class="ph-bold ph-wrench filter-icon"></i> TypeOfJob
              </a>
              <a href="off_remark_repot.html" class="plant-nav-pill">
                  <i class="ph-bold ph-note filter-icon"></i> Remark Report
              </a>
              <a href="off_tagswise_filter.html" class="plant-nav-pill">
                  <i class="ph-bold ph-funnel filter-icon"></i> TagWiseFilter
              </a>
              <a href="#" class="plant-nav-pill">
                  <i class="ph-bold ph-calendar-blank filter-icon"></i> Monthly Report
              </a>
              <a href="#" class="plant-nav-pill">
                  <i class="ph-bold ph-calendar-dots filter-icon"></i> DateWiseReport
              </a>
              <a href="#" class="plant-nav-pill">
                  <i class="ph-bold ph-clock-counter-clockwise filter-icon"></i> History
              </a>
              <a href="off_namewise.html" class="plant-nav-pill">
                  <i class="ph-bold ph-users filter-icon"></i> NameWise
              </a>
          </nav>
          <div class="plant-nav-tools">
              <button type="button" class="btn-emg-sm">
                  <i class="ph-bold ph-siren"></i>
                  <span class="btn-text-sm">EMG Call</span>
              </button>
              <button type="button" class="btn-ot-sm" onclick="window.location.href='off_extra_duty.html'">
                  <i class="ph-bold ph-timer"></i>
                  <span class="btn-text-sm">Extra Duty</span>
              </button>
          </div>
      </div>

      <!-- Toolbar (Switcher and Action Buttons) -->
      <section class="ui-card plant-toolbar-card">
        <div class="plant-toolbar">
          
          <div class="plant-toolbar__left">
            <div class="ui-switcher" role="group">
              <button type="button" class="ui-switcher-btn ${activeView === 'today' ? 'is-active' : ''}" data-view="today">Today</button>
              <button type="button" class="ui-switcher-btn ${activeView === 'prev' ? 'is-active' : ''}" data-view="prev">PrevDay</button>
              <span class="plant-period-switcher__divider" aria-hidden="true"></span>
              <button type="button" class="ui-switcher-btn ${activeView === 'weekly' ? 'is-active' : ''}" data-view="weekly">Weekly</button>
              <button type="button" class="ui-switcher-btn ${activeView === 'monthly' ? 'is-active' : ''}" data-view="monthly">Monthly</button>
            </div>
          </div>
          
          <div class="plant-toolbar__right">
            <button type="button" class="plant-nav-pill" onclick="window.location.href='off_add_log.html'">
              <i class="ph-bold ph-plus" aria-hidden="true"></i>
              <span>Add</span>
            </button>
            <button type="button" class="plant-nav-pill" onclick="window.location.href='off_ot.html'">
              <i class="ph-bold ph-pencil-simple" aria-hidden="true"></i>
              <span>O.T.</span>
            </button>
          </div>

        </div>
      </section>
    `;

    $container.html(html);

    // Reattach switcher event logic
    $container.find('.ui-switcher-btn').on('click', function() {
        $container.find('.ui-switcher-btn').removeClass('is-active');
        $(this).addClass('is-active');
        // Dispatch event for view change
        const view = $(this).data('view');
        $(document).trigger('officerViewChanged', [view]);
    });
}

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialView = urlParams.get('view') || 'today';
    renderOfficerHeader(initialView);
});
