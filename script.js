const packages = [
  "Lamplighter",
  "Tempesta",
  "Children of the Sky",
  "Luz-Estrela",
  "Maratona",
  "Trem-Bala",
  "Maeve",
  "Marie Moreau",
  "Jordan Li",
  "Golden Boy",
  "Espoleta",
  "Kimiko",
  "Oh Pai",
  "Mana Sábia",
  "Black Noir",
  "Aprendiz de Soldier Boy",
  "Cindy",
  "Sam Riordan",
  "Cate Dunlap",
  "Andre Anderson",
  "Polarity",
  "Crimson Countess",
  "Shockwave",
  "Blue Hawk",
  "Mesmer",
  "Doppelganger",
  "Mindstorm",
  "Nubian Prince",
  "Silver Kincaid",
  "Eagle the Archer",
  "Blindspot",
  "Popclaw",
  "Termite",
  "Swatto",
  "TNT Twins",
  "Tek Knight",
  "Firecracker",
  "Sister Sage",
  "Supersonic",
  "Love Sausage",
  "Victoria Neuman",
  "Maverick",
  "Rufus",
  "Little Cricket",
  "Maverick"
];

const levels = [
  "Aprendiz",
  "Operante",
  "Veterano",
  "Dominante",
  "Titanico",
  "Omega",
  "Singular"
];

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

    document.querySelectorAll(".submenu-panel").forEach((item) => {
      item.classList.remove("open");
    });

    if (!isOpen) {
      panel.classList.add("open");
    }

    menuImpact(button);
    cameraHit();
    dirtyClick();
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

const cursor = document.querySelector("#cursor");

if (cursor) {
  document.addEventListener("mousemove", (event) => {
    const size = 26;

    const x = Math.min(
      window.innerWidth - size,
      Math.max(size, event.clientX)
    );

    const y = Math.min(
      window.innerHeight - size,
      Math.max(size, event.clientY)
    );

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  });

  document.addEventListener("mousedown", () => {
    document.body.classList.add("clicking");
  });

  document.addEventListener("mouseup", () => {
    document.body.classList.remove("clicking");
  });
}

/* AUDIO */

let uiAudio;

const soundClick = new Audio(
  "https://cdn.pixabay.com/download/audio/2021/08/04/audio_c403e5d7f9.mp3?filename=radio-static-6382.mp3"
);

const soundHover = new Audio(
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8a9d7a6f3.mp3?filename=tv-static-6924.mp3"
);

soundClick.volume = 0.16;
soundHover.volume = 0.07;

function getAudio() {
  if (!uiAudio) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    uiAudio = new AudioContext();
  }

  return uiAudio;
}

function playSound(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function dirtyClick() {
  playSound(soundClick);

  const ctx = getAudio();
  if (!ctx) return;

  const length = Math.floor(ctx.sampleRate * 0.06);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    const fade = 1 - i / length;
    data[i] = (Math.random() * 2 - 1) * fade;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 250;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
}

function dirtyHover() {
  playSound(soundHover);

  const ctx = getAudio();
  if (!ctx) return;

  const length = Math.floor(ctx.sampleRate * 0.03);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    const fade = 1 - i / length;
    data[i] = (Math.random() * 2 - 1) * fade * 0.35;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 330;
  filter.Q.value = 3;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
}

document.addEventListener("mouseenter", (event) => {
  if (event.target.closest(".ui-sound, button, .military-knob")) {
    dirtyHover();
  }
}, true);

document.addEventListener("click", (event) => {
  if (event.target.closest(".ui-sound, button, .military-knob")) {
    dirtyClick();
  }
});

/* MENU IMPACT */

function menuImpact(button) {
  button.classList.remove("hit");
  void button.offsetWidth;
  button.classList.add("hit");
}

function cameraHit() {
  document.body.classList.remove("camera-hit");
  void document.body.offsetWidth;
  document.body.classList.add("camera-hit");
}

document.querySelectorAll(".nav-btn").forEach((button) => {
  button.addEventListener("click", () => {
    menuImpact(button);
    cameraHit();
  });
});

/* MOTION TOGGLE */

const motionBtn = document.querySelector("#motionBtn");

if (motionBtn) {
  motionBtn.addEventListener("click", () => {
    const isOn = document.body.classList.contains("motion-on");

    document.body.classList.toggle("motion-on", !isOn);
    document.body.classList.toggle("motion-off", isOn);

    motionBtn.textContent = isOn ? "animações: off" : "animações: on";
  });
}

/* PARALLAX */

document.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;

  document.body.style.setProperty("--px", `${x}px`);
  document.body.style.setProperty("--py", `${y}px`);
});

/* RADIO */

const intro = document.querySelector("#intro");
const skipBtn = document.querySelector("#skipBtn");
const audioBtn = document.querySelector("#audioBtn");

const waveA = document.querySelector("#waveA");
const waveB = document.querySelector("#waveB");

const knobA = document.querySelector("#knobA");
const knobB = document.querySelector("#knobB");

const lamp = document.querySelector("#lamp");
const radioStatus = document.querySelector("#radioStatus");

const canvas = document.querySelector("#waveCanvas");
const ctx = canvas?.getContext("2d");

let radioAudio;
let radioMaster;
let radioStatic;
let radioFilter;
let radioHum;

let solved = false;

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

  if (audioBtn) audioBtn.style.display = "none";
}

