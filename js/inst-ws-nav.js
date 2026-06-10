function renderInstWsNav(activePageId) {
    const $navContainer = $('#plant-nav-container');
    if (!$navContainer.length) return;

    // Determine if an item is active
    const isActive = (id) => id === activePageId ? 'is-active' : '';
    const isDropdownActive = (ids) => ids.includes(activePageId) ? 'is-active' : '';

    const html = `
      <div class="plant-nav-wrapper">
        <nav class="plant-nav-links">
          <a href="inst_ws_logbook.html" class="plant-nav-pill ${isActive('inst_ws_logbook')}">
            <i class="ph-bold ph-list-dashes filter-icon"></i> Logs
          </a>
          <div class="plant-nav-separator"></div>
          
          <div class="plant-nav-dropdown-wrap" data-custom-dropdown>
            <button type="button" class="plant-nav-pill ${isDropdownActive(['job_types', 'instrument_types', 'remark_reports', 'tagwise_filter', 'jobwise_filter', 'searchwise_filter', 'monthly_report', 'datewise_report', 'namewise_report', 'name_date_report'])}" data-toggle="reports-dd">
              <i class="ph-bold ph-chart-bar filter-icon"></i> Reports
              <i class="ph-bold ph-caret-down dropdown-caret"></i>
            </button>
            <div id="reports-dd" class="pn-dropdown-portal">
                <a href="../job_types.html" class="pn-dropdown-item ${isActive('job_types')}"><i class="ph-bold ph-wrench"></i> Type Of Job</a>
                <a href="../instrument_types.html" class="pn-dropdown-item ${isActive('instrument_types')}"><i class="ph-bold ph-cpu"></i> Type Of Inst</a>
                <a href="inst_ws_remarks_report.html" class="pn-dropdown-item ${isActive('remark_reports')}"><i class="ph-bold ph-note"></i> Remark Report</a>
                <a href="../tagwise_filter.html" class="pn-dropdown-item ${isActive('tagwise_filter')}"><i class="ph-bold ph-funnel"></i> Tag Wise Filter</a>
                <a href="inst_ws_jobwiserfilter.html" class="pn-dropdown-item ${isActive('jobwise_filter')}"><i class="ph-bold ph-magnifying-glass"></i> Job Wise Filter</a>
                <a href="inst_ws_searchwise_filter.html" class="pn-dropdown-item ${isActive('searchwise_filter')}"><i class="ph-bold ph-magnifying-glass-plus"></i> Search Wise Filter</a>
                <a href="inst_ws_monthly_report.html" class="pn-dropdown-item ${isActive('monthly_report')}"><i class="ph-bold ph-calendar-blank"></i> Monthly Report</a>
                <a href="inst_ws_datewise_report.html" class="pn-dropdown-item ${isActive('datewise_report')}"><i class="ph-bold ph-calendar-dots"></i> Date Wise Report</a>
                <a href="inst_ws_namewise_report.html" class="pn-dropdown-item ${isActive('namewise_report')}"><i class="ph-bold ph-user-list"></i> Name Wise Report</a>
                <a href="../name_date_report.html" class="pn-dropdown-item ${isActive('name_date_report')}"><i class="ph-bold ph-users-three"></i> Name & Tag Wise Report</a>
            </div>
          </div>
                
          <div class="plant-nav-separator"></div>

          <a href="../ot_hours.html" class="plant-nav-pill ${isActive('ot_hours')}">
            <i class="ph-bold ph-timer filter-icon"></i> OT Hrs
          </a>
          <div class="plant-nav-separator"></div>
          <div class="plant-nav-separator"></div>
          <a href="../doc_change.html" class="plant-nav-pill ${isActive('doc_change')}">
            <i class="ph-bold ph-file-doc filter-icon"></i> Doc. Change
          </a>
          <div class="plant-nav-separator"></div>
          <a href="../Helper.html" class="plant-nav-pill ${isActive('helper')}">
            <i class="ph-bold ph-users filter-icon"></i> Helper
          </a>
          <div class="plant-nav-separator"></div>
          <a href="../cost_saving.html" class="plant-nav-pill ${isActive('cost_saving')}">
            <i class="ph-bold ph-coins filter-icon"></i> Cost Saving
          </a>
          <div class="plant-nav-separator"></div>
          <a href="../c-lab.html" class="plant-nav-pill ${isActive('c_lab')}">
            <i class="ph-bold ph-flask filter-icon"></i> C-Lab
          </a>
          <div class="plant-nav-separator"></div>
          <a href="Job_status.html" class="plant-nav-pill ${isActive('Job_status')}">
            <i class="ph-bold ph-clipboard filter-icon"></i> Job Status
          </a>
        </nav>
        <div class="plant-nav-tools">
          <button type="button" onclick="window.location.href='../ot_statement.html'" class="btn-ot-sm ${isActive('ot_statement')}">
            <i class="ph-bold ph-clock-user"></i>
            <span class="btn-text-sm">O.T.</span>
          </button>
          <button type="button" onclick="window.location.href='../emg_call.html'" class="btn-emg-sm ${isActive('emg_call')}">
            <i class="ph-bold ph-siren"></i>
            <span class="btn-text-sm">EMG Call</span>
          </button>
        </div>
      </div>
    `;

    $navContainer.html(html);

    // Initialize Dropdowns
    $('#reports-dd, #history-dd').appendTo('body');
    
    $('[data-toggle]').on('click', function(e) {
      e.stopPropagation();
      const targetId = $(this).data('toggle');
      const $panel = $('#' + targetId);
      const isOpen = $panel.hasClass('is-open');
      
      // Close all
      $('.pn-dropdown-portal').removeClass('is-open');
      $('.dropdown-caret').css('transform', '');
      
      if (!isOpen) {
        // Position
        const rect = this.getBoundingClientRect();
        $panel.css({
          top: (rect.bottom + 6) + 'px',
          left: rect.left + 'px'
        });
        $panel.addClass('is-open');
        $(this).find('.dropdown-caret').css('transform', 'rotate(180deg)');
      }
    });
    
    if (!window._instNavEventsBound) {
        $(document).on('click', function(e) {
          if (!$(e.target).closest('[data-custom-dropdown]').length && !$(e.target).closest('.pn-dropdown-portal').length) {
            $('.pn-dropdown-portal').removeClass('is-open');
            $('.dropdown-caret').css('transform', '');
          }
        });
        
        $(window).on('resize scroll', function() {
          $('.pn-dropdown-portal').removeClass('is-open');
          $('.dropdown-caret').css('transform', '');
        });
        
        window._instNavEventsBound = true;
    }
}

$(document).ready(function() {
    renderInstWsNav(window.activePage || 'inst_ws_logbook');
});
