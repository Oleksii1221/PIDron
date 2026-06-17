"use strict";

const presets = {
  "5-race": {
    label: '5" freestyle / racing',
    frameClass: "5",
    layout: "quad",
    pusherMode: "all-standard",
    batteryType: "lipo",
    frameSize: 5,
    armLength: 162,
    frameMass: 390,
    payloadMass: 40,
    massSpread: 0.55,
    motorKv: 1850,
    stator: "2207",
    propDiameter: 5.1,
    propPitch: 4.3,
    propBlades: 3,
    batteryCells: 6,
    batteryMah: 1300,
    batteryResistance: 42,
    motorLag: 18,
    filtering: "medium",
    noise: 0.35,
    wind: 0.18,
    style: 0.72,
    targetRate: 520
  },
  "7-long": {
    label: '7" long range',
    frameClass: "7",
    layout: "quad",
    pusherMode: "all-standard",
    batteryType: "liion",
    frameSize: 7,
    armLength: 240,
    frameMass: 780,
    payloadMass: 160,
    massSpread: 0.62,
    motorKv: 1300,
    stator: "2806",
    propDiameter: 7,
    propPitch: 3.5,
    propBlades: 2,
    batteryCells: 6,
    batteryMah: 3000,
    batteryResistance: 28,
    motorLag: 28,
    filtering: "medium",
    noise: 0.28,
    wind: 0.35,
    style: 0.46,
    targetRate: 360
  },
  "10-cinema": {
    label: '10" heavy lift',
    frameClass: "10",
    layout: "octo",
    pusherMode: "all-standard",
    batteryType: "lipo",
    frameSize: 10,
    armLength: 360,
    frameMass: 1850,
    payloadMass: 650,
    massSpread: 0.72,
    motorKv: 720,
    stator: "3115",
    propDiameter: 10,
    propPitch: 4.7,
    propBlades: 2,
    batteryCells: 6,
    batteryMah: 10000,
    batteryResistance: 18,
    motorLag: 45,
    filtering: "heavy",
    noise: 0.22,
    wind: 0.42,
    style: 0.25,
    targetRate: 260
  },
  "custom-coax": {
    label: "Custom coax pusher",
    frameClass: "custom",
    layout: "coax",
    pusherMode: "mixed",
    batteryType: "lihv",
    frameSize: 8,
    armLength: 275,
    frameMass: 1100,
    payloadMass: 300,
    massSpread: 0.66,
    motorKv: 1050,
    stator: "2808",
    propDiameter: 8,
    propPitch: 4,
    propBlades: 3,
    batteryCells: 6,
    batteryMah: 5000,
    batteryResistance: 24,
    motorLag: 34,
    filtering: "medium",
    noise: 0.32,
    wind: 0.3,
    style: 0.42,
    targetRate: 330
  }
};

const options = {
  frameClass: [
    ["5", '5"'],
    ["7", '7"'],
    ["10", '10"'],
    ["custom", "Custom"]
  ],
  layout: [
    ["quad", "Quad"],
    ["hex", "Hex"],
    ["octo", "Octo"],
    ["coax", "Coax"]
  ],
  pusherMode: [
    ["all-standard", "Усі standard"],
    ["all-pusher", "Усі pusher"],
    ["mixed", "Змішано"]
  ],
  batteryType: [
    ["lipo", "LiPo"],
    ["lihv", "LiHV"],
    ["liion", "Li-ion"],
    ["lifepo", "LiFePO4"],
    ["custom", "Custom"]
  ],
  filtering: [
    ["light", "Легка"],
    ["medium", "Середня"],
    ["heavy", "Важка"]
  ]
};

const axes = ["roll", "pitch", "yaw"];
const axisLabels = { roll: "Roll", pitch: "Pitch", yaw: "Yaw" };
const ids = [
  "frameClass",
  "layout",
  "pusherMode",
  "frameSize",
  "armLength",
  "frameMass",
  "payloadMass",
  "massSpread",
  "motorKv",
  "stator",
  "propDiameter",
  "propPitch",
  "propBlades",
  "batteryType",
  "batteryCells",
  "batteryMah",
  "batteryResistance",
  "motorLag",
  "filtering",
  "noise",
  "wind",
  "style",
  "targetRate"
];

const storageKeys = {
  settings: "pidron.settings",
  customPresets: "pidron.customPresets",
  pickmeUnlocked: "pidron.pickmeUnlocked"
};

const state = {
  config: { ...presets["5-race"] },
  activeAxis: "roll",
  optimized: null,
  simulations: null,
  physics: null,
  warnings: [],
  pusherMotors: [],
  customPresets: {},
  activePresetKey: "5-race",
  pickmeClicks: 0,
  pickmeTimer: null,
  fcPort: null,
  settings: {
    language: "uk",
    theme: "light",
    units: "metric",
    compactMode: false,
    pickmeUnlocked: false
  }
};

const el = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  ids.forEach((id) => {
    el[id] = document.getElementById(id);
  });
  el.presetSelect = document.getElementById("presetSelect");
  el.metrics = document.getElementById("metrics");
  el.pidCards = document.getElementById("pidCards");
  el.warnings = document.getElementById("warnings");
  el.modelNotes = document.getElementById("modelNotes");
  el.responseChart = document.getElementById("responseChart");
  el.chartLegend = document.getElementById("chartLegend");
  el.droneVisual = document.getElementById("droneVisual");
  el.droneStatus = document.getElementById("droneStatus");
  el.optimizeBtn = document.getElementById("optimizeBtn");
  el.simulateBtn = document.getElementById("simulateBtn");
  el.copyBtn = document.getElementById("copyBtn");
  el.savePresetBtn = document.getElementById("savePresetBtn");
  el.deletePresetBtn = document.getElementById("deletePresetBtn");
  el.presetNameInput = document.getElementById("presetNameInput");
  el.presetStatus = document.getElementById("presetStatus");
  el.authorInfo = document.getElementById("authorInfo");
  el.firmwareType = document.getElementById("firmwareType");
  el.baudRate = document.getElementById("baudRate");
  el.connectFcBtn = document.getElementById("connectFcBtn");
  el.writeSafety = document.getElementById("writeSafety");
  el.generateCliBtn = document.getElementById("generateCliBtn");
  el.copyCliBtn = document.getElementById("copyCliBtn");
  el.writeFcBtn = document.getElementById("writeFcBtn");
  el.fcStatus = document.getElementById("fcStatus");
  el.fcCommandOutput = document.getElementById("fcCommandOutput");
  el.blackboxFile = document.getElementById("blackboxFile");
  el.analyzeLogBtn = document.getElementById("analyzeLogBtn");
  el.analysisReport = document.getElementById("analysisReport");
  el.language = document.getElementById("language");
  el.theme = document.getElementById("theme");
  el.units = document.getElementById("units");
  el.compactMode = document.getElementById("compactMode");
  el.massSpreadValue = document.getElementById("massSpreadValue");
  el.noiseValue = document.getElementById("noiseValue");
  el.windValue = document.getElementById("windValue");
  el.styleValue = document.getElementById("styleValue");

  loadStoredState();
  fillSelects();
  applyStoredSettings();
  bindEvents();
  applyPreset("5-race");
}

