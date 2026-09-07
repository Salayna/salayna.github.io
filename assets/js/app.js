/* Theme toggle -------------------------------------------------------------
   The initial theme is applied by a blocking inline script in <head> so the
   page never flashes the wrong palette. This only handles the button. */

(function theme() {
  var btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });
})();


/* Project filters ---------------------------------------------------------- */

(function filters() {
  var root = document.querySelector('[data-filters]');
  if (!root) return;

  var chips  = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
  var search = root.querySelector('[data-filter-search]');
  var count  = root.querySelector('[data-filter-count]');
  var items  = Array.prototype.slice.call(document.querySelectorAll('[data-tags]'));
  var empty  = document.querySelector('[data-filter-empty]');
  var active = 'all';

  function apply() {
    var q = (search ? search.value : '').trim().toLowerCase();
    var shown = 0;

    items.forEach(function (el) {
      var tags = (el.dataset.tags || '').toLowerCase();
      var text = (el.dataset.search || el.textContent).toLowerCase();
      var byTag = active === 'all' || tags.split(' ').indexOf(active) !== -1;
      var byText = !q || text.indexOf(q) !== -1;
      var show = byTag && byText;
      el.hidden = !show;
      if (show) shown++;
    });

    if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects');
    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      active = chip.dataset.filter;
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });
      apply();
    });
  });

  if (search) search.addEventListener('input', apply);
  apply();
})();


/* Command palette ---------------------------------------------------------- */

(function palette() {
  var el = document.getElementById('palette');
  if (!el) return;

  var input   = el.querySelector('[data-palette-input]');
  var list    = el.querySelector('[data-palette-list]');
  var empty   = el.querySelector('[data-palette-empty]');
  var openers = document.querySelectorAll('[data-palette-open]');

  var index = null;      // loaded lazily on first open
  var results = [];
  var cursor = 0;
  var lastFocus = null;

  /* Subsequence scoring: every query character must appear in order.
     Consecutive and word-initial matches score higher, so "hoop" beats
     a scattered match, and shorter targets win ties. */
  function score(query, target) {
    var q = query.toLowerCase();
    var t = target.toLowerCase();
    if (!q) return 1;

    var ti = 0, total = 0, streak = 0;
    var first = -1, last = -1;

    for (var qi = 0; qi < q.length; qi++) {
      var found = -1;
      for (; ti < t.length; ti++) {
        if (t[ti] === q[qi]) { found = ti; break; }
      }
      if (found === -1) return 0;
      if (first === -1) first = found;
      last = found;

      var points = 1;
      if (found === 0 || /[\s\-–/_.]/.test(t[found - 1])) points += 3; // word start
      if (streak > 0 && found === ti) points += 2;                     // consecutive
      streak = found === ti ? streak + 1 : 0;
      total += points;
      ti = found + 1;
    }

    /* Reject matches spread thinly across the target: without this, "hoop"
       matches almost any long sentence containing those letters in order. */
    if (q.length / (last - first + 1) < 0.34) return 0;

    return total + Math.max(0, 12 - t.length * 0.1);
  }

  function search(q) {
    if (!index) return [];
    if (!q.trim()) return index.slice(0, 8);

    return index
      .map(function (item) {
        var s = Math.max(
          score(q, item.title) * 2,
          score(q, item.summary || '') * 0.6,
          score(q, (item.tags || []).join(' ')) * 0.9
        );
        return { item: item, s: s };
      })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 10)
      .map(function (r) { return r.item; });
  }

  function render() {
    list.innerHTML = '';
    empty.hidden = results.length !== 0;

    results.forEach(function (item, i) {
      var li = document.createElement('li');
      li.className = 'palette__item';
      li.id = 'palette-item-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === cursor));

      var title = document.createElement('b');
      title.textContent = item.title;
      li.appendChild(title);

      if (item.summary) {
        var sum = document.createElement('span');
        sum.className = 'palette__summary';
        sum.textContent = item.summary.slice(0, 46);
        li.appendChild(sum);
      }

      var kind = document.createElement('span');
      kind.className = 'palette__kind';
      kind.textContent = item.kind;
      li.appendChild(kind);

      li.addEventListener('click', function () { go(item); });
      li.addEventListener('mousemove', function () {
        if (cursor === i) return;
        cursor = i;
        update();
      });

      list.appendChild(li);
    });

    update();
  }

  function update() {
    Array.prototype.forEach.call(list.children, function (li, i) {
      li.setAttribute('aria-selected', String(i === cursor));
    });
    input.setAttribute('aria-activedescendant', results.length ? 'palette-item-' + cursor : '');
    var sel = list.children[cursor];
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  function go(item) {
    close();
    window.location.href = item.url;
  }

  function open() {
    lastFocus = document.activeElement;
    el.hidden = false;
    input.value = '';
    input.focus();

    if (index) {
      results = search('');
      cursor = 0;
      render();
      return;
    }

    fetch('/index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        index = data;
        results = search(input.value);
        cursor = 0;
        render();
      })
      .catch(function () {
        empty.hidden = false;
        empty.textContent = "Couldn't load the index. Use the menu instead.";
      });
  }

  function close() {
    el.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(openers, function (btn) {
    btn.addEventListener('click', open);
  });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      el.hidden ? open() : close();
      return;
    }
    if (el.hidden) {
      // "/" opens search, unless the person is typing in a field.
      var tag = (document.activeElement.tagName || '').toLowerCase();
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cursor = results.length ? (cursor + 1) % results.length : 0;
      update();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      cursor = results.length ? (cursor - 1 + results.length) % results.length : 0;
      update();
    }
    if (e.key === 'Enter' && results[cursor]) { e.preventDefault(); go(results[cursor]); }
  });

  input.addEventListener('input', function () {
    results = search(input.value);
    cursor = 0;
    render();
  });

  el.addEventListener('mousedown', function (e) {
    if (e.target === el) close();
  });
})();
