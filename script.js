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

/* =========================
   SUBMENUS
========================= */

function populatePanel(id, items) {
  const panel = document.querySelector(`#${id}`);

  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "ui-sound";
    btn.textContent = item;
    panel.appendChild(btn);
  });
}

populatePanel("pacotes", packages);
populatePanel("niveis", levels);

document.querySelectorAll(".menu-toggle").forEach(button => {
  button.addEventListener("click", e => {
    e.stopPropagation();

    const panel = document.querySelector(
      `#${button.dataset.panel}`
    );

    const isOpen = panel.classList.contains("open");

    document
      .querySelectorAll(".submenu-panel")
      .forEach(p => p.classList.remove("open"));

    if (!isOpen) {
      panel.classList.add("open");
    }

    menuImpact(button);
    dirtyClick();
  });
});

document.addEventListener("click", e => {
  if (
    !e.target.closest(".submenu-panel") &&
    !e.target.closest(".menu-toggle")
  ) {
    document
      .querySelectorAll(".submenu-panel")
      .forEach(p => p.classList.remove("open"));
  }
});

/* =========================
   CURSOR
========================= */

const cursor = document.querySelector("#cursor");

document.addEventListener("mousemove", e => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

document.addEventListener("mousedown", () => {
  document.body.classList.add("clicking");
});

document.addEventListener("mouseup", () => {
  document.body.classList.remove("clicking");
});

/* =========================
   IMPACTO MENU
========================= */

function menuImpact(button) {
  button.classList.remove("hit");

  void button.offsetWidth;

  button.classList.add("hit");
}

/* =========================
   AUDIO SUJO
========================= */

let uiAudio;

function getAudio() {
  if (!uiAudio) {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    uiAudio = new AudioContext();
  }

  return uiAudio;
}

function dirtyClick() {
  const ctx = getAudio();

  const length = ctx.sampleRate * 0.09;

  const buffer = ctx.createBuffer(
    1,
    length,
    ctx.sampleRate
  );

  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    const fade = 1 - i / length;

    data[i] =
      (Math.random() * 2 - 1) *
      fade;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 260;

  const gain = ctx.createGain();

  gain.gain.setValueAtTime(
    0.12,
    ctx.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + 0.09
  );

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
}

function dirtyHover() {
  const ctx = getAudio();

  const length = ctx.sampleRate * 0.035;

  const buffer = ctx.createBuffer(
    1,
    length,
    ctx.sampleRate
  );

  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    const fade = 1 - i / length;

    data[i] =
      (Math.random() * 2 - 1) *
      fade *
      0.45;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();

  filter.type = "bandpass";
  filter.frequency.value = 330;
  filter.Q.value = 3;

  const gain = ctx.createGain();

  gain.gain.setValueAtTime(
    0.035,
    ctx.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + 0.04
  );

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
}

document.querySelectorAll(".ui-sound").forEach(el => {
  el.addEventListener("mouseenter", () => {
    dirtyHover();
  });

  el.addEventListener("click", () => {
    dirtyClick();
  });
});

/* =========================
   MOTION TOGGLE
========================= */

const motionBtn =
  document.querySelector("#motionBtn");

motionBtn.addEventListener("click", () => {
  const on =
    document.body.classList.contains("motion-on");

  document.body.classList.toggle(
    "motion-on",
    !on
  );

  document.body.classList.toggle(
    "motion-off",
    on
  );

  motionBtn.textContent = on
    ? "animações: off"
    : "animações: on";
});

/* =========================
   RADIO AUDIO
========================= */

const intro = document.querySelector("#intro");
const skipBtn = document.querySelector("#skipBtn");
const audioBtn = document.querySelector("#audioBtn");

const waveA = document.querySelector("#waveA");
const waveB = document.querySelector("#waveB");

const knobA = document.querySelector("#knobA");
const knobB = document.querySelector("#knobB");

const lamp = document.querySelector("#lamp");

const radioStatus =
  document.querySelector("#radioStatus");

const canvas =
  document.querySelector("#waveCanvas");

const ctx = canvas.getContext("2d");

let radioAudio;
let radioMaster;
let radioStatic;
let radioFilter;
let radioHum;

let solved = false;

/* =========================
   START RADIO SOUND
========================= */

function startRadioSound() {
  if (radioAudio) return;

  const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

  radioAudio = new AudioContext();

  radioMaster =
    radioAudio.createGain();

  radioMaster.gain.value = 0.12;

  radioMaster.connect(
    radioAudio.destination
  );

  const bufferSize =
    radioAudio.sampleRate * 2;

  const buffer =
    radioAudio.createBuffer(
      1,
      bufferSize,
      radioAudio.sampleRate
    );

  const data =
    buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise =
    radioAudio.createBufferSource();

  noise.buffer = buffer;
  noise.loop = true;

  radioStatic =
    radioAudio.createGain();

  radioStatic.gain.value = 0.9;

  radioFilter =
    radioAudio.createBiquadFilter();

  radioFilter.type = "bandpass";
  radioFilter.frequency.value = 450;
  radioFilter.Q.value = 1.4;

  radioHum =
    radioAudio.createOscillator();

  radioHum.type = "sawtooth";
  radioHum.frequency.value = 54;

  const humGain =
    radioAudio.createGain();

  humGain.gain.value = 0.02;

  noise.connect(radioStatic);

  radioStatic.connect(radioFilter);

  radioFilter.connect(radioMaster);

  radioHum.connect(humGain);

  humGain.connect(radioMaster);

  noise.start();
  radioHum.start();

  audioBtn.style.display = "none";
}

/* =========================
   RADIO VALUES
========================= */

function radioValues() {
  const a = Number(waveA.value);
  const b = Number(waveB.value);

  const distanceA =
    Math.abs(a - 50);

  const distanceB =
    Math.abs(b - 50);

  const clarity =
    Math.max(
      0,
      1 - (distanceA + distanceB) / 95
    );

  const aligned =
    distanceA < 4 &&
    distanceB < 4;

  return {
    a,
    b,
    clarity,
    aligned
  };
}

/* =========================
   UPDATE RADIO
========================= */

function updateRadio() {
  const {
    a,
    b,
    clarity,
    aligned
  } = radioValues();

 knobA.querySelector(".knob-rotor").style.transform =
  `rotate(${a * 2.7 - 135}deg)`;

knobB.querySelector(".knob-rotor").style.transform =
  `rotate(${b * 2.7 - 135}deg)`;

  if (radioAudio) {
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

  lamp.classList.toggle("on", aligned);

  radioStatus.textContent = aligned
    ? "sinal alinhado // transmissão aberta"
    : "sinal perdido // alinhe as ondas";

  if (aligned && !solved) {
    solved = true;

    setTimeout(closeIntro, 1000);
  }
}

/* =========================
   DRAW WAVES
========================= */

function drawWaves() {
  const rect =
    canvas.getBoundingClientRect();

  canvas.width =
    rect.width * devicePixelRatio;

  canvas.height =
    rect.height * devicePixelRatio;

  ctx.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );

  const width = rect.width;
  const height = rect.height;

  const {
    a,
    b,
    clarity
  } = radioValues();

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(9,7,5,.55)";
  ctx.fillRect(0, 0, width, height);

  const center = height / 2;

  const jitter =
    18 * (1 - clarity);

  drawLine(
    "rgba(255,60,60,.92)",
    (a - 50) * 1.1,
    jitter
  );

  drawLine(
    "rgba(188,168,141,.92)",
    (b - 50) * 1.1,
    jitter
  );

  requestAnimationFrame(drawWaves);

  function drawLine(
    color,
    offset,
    noise
  ) {
    ctx.beginPath();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let x = 0; x <= width; x++) {
      const y =
        center +
        offset +
        Math.sin(
          x * 0.035 +
          Date.now() * 0.004
        ) * 18 +
        (Math.random() - .5) * noise;

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }
}

/* =========================
   CLOSE INTRO
========================= */

function closeIntro() {
  if (radioAudio && radioMaster) {
    radioMaster.gain.setTargetAtTime(
      0,
      radioAudio.currentTime,
      0.05
    );

    setTimeout(() => {
      radioAudio.close();
    }, 300);
  }

  intro.classList.add("hide");

  setTimeout(() => {
    intro.style.display = "none";
  }, 750);
}

/* =========================
   DRAG KNOBS
========================= */

document.querySelectorAll(".military-knob").forEach(knob => {
  const input = document.querySelector(`#${knob.dataset.input}`);
  let dragging = false;

  function setValue(event) {
    const rect = knob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let angle =
      Math.atan2(event.clientY - cy, event.clientX - cx) *
      180 / Math.PI + 90;

    if (angle < 0) angle += 360;

    angle = Math.max(0, Math.min(270, angle));

    input.value = Math.round(angle / 270 * 100);

    startRadioSound();
    updateRadio();
  }

  knob.addEventListener("pointerdown", event => {
    dragging = true;
    knob.classList.add("dragging");
    knob.setPointerCapture(event.pointerId);
    setValue(event);
    dirtyClick();
  });

  knob.addEventListener("pointermove", event => {
    if (dragging) setValue(event);
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

/* =========================
   EVENTS
========================= */

waveA.addEventListener(
  "input",
  updateRadio
);

waveB.addEventListener(
  "input",
  updateRadio
);

audioBtn.addEventListener(
  "click",
  startRadioSound
);

skipBtn.addEventListener(
  "click",
  closeIntro
);

/* =========================
   INIT
========================= */

updateRadio();
drawWaves();