function fillSelects() {
  Object.entries(options).forEach(([id, values]) => {
    values.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      el[id].append(option);
    });
  });
  ensurePickmeThemeOption();
  renderPresetOptions();
}

function renderPresetOptions() {
  const previous = el.presetSelect.value || state.activePresetKey;
  el.presetSelect.innerHTML = "";
  appendPresetGroup("Базові", presets);
  if (Object.keys(state.customPresets).length > 0) {
    appendPresetGroup("Мої пресети", state.customPresets, "custom:");
  }
  if ([...el.presetSelect.options].some((option) => option.value === previous)) {
    el.presetSelect.value = previous;
  }
}

function appendPresetGroup(label, items, prefix = "") {
  const group = document.createElement("optgroup");
  group.label = label;
  Object.entries(items)
    .sort(([, a], [, b]) => a.label.localeCompare(b.label, "uk"))
    .forEach(([key, preset]) => {
      const option = document.createElement("option");
      option.value = `${prefix}${key}`;
      option.textContent = preset.label;
      group.append(option);
    });
  el.presetSelect.append(group);
}

function bindEvents() {
  el.presetSelect.addEventListener("change", (event) => applyPreset(event.target.value));
  ids.forEach((id) => {
    el[id].addEventListener("input", () => {
      readConfigFromInputs();
      runAll(false);
    });
  });
  el.optimizeBtn.addEventListener("click", () => runAll(true));
  el.simulateBtn.addEventListener("click", () => runAll(false));
  el.copyBtn.addEventListener("click", copyResult);
  el.savePresetBtn.addEventListener("click", saveCurrentPreset);
  el.deletePresetBtn.addEventListener("click", deleteCurrentPreset);
  el.authorInfo.addEventListener("click", handleKicoClick);
  document.querySelectorAll(".page-tab").forEach((button) => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });
  wireHelpTooltips();
  el.generateCliBtn.addEventListener("click", generateFlightControllerCommands);
  el.copyCliBtn.addEventListener("click", copyFlightControllerCommands);
  el.connectFcBtn.addEventListener("click", connectFlightController);
  el.writeFcBtn.addEventListener("click", writeFlightControllerCommands);
  el.analyzeLogBtn.addEventListener("click", analyzeBlackboxFile);
  el.theme.addEventListener("change", () => {
    state.settings.theme = el.theme.value;
    applyStoredSettings();
    saveSettings();
  });
  el.compactMode.addEventListener("change", () => {
    state.settings.compactMode = el.compactMode.checked;
    applyStoredSettings();
    saveSettings();
  });
  el.language.addEventListener("change", () => {
    state.settings.language = el.language.value;
    saveSettings();
    render();
  });
  el.units.addEventListener("change", () => {
    state.settings.units = el.units.value;
    saveSettings();
    renderMetrics();
  });
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeAxis = button.dataset.axis;
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
      drawChart();
    });
  });
}

function showPage(id) {
  document.querySelectorAll(".page-view").forEach((page) => page.classList.toggle("active", page.id === id));
  document.querySelectorAll(".page-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.page === id));
  if (id === "flightPage") generateFlightControllerCommands();
  if (id === "simulatorPage") {
    drawChart();
    renderDrone();
  }
}

function wireHelpTooltips() {
  document.querySelectorAll(".help").forEach((button) => {
    const tip = button.closest("label")?.querySelector(".tip");
    if (!tip) return;
    const show = () => showTip(button, tip);
    const hide = () => {
      if (document.activeElement !== button) hideTip(tip);
    };
    button.addEventListener("mouseenter", show);
    button.addEventListener("mouseleave", hide);
    button.addEventListener("pointerenter", show);
    button.addEventListener("pointerleave", hide);
    button.addEventListener("focus", show);
    button.addEventListener("blur", () => hideTip(tip));
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      show();
    });
  });
}

function showTip(_button, tip) {
  tip.classList.add("is-visible");
}

function hideTip(tip) {
  tip.classList.remove("is-visible");
}

function applyPreset(key) {
  const preset = getPresetByKey(key) || presets["5-race"];
  state.activePresetKey = key;
  state.config = { ...preset.config };
  state.pusherMotors = preset.pusherMotors
    ? resizePusherMotors(preset.pusherMotors, motorCountFor(state.config.layout))
    : makePusherMotors(state.config);
  el.presetSelect.value = key;
  el.presetNameInput.value = key.startsWith("custom:") ? preset.label : "";
  setPresetStatus("");
  writeInputsFromConfig();
  runAll(true);
}

function getPresetByKey(key) {
  if (key.startsWith("custom:")) {
    const custom = state.customPresets[key.slice(7)];
    if (!custom) return null;
    return {
      config: custom.config,
      pusherMotors: custom.pusherMotors,
      label: custom.label
    };
  }
  if (!presets[key]) return null;
  return {
    config: presets[key],
    label: presets[key].label
  };
}

function writeInputsFromConfig() {
  ids.forEach((id) => {
    el[id].value = state.config[id];
  });
  updateRangeLabels();
}

function readConfigFromInputs() {
  const next = {};
  ids.forEach((id) => {
    if (["frameClass", "layout", "pusherMode", "batteryType", "filtering", "stator"].includes(id)) {
      next[id] = el[id].value;
    } else {
      next[id] = Number(el[id].value);
    }
  });
  const count = motorCountFor(next.layout);
  if (next.layout !== state.config.layout || next.pusherMode !== state.config.pusherMode) {
    state.pusherMotors = makePusherMotors(next);
  } else if (state.pusherMotors.length !== count) {
    state.pusherMotors = resizePusherMotors(state.pusherMotors, count);
  }
  state.config = next;
  updateRangeLabels();
}

function saveCurrentPreset() {
  readConfigFromInputs();
  const currentCustomKey = state.activePresetKey.startsWith("custom:") ? state.activePresetKey.slice(7) : null;
  const currentName = currentCustomKey ? state.customPresets[currentCustomKey]?.label : "";
  const cleanName =
    el.presetNameInput.value.trim() ||
    currentName ||
    `Мій сетап ${Object.keys(state.customPresets).length + 1}`;
  const existingKey =
    currentCustomKey ||
    Object.entries(state.customPresets).find(([, preset]) => preset.label.toLowerCase() === cleanName.toLowerCase())?.[0] ||
    `preset-${Date.now()}`;

  state.customPresets[existingKey] = {
    label: cleanName,
    config: snapshotConfig(),
    pusherMotors: [...state.pusherMotors],
    savedAt: new Date().toISOString()
  };
  saveCustomPresets();
  renderPresetOptions();
  state.activePresetKey = `custom:${existingKey}`;
  el.presetSelect.value = state.activePresetKey;
  el.presetNameInput.value = cleanName;
  setPresetStatus("Збережено");
}

