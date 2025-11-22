// ============================================================
// ELEMENT HOOKS
// ============================================================

// Images
const mainImgFile = document.getElementById("mainImgFile");
const secondImgFile = document.getElementById("secondImgFile");
const mainImg = document.getElementById("mainImg");
const secondImg = document.getElementById("secondImg");
const imageLayout = document.getElementById("imageLayout");
const layoutSelect = document.getElementById("layoutSelect");

// Text inputs
const titleIn = document.getElementById("titleIn");
const descIn = document.getElementById("descIn");
const keysIn = document.getElementById("keysIn");

// Font select
const fontSelect = document.getElementById("fontSelect");

// Text DOM
const titleEl = document.getElementById("titleEl");
const descEl = document.getElementById("descEl");

// Canvas
const postEl = document.getElementById("post");
const ratioSelect = document.getElementById("ratioSelect");

// Buttons
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

// Tabs
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

// Text style controls
const titleSizeInput = document.getElementById("titleSize");
const descSizeInput = document.getElementById("descSize");
const titleLineHeightInput = document.getElementById("titleLineHeight");
const descLineHeightInput = document.getElementById("descLineHeight");
const titleLetterSpacingInput = document.getElementById("titleLetterSpacing");

// Stroke ("scratch")
const strokeWidthInput = document.getElementById("strokeWidth");
const strokeColorInput = document.getElementById("strokeColor");

// Shadow
const shadowToggle = document.getElementById("shadowToggle");
const shadowXInput = document.getElementById("shadowX");
const shadowYInput = document.getElementById("shadowY");
const shadowBlurInput = document.getElementById("shadowBlur");
const shadowAlphaInput = document.getElementById("shadowAlpha");
const shadowColorInput = document.getElementById("shadowColor");

// Value displays
const titleSizeVal = document.getElementById("titleSizeVal");
const descSizeVal = document.getElementById("descSizeVal");
const titleLHVal = document.getElementById("titleLHVal");
const descLHVal = document.getElementById("descLHVal");
const letterSpaceVal = document.getElementById("letterSpaceVal");
const strokeWidthVal = document.getElementById("strokeWidthVal");
const shadowXVal = document.getElementById("shadowXVal");
const shadowYVal = document.getElementById("shadowYVal");
const shadowBlurVal = document.getElementById("shadowBlurVal");
const shadowAlphaVal = document.getElementById("shadowAlphaVal");

// ============================================================
// IMAGE UPLOAD + LAYOUT
// ============================================================

mainImgFile.onchange = e => {
  const f = e.target.files[0];
  if (f) mainImg.src = URL.createObjectURL(f);
};

secondImgFile.onchange = e => {
  const f = e.target.files[0];
  if (f) secondImg.src = URL.createObjectURL(f);
};

layoutSelect.onchange = () => {
  const mode = layoutSelect.value; // "single" or "double"
  imageLayout.classList.remove("single", "double");
  imageLayout.classList.add(mode);
};

// ============================================================
// FONT HANDLING
// ============================================================

function applyFont() {
  const f = fontSelect.value;
  titleEl.style.fontFamily = f;
  descEl.style.fontFamily = f;
  document.querySelectorAll(".highlight").forEach(el => {
    el.style.fontFamily = f;
  });
}

// ============================================================
// TEXT AUTO 4-LINE FORMAT + HIGHLIGHTS
// ============================================================

function autoFormatTo4Lines(text) {
  let clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const words = clean.split(" ");
  const target = Math.max(8, Math.round(clean.length / 4));

  const lines = ["", "", "", ""];
  let idx = 0, len = 0;

  for (let w of words) {
    if (idx < 3 && lines[idx] && len + 1 + w.length > target + 4) {
      idx++;
      len = 0;
    }
    if (lines[idx]) {
      lines[idx] += " ";
      len++;
    }
    lines[idx] += w;
    len += w.length;
  }

  return lines.filter(l => l).join("\n");
}

function updateDesc() {
  const raw = descIn.value;
  const text4 = autoFormatTo4Lines(raw);

  const keys = keysIn.value
    .split(",")
    .map(x => x.trim())
    .filter(x => x);

  if (!text4) {
    descEl.innerHTML = "";
    return;
  }

  let html = text4.replace(/\n/g, "<br>");

  if (keys.length) {
    keys.sort((a, b) => b.length - a.length);
    const re = new RegExp(
      "(" +
        keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") +
      ")",
      "gi"
    );

    html = html.replace(re, x => `<span class="highlight">${x}</span>`);
  }

  descEl.innerHTML = html;
  applyFont();
  applyTextStyles();
}

// ============================================================
// TEXT STYLE CONTROLS (SHADOW, STROKE, SIZES)
// ============================================================

