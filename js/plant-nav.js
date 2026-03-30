/* 
  Plant Navigation Component and OT Modal functionality
*/

function renderPlantNav(activePageId) {
    const $navContainer = $('#plant-nav-container');
    if (!$navContainer.length) return;

    const currentUrl = new URL(window.location.href);
    const currentPlant = (currentUrl.searchParams.get('plant') || '').trim();

    // Configuration array
    const navGroups = [
        {
            items: [
                { id: 'technician_logbook', label: 'Logs', icon: 'ph-list-dashes', href: 'plant_detail.html' }
            ]
        },
        {
            items: [
                { id: 'job_types', label: 'Type Of Job', icon: 'ph-wrench', href: 'job_types.html' },
                { id: 'instrument_types', label: 'Type Of Inst', icon: 'ph-cpu', href: 'instrument_types.html' }
            ]
        },
        {
            dropdown: true,
            id: 'reports_group',
            label: 'Reports',
            icon: 'ph-chart-bar',
            activeIds: ['remark_reports', 'tagwise_filter', 'monthly_report', 'datewise_report', 'namewise_report'],
            items: [
                { id: 'remark_reports', label: 'Remark Report', icon: 'ph-note', href: 'remark_reports.html' },
                { id: 'tagwise_filter', label: 'TagWise Filter', icon: 'ph-funnel', href: 'tagwise_filter.html' },
                { id: 'monthly_report', label: 'Monthly Report', icon: 'ph-calendar-blank', href: 'monthly_report.html' },
                { id: 'datewise_report', label: 'Date Wise Report', icon: 'ph-calendar-dots', href: 'datewise_report.html' },
                { id: 'namewise_report', label: 'Name Wise Report', icon: 'ph-user-list', href: 'namewise_report.html' }
            ]
        },
        {
            items: [
                { id: 'job_history', label: 'Job History', icon: 'ph-clock-counter-clockwise', href: 'job_history.html' },
                { id: 'ot_hours', label: 'OT Hrs', icon: 'ph-timer', href: 'ot_hours.html' },
                // { id: 'pending_log', label: 'Pending Log', icon: 'ph-hourglass-medium', href: '#' }
            ]
        },
        {
            items: [
                { id: 'modifications', label: 'Modifications', icon: 'ph-gear-fine', href: 'modifications.html' },
                { id: 'doc_change', label: 'Doc. Change', icon: 'ph-file-doc', href: 'doc_change.html' }
            ]
        }
    ];

    const isItemActive = (item) => item.id === activePageId || (activePageId === 'logs' && item.id === 'technician_logbook');
    const isGroupActive = (group) => {
        if (group.activeIds) return group.activeIds.includes(activePageId);
        return group.items.some(i => i.id === activePageId);
    };

    let groupsHtml = navGroups.map((group, gi) => {
        let html = '';
        if (gi > 0) {
            html += `<div class="plant-nav-separator"></div>`;
        }

        if (group.dropdown) {
            const active = isGroupActive(group);
            const pillCls = `plant-nav-pill ${active ? 'is-active' : ''}`;
            const ddId = `pn-dd-${group.id}`;

            html += `
                <div class="plant-nav-dropdown-wrap" data-pn-dropdown>
                    <button type="button" class="${pillCls}" data-pn-trigger="${ddId}">
                        <i class="ph-bold ${group.icon} filter-icon"></i>
                        ${group.label}
                        <i class="ph-bold ph-caret-down dropdown-caret" data-pn-caret></i>
                    </button>
                </div>
            `;
            return html;
        }

        html += group.items.map(item => {
            const active = isItemActive(item);
            const pillCls = `plant-nav-pill ${active ? 'is-active' : ''}`;
            return `
                <a href="${item.href}" class="${pillCls}">
                    <i class="ph-bold ${item.icon} filter-icon"></i>
                    ${item.label}
                </a>
            `;
        }).join('');

        return html;
    }).join('');

    $navContainer.html(`
        <div class="plant-nav-wrapper">
            <nav class="plant-nav-links">
                ${groupsHtml}
            </nav>
            <div class="plant-nav-tools">
                <button type="button" onclick="try{window.openOtModal('${currentPlant}')}catch(e){console.log('OT Modal missing')}" class="btn-ot-sm">
                    <i class="ph-bold ph-clock-user"></i>
                    <span class="btn-text-sm">O.T.</span>
                </button>
                <button type="button" data-open-modal="modal-emg-call" class="btn-emg-sm">
                    <i class="ph-bold ph-siren"></i>
                    <span class="btn-text-sm">EMG Call</span>
                </button>
            </div>
        </div>
    `);

    // Portals
    $('.pn-dropdown-portal').remove();
    navGroups.filter(g => g.dropdown).forEach(group => {
        const ddId = `pn-dd-${group.id}`;
        let panelHtml = `<div id="${ddId}" class="pn-dropdown-portal">`;
        panelHtml += (group.items || []).map(child => {
            const childActive = isItemActive(child);
            return `
                <a href="${child.href}" class="pn-dropdown-item ${childActive ? 'is-active' : ''}">
                    <i class="ph-bold ${child.icon}"></i>
                    ${child.label}
                </a>
            `;
        }).join('');
        panelHtml += `</div>`;
        $('body').append(panelHtml);
    });

    const GAP = 6;
    const positionPortal = ($panel, $trigger) => {
        const tr = $trigger[0].getBoundingClientRect();
        const pw = $panel.outerWidth();
        const ph = $panel.outerHeight();

        let left = tr.left;
        let top = tr.bottom + GAP;

        if (left + pw > $(window).width() - GAP) left = tr.right - pw;
        if (left < GAP) left = GAP;

        if (top + ph > $(window).height() - GAP) {
            const above = tr.top - ph - GAP;
            if (above >= GAP) {
                top = above;
                $panel.css('transform-origin', 'bottom left');
            }
        }

        $panel.css({ left: `${Math.round(left)}px`, top: `${Math.round(top)}px` });
    };

    const closeAll = () => {
        $('.pn-dropdown-portal').removeClass('is-open');
        $('[data-pn-caret]').css('transform', '');
    };

    const openDropdown = ($trigger, $panel) => {
        closeAll();
        positionPortal($panel, $trigger);
        $panel.addClass('is-open');
        $trigger.find('[data-pn-caret]').css('transform', 'rotate(180deg)');
    };

    $navContainer.find('[data-pn-trigger]').off('click').on('click', function(e) {
        e.stopPropagation();
        const ddId = $(this).attr('data-pn-trigger');
        const $panel = $('#' + ddId);
        if (!$panel.length) return;

        if ($panel.hasClass('is-open')) closeAll();
        else openDropdown($(this), $panel);
    });

    if (!window._pnEventsAdded) {
        $(document).on('click', function(e) {
            if (!$(e.target).closest('[data-pn-dropdown]').length && !$(e.target).closest('.pn-dropdown-portal').length) {
                closeAll();
            }
        });
        $(window).on('resize scroll', function() {
            closeAll();
        });
        window._pnEventsAdded = true;
    }
}