function deleteCurrentPreset() {
  if (!state.activePresetKey.startsWith("custom:")) {
    setPresetStatus("Базовий не видаляється");
    return;
  }
  const key = state.activePresetKey.slice(7);
  const label = state.customPresets[key]?.label || "цей пресет";
  delete state.customPresets[key];
  saveCustomPresets();
  renderPresetOptions();
  applyPreset("5-race");
  setPresetStatus(`Видалено: ${label}`);
}

function setPresetStatus(message) {
  el.presetStatus.textContent = message;
  if (!message) return;
  window.clearTimeout(setPresetStatus.timer);
  setPresetStatus.timer = window.setTimeout(() => {
    el.presetStatus.textContent = "";
  }, 2200);
}

function snapshotConfig() {
  return ids.reduce((snapshot, id) => {
    snapshot[id] = state.config[id];
    return snapshot;
  }, {});
}

function loadStoredState() {
  const storedSettings = readJson(storageKeys.settings, {});
  const storedPresets = readJson(storageKeys.customPresets, {});
  state.settings = {
    ...state.settings,
    ...storedSettings,
    pickmeUnlocked: localStorage.getItem(storageKeys.pickmeUnlocked) === "true" || Boolean(storedSettings.pickmeUnlocked)
  };
  state.customPresets = storedPresets && typeof storedPresets === "object" ? storedPresets : {};
}

function applyStoredSettings() {
  ensurePickmeThemeOption();
  if (state.settings.theme.startsWith("pickme") && !state.settings.pickmeUnlocked) {
    state.settings.theme = "light";
  }
  el.language.value = state.settings.language || "uk";
  el.theme.value = state.settings.theme || "light";
  el.units.value = state.settings.units || "metric";
  el.compactMode.checked = Boolean(state.settings.compactMode);
  document.body.dataset.theme = el.theme.value;
  document.body.classList.toggle("compact", el.compactMode.checked);
  renderDrone();
  drawChart();
}

function saveSettings() {
  localStorage.setItem(storageKeys.settings, JSON.stringify(state.settings));
}

