(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else if (stored === 'light') {
      document.documentElement.classList.add('theme-light');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // OS prefers dark, no stored preference — add class so CSS knows
      document.documentElement.classList.add('theme-dark');
    }
    // Default: no class = light theme (CSS default)
  } catch (_) {
    // localStorage blocked (private browsing, permissions policy) — OS pref wins via CSS @media.
  }
})();
