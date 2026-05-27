const packages = [
  "Lamplighter", "Tempesta", "Children of the Sky", "Luz-Estrela",
  "Maratona", "Trem-Bala", "Maeve", "Marie Moreau", "Jordan Li",
  "Golden Boy", "Espoleta", "Kimiko", "Oh Pai", "Mana Sábia",
  "Black Noir", "Aprendiz de Soldier Boy", "Cindy", "Sam Riordan",
  "Cate Dunlap", "Andre Anderson", "Polarity", "Crimson Countess",
  "Shockwave", "Blue Hawk", "Mesmer", "Doppelganger", "Mindstorm",
  "Nubian Prince", "Silver Kincaid", "Eagle the Archer", "Blindspot",
  "Popclaw", "Termite", "Swatto", "TNT Twins", "Tek Knight",
  "Firecracker", "Sister Sage", "Supersonic", "Love Sausage",
  "Victoria Neuman", "Maverick", "Rufus", "Little Cricket", "Maverick"
];

const levels = [
  "Aprendiz", "Operante", "Veterano", "Dominante",
  "Titanico", "Omega", "Singular"
];

const intro = document.querySelector("#intro");
const site = document.querySelector(".site");
const bootScreen = document.querySelector("#bootScreen");
const skipBtn = document.querySelector("#skipBtn");
const audioBtn = document.querySelector("#audioBtn");
const motionBtn = document.querySelector("#motionBtn");

const cursor = document.querySelector("#cursor");

const waveA = document.querySelector("#waveA");
const waveB = document.querySelector("#waveB");
const knobA = document.querySelector("#knobA");
const knobB = document.querySelector("#knobB");
const lamp = document.querySelector("#lamp");
const radioStatus = document.querySelector("#radioStatus");
const canvas = document.querySelector("#waveCanvas");
const ctx = canvas?.getContext("2d");

const packagePage = document.querySelector("#packagePage");
const packageTitle = document.querySelector("#packageTitle");
const packageMainTitle = document.querySelector("#packageMainTitle");
const backFromPackageBtn = document.querySelector("#backFromPackageBtn");
const backHomeBtn = document.querySelector("#backHomeBtn");

let solved = false;
let radioAudio;
let radioMaster;
let radioStatic;
let radioFilter;
let radioHum;

/* SUBMENUS */

function populatePanel(id, items) {
  const panel = document.querySelector(`#${id}`);
  if (!panel) return;

  panel.innerHTML = "";

  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "ui-sound";
    button.type = "button";
    button.textContent = item;
    panel.appendChild(button);
  });
}

populatePanel("pacotes", packages);
populatePanel("niveis", levels);

document.querySelectorAll(".menu-toggle").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const panel = document.querySelector(`#${button.dataset.panel}`);
    if (!panel) return;

    const isOpen = panel.classList.contains("open");

    document.querySelectorAll(".submenu-panel").forEach((p) => {
      p.classList.remove("open");
    });

    if (!isOpen) {
      panel.classList.add("open");
    }

    dirtyClick();
    cameraHit();
    bloodBurst(button);
  });
});

document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".submenu-panel") &&
    !event.target.closest(".menu-toggle")
  ) {
    document.querySelectorAll(".submenu-panel").forEach((panel) => {
      panel.classList.remove("open");
    });
  }
});

/* CURSOR */

document.addEventListener("mousemove", (event) => {
  if (!cursor) return;

  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;

  document.body.style.setProperty(
    "--px",
    `${(event.clientX / window.innerWidth - 0.5) * 18}px`
  );

  document.body.style.setProperty(
    "--py",
    `${(event.clientY / window.innerHeight - 0.5) * 18}px`
  );
});

document.addEventListener("mousedown", () => {
  document.body.classList.add("clicking");
});

document.addEventListener("mouseup", () => {
  document.body.classList.remove("clicking");
});

/* AUDIO */

let uiAudio;

function getAudio() {
  if (!uiAudio) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    uiAudio = new AudioContext();
  }

  return uiAudio;
}