function saveCustomPresets() {
  localStorage.setItem(storageKeys.customPresets, JSON.stringify(state.customPresets));
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function ensurePickmeThemeOption() {
  if (!state.settings.pickmeUnlocked) return;
  [
    ["pickme", "Пікмі"],
    ["pickme-dark", "Пікмі темна"]
  ].forEach(([value, label]) => {
    if ([...el.theme.options].some((option) => option.value === value)) return;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    el.theme.append(option);
  });
}

function handleKicoClick() {
  state.pickmeClicks += 1;
  window.clearTimeout(state.pickmeTimer);
  state.pickmeTimer = window.setTimeout(() => {
    state.pickmeClicks = 0;
  }, 1800);

  if (state.pickmeClicks < 5) return;
  state.pickmeClicks = 0;
  state.settings.pickmeUnlocked = true;
  state.settings.theme = "pickme";
  localStorage.setItem(storageKeys.pickmeUnlocked, "true");
  saveSettings();
  applyStoredSettings();
}

function updateRangeLabels() {
  el.massSpreadValue.textContent = `${Math.round(Number(el.massSpread.value) * 100)}%`;
  el.noiseValue.textContent = levelLabel(Number(el.noise.value));
  el.windValue.textContent = levelLabel(Number(el.wind.value));
  el.styleValue.textContent = levelLabel(Number(el.style.value));
}

function levelLabel(value) {
  if (value < 0.25) return "низько";
  if (value < 0.55) return "середньо";
  if (value < 0.8) return "високо";
  return "дуже високо";
}

function runAll(optimize) {
  state.physics = estimatePhysics(state.config);
  state.warnings = buildWarnings(state.config, state.physics);
  if (optimize || !state.optimized) {
    state.optimized = optimizePid(state.config, state.physics);
  } else {
    state.optimized = rescalePid(state.optimized, state.config, state.physics);
  }
  state.simulations = {};
  axes.forEach((axis) => {
    state.simulations[axis] = simulateAxis(axis, state.config, state.physics, state.optimized[axis].pid);
    state.optimized[axis].metrics = state.simulations[axis].metrics;
  });
  render();
  generateFlightControllerCommands();
}

function estimatePhysics(config) {
  const motorCount = motorCountFor(config.layout);
  const coaxLoss = config.layout === "coax" ? 0.86 : 1;
  const pusherRatio =
    state.pusherMotors.length > 0 ? state.pusherMotors.filter(Boolean).length / state.pusherMotors.length : 0;
  const pusherLoss = 1 - pusherRatio * 0.05;
  const stator = parseStator(config.stator);
  const battery = batteryProfile(config.batteryType);
  const batteryMass = battery.baseMass + config.batteryMah * config.batteryCells * battery.massFactor;
  const motorMass = motorCount * (0.014 + stator.volume * 0.0000026);
  const propMass = motorCount * (0.004 + Math.pow(config.propDiameter, 2.25) * config.propBlades * 0.00011);
  const allUpMassKg =
    (config.frameMass + config.payloadMass) / 1000 + batteryMass + motorMass + propMass;
  const voltageNominal = config.batteryCells * battery.nominalVoltage;
  const rpmNoLoad = config.motorKv * voltageNominal;
  const propLoad = Math.pow(config.propDiameter, 4) * config.propPitch * (1 + (config.propBlades - 2) * 0.18);
  const kvTorqueFit = clamp((stator.volume / 1100) * (1800 / Math.max(config.motorKv, 1)), 0.38, 2.15);
  const loadLimit = clamp(0.82 / (1 + propLoad / (4200 * kvTorqueFit)), 0.35, 0.78);
  const loadedRpm = rpmNoLoad * loadLimit;
  const thrustPerMotorN =
    5.0e-11 *
    Math.pow(loadedRpm, 2) *
    Math.pow(config.propDiameter, 3.55) *
    (0.72 + config.propPitch / 7) *
    (1 + (config.propBlades - 2) * 0.12) *
    coaxLoss *
    pusherLoss;
  const maxThrustN = thrustPerMotorN * motorCount;
  const weightN = allUpMassKg * 9.81;
  const thrustToWeight = maxThrustN / weightN;
  const hoverThrottle = clamp(weightN / Math.max(maxThrustN, 0.01), 0.08, 0.96);
  const armM = config.armLength / 1000;
  const inertiaBase = allUpMassKg * Math.pow(armM * config.massSpread, 2);
  const inertia = {
    roll: inertiaBase * 0.84,
    pitch: inertiaBase * 0.91,
    yaw: inertiaBase * (1.75 + config.propDiameter / 7)
  };
  const torqueLever = armM * (config.layout === "hex" ? 0.92 : config.layout === "octo" ? 0.86 : 1);
  const axisAuthority = {
    roll: maxThrustN * torqueLever * 0.23 * (1 - hoverThrottle),
    pitch: maxThrustN * torqueLever * 0.21 * (1 - hoverThrottle),
    yaw:
      maxThrustN *
      config.propDiameter *
      0.012 *
      (config.propBlades >= 3 ? 1.1 : 0.86) *
      (config.layout === "coax" ? 1.18 : 1) *
      (1 - hoverThrottle * 0.6)
  };
  const currentEstimate =
    motorCount *
    Math.pow(config.propDiameter, 2.2) *
    config.propPitch *
    config.motorKv *
      battery.currentFactor *
      clamp(hoverThrottle + 0.28 + config.style * 0.12, 0.36, 0.82);
  const sagV = (currentEstimate * (config.batteryResistance / 1000)) / Math.max(config.batteryCells, 1);
  const sagRatio = clamp(sagV / battery.nominalVoltage, 0, 0.32);
  const discLoading = weightN / (motorCount * Math.PI * Math.pow((config.propDiameter * 0.0254) / 2, 2));
  const filterDelayMs = { light: 4, medium: 8, heavy: 14 }[config.filtering];
  const responseLagMs = config.motorLag + filterDelayMs + sagRatio * 35 + config.propDiameter * 1.4;
  return {
    motorCount,
    allUpMassKg,
    batteryMass,
    motorMass,
    propMass,
    voltageNominal,
    loadedRpm,
    maxThrustN,
    thrustPerMotorN,
    weightN,
    thrustToWeight,
    hoverThrottle,
    inertia,
    axisAuthority,
    sagRatio,
    discLoading,
    responseLagMs,
    propLoad,
    loadLimit,
    pusherRatio,
    battery
  };
}

function batteryProfile(type) {
  return (
    {
      lipo: { label: "LiPo", nominalVoltage: 3.75, baseMass: 0.095, massFactor: 0.0000115, currentFactor: 0.00015 },
      lihv: { label: "LiHV", nominalVoltage: 3.85, baseMass: 0.098, massFactor: 0.0000118, currentFactor: 0.000145 },
      liion: { label: "Li-ion", nominalVoltage: 3.6, baseMass: 0.12, massFactor: 0.0000148, currentFactor: 0.00018 },
      lifepo: { label: "LiFePO4", nominalVoltage: 3.2, baseMass: 0.13, massFactor: 0.000016, currentFactor: 0.00017 },
      custom: { label: "Custom", nominalVoltage: 3.7, baseMass: 0.11, massFactor: 0.000013, currentFactor: 0.00016 }
    }[type] || { label: "Custom", nominalVoltage: 3.7, baseMass: 0.11, massFactor: 0.000013, currentFactor: 0.00016 }
  );
}

function parseStator(raw) {
  const match = String(raw).match(/(\d{2})(\d{2})/);
  if (!match) return { width: 22, height: 7, volume: 22 * 22 * 7 };
  const width = Number(match[1]);
  const height = Number(match[2]);
  return { width, height, volume: width * width * height };
}

function motorCountFor(layout) {
  return { quad: 4, hex: 6, octo: 8, coax: 8 }[layout] || 4;
}

function makePusherMotors(config) {
  const count = motorCountFor(config.layout);
  if (config.pusherMode === "all-pusher") return Array(count).fill(true);
  if (config.pusherMode === "mixed") {
    return Array.from({ length: count }, (_, index) =>
      config.layout === "coax" ? index % 2 === 1 : index >= Math.floor(count / 2)
    );
  }
  return Array(count).fill(false);
}

function resizePusherMotors(current, count) {
  return Array.from({ length: count }, (_, index) => Boolean(current[index]));
}

function syncPusherModeFromMotors() {
  const count = state.pusherMotors.length;
  const pusherCount = state.pusherMotors.filter(Boolean).length;
  const mode = pusherCount === 0 ? "all-standard" : pusherCount === count ? "all-pusher" : "mixed";
  state.config.pusherMode = mode;
  el.pusherMode.value = mode;
}

function optimizePid(config, physics) {
  const result = {};
  axes.forEach((axis) => {
    const base = basePid(axis, config, physics);
    const candidates = [];
    for (const pScale of [0.72, 0.88, 1, 1.12, 1.3, 1.48]) {
      for (const iScale of [0.55, 0.78, 1, 1.24, 1.52]) {
        for (const dScale of [0.45, 0.72, 1, 1.22, 1.48]) {
          const pid = {
            p: base.p * pScale,
            i: base.i * iScale,
            d: base.d * dScale,
            ff: base.ff * clamp(1.12 - pScale * 0.12 + config.style * 0.1, 0.82, 1.28)
          };
          const sim = simulateAxis(axis, config, physics, pid);
          candidates.push({ pid, metrics: sim.metrics, score: scoreMetrics(sim.metrics, config) });
        }
      }
    }
    candidates.sort((a, b) => a.score - b.score);
    result[axis] = candidates[0];
  });
  return result;
}

function rescalePid(current, config, physics) {
  const scaled = {};
  axes.forEach((axis) => {
    const fallback = basePid(axis, config, physics);
    const pid = current?.[axis]?.pid || fallback;
    scaled[axis] = {
      pid: {
        p: clamp(pid.p, fallback.p * 0.45, fallback.p * 1.9),
        i: clamp(pid.i, fallback.i * 0.4, fallback.i * 2.2),
        d: clamp(pid.d, fallback.d * 0.35, fallback.d * 2.1),
        ff: clamp(pid.ff, fallback.ff * 0.5, fallback.ff * 1.8)
      },
      metrics: current?.[axis]?.metrics || {}
    };
  });
  return scaled;
}

function basePid(axis, config, physics) {
  const authority = physics.axisAuthority[axis] / Math.max(physics.inertia[axis], 0.0001);
  const authorityDeg = authority * (180 / Math.PI);
  const lag = physics.responseLagMs / 1000;
  const axisFactor = axis === "yaw" ? 0.62 : axis === "pitch" ? 0.95 : 1;
  const style = 0.82 + config.style * 0.42;
  const loadPenalty = clamp(1 / Math.sqrt(Math.max(physics.thrustToWeight, 0.45)), 0.56, 1.55);
  const p = axisFactor * style * loadPenalty * clamp(36 / Math.sqrt(authority), 0.08, 1.55);
  const i = p * clamp(0.58 + physics.hoverThrottle * 0.8 + config.wind * 0.35, 0.45, 1.5);
  const d = p * clamp(lag * 5.8 + config.noise * 0.18 + (config.filtering === "heavy" ? 0.16 : 0), 0.08, 0.75);
  const drag = 1.9 + physics.discLoading / 130;
  const steadyDemand = (drag * config.targetRate * (axis === "yaw" ? 0.72 : 1)) / Math.max(authorityDeg, 1);
  const ff = clamp(steadyDemand * (0.78 + config.style * 0.34), 0.04, axis === "yaw" ? 0.36 : 0.58);
  return { p, i, d, ff };
}

function simulateAxis(axis, config, physics, pid) {
  const dt = 0.002;
  const totalTime = 1.6;
  const steps = Math.round(totalTime / dt);
  const target = config.targetRate * (axis === "yaw" ? 0.72 : 1);
  const authorityDeg =
    (physics.axisAuthority[axis] / Math.max(physics.inertia[axis], 0.0001)) * (180 / Math.PI);
  const tau = Math.max(0.006, physics.responseLagMs / 1000);
  const windBias = (config.wind * target * (axis === "yaw" ? 0.05 : 0.08)) / Math.max(authorityDeg, 80);
  const noiseAmp = config.noise * (axis === "yaw" ? 1.6 : 2.4);
  let rate = 0;
  let motor = 0;
  let integral = 0;
  let prevError = 0;
  let saturationSamples = 0;
  let absError = 0;
  let oscillation = 0;
  let prevVelocitySign = 0;
  let lastObserved = 0;
  const points = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i * dt;
    const command = t < 0.12 ? 0 : target;
    const error = command - rate;
    integral = clamp(integral + error * dt, -target * 0.42, target * 0.42);
    const derivative = (error - prevError) / dt;
    const ffTerm = (command / Math.max(target, 1)) * pid.ff;
    const raw = (pid.p * error) / 620 + (pid.i * integral) / 520 + (pid.d * derivative) / 14000 + ffTerm;
    const demand = clamp(raw + windBias * Math.sin(t * 8.5), -1, 1);
    if (Math.abs(raw) > 1) saturationSamples += 1;
    const effectiveTau = tau * (1 + Math.abs(motor) * 0.45 + physics.sagRatio * 0.8);
    motor += ((demand - motor) * dt) / effectiveTau;
    const saggedAuthority = authorityDeg * (1 - physics.sagRatio * (0.35 + Math.abs(motor) * 0.65));
    const disturbance = config.wind * 22 * Math.sin(t * 5.2 + (axis === "pitch" ? 1.4 : 0));
    const accel = motor * saggedAuthority - rate * (1.9 + physics.discLoading / 130) + disturbance;
    rate += accel * dt;
    const visibleNoise = deterministicNoise(i, axis) * noiseAmp;
    const observed = rate + visibleNoise;
    const delta = observed - lastObserved;
    const velocitySign = Math.abs(delta) > target * 0.006 ? Math.sign(delta) : 0;
    if (t > 0.24 && velocitySign !== 0 && prevVelocitySign !== 0 && velocitySign !== prevVelocitySign) {
      oscillation += 1;
    }
    prevVelocitySign = velocitySign || prevVelocitySign;
    lastObserved = observed;
    prevError = error;
    absError += Math.abs(error) * dt;
    if (i % 4 === 0) {
      points.push({
        t,
        target: command,
        rate: observed,
        motor: motor * 100,
        saturation: Math.abs(raw) > 1
      });
    }
  }

  const metrics = calculateMetrics(points, target, saturationSamples / steps, oscillation, absError / totalTime);
  return { points, metrics };
}

