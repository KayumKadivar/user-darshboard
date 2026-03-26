(function ($) {
  const PlantPage = {
    state: {
      plantName: 'METHANOL-1',
      currentView: 'today',
      searchTerm: '',
      sortKey: 'sr',
      sortDirection: 'asc',
      page: 1,
      perPage: 8,
      pendingOnly: false,
      selectedPriority: 0,
      activeRecordId: null
    },

    options: {
      technicians: ['BPB', 'PBS', 'NRK', 'SHC', 'NHP'],
      engineers: ['SHC', 'MAJ', 'CKV', 'MDM'],
      areas: ['METH', 'FA', 'AA', 'DCS', 'UTIL'],
      jobTypes: ['PROCESS REQMT', 'CMS JOB', 'PM JOB', 'BREAKDOWN', 'N.A.'],
      instTypes: ['DCS', 'TRANSMITTER', 'CONTROL VALVE', 'SWITCH', 'ANALYZER', 'OTHERS'],
      loops: {
        LIC101: ['LT101A', 'LT101B'],
        FIC204: ['FT204A', 'FV204'],
        TIC310: ['TT310A', 'TV310'],
        PIC415: ['PT415A', 'PV415'],
        AIC525: ['AT525A', 'AV525']
      }
    },

    records: [
      { id: 1, sr: 1, date: '2026-03-26', view: 'today', area: 'METH', loop: 'LIC101', tag: 'LT101A', job: 'Level calibration', jobType: 'PROCESS REQMT', tech: 'BPB', description: 'Calibrate level transmitter and verify scaling with DCS operator.', engineer: 'SHC', status: 'OVER', priority: 4, remarks: 'Completed and handed over.', ackPending: false },
      { id: 2, sr: 2, date: '2026-03-26', view: 'today', area: 'AA', loop: 'FIC204', tag: 'FV204', job: 'Valve stroking issue', jobType: 'BREAKDOWN', tech: 'PBS', description: 'Investigate erratic travel feedback on control valve.', engineer: 'MAJ', status: 'IN PROGRESS', priority: 16, remarks: 'Need positioner tuning.', ackPending: true },
      { id: 3, sr: 3, date: '2026-03-26', view: 'today', area: 'FA', loop: 'TIC310', tag: 'TT310A', job: 'Temperature loop check', jobType: 'CMS JOB', tech: 'NRK', description: 'Loop test for high drift observed in overnight report.', engineer: 'CKV', status: 'HOLD', priority: 10, remarks: 'Awaiting shutdown window.', ackPending: true },
      { id: 4, sr: 4, date: '2026-03-25', view: 'prev', area: 'DCS', loop: 'PIC415', tag: 'PV415', job: 'Pressure controller tuning', jobType: 'PROCESS REQMT', tech: 'SHC', description: 'Controller gain adjusted to reduce hunting.', engineer: 'MDM', status: 'OVER', priority: 3, remarks: 'Stable after tuning.', ackPending: false },
      { id: 5, sr: 5, date: '2026-03-27', view: 'tomorrow', area: 'UTIL', loop: 'AIC525', tag: 'AT525A', job: 'Analyzer preventive check', jobType: 'PM JOB', tech: 'NHP', description: 'Scheduled analyzer health check and line cleaning.', engineer: 'SHC', status: 'IN PROGRESS', priority: 7, remarks: 'Planned for morning shift.', ackPending: false },
      { id: 6, sr: 6, date: '2026-03-24', view: 'weekly', area: 'METH', loop: 'LIC101', tag: 'LT101B', job: 'Impulse line flushing', jobType: 'PM JOB', tech: 'BPB', description: 'Flush impulse line due to slow response during trend review.', engineer: 'MAJ', status: 'OVER', priority: 2, remarks: 'Response normalized.', ackPending: false },
      { id: 7, sr: 7, date: '2026-03-22', view: 'weekly', area: 'AA', loop: 'PIC415', tag: 'PT415A', job: 'Pressure transmitter replacement', jobType: 'BREAKDOWN', tech: 'PBS', description: 'Replace faulty transmitter and verify calibration range.', engineer: 'CKV', status: 'IN PROGRESS', priority: 18, remarks: 'Spare received from store.', ackPending: true },
      { id: 8, sr: 8, date: '2026-03-15', view: 'monthly', area: 'FA', loop: 'TIC310', tag: 'TV310', job: 'Control valve seat leakage', jobType: 'BREAKDOWN', tech: 'NRK', description: 'Seat leakage observed during maintenance round.', engineer: 'MDM', status: 'HOLD', priority: 22, remarks: 'Requires outage planning.', ackPending: true },
      { id: 9, sr: 9, date: '2026-03-18', view: 'monthly', area: 'UTIL', loop: 'FIC204', tag: 'FT204A', job: 'Flow transmitter verification', jobType: 'CMS JOB', tech: 'SHC', description: 'Cross-check transmitter output against local indicator.', engineer: 'SHC', status: 'OVER', priority: 5, remarks: 'No deviation found.', ackPending: false },
      { id: 10, sr: 10, date: '2026-03-26', view: 'today', area: 'DCS', loop: 'AIC525', tag: 'AV525', job: 'Signal card diagnostics', jobType: 'CMS JOB', tech: 'NHP', description: 'Investigate intermittent analyzer signal at marshalling panel.', engineer: 'CKV', status: 'IN PROGRESS', priority: 11, remarks: 'Monitoring after card reseat.', ackPending: false }
    ],

    init: function () {
      this.cacheDom();
      this.readQuery();
      this.populateStaticOptions();
      this.bindEvents();
      this.populateModalDefaults();
      this.renderPriorityGrid();
      this.renderAuxiliaryLists();
      this.updateView(this.state.currentView);
      this.bindHeaderSidebarToggle();
    },

    cacheDom: function () {
      this.$body = $('body');
      this.$viewButtons = $('.plant-period-switcher__button');
      this.$search = $('#table-search');
      this.$jobType = $('#job-type-select');
      this.$startDate = $('#start-date');
      this.$endDate = $('#end-date');
      this.$tableBody = $('#plantTableBody');
      this.$recordCount = $('#record-count');
      this.$viewTitle = $('#view-title');
      this.$viewDate = $('#view-date');
      this.$pageLabel = $('#page-label');
      this.$priorityHeader = $('#priority-column-header');
      this.$ackButton = $('#acknowledge-btn');
      this.$filterBar = $('#job-filter-bar');
      this.$pendingButton = $('#toggle-pending-btn');
      this.$plantTitle = $('#plant-page-title');
      this.$plantNameChip = $('#plant-name-chip');
      this.$plantViewChip = $('#plant-view-chip');
    },

    bindEvents: function () {
      const self = this;

      this.$viewButtons.on('click', function () {
        self.updateView($(this).data('view'));
      });

      this.$search.on('input', function () {
        self.state.searchTerm = $(this).val().toLowerCase();
        self.state.page = 1;
        self.renderTable();
      });

      this.$jobType.on('change', function () {
        self.state.page = 1;
        self.renderTable();
      });

      this.$startDate.add(this.$endDate).on('change', function () {
        self.state.page = 1;
        self.renderTable();
      });

      this.$pendingButton.on('click', function () {
        self.state.pendingOnly = !self.state.pendingOnly;
        self.$pendingButton.toggleClass('is-active', self.state.pendingOnly);
        self.$priorityHeader.toggleClass('is-hidden', !self.state.pendingOnly);
        self.$filterBar.toggleClass('is-hidden', !self.state.pendingOnly);
        self.state.page = 1;
        self.renderTable();
      });

      $('#close-filter-bar').on('click', function () {
        self.state.pendingOnly = false;
        self.$pendingButton.removeClass('is-active');
        self.$priorityHeader.addClass('is-hidden');
        self.$filterBar.addClass('is-hidden');
        self.renderTable();
      });

      $('#page-prev').on('click', function () {
        if (self.state.page > 1) {
          self.state.page -= 1;
          self.renderTable();
        }
      });

      $('#page-next').on('click', function () {
        self.state.page += 1;
        self.renderTable();
      });

      $('#plant-table thead').on('click', 'th[data-sort]', function () {
        const sortKey = $(this).data('sort');
        if (self.state.sortKey === sortKey) {
          self.state.sortDirection = self.state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          self.state.sortKey = sortKey;
          self.state.sortDirection = 'asc';
        }
        self.renderTable();
      });

      $(document).on('click', '[data-open-modal]', function () {
        self.openModal($(this).data('open-modal'));
      });

      $(document).on('click', '[data-close-modal]', function () {
        self.closeModal($(this).data('close-modal'));
      });

      $('.gnfc-modal-overlay').on('click', function (event) {
        if (event.target === this) {
          self.closeModal(this.id);
        }
      });

      $('.plant-nav-button').on('click', function () {
        const target = $(this).data('target');
        if (target) {
          window.location.href = target;
        }
      });

      $('#job-modal-form').on('submit', function (event) {
        event.preventDefault();
        self.createJob();
      });

      $('#edit-modal-form').on('submit', function (event) {
        event.preventDefault();
        self.saveEdit();
      });

      $('#remark-modal-form').on('submit', function (event) {
        event.preventDefault();
        self.saveRemark();
      });

      $('#priority-modal-form').on('submit', function (event) {
        event.preventDefault();
        self.savePriority();
      });

      $('#acknowledge-selected-btn').on('click', function () {
        self.acknowledgeSelectedRemarks();
      });

      $('#history-system-btn').on('click', function () {
        self.closeModal('history-type-modal');
        window.alert('System History flow can be connected here.');
      });

      $('#history-general-btn').on('click', function () {
        self.closeModal('history-type-modal');
        self.openModal('general-history-modal');
      });

      $('#add-history-btn').on('click', function () {
        self.closeModal('general-history-modal');
        window.alert('History record added.');
      });

      $('#job-loop').on('change', function () {
        self.populateTags($(this).val());
      });

      $('#priority-grid').on('click', '.plant-priority-grid__button', function () {
        self.state.selectedPriority = parseInt($(this).data('value'), 10) || 0;
        $('#priority-value').val(self.state.selectedPriority);
        $('.plant-priority-grid__button').removeClass('is-selected');
        $(this).addClass('is-selected');
      });

      $(document).on('click', '.plant-inline-button[data-action]', function () {
        const action = $(this).data('action');
        const recordId = parseInt($(this).closest('tr').data('record-id'), 10);
        self.state.activeRecordId = recordId;
        if (action === 'edit') {
          self.populateEditModal(recordId);
          self.openModal('edit-modal');
        } else if (action === 'remark') {
          self.populateRemarkModal(recordId);
          self.openModal('remark-modal');
        } else if (action === 'priority') {
          self.populatePriorityModal(recordId);
          self.openModal('priority-modal');
        } else if (action === 'history') {
          self.populateHistoryModal(recordId);
          self.openModal('history-type-modal');
        }
      });
    },

    readQuery: function () {
      const params = new URLSearchParams(window.location.search);
      const plantName = params.get('plant');
      const view = params.get('view');

      if (plantName) {
        this.state.plantName = plantName;
      }

      if (view && this.$viewButtons.filter('[data-view="' + view + '"]').length) {
        this.state.currentView = view;
      }

      this.$plantTitle.text(this.state.plantName + ' Logbook');
      this.$plantNameChip.text('Plant: ' + this.state.plantName);
    },

    populateStaticOptions: function () {
      this.fillSelect('#job-tech', this.options.technicians);
      this.fillSelect('#job-area', this.options.areas);
      this.fillSelect('#job-type', this.options.jobTypes);
      this.fillSelect('#job-inst', this.options.instTypes);
      this.fillSelect('#job-loop', Object.keys(this.options.loops));
      this.fillSelect('#edit-job-tech', this.options.technicians);
      this.fillSelect('#edit-job-engineer', this.options.engineers);
      this.fillSelect('#hist-insttag', this.options.instTypes);
      this.fillSelect('#hist-jobtype', this.options.jobTypes);
      this.fillSelect('#hist-status', ['OVER', 'IN PROGRESS', 'U/P']);
      this.fillSelect('#hist-tech', this.options.technicians);
      this.fillSelect('#hist-eng', this.options.engineers);
      this.fillSelect('#hist-area', this.options.areas);
      this.fillSelect('#job-type-select', ['All Jobs'].concat(this.options.jobTypes), true);
      this.populateTags(Object.keys(this.options.loops)[0]);
    },

    fillSelect: function (selector, options, preserveFirstValue) {
      const $select = $(selector);
      if (!$select.length) return;

      let html = '';
      options.forEach(function (item, index) {
        if (preserveFirstValue && index === 0) {
          html += '<option value="">' + item + '</option>';
        } else {
          html += '<option value="' + item + '">' + item + '</option>';
        }
      });
      $select.html(html);
    },

    populateTags: function (loopName) {
      const tags = this.options.loops[loopName] || [];
      this.fillSelect('#job-tag', tags);
    },

    populateModalDefaults: function () {
      const today = '2026-03-26';
      $('#job-date').val(today);
      $('#hist-date').val(today);
      $('#hist-loop').val(this.state.plantName);
      $('#hist-insttype').val('DCS');
    },

    updateView: function (viewName) {
      this.state.currentView = viewName;
      this.state.page = 1;
      this.$viewButtons.removeClass('is-active');
      this.$viewButtons.filter('[data-view="' + viewName + '"]').addClass('is-active');
      this.$plantViewChip.text('View: ' + this.labelForView(viewName));
      this.$viewTitle.text(this.labelForView(viewName) + ' Log Book');
      this.$viewDate.text(this.dateLabelForView(viewName));
      $('#job-date').val(this.dateValueForView(viewName));
      this.renderTable();
    },

    labelForView: function (viewName) {
      const labels = {
        tomorrow: 'Tomorrow',
        today: 'Today',
        prev: 'Previous Day',
        weekly: 'Weekly',
        monthly: 'Monthly'
      };
      return labels[viewName] || 'Today';
    },

    dateValueForView: function (viewName) {
      const values = {
        tomorrow: '2026-03-27',
        today: '2026-03-26',
        prev: '2026-03-25',
        weekly: '2026-03-20',
        monthly: '2026-03-01'
      };
      return values[viewName] || values.today;
    },

    dateLabelForView: function (viewName) {
      const labels = {
        tomorrow: '27.03.2026',
        today: '26.03.2026',
        prev: '25.03.2026',
        weekly: '20.03.2026 - 26.03.2026',
        monthly: '01.03.2026 - 31.03.2026'
      };
      return labels[viewName] || labels.today;
    },

    getFilteredRecords: function () {
      const self = this;
      const selectedType = this.$jobType.val();
      const startDate = this.$startDate.val();
      const endDate = this.$endDate.val();

      return this.records.filter(function (record) {
        const inView = record.view === self.state.currentView;
        const typeMatch = !selectedType || record.jobType === selectedType;
        const pendingMatch = !self.state.pendingOnly || record.status !== 'OVER';
        const startMatch = !startDate || record.date >= startDate;
        const endMatch = !endDate || record.date <= endDate;
        const haystack = [
          record.area,
          record.loop,
          record.tag,
          record.job,
          record.tech,
          record.description,
          record.engineer,
          record.remarks
        ].join(' ').toLowerCase();
        const searchMatch = !self.state.searchTerm || haystack.indexOf(self.state.searchTerm) >= 0;
        return inView && typeMatch && pendingMatch && startMatch && endMatch && searchMatch;
      }).sort(function (left, right) {
        const key = self.state.sortKey;
        const leftValue = left[key];
        const rightValue = right[key];
        if (leftValue < rightValue) return self.state.sortDirection === 'asc' ? -1 : 1;
        if (leftValue > rightValue) return self.state.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    },

    renderTable: function () {
      const filteredRecords = this.getFilteredRecords();
      const totalPages = Math.max(1, Math.ceil(filteredRecords.length / this.state.perPage));
      if (this.state.page > totalPages) {
        this.state.page = totalPages;
      }

      const startIndex = (this.state.page - 1) * this.state.perPage;
      const pageRecords = filteredRecords.slice(startIndex, startIndex + this.state.perPage);
      const self = this;

      const rowsHtml = pageRecords.map(function (record) {
        return [
          '<tr data-record-id="', record.id, '">',
          '<td>', record.sr, '</td>',
          '<td>', record.area, '</td>',
          '<td><div class="plant-table__cell-stack"><span class="plant-table__cell-primary">', record.loop, '</span><span class="plant-table__cell-secondary">', record.tag, '</span></div></td>',
          '<td><div class="plant-table__cell-stack"><span class="plant-table__cell-primary">', record.job, '</span><span class="plant-table__cell-secondary">', record.jobType, '</span></div></td>',
          '<td>', record.tech, '</td>',
          '<td>', record.description, '</td>',
          '<td>', record.engineer, '</td>',
          '<td>', self.statusChip(record.status), '</td>',
          '<td class="', self.state.pendingOnly ? '' : 'is-hidden', '">', self.priorityChip(record.priority), '</td>',
          '<td><div class="plant-table__cell-stack"><span class="plant-table__cell-secondary">', record.remarks, '</span><div class="plant-inline-actions"><button type="button" class="plant-inline-button" data-action="edit"><i class="ph-bold ph-pencil-simple" aria-hidden="true"></i></button><button type="button" class="plant-inline-button" data-action="remark"><i class="ph-bold ph-chat-circle-dots" aria-hidden="true"></i></button><button type="button" class="plant-inline-button" data-action="priority"><i class="ph-bold ph-number-square-eight" aria-hidden="true"></i></button></div></div></td>',
          '<td><button type="button" class="plant-inline-button" data-action="history"><i class="ph-bold ph-plus-circle" aria-hidden="true"></i></button></td>',
          '</tr>'
        ].join('');
      }).join('');

      this.$tableBody.html(rowsHtml || '<tr><td colspan="' + (this.state.pendingOnly ? '11' : '10') + '"><div class="plant-list-item__meta">No records found for the selected criteria.</div></td></tr>');
      this.$recordCount.text(filteredRecords.length + ' Records');
      this.$pageLabel.text('Page ' + this.state.page + ' of ' + totalPages);
      $('#page-prev').prop('disabled', this.state.page <= 1);
      $('#page-next').prop('disabled', this.state.page >= totalPages);
      this.renderAuxiliaryLists();
    },

    statusChip: function (status) {
      const map = {
        OVER: 'plant-status-chip plant-status-chip--over',
        'IN PROGRESS': 'plant-status-chip plant-status-chip--progress',
        HOLD: 'plant-status-chip plant-status-chip--hold'
      };
      return '<span class="' + (map[status] || map['IN PROGRESS']) + '">' + status + '</span>';
    },

    priorityChip: function (priority) {
      return '<span class="plant-priority-chip">' + priority + '</span>';
    },

    openModal: function (modalId) {
      $('#' + modalId).addClass('is-open').attr('aria-hidden', 'false');
    },

    closeModal: function (modalId) {
      $('#' + modalId).removeClass('is-open').attr('aria-hidden', 'true');
    },

    createJob: function () {
      const jobTech = $('#job-tech-custom').val().trim() || $('#job-tech').val() || 'BPB';
      const loop = $('#job-loop').val() || 'LIC101';
      const newRecord = {
        id: this.records.length + 1,
        sr: this.records.length + 1,
        date: $('#job-date').val() || this.dateValueForView(this.state.currentView),
        view: this.state.currentView,
        area: $('#job-area').val() || 'METH',
        loop: loop,
        tag: $('#job-tag').val() || (this.options.loops[loop] ? this.options.loops[loop][0] : 'LT101A'),
        job: $('#job-desc').val().trim().split('.').shift() || 'New assigned job',
        jobType: $('#job-type').val() || 'PROCESS REQMT',
        tech: jobTech,
        description: $('#job-desc').val().trim() || 'New assigned job',
        engineer: this.options.engineers[0],
        status: 'IN PROGRESS',
        priority: 0,
        remarks: 'Awaiting execution update.',
        ackPending: false
      };

      this.records.unshift(newRecord);
      $('#job-modal-form')[0].reset();
      $('#job-date').val(this.dateValueForView(this.state.currentView));
      this.populateTags($('#job-loop').val() || Object.keys(this.options.loops)[0]);
      this.closeModal('job-modal');
      this.renderTable();
    },

    getRecordById: function (recordId) {
      return this.records.find(function (record) {
        return record.id === recordId;
      });
    },

    populateEditModal: function (recordId) {
      const record = this.getRecordById(recordId);
      if (!record) return;

      $('#edit-job-id').val(record.id);
      $('#edit-job-id-display').text(record.id);
      $('#edit-job-date').val(record.date);
      $('#edit-job-assigned-to').val(record.tech);
      $('#edit-job-by').val(record.engineer);
      $('#edit-job-summary').val(record.job);
      $('#edit-job-detail-date').val(record.date);
      $('#edit-job-loop-tag').val(record.loop + ' / ' + record.tag);
      $('#edit-job-type').val(record.jobType);
      $('#edit-job-desc').val(record.description);
      $('#edit-job-status').val(record.status);
      $('#edit-job-extra-hours').val(record.priority > 12 ? 2 : 0);
      $('#edit-job-tech').val(record.tech);
      $('#edit-job-engineer').val(record.engineer);
      $('#edit-warning').toggleClass('is-hidden', record.status !== 'HOLD');
      $('#edit-warning-text').text(record.status === 'HOLD' ? 'This job is currently on hold and needs follow-up clearance.' : '');
    },

    saveEdit: function () {
      const record = this.getRecordById(parseInt($('#edit-job-id').val(), 10));
      if (!record) return;

      record.description = $('#edit-job-desc').val().trim() || record.description;
      record.status = $('#edit-job-status').val();
      record.tech = $('#edit-job-tech').val();
      record.engineer = $('#edit-job-engineer').val();
      this.closeModal('edit-modal');
      this.renderTable();
    },

    populateRemarkModal: function (recordId) {
      const record = this.getRecordById(recordId);
      if (!record) return;

      $('#remark-job-id').val(record.id);
      $('#remark-text').val(record.remarks);
      $('#remark-by-display').text(record.engineer);
      $('#remark-status-over').prop('checked', record.status === 'OVER');
      $('#remark-ack-tech').prop('checked', record.ackPending);
    },

    saveRemark: function () {
      const record = this.getRecordById(parseInt($('#remark-job-id').val(), 10));
      if (!record) return;

      record.remarks = $('#remark-text').val().trim() || record.remarks;
      record.status = $('#remark-status-over').is(':checked') ? 'OVER' : record.status;
      record.ackPending = $('#remark-ack-tech').is(':checked');
      this.closeModal('remark-modal');
      this.renderTable();
    },

    populatePriorityModal: function (recordId) {
      const record = this.getRecordById(recordId);
      if (!record) return;

      this.state.selectedPriority = record.priority;
      $('#priority-job-id').val(record.id);
      $('#priority-value').val(record.priority);
      $('.plant-priority-grid__button').removeClass('is-selected');
      $('.plant-priority-grid__button[data-value="' + record.priority + '"]').addClass('is-selected');
    },

    savePriority: function () {
      const record = this.getRecordById(parseInt($('#priority-job-id').val(), 10));
      if (!record) return;

      record.priority = parseInt($('#priority-value').val(), 10) || 0;
      this.closeModal('priority-modal');
      this.renderTable();
    },

    populateHistoryModal: function (recordId) {
      const record = this.getRecordById(recordId);
      if (!record) return;

      this.state.activeRecordId = recordId;
      $('#history-plant-name').text(this.state.plantName);
      $('#general-history-plant-name').text(this.state.plantName);
      $('#hist-loop').val(record.loop);
      $('#hist-insttype').val(record.tag);
      $('#hist-desc').val(record.description);
      $('#hist-status').val(record.status);
      $('#hist-tech').val(record.tech);
      $('#hist-eng').val(record.engineer);
      $('#hist-area').val(record.area);
    },

    renderPriorityGrid: function () {
      let html = '';
      for (let value = 0; value <= 25; value += 1) {
        html += '<button type="button" class="plant-priority-grid__button" data-value="' + value + '">' + value + '</button>';
      }
      $('#priority-grid').html(html);
    },

    renderAuxiliaryLists: function () {
      const pendingRecords = this.records.filter(function (record) {
        return record.status !== 'OVER';
      });
      const ackRecords = this.records.filter(function (record) {
        return record.ackPending;
      });

      $('#ojr-pending-list').html(pendingRecords.slice(0, 4).map(function (record) {
        return '<div class="plant-list-item"><div class="plant-list-item__copy"><span class="plant-list-item__title">' + record.job + '</span><span class="plant-list-item__meta">' + record.loop + ' / ' + record.tag + ' &bull; ' + record.tech + '</span></div><span class="plant-status-chip plant-status-chip--progress">' + record.status + '</span></div>';
      }).join(''));

      $('#ack-list').html(ackRecords.map(function (record) {
        return '<label class="plant-list-item"><span class="plant-list-item__copy"><span class="plant-list-item__title">' + record.job + '</span><span class="plant-list-item__meta">' + record.remarks + '</span></span><input type="checkbox" class="ack-check" value="' + record.id + '"></label>';
      }).join('') || '<div class="plant-list-item__meta">No acknowledgement pending.</div>');

      $('#reminder-list').html(pendingRecords.map(function (record) {
        return '<div class="plant-list-item"><div class="plant-list-item__copy"><span class="plant-list-item__title">' + record.job + '</span><span class="plant-list-item__meta">' + record.date + ' &bull; ' + record.area + ' &bull; ' + record.engineer + '</span></div><span class="plant-priority-chip">' + record.priority + '</span></div>';
      }).join(''));

      this.$ackButton.toggleClass('is-hidden', ackRecords.length === 0);
    },

    acknowledgeSelectedRemarks: function () {
      const selectedIds = $('.ack-check:checked').map(function () {
        return parseInt($(this).val(), 10);
      }).get();

      if (!selectedIds.length) {
        window.alert('Select at least one remark to acknowledge.');
        return;
      }

      this.records.forEach(function (record) {
        if (selectedIds.indexOf(record.id) >= 0) {
          record.ackPending = false;
        }
      });

      this.closeModal('ack-modal');
      this.renderTable();
    },

    bindHeaderSidebarToggle: function () {
      $(document).on('click', '.sidebar-toggle-header', function () {
        const $sidebar = $('.app-sidebar');
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        const nextCollapsed = !isCollapsed;

        localStorage.setItem('sidebarCollapsed', nextCollapsed);
        $sidebar.toggleClass('w-20', nextCollapsed).toggleClass('w-60', !nextCollapsed);
        $('.sidebar-text, .user-info').toggleClass('hidden', nextCollapsed);
        $('.user-avatar').toggleClass('hidden', nextCollapsed);
        $(this).toggleClass('ph-list', nextCollapsed).toggleClass('ph-sidebar-simple', !nextCollapsed);
      });
    }
  };

  $(function () {
    PlantPage.init();
  });
})(jQuery);