/** OT Statement Modal Logic */
window.openOtModal = (function () {
    const MODAL_ID = 'modal-ot-statement';

    const OT_DATA = [
        { ecno: 'N.A.', name: 'N.A.', date: '01/03/2026', shift: 'A', from: '', to: '', otReason: '', detailReason: 'nd taken found OK\nner checked found OK', rs: '', min: '' },
        { ecno: 'BOILE', name: 'BOILER', date: '01/03/2026', shift: 'B', from: '', to: '', otReason: '', detailReason: 'berated so its operation check with operator found ok', rs: '', min: '' },
        { ecno: 'ASH', name: 'ASH', date: '01/03/2026', shift: 'C', from: '', to: '', otReason: '', detailReason: 'n checked and cylinder callnk found so link and seal pressure found ok', rs: '', min: '' },
        { ecno: 'N.A.', name: 'N.A.', date: '01/03/2026', shift: 'A', from: '', to: '', otReason: '', detailReason: 'nd taken found OK\nner checked found OK', rs: '', min: '' },
        { ecno: 'ASH', name: 'ASH', date: '01/03/2026', shift: 'B', from: '', to: '', otReason: 'DEFECT MAINTENANCE', detailReason: 'Seal not coming due to mech, so bypass it as per process requirements.', rs: '', min: '' },
        { ecno: 'ASH', name: 'ASH', date: '01/03/2026', shift: 'C', from: '', to: '', otReason: 'DEFECT MAINTENANCE', detailReason: 'Seal not coming because valve remain minor open due to mech. Manual operation done and seal ok', rs: '', min: '' },
        { ecno: 'N.A.', name: 'N.A.', date: '01/03/2026', shift: 'A', from: '', to: '', otReason: 'N.A', detailReason: 'Boiler CPP CPEU system round taken found OK\nAll visible and UV flame scanner checked found OK', rs: '', min: '' },
        { ecno: 'ASH', name: 'ASH', date: '01/03/2026', shift: 'B', from: '', to: '', otReason: 'DEFECT MAINTENANCE', detailReason: 'DV-1 seal pressure Ok indication bypass due to mechanical seal damage.', rs: '', min: '' },
        { ecno: 'ASH', name: 'ASH', date: '01/03/2026', shift: 'C', from: '', to: '', otReason: 'DEFECT MAINTENANCE', detailReason: 'Seal pressure Ok indication bypass as per process requirement.', rs: '', min: '' },
        { ecno: 'BOILER-2', name: 'BOILER-2', date: '01/03/2026', shift: 'A', from: '', to: '', otReason: 'DEFECT MAINTENANCE', detailReason: 'Open feedback bypass due to not available in open condition.', rs: '', min: '' },
    ];

    function getFilteredData() {
        const month = $('#ot-filter-month').val() || '';
        const year = $('#ot-filter-year').val() || '';
        const ecno = ($('#ot-filter-ecno').val() || '').trim().toLowerCase();

        return OT_DATA.filter(row => {
            const parts = row.date.split('/');
            const rowMonth = parts[1] || '';
            const rowYear = parts[2] || '';
            if (month && rowMonth !== month) return false;
            if (year && !rowYear.startsWith(year)) return false;
            if (ecno && !row.ecno.toLowerCase().includes(ecno)) return false;
            return true;
        });
    }

    function renderTable() {
        const rows = getFilteredData();
        let totalRs = 0, totalMin = 0;

        const $tbody = $('#ot-tbody');
        if (rows.length === 0) {
            $tbody.html(`<tr><td colspan="11" class="ot-table-empty">No records found.</td></tr>`);
        } else {
            $tbody.html(rows.map((r, i) => {
                totalRs += Number(r.rs) || 0;
                totalMin += Number(r.min) || 0;
                const otReasonValue = r.otReason || '-';
                const hasReason = otReasonValue !== '-' && otReasonValue !== 'N.A';
                
                return `
                <tr class="ot-table-row">
                    <td class="ot-cell-center">${i + 1}</td>
                    <td class="ot-cell-center ot-bold-blue">${r.ecno || '-'}</td>
                    <td class="ot-cell-primary">${r.name || '-'}</td>
                    <td class="ot-cell-center ot-date">${r.date || '-'}</td>
                    <td class="ot-cell-center ot-bold-primary">${r.shift || '-'}</td>
                    <td class="ot-cell-center ot-mono">${r.from || '-'}</td>
                    <td class="ot-cell-center ot-mono">${r.to || '-'}</td>
                    <td class="ot-cell-primary">
                        ${hasReason 
                            ? `<span class="ot-reason-pill">${otReasonValue}</span>`
                            : `<span class="ot-reason-empty">${otReasonValue}</span>`
                        }
                    </td>
                    <td class="ot-cell-desc">${r.detailReason || '-'}</td>
                    <td class="ot-cell-center ot-bold-primary">${r.rs || '-'}</td>
                    <td class="ot-cell-center ot-bold-primary">${r.min || '-'}</td>
                </tr>`;
            }).join(''));
        }

        $('#ot-total-rs').text(totalRs);
        $('#ot-total-min').text(totalMin);
        $('#ot-record-count').text(rows.length);
    }

    window._otRenderTable = renderTable;

    function buildModal(plant) {
        const now = new Date();
        const curMonth = String(now.getMonth() + 1).padStart(2, '0');
        const curYear = String(now.getFullYear());

        const months = [
            ['01', 'January'], ['02', 'February'], ['03', 'March'], ['04', 'April'],
            ['05', 'May'], ['06', 'June'], ['07', 'July'], ['08', 'August'],
            ['09', 'September'], ['10', 'October'], ['11', 'November'], ['12', 'December']
        ];
        const monthOptions = months.map(([v, l]) =>
            `<option value="${v}" ${v === curMonth ? 'selected' : ''}>${l}</option>`
        ).join('');

        const years = [];
        for (let y = now.getFullYear(); y >= 2020; y--) years.push(y);
        const yearOptions = years.map(y =>
            `<option value="${y}" ${y === now.getFullYear() ? 'selected' : ''}>${y}</option>`
        ).join('');

        const modalHtml = `
        <div id="${MODAL_ID}" class="gnfc-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="ot-modal-title">
            <div class="gnfc-modal-shell gnfc-modal-shell--2xl">
                <div class="gnfc-modal-header">
                    <div class="ot-modal-title-layout">
                        <div class="ot-modal-icon">
                            <i class="ph-fill ph-clock-user text-[20px]"></i>
                        </div>
                        <div>
                            <h2 id="ot-modal-title" class="gnfc-modal-title">Over Time Statement</h2>
                            <p class="gnfc-modal-subtitle">Plant: <span class="fw-bold color-primary">${plant}</span></p>
                        </div>
                    </div>
                    <button type="button" onclick="window.closeOtModal()" class="gnfc-modal-close" aria-label="Close">
                        <i class="ph-bold ph-x text-lg pointer-events-none"></i>
                    </button>
                </div>

                <div class="ot-filter-bar">
                    <div class="ot-filter-group">
                        <label class="gnfc-modal-label">Month</label>
                        <select id="ot-filter-month" class="gnfc-modal-input ot-select-sm" onchange="window._otRenderTable()">
                            <option value="">All</option>
                            ${monthOptions}
                        </select>
                    </div>
                    <div class="ot-filter-group">
                        <label class="gnfc-modal-label">Year</label>
                        <select id="ot-filter-year" class="gnfc-modal-input ot-select-sm" onchange="window._otRenderTable()">
                            <option value="">All</option>
                            ${yearOptions}
                        </select>
                    </div>
                    <div class="ot-filter-group">
                        <label class="gnfc-modal-label">ECNO</label>
                        <input id="ot-filter-ecno" type="text" placeholder="Search ECNO…" class="gnfc-modal-input ot-input-sm" oninput="window._otRenderTable()">
                    </div>
                    <button type="button" onclick="window._otRenderTable()" class="gnfc-modal-btn gnfc-modal-btn-primary ot-btn-go">
                        <i class="ph-bold ph-magnifying-glass"></i> Go
                    </button>
                </div>

                <div class="gnfc-modal-body gnfc-modal-body--flush ot-table-view">
                    <table class="ot-table theme-table">
                        <thead class="sticky top-0 z-10">
                            <tr>
                                <th style="width: 50px;">SR</th>
                                <th style="width: 100px;">ECNO</th>
                                <th style="width: 120px;" class="text-left">NAME</th>
                                <th style="width: 120px;">DATE</th>
                                <th style="width: 70px;">SHIFT</th>
                                <th style="width: 80px;">FROM</th>
                                <th style="width: 80px;">TO</th>
                                <th style="width: 160px;" class="text-left">OT REASON</th>
                                <th class="text-left">DETAIL REASON</th>
                                <th style="width: 80px;">RS</th>
                                <th style="width: 80px;">MIN</th>
                            </tr>
                        </thead>
                        <tbody id="ot-tbody"></tbody>
                        <tfoot class="ot-tfoot">
                            <tr>
                                <td colspan="9" class="ot-tfoot-label">TOTAL</td>
                                <td id="ot-total-rs" class="ot-tfoot-val ot-tfoot-rs">0</td>
                                <td id="ot-total-min" class="ot-tfoot-val">0</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="gnfc-modal-footer gnfc-modal-footer--space-between">
                    <div class="ot-record-info">
                        Showing <span id="ot-record-count" class="fw-bold color-primary mx-1">0</span> entries
                    </div>
                    <div class="ot-modal-actions">
                        <button type="button" onclick="window.openOtSummaryModal()" class="gnfc-modal-btn gnfc-modal-btn-secondary">
                            <i class="ph-bold ph-chart-bar mr-1"></i>Summary
                        </button>
                        <button type="button" onclick="window.openOtTotalReportModal()" class="gnfc-modal-btn gnfc-modal-btn-primary">
                            <i class="ph-bold ph-printer mr-1"></i>Total Report
                        </button>
                        <button type="button" onclick="window.closeOtModal()" class="gnfc-modal-btn gnfc-modal-btn-secondary">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        $('body').append(modalHtml);
        
        $('#' + MODAL_ID).on('click', function (e) {
            if (e.target === this) window.closeOtModal();
        });
    }

    return function openOtModal(plantName) {
        const plant = (plantName || 'BOILER').toUpperCase();
        let $modal = $('#' + MODAL_ID);
        if (!$modal.length) {
            buildModal(plant);
            $modal = $('#' + MODAL_ID);
        }

        requestAnimationFrame(() => {
            $modal.addClass('is-open');
            renderTable();
        });
    };
})();

window.closeOtModal = function () {
    $('#modal-ot-statement').removeClass('is-open');
};

/** OT Summary Child Modal */
window.openOtSummaryModal = function () {
    const filterMonth = $('#ot-filter-month').val() || (new Date().getMonth() + 1).toString();
    const filterYear = $('#ot-filter-year').val() || new Date().getFullYear();
    const min = $('#ot-total-min').text() || '0';
    const numPersons = $('#ot-tbody tr:not(:has(.ot-table-empty))').length || 0;

    let m = parseInt(min) || 0;
    const hr = Math.floor(m / 60);
    const remMin = m % 60;

    if (!$('#modal-ot-summary').length) {
        const html = `
            <div id="modal-ot-summary" class="gnfc-modal-overlay" role="dialog" aria-modal="true" style="z-index: 10005;">
                <div class="gnfc-modal-shell gnfc-modal-shell--medium">
                    <div class="gnfc-modal-header">
                        <h2 class="gnfc-modal-title">Over Time Summary</h2>
                        <button type="button" onclick="window.closeOtSummaryModal()" class="gnfc-modal-close">
                            <i class="ph-bold ph-x text-lg pointer-events-none"></i>
                        </button>
                    </div>
                    <div class="gnfc-modal-body p-6 flex flex-col gap-4">
                        <h3 class="ot-summary-heading">Over Time Summary for the month of <span id="summ-month-year" class="fw-bold"></span></h3>
                        <div class="ot-summary-details">
                            <div><span class="fw-bold color-primary">No Of Person :</span> <span id="summ-persons" class="color-blue fw-bold"></span></div>
                            <div class="ot-summary-row mt-2">
                                <span class="fw-bold color-primary">Grand Total :</span> 
                                <div class="ot-time-inputs">
                                    <span>Hr : <input type="text" id="summ-hr" class="gnfc-modal-input ot-min-input" readonly></span>
                                    <span>Min : <input type="text" id="summ-min" class="gnfc-modal-input ot-min-input" readonly></span>
                                </div>
                            </div>
                            <div class="ot-summary-row mt-4 mb-2">
                                <span class="fw-bold color-primary">Reason:</span>
                                <input type="text" class="gnfc-modal-input ot-reason-input">
                                <button class="gnfc-modal-btn gnfc-modal-btn-secondary py-1 h-30px" style="height: 30px; font-size: 13px;"><i class="ph-bold ph-export pt-0.5"></i> Export</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        $('body').append(html);
    }

    $('#summ-month-year').text(`${parseInt(filterMonth)}/${filterYear}`);
    $('#summ-persons').text(numPersons);
    $('#summ-hr').val(hr);
    $('#summ-min').val(remMin);

    requestAnimationFrame(() => $('#modal-ot-summary').addClass('is-open'));
};

window.closeOtSummaryModal = function () {
    $('#modal-ot-summary').removeClass('is-open');
};

/** OT Total Report Child Modal */
window.openOtTotalReportModal = function () {
    const filterMonth = $('#ot-filter-month').val() || (new Date().getMonth() + 1).toString();
    const filterYear = $('#ot-filter-year').val() || new Date().getFullYear();
    const min = $('#ot-total-min').text() || '0';
    const numPersons = $('#ot-tbody tr:not(:has(.ot-table-empty))').length || 0;

    let m = parseInt(min) || 0;
    const hr = Math.floor(m / 60);
    const remMin = m % 60;

    if (!$('#modal-ot-total-report').length) {
        const html = `
            <div id="modal-ot-total-report" class="gnfc-modal-overlay" role="dialog" aria-modal="true" style="z-index: 10005;">
                <div class="gnfc-modal-shell gnfc-modal-shell--medium">
                    <div class="gnfc-modal-header">
                        <h2 class="gnfc-modal-title">Over Time Summary (Total Report)</h2>
                        <button type="button" onclick="window.closeOtTotalReportModal()" class="gnfc-modal-close">
                            <i class="ph-bold ph-x text-lg pointer-events-none"></i>
                        </button>
                    </div>
                    <div class="gnfc-modal-body p-6 flex flex-col gap-4">
                        <h3 class="ot-summary-heading">Over Time Summary for the month of <span id="tot-month-year" class="fw-bold"></span></h3>
                        <div class="ot-summary-details">
                            <div><span class="fw-bold color-primary">No Of Person :</span> <span id="tot-persons" class="color-blue fw-bold"></span></div>
                            <div class="ot-summary-row mt-2">
                                <span class="fw-bold color-primary">Grand Total :</span> 
                                <span class="fw-bold">Hr :</span> <span id="tot-hr" class="color-primary"></span>
                                <span class="fw-bold ml-2">Min :</span> <span id="tot-min" class="color-primary"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        $('body').append(html);
    }

    $('#tot-month-year').text(`${parseInt(filterMonth)}/${filterYear}`);
    $('#tot-persons').text(numPersons);
    $('#tot-hr').text(hr);
    $('#tot-min').text(remMin);

    requestAnimationFrame(() => $('#modal-ot-total-report').addClass('is-open'));
};

window.closeOtTotalReportModal = function () {
    $('#modal-ot-total-report').removeClass('is-open');
};

// Auto-run if container exists
$(document).ready(function() {
    renderPlantNav(window.activePage || 'technician_logbook');
});