function calculateMetrics(points, target, saturationRatio, oscillation, meanAbsError) {
  const active = points.filter((point) => point.t >= 0.12);
  const maxRate = Math.max(...active.map((point) => point.rate));
  const finalWindow = active.slice(-Math.max(8, Math.round(active.length * 0.12)));
  const finalMean = average(finalWindow.map((point) => point.rate));
  const overshoot = Math.max(0, ((maxRate - target) / Math.max(target, 1)) * 100);
  const band = target * 0.05;
  let settlingTime = 1.6;
  for (const point of active) {
    const tail = active.filter((candidate) => candidate.t >= point.t);
    if (tail.every((candidate) => Math.abs(candidate.rate - target) <= band)) {
      settlingTime = point.t - 0.12;
      break;
    }
  }
  const tailVariance = variance(finalWindow.map((point) => point.rate));
  const oscillationRisk = clamp(
    overshoot / 38 + Math.sqrt(tailVariance) / Math.max(target * 0.14, 1) + oscillation / 180,
    0,
    1
  );
  const steadyError = Math.abs(target - finalMean);
  return {
    overshoot,
    settlingTime,
    oscillationRisk,
    saturation: saturationRatio,
    steadyError,
    meanAbsError
  };
}

function scoreMetrics(metrics, config) {
  return (
    metrics.overshoot * 1.8 +
    metrics.settlingTime * 42 * (0.8 + config.style * 0.5) +
    metrics.oscillationRisk * 95 +
    metrics.saturation * 70 +
    metrics.steadyError * 0.18 +
    metrics.meanAbsError * 0.04
  );
}