function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h.split("").map(c => c + c).join("");
  }
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function applyTextStyles() {
  // Font sizes
  const titleSize = Number(titleSizeInput.value);
  const descSize = Number(descSizeInput.value);
  titleEl.style.fontSize = `${titleSize}px`;
  descEl.style.fontSize = `${descSize}px`;

  // Line heights
  const tLH = parseFloat(titleLineHeightInput.value);
  const dLH = parseFloat(descLineHeightInput.value);
  titleEl.style.lineHeight = tLH;
  descEl.style.lineHeight = dLH;

  // Letter spacing
  const letterSpace = parseFloat(titleLetterSpacingInput.value);
  titleEl.style.letterSpacing = `${letterSpace}px`;

  // Stroke
  const strokeWidth = parseFloat(strokeWidthInput.value);
  const strokeColor = strokeColorInput.value;
  const strokeVal = strokeWidth > 0 ? `${strokeWidth}px ${strokeColor}` : "0 transparent";

  const strokeTargets = [
    titleEl,
    descEl,
    ...document.querySelectorAll(".highlight")
  ];

  strokeTargets.forEach(el => {
    el.style.webkitTextStroke = strokeVal;
    el.style.textStroke = strokeVal;
  });

  // Shadow
  if (shadowToggle.checked) {
    const sx = Number(shadowXInput.value);
    const sy = Number(shadowYInput.value);
    const blur = Number(shadowBlurInput.value);
    const alpha = Number(shadowAlphaInput.value);
    const { r, g, b } = hexToRgb(shadowColorInput.value);

    const shadowStr = `${sx}px ${sy}px ${blur}px rgba(${r}, ${g}, ${b}, ${alpha})`;

    [titleEl, descEl].forEach(el => {
      el.style.textShadow = shadowStr;
    });
  } else {
    [titleEl, descEl].forEach(el => {
      el.style.textShadow = "none";
    });
  }

  // Update visible values
  titleSizeVal.textContent = titleSize + "px";
  descSizeVal.textContent = descSize + "px";
  titleLHVal.textContent = tLH.toFixed(2);
  descLHVal.textContent = dLH.toFixed(2);
  letterSpaceVal.textContent = letterSpace.toFixed(2) + "px";
  strokeWidthVal.textContent = strokeWidth.toFixed(1) + "px";
  shadowXVal.textContent = shadowXInput.value + "px";
  shadowYVal.textContent = shadowYInput.value + "px";
  shadowBlurVal.textContent = shadowBlurInput.value + "px";
  shadowAlphaVal.textContent = shadowAlphaInput.value;
}

// ============================================================
// CANVAS RATIO
// ============================================================

function applyRatio() {
  const val = ratioSelect.value; // "1:1", "4:5", "9:16"
  postEl.style.aspectRatio = val.replace(":", " / ");
}

// ============================================================
// TABS
// ============================================================

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabButtons.forEach(b => b.classList.remove("active"));
    tabPanels.forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

// ============================================================
// MAIN INPUT LISTENERS
// ============================================================

titleIn.oninput = () => {
  titleEl.textContent = titleIn.value;
  applyFont();
  applyTextStyles();
};

descIn.oninput = updateDesc;
keysIn.oninput = updateDesc;
fontSelect.onchange = () => {
  applyFont();
  applyTextStyles();
};

ratioSelect.onchange = applyRatio;

// Text style inputs
[
  titleSizeInput,
  descSizeInput,
  titleLineHeightInput,
  descLineHeightInput,
  titleLetterSpacingInput,
  strokeWidthInput,
  strokeColorInput,
  shadowToggle,
  shadowXInput,
  shadowYInput,
  shadowBlurInput,
  shadowAlphaInput,
  shadowColorInput
].forEach(el => {
  el.addEventListener("input", applyTextStyles);
});

// ============================================================
// DOWNLOAD + RESET
// ============================================================

downloadBtn.onclick = async () => {
  const canvas = await html2canvas(postEl, { scale: 1.8 });
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/jpeg", 0.95);
  a.download = "tamilzone_post.jpg";
  a.click();
};

resetBtn.onclick = () => {
  mainImg.src = "";
  secondImg.src = "";
  mainImgFile.value = "";
  secondImgFile.value = "";
  titleIn.value = "";
  descIn.value = "";
  keysIn.value = "";
  titleEl.textContent = "";
  descEl.innerHTML = "";

  // Reset layout, ratio, styles
  layoutSelect.value = "single";
  imageLayout.classList.remove("double");
  imageLayout.classList.add("single");

  ratioSelect.value = "1:1";
  applyRatio();

  // Reset sliders to defaults
  titleSizeInput.value = 72;
  descSizeInput.value = 28;
  titleLineHeightInput.value = 1.05;
  descLineHeightInput.value = 1.35;
  titleLetterSpacingInput.value = -1;
  strokeWidthInput.value = 3.5;
  strokeColorInput.value = "#000000";
  shadowToggle.checked = true;
  shadowXInput.value = 0;
  shadowYInput.value = 0;
  shadowBlurInput.value = 10;
  shadowAlphaInput.value = 0.9;
  shadowColorInput.value = "#000000";

  applyFont();
  applyTextStyles();
};

// ============================================================
// INITIALIZE
// ============================================================

applyFont();
applyRatio();
applyTextStyles();
