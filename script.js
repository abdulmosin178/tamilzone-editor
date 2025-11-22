const mainImgFile = document.getElementById("mainImgFile");
const mainImg     = document.getElementById("mainImg");
const titleIn     = document.getElementById("titleIn");
const descIn      = document.getElementById("descIn");
const keysIn      = document.getElementById("keysIn");
const fontSelect  = document.getElementById("fontSelect");
const titleEl     = document.getElementById("titleEl");
const descEl      = document.getElementById("descEl");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn    = document.getElementById("resetBtn");
const postEl      = document.getElementById("post");

mainImgFile.onchange = e => {
  const f = e.target.files[0];
  if (f) mainImg.src = URL.createObjectURL(f);
};

function applyFont() {
  const f = fontSelect.value;
  titleEl.style.fontFamily = f;
  descEl.style.fontFamily  = f;
  document.querySelectorAll(".highlight").forEach(el => {
    el.style.fontFamily = f;
  });
}

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

  const keys = keysIn.value.split(",").map(x => x.trim()).filter(x => x);

  if (!text4) {
    descEl.innerHTML = "";
    return;
  }

  let html = text4.replace(/\n/g, "<br>");

  if (keys.length) {
    keys.sort((a,b)=>b.length-a.length);
    const re = new RegExp("(" + 
      keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|") + 
    ")", "gi");

    html = html.replace(re, x => `<span class="highlight">${x}</span>`);
  }

  descEl.innerHTML = html;
  applyFont();
}

titleIn.oninput = () => { 
  titleEl.textContent = titleIn.value; 
  applyFont(); 
};

descIn.oninput  = updateDesc;
keysIn.oninput  = updateDesc;
fontSelect.onchange = applyFont;

applyFont();

downloadBtn.onclick = async () => {
  const canvas = await html2canvas(postEl, { scale: 1.8 });
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/jpeg", 0.95);
  a.download = "tamilzone_post.jpg";
  a.click();
};

resetBtn.onclick = () => {
  mainImg.src = "";
  mainImgFile.value = "";
  titleIn.value = "";
  descIn.value = "";
  keysIn.value = "";
  titleEl.textContent = "";
  descEl.innerHTML = "";
};
