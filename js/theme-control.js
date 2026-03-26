window.ThemeControl = (function () {
  const $html = $('html');

  const ThemeControl = {
    settings: {
      theme: localStorage.getItem("theme") || "dark",
      fontSize: parseInt(localStorage.getItem("fontSize")) || 16,
    },
    minFontSize: 14,
    maxFontSize: 24,

    init() {
      this.applyTheme(this.settings.theme);
      this.applyFontSize(this.settings.fontSize);
      this.attachEventListeners();
    },

    getSettings() {
      return {
        mode: this.settings.theme,
        fontSize: this.settings.fontSize,
      };
    },

    applyTheme(theme) {
      const $themeIcon = $(".themeIcon");
      if (theme === "light") {
        $html.attr("data-theme", "light");
        if ($themeIcon.length) $themeIcon.removeClass("ph-moon").addClass("ph-sun");
      } else {
        $html.removeAttr("data-theme");
        if ($themeIcon.length) $themeIcon.removeClass("ph-sun").addClass("ph-moon");
      }
      this.settings.theme = theme;
      localStorage.setItem("theme", theme);
      $(window).trigger("themeChanged", { theme });
    },

    setMode(mode) {
      this.applyTheme(mode);
    },

    applyFontSize(size) {
      $html.css("font-size", size + "px");
      this.settings.fontSize = size;
      localStorage.setItem("fontSize", size);
    },

    increaseFontSize() {
      if (this.settings.fontSize < this.maxFontSize) {
        this.applyFontSize(this.settings.fontSize + 1);
      }
    },

    decreaseFontSize() {
      if (this.settings.fontSize > this.minFontSize) {
        this.applyFontSize(this.settings.fontSize - 1);
      }
    },

    attachEventListeners() {
      $(document).on("click", ".themeToggleBtn", () => {
        const nextTheme = this.settings.theme === "light" ? "dark" : "light";
        this.applyTheme(nextTheme);
      });

      $(document).on("click", ".fontIncreaseBtn", () => {
        this.increaseFontSize();
      });

      $(document).on("click", ".fontDecreaseBtn", () => {
        this.decreaseFontSize();
      });
    },
  };

  ThemeControl.init();
  return ThemeControl;
})();