function buildWarnings(config, physics) {
  const warnings = [];
  if (physics.thrustToWeight < 1.7) {
    warnings.push({
      level: "high",
      title: "Малий запас тяги",
      text: `TWR ${format(physics.thrustToWeight, 2)}: PID матиме часту saturation, а recovery після маневру буде повільним.`
    });
  } else if (physics.thrustToWeight < 2.4) {
    warnings.push({
      level: "medium",
      title: "Обмежений запас тяги",
      text: `TWR ${format(physics.thrustToWeight, 2)} підходить для плавного польоту, але агресивні rates потребують обережності.`
    });
  }
  if (physics.hoverThrottle > 0.58) {
    warnings.push({
      level: "high",
      title: "Високий hover throttle",
      text: `${Math.round(physics.hoverThrottle * 100)}% у висінні залишає мало керуючого діапазону для стабілізації.`
    });
  }
  if (physics.sagRatio > 0.18) {
    warnings.push({
      level: "medium",
      title: "Помітний battery sag",
      text: `Оцінений провал напруги ${Math.round(physics.sagRatio * 100)}% може змінювати PID-відповідь протягом газу.`
    });
  }
  if (physics.responseLagMs > 62) {
    warnings.push({
      level: "medium",
      title: "Повільна силова установка",
      text: `Ефективна затримка ${Math.round(physics.responseLagMs)} мс підвищує overshoot і зменшує безпечний D.`
    });
  }
  if (config.propDiameter > config.frameSize + 0.8 && config.frameClass !== "custom") {
    warnings.push({
      level: "medium",
      title: "Незвичне змішування компонентів",
      text: `${config.propDiameter}" проп на ${config.frameSize}" рамі можливий у симуляції, але перевірте clearance і жорсткість рами.`
    });
  }
  if (config.noise > 0.72 && config.filtering === "light") {
    warnings.push({
      level: "medium",
      title: "Шум і легка фільтрація",
      text: "D-term може гріти мотори. Починайте з нижчого D або сильнішої фільтрації."
    });
  }
  if (config.layout === "coax") {
    warnings.push({
      level: "low",
      title: "Coaxial поправка",
      text: "Модель враховує втрату тяги у стеку пропів і трохи кращий yaw authority, але реальні відстані між пропами важливі."
    });
  }
  if (physics.pusherRatio > 0 && physics.pusherRatio < 1) {
    warnings.push({
      level: "low",
      title: "Змішана pusher-схема",
      text: `${format(physics.pusherRatio * 100, 0)}% моторів pusher: перевірте напрямки пропів, обдув рами й можливе зміщення yaw/roll coupling.`
    });
  }
  if (!warnings.length) {
    warnings.push({
      level: "low",
      title: "Сетап виглядає збалансовано",
      text: "Ризики не зникли, але симуляція не бачить очевидного конфлікту між рамою, мотором, пропом і батареєю."
    });
  }
  return warnings;
}

function render() {
  renderDrone();
  renderMetrics();
  renderPidCards();
  renderWarnings();
  renderModelNotes();
  drawChart();
}

function renderDrone() {
  const count = motorCountFor(state.config.layout);
  if (state.pusherMotors.length !== count) {
    state.pusherMotors = resizePusherMotors(state.pusherMotors, count);
  }
  const radius = 39;
  const start = state.config.layout === "quad" ? -45 : -90;
  const arms = [];
  const motors = [];
  for (let index = 0; index < count; index += 1) {
    const angle = start + (360 / count) * index;
    const rad = (angle * Math.PI) / 180;
    const x = 50 + Math.cos(rad) * radius;
    const y = 50 + Math.sin(rad) * radius;
    const isPusher = Boolean(state.pusherMotors[index]);
    const isCoax = state.config.layout === "coax";
    arms.push(`<span class="arm" style="transform: rotate(${angle}deg)"></span>`);
    motors.push(`
      <button
        class="motor-node ${isPusher ? "pusher" : ""} ${isCoax ? "coax" : ""}"
        type="button"
        data-motor="${index}"
        style="left:${x}%; top:${y}%"
        title="M${index + 1}: ${isPusher ? "pusher" : "standard"}"
      >
        M${index + 1}<small>${isPusher ? "push" : "std"}</small>
      </button>`);
  }
  el.droneVisual.innerHTML = `
    ${arms.join("")}
    <div class="drone-hub">${state.config.layout.toUpperCase()}</div>
    ${motors.join("")}`;
  el.droneVisual.querySelectorAll(".motor-node").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.motor);
      state.pusherMotors[index] = !state.pusherMotors[index];
      syncPusherModeFromMotors();
      runAll(true);
    });
  });
  const pusherCount = state.pusherMotors.filter(Boolean).length;
  el.droneStatus.textContent = `${state.config.layout.toUpperCase()} · ${pusherCount}/${count} pusher`;
  const detail = {
    layout: state.config.layout,
    armLength: state.config.armLength,
    propDiameter: state.config.propDiameter,
    pusherMotors: [...state.pusherMotors]
  };
  window.pidronCurrentDrone = detail;
  window.dispatchEvent(new CustomEvent("pidron:drone-change", { detail }));
}

function renderMetrics() {
  const physics = state.physics;
  const metrics = [
    ["Маса AUW", `${format(physics.allUpMassKg * 1000, 0)} г`, "рама, батарея, мотори, пропи, payload"],
    ["Тяга / вага", `${format(physics.thrustToWeight, 2)}x`, `${format(physics.maxThrustN / 9.81, 2)} кг сумарної тяги`],
    ["Hover throttle", `${format(physics.hoverThrottle * 100, 0)}%`, "нижче краще для control authority"],
    [
      "Battery sag",
      `${format(physics.sagRatio * 100, 0)}%`,
      `${physics.battery.label}, ${format(physics.voltageNominal, 1)} В nominal`
    ],
    ["Motor lag + filter", `${format(physics.responseLagMs, 0)} мс`, "мотор, фільтр, sag, інерція пропа"],
    ["Disc loading", `${format(physics.discLoading, 1)} Н/м²`, "оцінка навантаження на пропи"],
    ["Loaded RPM", `${format(physics.loadedRpm, 0)}`, "KV, напруга і prop loading"],
    [
      "Моторів",
      `${physics.motorCount}`,
      `${state.config.layout.toUpperCase()}, pusher ${format(physics.pusherRatio * 100, 0)}%`
    ]
  ];
  el.metrics.innerHTML = metrics
    .map(
      ([label, value, hint]) => `
        <article class="metric">
          <span>${label}</span>
          <strong>${value}</strong>
          <em>${hint}</em>
        </article>`
    )
    .join("");
}

function renderPidCards() {
  el.pidCards.innerHTML = axes
    .map((axis) => {
      const item = state.optimized[axis];
      const m = item.metrics;
      return `
        <article class="pid-card">
          <h3>${axisLabels[axis]} <span>${riskLabel(m.oscillationRisk)}</span></h3>
          <table class="pid-table">
            <tr><td>P</td><td>${format(item.pid.p, 2)}</td></tr>
            <tr><td>I</td><td>${format(item.pid.i, 2)}</td></tr>
            <tr><td>D</td><td>${format(item.pid.d, 2)}</td></tr>
            <tr><td>Feedforward</td><td>${format(item.pid.ff, 2)}</td></tr>
            <tr><td>Overshoot</td><td>${format(m.overshoot, 1)}%</td></tr>
            <tr><td>Settling</td><td>${format(m.settlingTime * 1000, 0)} мс</td></tr>
            <tr><td>Saturation</td><td>${format(m.saturation * 100, 1)}%</td></tr>
          </table>
        </article>`;
    })
    .join("");
}

function renderWarnings() {
  el.warnings.innerHTML = state.warnings
    .map(
      (warning) => `
        <article class="warning ${warning.level}">
          <strong>${warning.title}</strong>
          <span>${warning.text}</span>
        </article>`
    )
    .join("");
}

