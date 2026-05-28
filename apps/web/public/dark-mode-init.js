(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else if (stored === 'light') {
      document.documentElement.classList.add('theme-light');
    }
    // No stored preference — let CSS @media prefers-color-scheme handle it.
    // No class added; tokens.css dark override fires via OS query.
  } catch (_) {
    // localStorage blocked (private browsing, permissions policy) — OS pref wins.
  }
})();
