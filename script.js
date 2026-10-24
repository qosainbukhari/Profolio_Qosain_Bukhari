// Plots for the engineering-pad portfolio. Every number here is from a project repo.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(name, attrs, parent, text) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }

  // Hatching patterns, like plotter fills.
  function addHatches(svg) {
    const defs = el("defs", {}, svg);
    [["hatch-ink", "#1d2b53"], ["hatch-pen", "#b8322a"], ["hatch-pencil", "#5c665e"]].forEach(([id, c]) => {
      const p = el("pattern", { id, width: 7, height: 7, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
      el("rect", { width: 7, height: 7, fill: "#e5eddc" }, p);
      el("line", { x1: 0, y1: 0, x2: 0, y2: 7, stroke: c, "stroke-width": 2.4 }, p);
    });
  }

  // ---------- Fig. 1: YOLOv12 training curve (validation mAP@50 per epoch) ----------
  const map50 = [0.05884, 0.18703, 0.22926, 0.44011, 0.54654, 0.63878, 0.68028, 0.62331, 0.70266, 0.7246,
    0.72868, 0.77622, 0.77985, 0.80958, 0.83454, 0.82961, 0.84389, 0.85124, 0.86424, 0.86562,
    0.87836, 0.88156, 0.88447, 0.88444, 0.89041, 0.89006, 0.89471, 0.89578, 0.89968, 0.89971,
    0.90297, 0.90619, 0.90591, 0.90788, 0.90803, 0.91075, 0.91253, 0.91145, 0.91207, 0.9128];

  function trainingPlot(svg, animate) {
    const W = Math.max(330, Math.min(640, svg.parentElement.clientWidth || 640));
    const narrow = W < 480;
    const H = narrow ? 360 : 440;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const L = 62, R = W - 26, T = 30, B = H - 60;
    const x = (e) => L + ((e - 1) / 39) * (R - L);
    const y = (v) => B - v * (B - T);

    // axes
    el("path", { class: "axis", d: `M${L} ${T - 10} V${B} H${R + 10}` }, svg);
    [0, 0.25, 0.5, 0.75, 1].forEach((v) => {
      el("line", { class: "tick", x1: L - 7, x2: L, y1: y(v), y2: y(v) }, svg);
      el("text", { class: "tick-label", x: L - 12, y: y(v) + 4, "text-anchor": "end" }, svg, v.toFixed(2));
    });
    [1, 10, 20, 30, 40].forEach((e) => {
      el("line", { class: "tick", x1: x(e), x2: x(e), y1: B, y2: B + 7 }, svg);
      el("text", { class: "tick-label", x: x(e), y: B + 24, "text-anchor": "middle" }, svg, e);
    });
    el("text", { class: "axis-title", x: (L + R) / 2, y: B + 50, "text-anchor": "middle" }, svg, "Epoch");
    el("text", { class: "axis-title", x: 18, y: (T + B) / 2, "text-anchor": "middle", transform: `rotate(-90 18 ${(T + B) / 2})` }, svg, "Validation mAP@50");

    // the curve
    const d = map50.map((v, i) => `${i ? "L" : "M"}${x(i + 1).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    const curve = el("path", { class: "curve", d }, svg);
    const pts = el("g", {}, svg);
    map50.forEach((v, i) => { if (i % 3 === 0 || i === 39) el("circle", { class: "pt", cx: x(i + 1), cy: y(v), r: 3.6 }, pts); });

    // red-pen annotations
    const notes = el("g", { class: "notes" }, svg);
    if (narrow) {
      el("path", { class: "hand-line", d: `M${x(40) - 2} ${y(0.9128) + 10} q -6 40 -40 56` }, notes);
      el("text", { class: "hand", x: x(40) - 46, y: y(0.9128) + 86, "text-anchor": "end" }, notes, "0.913 at epoch 40");
      el("text", { class: "hand", x: x(40) - 46, y: y(0.9128) + 108, "text-anchor": "end" }, notes, "(test set: 0.899)");
    } else {
      el("path", { class: "hand-line", d: `M${x(8) + 6} ${y(0.62) + 8} q 30 50 70 56` }, notes);
      el("text", { class: "hand", x: x(8) + 80, y: y(0.62) + 70 }, notes, "epoch 8: a dip, then it recovers");
      el("path", { class: "hand-line", d: `M${x(40) - 4} ${y(0.9128) + 10} q -10 50 -60 70` }, notes);
      el("text", { class: "hand", x: x(40) - 70, y: y(0.9128) + 104, "text-anchor": "end" }, notes, "0.913 at epoch 40");
      el("text", { class: "hand", x: x(40) - 70, y: y(0.9128) + 128, "text-anchor": "end" }, notes, "(test set: 0.899)");
    }

    if (animate && !reduceMotion) {
      const len = curve.getTotalLength();
      curve.style.strokeDasharray = len;
      curve.style.strokeDashoffset = len;
      pts.style.opacity = 0;
      notes.style.opacity = 0;
      requestAnimationFrame(() => {
        curve.style.transition = "stroke-dashoffset 2.2s cubic-bezier(.45,.05,.3,1)";
        curve.style.strokeDashoffset = 0;
        pts.style.transition = "opacity .5s 1.9s";
        notes.style.transition = "opacity .6s 2.3s";
        pts.style.opacity = 1;
        notes.style.opacity = 1;
      });
    }
  }

  // ---------- Horizontal bar plots ----------
  function barPlot(svg) {
    const bars = JSON.parse(svg.dataset.bars);
    const min = parseFloat(svg.dataset.min || "0");
    const max = parseFloat(svg.dataset.max);
    const unit = svg.dataset.unit || "";
    const W = Math.max(280, Math.min(520, svg.parentElement.clientWidth || 520));
    const stacked = W < 440;                       // labels above bars on phones
    const labelW = stacked ? 0 : 170;
    const rowH = stacked ? 58 : 46;
    const T = stacked ? 52 : 40, L = stacked ? 4 : labelW + 10, R = W - 70;
    const H = T + bars.length * rowH + 44;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    addHatches(svg);
    const x = (v) => L + ((v - min) / (max - min)) * (R - L);
    const B = T + bars.length * rowH;

    const title = svg.dataset.label;
    if (stacked && title.includes(" — ")) {
      const [t1, t2] = title.split(" — ");
      el("text", { class: "axis-title", x: L, y: 18 }, svg, t1);
      el("text", { class: "tick-label", x: L, y: 36 }, svg, t2);
    } else {
      el("text", { class: "axis-title", x: L, y: 22 }, svg, title);
    }
    el("path", { class: "axis", d: `M${L} ${T - 6} V${B} H${R + 8}` }, svg);
    const steps = stacked ? 2 : 4;
    for (let i = 0; i <= steps; i++) {
      const v = min + ((max - min) * i) / steps;
      el("line", { class: "tick", x1: x(v), x2: x(v), y1: B, y2: B + 6 }, svg);
      const txt = unit === "€" ? "€" + Math.round(v) : (Number.isInteger(v) ? v : v.toFixed(1)) + "%";
      el("text", { class: "tick-label", x: x(v), y: B + 22, "text-anchor": i === 0 && stacked ? "start" : "middle" }, svg, txt);
    }
    bars.forEach(([label, value, kind], i) => {
      const yTop = T + i * rowH + (stacked ? 20 : 8);
      if (stacked) el("text", { class: "bar-label", x: L + 8, y: yTop - 6 }, svg, label);
      else el("text", { class: "bar-label", x: labelW, y: yTop + 19, "text-anchor": "end" }, svg, label);
      el("rect", { class: "bar" + (kind ? " " + kind : ""), x: L, y: yTop, width: Math.max(2, x(value) - L), height: 26 }, svg);
      const txt = unit === "€" ? "€" + value.toFixed(2) : value.toFixed(1) + "%";
      el("text", { class: "bar-value" + (kind === "pen" ? " pen" : ""), x: x(value) + 8, y: yTop + 20 }, svg, txt);
    });
  }

  // ---------- Fig. 7: the train/eval overlap in the Chest CT project ----------
  function leakPlot(svg) {
    const W = Math.max(300, Math.min(520, svg.parentElement.clientWidth || 520));
    svg.setAttribute("viewBox", `0 0 ${W} 240`);
    addHatches(svg);
    const L = 14, R = W - 20, x = (p) => L + (p / 100) * (R - L);
    const row = (yy, a, b, cls, label) => {
      el("text", { class: "bar-label", x: L, y: yy - 8 }, svg, label);
      el("rect", { class: "bar " + cls, x: x(a), y: yy, width: x(b) - x(a), height: 26 }, svg);
    };
    row(40, 20, 100, "", "Training images (20–100%)");
    row(110, 0, 30, "pen", "“Unseen” evaluation images (0–30%)");
    // overlap marks
    el("line", { class: "hand-line", x1: x(20), x2: x(20), y1: 34, y2: 146, "stroke-dasharray": "5 5" }, svg);
    el("line", { class: "hand-line", x1: x(30), x2: x(30), y1: 34, y2: 146, "stroke-dasharray": "5 5" }, svg);
    el("path", { class: "hand-line", d: `M${x(25)} 150 q 10 30 50 34` }, svg);
    el("text", { class: "hand", x: x(25) + 56, y: 190 }, svg, W < 420 ? "seen in training!" : "seen in training! → fake 100%");
    // scale
    el("path", { class: "axis", d: `M${L} 210 H${R}` }, svg);
    [0, 20, 30, 50, 100].forEach((p) => {
      el("line", { class: "tick", x1: x(p), x2: x(p), y1: 204, y2: 216 }, svg);
      el("text", { class: "tick-label", x: x(p), y: 230, "text-anchor": "middle" }, svg, p + "%");
    });
  }

  function clear(svg) { [...svg.childNodes].forEach((n) => { if (n.nodeName !== "title" && n.nodeName !== "desc") svg.removeChild(n); }); }
  function renderAll(animate) {
    const tp = document.getElementById("trainingPlot");
    if (tp) { clear(tp); trainingPlot(tp, animate); }
    document.querySelectorAll("svg.bars").forEach((s) => { clear(s); barPlot(s); });
    const lk = document.getElementById("leakPlot");
    if (lk) { clear(lk); leakPlot(lk); }
  }
  renderAll(true);
  let lastW = window.innerWidth, timer;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(() => renderAll(false), 150);
  });
})();
