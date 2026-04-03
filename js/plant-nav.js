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
            const plantPart = currentPlant ? `?plant=${encodeURIComponent(currentPlant)}` : '';
            const href = item.href === '#' ? '#' : `${item.href}${plantPart}`;
            return `
                <a href="${href}" class="${pillCls}">
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
            const plantPart = currentPlant ? `?plant=${encodeURIComponent(currentPlant)}` : '';
            const href = child.href === '#' ? '#' : `${child.href}${plantPart}`;
            return `
                <a href="${href}" class="pn-dropdown-item ${childActive ? 'is-active' : ''}">
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


// Auto-run if container exists
$(document).ready(function() {
    renderPlantNav(window.activePage || 'technician_logbook');
});