function dirtyClick() {
  const ctx = getAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = 130;

  gain.gain.setValueAtTime(0.025, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

function cameraHit() {
  document.body.classList.remove("camera-hit");
  void document.body.offsetWidth;
  document.body.classList.add("camera-hit");
}

/* RADIO SOUND */

function startRadioSound() {
  if (radioAudio) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  radioAudio = new AudioContext();

  radioMaster = radioAudio.createGain();
  radioMaster.gain.value = 0.12;
  radioMaster.connect(radioAudio.destination);

  const bufferSize = radioAudio.sampleRate * 2;
  const buffer = radioAudio.createBuffer(1, bufferSize, radioAudio.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = radioAudio.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  radioStatic = radioAudio.createGain();
  radioStatic.gain.value = 0.9;

  radioFilter = radioAudio.createBiquadFilter();
  radioFilter.type = "bandpass";
  radioFilter.frequency.value = 450;
  radioFilter.Q.value = 1.4;

  radioHum = radioAudio.createOscillator();
  radioHum.type = "sawtooth";
  radioHum.frequency.value = 54;

  const humGain = radioAudio.createGain();
  humGain.gain.value = 0.02;

  noise.connect(radioStatic);
  radioStatic.connect(radioFilter);
  radioFilter.connect(radioMaster);

  radioHum.connect(humGain);
  humGain.connect(radioMaster);

  noise.start();
  radioHum.start();

  if (audioBtn) {
    audioBtn.style.display = "none";
  }
}

/* RADIO VALUES */

function radioValues() {
  const a = Number(waveA?.value || 0);
  const b = Number(waveB?.value || 0);

  const distanceA = Math.abs(a - 50);
  const distanceB = Math.abs(b - 50);

  const clarity = Math.max(0, 1 - (distanceA + distanceB) / 95);
  const aligned = distanceA < 4 && distanceB < 4;

  return { a, b, clarity, aligned };
}

function updateRadio() {
  const { a, b, clarity, aligned } = radioValues();

  knobA?.querySelector(".knob-rotor")?.style.setProperty(
    "transform",
    `rotate(${a * 2.7 - 135}deg)`
  );

  knobB?.querySelector(".knob-rotor")?.style.setProperty(
    "transform",
    `rotate(${b * 2.7 - 135}deg)`
  );

  if (radioAudio && radioStatic && radioFilter && radioHum) {
    radioStatic.gain.setTargetAtTime(
      Math.max(0.05, 1 - clarity),
      radioAudio.currentTime,
      0.05
    );

    radioFilter.frequency.setTargetAtTime(
      300 + clarity * 1800,
      radioAudio.currentTime,
      0.05
    );

    radioHum.frequency.setTargetAtTime(
      45 + clarity * 100,
      radioAudio.currentTime,
      0.05
    );
  }

  lamp?.classList.toggle("on", aligned);

  if (radioStatus) {
    radioStatus.textContent = aligned
      ? "sinal alinhado // transmissão aberta"
      : "sinal perdido // alinhe as ondas";
  }

  if (aligned && !solved) {
    solved = true;
    setTimeout(closeIntroWithBoot, 1000);
  }
}

/* WAVES */

function drawWaves() {
  if (!canvas || !ctx) return;

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;

  ctx.setTransform(
    window.devicePixelRatio,
    0,
    0,
    window.devicePixelRatio,
    0,
    0
  );

  const width = rect.width;
  const height = rect.height;

  const { a, b, clarity } = radioValues();

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(9,7,5,.55)";
  ctx.fillRect(0, 0, width, height);

  const center = height / 2;
  const jitter = 18 * (1 - clarity);

  drawLine("rgba(255,60,60,.92)", (a - 50) * 1.1, jitter);
  drawLine("rgba(188,168,141,.92)", (b - 50) * 1.1, jitter);

  requestAnimationFrame(drawWaves);

  function drawLine(color, offset, noiseAmount) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let x = 0; x <= width; x++) {
      const y =
        center +
        offset +
        Math.sin(x * 0.035 + Date.now() * 0.004) * 18 +
        (Math.random() - 0.5) * noiseAmount;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  }
}

/* KNOBS */

document.querySelectorAll(".military-knob").forEach((knob) => {
  const input = document.querySelector(`#${knob.dataset.input}`);
  let dragging = false;

  function setValue(event) {
    const rect = knob.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle =
      Math.atan2(event.clientY - centerY, event.clientX - centerX) *
        180 /
        Math.PI +
      90;

    if (angle < 0) angle += 360;

    angle = Math.max(0, Math.min(270, angle));

    const targetValue = Math.round((angle / 270) * 100);
    const currentValue = Number(input.value);

    input.value = Math.round(
      currentValue + (targetValue - currentValue) * 0.38
    );

    startRadioSound();
    updateRadio();
  }

  knob.addEventListener("pointerdown", (event) => {
    dragging = true;
    knob.classList.add("dragging");
    knob.setPointerCapture(event.pointerId);
    setValue(event);
    dirtyClick();
  });

  knob.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    setValue(event);
  });

  knob.addEventListener("pointerup", () => {
    dragging = false;
    knob.classList.remove("dragging");
  });

  knob.addEventListener("pointercancel", () => {
    dragging = false;
    knob.classList.remove("dragging");
  });
});

/* INTRO / BOOT */

function showSite() {
  site?.classList.add("visible");
}