function renderModelNotes() {
  const physics = state.physics;
  const notes = [
    [
      "Тяга",
      `Оцінка бере KV, ${physics.battery.label} nominal voltage, діаметр/крок/лопаті пропа, stator volume, ${format(
        physics.pusherRatio * 100,
        0
      )}% pusher-моторів, втрату coax і prop loading.`
    ],
    [
      "Інерція",
      `Маса розкладається через плече ${format(state.config.armLength, 0)} мм і коефіцієнт розподілу ${format(
        state.config.massSpread,
        2
      )}; yaw отримує більший момент інерції.`
    ],
    [
      "Saturation",
      `PID demand clamp до доступного torque authority: roll ${format(physics.axisAuthority.roll, 2)} Нм, pitch ${format(
        physics.axisAuthority.pitch,
        2
      )} Нм, yaw ${format(physics.axisAuthority.yaw, 2)} Нм.`
    ],
    [
      "Шум і вітер",
      "Шум додається до виміряного rate, а вітер як повільне збурення моменту. Це показує ризик D-term і I-term, але не замінює blackbox."
    ]
  ];
  el.modelNotes.innerHTML = notes
    .map(
      ([title, text]) => `
        <article class="note">
          <strong>${title}</strong>
          <span>${text}</span>
        </article>`
    )
    .join("");
}

function generateFlightControllerCommands() {
  if (!state.optimized || !el.fcCommandOutput) return;
  const firmware = el.firmwareType?.value || "betaflight";
  const lines = firmware === "ardupilot" ? ardupilotParams() : cliCommands(firmware);
  el.fcCommandOutput.value = lines.join("\n");
  if (el.fcStatus && !state.fcPort) {
    el.fcStatus.textContent = "Команди готові";
  }
}

function cliCommands(firmware) {
  const prefix = firmware === "inav" ? "mc_" : "";
  const scalePid = (value) => Math.round(clamp(value * 52, 1, 180));
  const scaleD = (value) => Math.round(clamp(value * 44, 0, 160));
  const scaleF = (value) => Math.round(clamp(value * 110, 0, 220));
  return [
    "# PIDron generated values",
    "# Перевірити без пропів. Не шити сліпо.",
    "profile 0",
    ...axes.flatMap((axis) => {
      const pid = state.optimized[axis].pid;
      return [
        `set ${prefix}${axis}_p = ${scalePid(pid.p)}`,
        `set ${prefix}${axis}_i = ${scalePid(pid.i)}`,
        `set ${prefix}${axis}_d = ${scaleD(pid.d)}`,
        `set ${prefix}${axis}_f = ${scaleF(pid.ff)}`
      ];
    }),
    "save"
  ];
}

function ardupilotParams() {
  const map = { roll: "RLL", pitch: "PIT", yaw: "YAW" };
  return [
    "# PIDron generated ArduPilot params",
    "# Перевірити без пропів. Значення є стартовими.",
    ...axes.flatMap((axis) => {
      const pid = state.optimized[axis].pid;
      const prefix = `ATC_RAT_${map[axis]}`;
      return [
        `${prefix}_P ${formatParam(pid.p * 0.11)}`,
        `${prefix}_I ${formatParam(pid.i * 0.09)}`,
        `${prefix}_D ${formatParam(pid.d * 0.004)}`,
        `${prefix}_FF ${formatParam(pid.ff * 0.08)}`
      ];
    })
  ];
}

function formatParam(value) {
  return Number(value).toFixed(4);
}

async function copyFlightControllerCommands() {
  const text = el.fcCommandOutput.value.trim();
  if (!text) return;
  if (window.pidronDesktop?.writeClipboard) {
    window.pidronDesktop.writeClipboard(text);
  } else {
    await navigator.clipboard.writeText(text);
  }
  el.fcStatus.textContent = "Скопійовано";
}

async function connectFlightController() {
  if (!navigator.serial) {
    el.fcStatus.textContent = "Web Serial недоступний у цьому режимі";
    return;
  }
  try {
    state.fcPort = await navigator.serial.requestPort();
    await state.fcPort.open({ baudRate: Number(el.baudRate.value) });
    el.fcStatus.textContent = "Підключено";
  } catch (error) {
    el.fcStatus.textContent = `Не підключено: ${error.message}`;
  }
}

async function writeFlightControllerCommands() {
  if (!el.writeSafety.checked) {
    el.fcStatus.textContent = "Спершу увімкни safety checkbox";
    return;
  }
  if (!state.fcPort?.writable) {
    el.fcStatus.textContent = "Немає активного serial-порту";
    return;
  }
  const writer = state.fcPort.writable.getWriter();
  try {
    const payload = new TextEncoder().encode(`${el.fcCommandOutput.value}\n`);
    await writer.write(payload);
    el.fcStatus.textContent = "Команди відправлено";
  } catch (error) {
    el.fcStatus.textContent = `Помилка запису: ${error.message}`;
  } finally {
    writer.releaseLock();
  }
}

async function analyzeBlackboxFile() {
  const file = el.blackboxFile.files?.[0];
  if (!file) {
    el.analysisReport.textContent = "Спершу вибери CSV/TXT/BBL файл.";
    return;
  }
  const text = await file.text();
  const report = analyzeLogText(text);
  el.analysisReport.textContent = report;
}

function analyzeLogText(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim()).slice(0, 12000);
  if (lines.length < 4) return "Лог занадто короткий для аналізу.";
  const delimiter = detectDelimiter(lines[0]);
  const headers = lines[0].split(delimiter).map((item) => item.trim().toLowerCase());
  const rows = lines
    .slice(1)
    .map((line) => line.split(delimiter).map((item) => Number(String(item).replace(",", "."))))
    .filter((row) => row.some(Number.isFinite));
  const setpointIndex = findColumn(headers, ["setpoint", "rccommand", "axisp", "desired"]);
  const gyroIndex = findColumn(headers, ["gyro", "gyroadc", "rate", "actual"]);
  const motorIndex = findColumn(headers, ["motor", "motor[", "esc"]);
  const values = (index) => (index >= 0 ? rows.map((row) => row[index]).filter(Number.isFinite) : []);
  const gyro = values(gyroIndex);
  const setpoint = values(setpointIndex);
  const motor = values(motorIndex);
  const trackingError =
    gyro.length && setpoint.length
      ? average(gyro.slice(0, setpoint.length).map((value, index) => Math.abs(setpoint[index] - value)))
      : null;
  const noise = gyro.length > 4 ? standardDeviation(gyro.slice(1).map((value, index) => value - gyro[index])) : null;
  const saturation =
    motor.length > 0 ? motor.filter((value) => value > 1900 || value < 1050 || value > 0.95).length / motor.length : null;
  const advice = [];
  if (trackingError !== null && trackingError > 90) advice.push("tracking error високий: трохи підняти P або feedforward.");
  if (noise !== null && noise > 55) advice.push("шум високий: зменшити D або посилити фільтрацію.");
  if (saturation !== null && saturation > 0.08) advice.push("є saturation: зменшити агресивність PID або перевірити запас тяги.");
  if (!advice.length) advice.push("лог виглядає відносно спокійно; робити малі кроки й перевіряти motor temp.");
  return [
    `Файл: ${el.blackboxFile.files[0].name}`,
    `Рядків проаналізовано: ${rows.length}`,
    `Tracking error: ${trackingError === null ? "немає колонок setpoint/gyro" : format(trackingError, 1)}`,
    `Noise score: ${noise === null ? "немає gyro" : format(noise, 1)}`,
    `Saturation: ${saturation === null ? "немає motor" : `${format(saturation * 100, 1)}%`}`,
    "",
    "Рекомендації:",
    ...advice.map((item) => `- ${item}`),
    "",
    "MVP-аналіз: для точного автотюну краще додати повний Blackbox parser із фазовою затримкою та FFT."
  ].join("\n");
}

