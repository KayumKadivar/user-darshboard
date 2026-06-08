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
            dropdown: true,
            id: 'reports_group',
            label: 'Reports',
            icon: 'ph-chart-bar',
            activeIds: ['job_types', 'instrument_types', 'remark_reports', 'tagwise_filter', 'monthly_report', 'datewise_report', 'namewise_report', 'name_date_report'],
            items: [
                { id: 'job_types', label: 'Type Of Job', icon: 'ph-wrench', href: 'job_types.html' },
                { id: 'instrument_types', label: 'Type Of Inst', icon: 'ph-cpu', href: 'instrument_types.html' },
                { id: 'remark_reports', label: 'Remark Report', icon: 'ph-note', href: 'remark_reports.html' },
                { id: 'tagwise_filter', label: 'Tag Wise Filter', icon: 'ph-funnel', href: 'tagwise_filter.html' },
                { id: 'monthly_report', label: 'Monthly Report', icon: 'ph-calendar-blank', href: 'monthly_report.html' },
                { id: 'datewise_report', label: 'Date Wise Report', icon: 'ph-calendar-dots', href: 'datewise_report.html' },
                { id: 'namewise_report', label: 'Name Wise Report', icon: 'ph-user-list', href: 'namewise_report.html' },
                { id: 'name_date_report', label: 'Name & Tag Wise Report', icon: 'ph-users-three', href: 'name_date_report.html' }
            ]
        },
        {
            dropdown: true,
            id: 'job_history_group',
            label: 'Job History',
            icon: 'ph-clock-counter-clockwise',
            activeIds: ['job_history', 'job_history_system', 'general_job_history'],
            items: [
                { id: 'job_history', label: 'General Job History', icon: 'ph-clipboard-text', href: 'job_history.html' },
                { id: 'job_history_system', label: 'System Job History', icon: 'ph-desktop', href: 'job_history_system.html' }
            ]
        },
        {
            items: [
                { id: 'ot_hours', label: 'OT Hrs', icon: 'ph-timer', href: 'ot_hours.html' }
            ]
        },
        {
            items: [
                { id: 'modifications', label: 'Modifications', icon: 'ph-gear-fine', href: 'modifications.html' },
                { id: 'doc_change', label: 'Doc. Change', icon: 'ph-file-doc', href: 'doc_change.html' },
                { id: 'helper', label: 'Helper', icon: 'ph-users', href: 'Helper.html' },
                { id: 'cost_saving', label: 'Cost Saving', icon: 'ph-coins', href: 'cost_saving.html' },
                { id: 'c_lab', label: 'C-Lab', icon: 'ph-flask', href: 'c-lab.html' }
            ]
        },
        {
            isTools: true,
            items: [
                { id: 'ot_statement', label: 'O.T.', icon: 'ph-clock-user', href: 'ot_statement.html', class: 'btn-ot-sm' },
                { id: 'emg_call', label: 'EMG Call', icon: 'ph-siren', href: 'emg_call.html', class: 'btn-emg-sm' }
            ]
        }
    ];

    const isItemActive = (item) => item.id === activePageId || (activePageId === 'logs' && item.id === 'technician_logbook');
    const isGroupActive = (group) => {
        if (group.activeIds) return group.activeIds.includes(activePageId);
        return group.items.some(i => i.id === activePageId);
    };

    const plantPart = currentPlant ? `?plant=${encodeURIComponent(currentPlant)}` : '';

    let groupsHtml = navGroups.filter(g => !g.isTools).map((group, gi) => {
        let html = '';
        if (gi > 0) {
            html += `<div class="plant-nav-separator"></div>`;
        }

        if (group.dropdown) {
            const active = isGroupActive(group);
            const activeItem = group.items.find(i => isItemActive(i));
            const displayLabel = activeItem ? activeItem.label : group.label;
            const pillCls = `plant-nav-pill ${active ? 'is-active' : ''}`;
            const ddId = `pn-dd-${group.id}`;

            html += `
                <div class="plant-nav-dropdown-wrap" data-pn-dropdown>
                    <button type="button" class="${pillCls}" data-pn-trigger="${ddId}">
                        <i class="ph-bold ${group.icon} filter-icon"></i>
                        ${displayLabel}
                        <i class="ph-bold ph-caret-down dropdown-caret" data-pn-caret></i>
                    </button>
                </div>
            `;
            return html;
        }

        html += group.items.map(item => {
            const active = isItemActive(item);
            const pillCls = `plant-nav-pill ${active ? 'is-active' : ''}`;
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

    // Render Tools (Buttons on the right)
    const toolsGroup = navGroups.find(g => g.isTools);
    let toolsHtml = '';
    if (toolsGroup) {
        toolsHtml = toolsGroup.items.map(item => {
            const active = isItemActive(item);
            const href = item.href === '#' ? '#' : `${item.href}${plantPart}`;
            return `
                <button type="button" onclick="window.location.href='${href}'" class="${item.class} ${active ? 'is-active' : ''}">
                    <i class="ph-bold ${item.icon}"></i>
                    <span class="btn-text-sm">${item.label}</span>
                </button>
            `;
        }).join('');
    }

    $navContainer.html(`
        <div class="plant-nav-wrapper">
            <nav class="plant-nav-links">
                ${groupsHtml}
            </nav>
            <div class="plant-nav-tools">
                ${toolsHtml}
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