function radioValues() {
  const a = Number(waveA?.value || 0);
  const b = Number(waveB?.value || 0);

  const distanceA = Math.abs(a - 50);
  const distanceB = Math.abs(b - 50);

  const clarity = Math.max(0, 1 - (distanceA + distanceB) / 95);
  const aligned = distanceA < 4 && distanceB < 4;

  return {
    a,
    b,
    clarity,
    aligned
  };
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
    setTimeout(closeIntro, 1000);
  }
}

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

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }
}

function closeIntro() {
  if (radioAudio && radioMaster) {
    radioMaster.gain.setTargetAtTime(0, radioAudio.currentTime, 0.05);

    setTimeout(() => {
      radioAudio.close().catch(() => {});
    }, 300);
  }

  intro?.classList.add("hide");

  setTimeout(() => {
    if (intro) intro.style.display = "none";
  }, 750);
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
      Math.atan2(
        event.clientY - centerY,
        event.clientX - centerX
      ) *
        180 /
        Math.PI +
      90;

    if (angle < 0) angle += 360;

    angle = Math.max(0, Math.min(270, angle));

    const targetValue = Math.round((angle / 270) * 100);
    const currentValue = Number(input.value);

    const weightedValue = Math.round(
      currentValue + (targetValue - currentValue) * 0.38
    );

    input.value = weightedValue;

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

/* EVENTS */

waveA?.addEventListener("input", updateRadio);
waveB?.addEventListener("input", updateRadio);

audioBtn?.addEventListener("click", () => {
  startRadioSound();
  dirtyClick();
});

skipBtn?.addEventListener("click", () => {
  closeIntro();
  dirtyClick();
});

/* INIT */

updateRadio();
drawWaves();
function bloodBurst(element) {
  const rect = element.getBoundingClientRect();

  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const fx = document.createElement("div");
  fx.className = "blood-art";
  fx.style.left = `${originX}px`;
  fx.style.top = `${originY}px`;

  document.body.appendChild(fx);

  for (let i = 0; i < 7; i++) {
    const streak = document.createElement("span");
    streak.className = "blood-streak";

    const side = Math.random() > 0.5 ? 1 : -1;

    streak.style.setProperty("--w", `${45 + Math.random() * 90}px`);
    streak.style.setProperty("--h", `${3 + Math.random() * 8}px`);
    streak.style.setProperty("--x", `${side * (20 + Math.random() * 90)}px`);
    streak.style.setProperty("--y", `${-35 + Math.random() * 70}px`);
    streak.style.setProperty("--rot", `${-35 + Math.random() * 70}deg`);

    fx.appendChild(streak);
  }

  for (let i = 0; i < 16; i++) {
    const spark = document.createElement("span");
    spark.className = "blood-spark";

    const angle = Math.random() * Math.PI * 2;
    const distance = 25 + Math.random() * 95;

    spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--s", `${3 + Math.random() * 7}px`);

    fx.appendChild(spark);
  }

  setTimeout(() => {
    fx.remove();
  }, 900);
}

document.querySelectorAll(".nav-btn").forEach((button) => {
  button.addEventListener("click", () => {
    bloodBurst(button);
  });
});
function closeIntro() {

  if (radioAudio && radioMaster) {

    radioMaster.gain.setTargetAtTime(
      0,
      radioAudio.currentTime,
      0.05
    );

    setTimeout(() => {
      radioAudio.close().catch(() => {});
    }, 300);
  }

  intro?.classList.add("hide");

  const bootScreen =
    document.querySelector("#bootScreen");

  const site =
    document.querySelector(".site");

  setTimeout(() => {

    if (intro) {
      intro.style.display = "none";
    }

    bootScreen?.classList.add("active");

    /* TEMPO DO BOOT */

    setTimeout(() => {

      bootScreen?.classList.add("hide");

      site?.classList.add("visible");

    }, 4000);

    setTimeout(() => {

      bootScreen?.classList.remove("active");

      if (bootScreen) {
        bootScreen.style.display = "none";
      }

    }, 4800);

  }, 700);
}
const dismissedUpdates =
  JSON.parse(localStorage.getItem("dismissedUpdates") || "[]");

document.querySelectorAll(".update-item").forEach((item, index) => {
  const id =
    item.dataset.updateId || `update-${index}`;

  item.dataset.updateId = id;

  if (dismissedUpdates.includes(id)) {
    item.remove();
    return;
  }

  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.title = "Clique para ocultar esta atualização";

  function dismissUpdate() {
    const saved =
      JSON.parse(localStorage.getItem("dismissedUpdates") || "[]");

    if (!saved.includes(id)) {
      saved.push(id);
      localStorage.setItem("dismissedUpdates", JSON.stringify(saved));
    }

    item.classList.add("removing");

    setTimeout(() => {
      item.remove();
    }, 280);
  }

  item.addEventListener("click", dismissUpdate);

  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dismissUpdate();
    }
  });
});
document.querySelectorAll(".page-link").forEach((button) => {
  button.addEventListener("click", () => {
    const pageId = button.dataset.page;
    const page = document.querySelector(`#${pageId}`);
    const home = document.querySelector(".home");

    document.querySelectorAll(".page-section").forEach((section) => {
      section.classList.add("hidden");
    });

    if (home) home.classList.add("hidden");

    if (page) {
      page.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    dirtyClick();
    cameraHit();
  });
});
document.querySelectorAll(".page-link").forEach((button) => {
  button.addEventListener("click", () => {
    const pageId = button.dataset.page;
    const page = document.querySelector(`#${pageId}`);
    const home = document.querySelector(".home");

    document.querySelectorAll(".page-section").forEach((section) => {
      section.classList.add("hidden");
    });

    home?.classList.add("hidden");

    page?.classList.remove("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});