function detectDelimiter(line) {
  if (line.includes("\t")) return "\t";
  if (line.includes(";")) return ";";
  return ",";
}

function findColumn(headers, needles) {
  return headers.findIndex((header) => needles.some((needle) => header.includes(needle)));
}

function drawChart() {
  const canvas = el.responseChart;
  const ctx = canvas.getContext("2d");
  const sim = state.simulations?.[state.activeAxis];
  if (!sim) return;

  const css = getComputedStyle(document.body);
  const surface = css.getPropertyValue("--surface").trim() || "#fbfcfb";
  const line = css.getPropertyValue("--line").trim() || "#d8dfda";
  const ink = css.getPropertyValue("--ink").trim() || "#1b2220";
  const muted = css.getPropertyValue("--muted").trim() || "#63706b";
  const accent = css.getPropertyValue("--accent").trim() || "#176b5b";
  const amber = css.getPropertyValue("--amber").trim() || "#a66200";
  const red = css.getPropertyValue("--red").trim() || "#a12b2b";
  const width = canvas.width;
  const height = canvas.height;
  const pad = { left: 54, right: 24, top: 24, bottom: 42 };
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, width, height);

  const maxY = Math.max(...sim.points.map((p) => Math.max(p.target, p.rate)), state.config.targetRate) * 1.15;
  const minY = Math.min(0, Math.min(...sim.points.map((p) => p.rate)) * 1.1);
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const x = (t) => pad.left + (t / 1.6) * plotW;
  const y = (value) => pad.top + (1 - (value - minY) / (maxY - minY)) * plotH;

  ctx.strokeStyle = line;
  ctx.lineWidth = 1;
  ctx.fillStyle = muted;
  ctx.font = "13px Inter, sans-serif";
  for (let i = 0; i <= 5; i += 1) {
    const gy = pad.top + (plotH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(width - pad.right, gy);
    ctx.stroke();
    const label = maxY - ((maxY - minY) / 5) * i;
    ctx.fillText(`${format(label, 0)}`, 12, gy + 4);
  }
  for (let i = 0; i <= 4; i += 1) {
    const gx = pad.left + (plotW / 4) * i;
    ctx.beginPath();
    ctx.moveTo(gx, pad.top);
    ctx.lineTo(gx, height - pad.bottom);
    ctx.stroke();
    ctx.fillText(`${format((1.6 / 4) * i, 1)} c`, gx - 12, height - 14);
  }

  drawSeries(ctx, sim.points, (p) => x(p.t), (p) => y(p.target), "#2563a9", 2, [8, 6]);
  drawSeries(ctx, sim.points, (p) => x(p.t), (p) => y(p.rate), accent, 3);
  drawSeries(
    ctx,
    sim.points,
    (p) => x(p.t),
    (p) => pad.top + plotH - ((p.motor + 100) / 200) * plotH,
    amber,
    1.5
  );
  sim.points
    .filter((p) => p.saturation)
    .forEach((p) => {
      ctx.fillStyle = redWithAlpha(red, 0.18);
      ctx.fillRect(x(p.t), pad.top, 3, plotH);
    });

  ctx.fillStyle = ink;
  ctx.font = "700 14px Inter, sans-serif";
  ctx.fillText(`${axisLabels[state.activeAxis]} rate, град/с`, pad.left, 18);
  el.chartLegend.innerHTML = `
    <span style="color:#176b5b">фактичний rate</span>
    <span style="color:#2563a9">команда</span>
    <span style="color:#a66200">motor demand</span>
    <span style="color:#a12b2b">saturation</span>`;
}

function drawSeries(ctx, points, getX, getY, color, lineWidth, dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(dash);
  ctx.beginPath();
  points.forEach((point, index) => {
    const px = getX(point);
    const py = getY(point);
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();
  ctx.restore();
}

async function copyResult() {
  const lines = axes.map((axis) => {
    const item = state.optimized[axis];
    return `${axisLabels[axis]}: P ${format(item.pid.p, 2)}, I ${format(item.pid.i, 2)}, D ${format(
      item.pid.d,
      2
    )}, FF ${format(item.pid.ff, 2)}`;
  });
  const text = `PIDron\n${lines.join("\n")}\nTWR ${format(state.physics.thrustToWeight, 2)}x, hover ${format(
    state.physics.hoverThrottle * 100,
    0
  )}%, ${state.physics.battery.label}, pusher ${format(state.physics.pusherRatio * 100, 0)}%`;
  try {
    if (window.pidronDesktop?.writeClipboard) {
      window.pidronDesktop.writeClipboard(text);
    } else {
      await navigator.clipboard.writeText(text);
    }
    el.copyBtn.textContent = "Copied";
    window.setTimeout(() => {
      el.copyBtn.textContent = "Copy";
    }, 1200);
  } catch {
    el.copyBtn.textContent = "No access";
  }
}

function deterministicNoise(i, axis) {
  const seed = axis === "roll" ? 12.9898 : axis === "pitch" ? 78.233 : 37.719;
  const value = Math.sin(i * seed) * 43758.5453;
  return (value - Math.floor(value) - 0.5) * 2;
}

function riskLabel(value) {
  if (value > 0.66) return "високий ризик";
  if (value > 0.36) return "помірний ризик";
  return "стабільно";
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

function variance(values) {
  const mean = average(values);
  return average(values.map((value) => Math.pow(value - mean, 2)));
}

function standardDeviation(values) {
  return Math.sqrt(variance(values));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function format(value, digits) {
  return Number(value).toLocaleString("uk-UA", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function redWithAlpha(color, alpha) {
  if (color.startsWith("#") && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(161, 43, 43, ${alpha})`;
}