function closeIntroWithBoot() {
  if (radioAudio && radioMaster) {
    radioMaster.gain.setTargetAtTime(0, radioAudio.currentTime, 0.05);

    setTimeout(() => {
      radioAudio.close().catch(() => {});
    }, 300);
  }

  intro?.classList.add("hide");

  setTimeout(() => {
    if (intro) intro.style.display = "none";

    bootScreen?.classList.remove("hide");
    bootScreen?.classList.add("active");

    setTimeout(() => {
      bootScreen?.classList.add("hide");
      showSite();
    }, 4000);

    setTimeout(() => {
      bootScreen?.classList.remove("active");
      if (bootScreen) bootScreen.style.display = "none";
    }, 4800);
  }, 750);
}

function skipIntro() {
  intro?.classList.add("hide");

  setTimeout(() => {
    if (intro) intro.style.display = "none";
    showSite();
  }, 700);
}

skipBtn?.addEventListener("click", skipIntro);
audioBtn?.addEventListener("click", startRadioSound);

/* PAGES */

function hideAllPages() {
  document.querySelector(".home")?.classList.add("hidden");

  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.add("hidden");
  });
}

function showHome() {
  hideAllPages();
  document.querySelector(".home")?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".page-link").forEach((button) => {
  button.addEventListener("click", () => {
    const pageId = button.dataset.page;
    const page = document.querySelector(`#${pageId}`);

    document.body.classList.add("page-switching");

    setTimeout(() => {
      hideAllPages();
      page?.classList.remove("hidden");

      document.body.classList.remove("page-switching");

      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 320);

    dirtyClick();
    cameraHit();
    bloodBurst(button);
  });
});

backHomeBtn?.addEventListener("click", showHome);
backFromPackageBtn?.addEventListener("click", showHome);

/* PACKAGE PAGE */

function openPackagePage(packageName) {
  document.body.classList.add("page-switching");

  setTimeout(() => {
    hideAllPages();

    packagePage?.classList.remove("hidden");

    if (packageTitle) packageTitle.textContent = packageName;
    if (packageMainTitle) packageMainTitle.textContent = packageName;

    document.querySelectorAll(".submenu-panel").forEach((panel) => {
      panel.classList.remove("open");
    });

    document.body.classList.remove("page-switching");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 320);

  dirtyClick();
  cameraHit();
}

document.querySelector("#pacotes")?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  openPackagePage(button.textContent.trim());
});

/* MOTION */

motionBtn?.addEventListener("click", () => {
  const on = document.body.classList.contains("motion-on");

  document.body.classList.toggle("motion-on", !on);
  document.body.classList.toggle("motion-off", on);

  motionBtn.textContent = on ? "animações: off" : "animações: on";

  dirtyClick();
});

/* UPDATES */

document.querySelectorAll(".update-item").forEach((item, index) => {
  const id = item.dataset.updateId || `update-${index}`;

  if (localStorage.getItem(id)) {
    item.remove();
    return;
  }

  item.addEventListener("click", () => {
    localStorage.setItem(id, "hidden");

    item.classList.add("removing");

    setTimeout(() => {
      item.remove();
    }, 280);
  });
});

/* BLOOD */

function bloodBurst(element) {
  const rect = element.getBoundingClientRect();

  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const fx = document.createElement("div");
  fx.className = "blood-art";

  document.body.appendChild(fx);

  /* SMEARS */

  for (let i = 0; i < 5; i++) {
    const smear = document.createElement("span");

    smear.className = "blood-smear";

    smear.style.left = `${originX}px`;
    smear.style.top = `${originY}px`;

    smear.style.setProperty(
      "--x",
      `${(Math.random() - 0.5) * 220}px`
    );

    smear.style.setProperty(
      "--y",
      `${(Math.random() - 0.5) * 140}px`
    );

    smear.style.setProperty(
      "--rot",
      `${Math.random() * 360}deg`
    );

    smear.style.setProperty(
      "--w",
      `${60 + Math.random() * 180}px`
    );

    smear.style.setProperty(
      "--h",
      `${2 + Math.random() * 3}px`
    );

    fx.appendChild(smear);
  }

 

  for (let i = 0; i < 18; i++) {
    const dot = document.createElement("span");

    dot.className = "blood-spark";

    dot.style.left = `${originX}px`;
    dot.style.top = `${originY}px`;

    dot.style.setProperty(
      "--s",
      `${3 + Math.random() * 8}px`
    );

    dot.style.setProperty(
      "--x",
      `${(Math.random() - 0.5) * 200}px`
    );

    dot.style.setProperty(
      "--y",
      `${(Math.random() - 0.5) * 150}px`
    );

    fx.appendChild(dot);
  }

  setTimeout(() => {
    fx.remove();
  }, 1000);
}

/* INIT */

updateRadio();
drawWaves();