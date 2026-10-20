// Поиск по статьям: грузит /search-index.json при первом вводе.
(function () {
  var input = document.getElementById("q");
  var out = document.getElementById("q-results");
  if (!input || !out) return;
  var index = null;

  function norm(s) { return s.toLowerCase().replace(/ё/g, "е"); }

  function render(q) {
    out.innerHTML = "";
    var words = norm(q).split(/\s+/).filter(function (w) { return w.length > 1 || /\d/.test(w); });
    if (!words.length || !index) return;
    var hits = index.filter(function (it) {
      var hay = norm(it.t + " " + it.d);
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    }).slice(0, 8);
    if (!hits.length) {
      out.innerHTML = '<li><span class="empty" style="padding:8px 12px;display:block">Ничего не нашлось</span></li>';
      return;
    }
    hits.forEach(function (it) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = it.u;
      a.textContent = it.t;
      var small = document.createElement("small");
      small.textContent = it.c;
      a.appendChild(small);
      li.appendChild(a);
      out.appendChild(li);
    });
  }

  input.addEventListener("input", function () {
    var q = input.value;
    if (index) return render(q);
    fetch("/search-index.json").then(function (r) { return r.json(); })
      .then(function (data) { index = data; render(input.value); });
  });
  document.addEventListener("click", function (e) {
    if (!out.contains(e.target) && e.target !== input) out.innerHTML = "";
  });
})();
