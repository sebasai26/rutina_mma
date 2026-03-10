// Rutina MMA - 12 Semanas
const RUTINA = {
  dia1: {
    titulo: "Martes: Potencia + Fuerza Posterior",
    secciones: [
      {
        titulo: "Bloque contraste (potencia)",
        ejercicios: [
          { nombre: "A1. Sentadilla trasera", detalle: "3×3 pesado (85%)", tieneCarga: true, id: "sentadilla_trasera", series: 3 },
          { nombre: "A2. Saltos verticales", detalle: "3×3 explosivos", tieneCarga: false }
        ],
        faseInfo: "Descanso 2–3 min"
      },
      {
        titulo: "Bloque fuerza posterior",
        ejercicios: [
          { nombre: "B1. Hip Thrust", detalle: "3×5", tieneCarga: true, id: "hip_thrust", series: 3 },
          { nombre: "B2. Broad Jump", detalle: "3×3", tieneCarga: false }
        ]
      },
      {
        titulo: "Blindaje escápula / hombro",
        ejercicios: [
          { nombre: "C1. Face Pull", detalle: "2×12", tieneCarga: true, id: "face_pull_v2", series: 2 },
          { nombre: "C2. Rotación externa cable", detalle: "2×15", tieneCarga: true, id: "rotacion_externa", series: 2 },
          { nombre: "C3. Y-Raise inclinado", detalle: "2×12", tieneCarga: true, id: "y_raise_inclinado", series: 2 }
        ]
      },
      {
        titulo: "Core",
        ejercicios: [
          { nombre: "D1. Toes to bar", detalle: "3×6", tieneCarga: false },
          { nombre: "D2. Pallof Press", detalle: "2×10 por lado", tieneCarga: true, id: "pallof_press", series: 2 }
        ]
      }
    ]
  },
  dia2: {
    titulo: "Sábado: Contraste + Unilateral + Blindaje",
    secciones: [
      {
        titulo: "Bloque contraste",
        ejercicios: [
          { nombre: "A1. Trap Bar Deadlift", detalle: "3×3 pesado", tieneCarga: true, id: "trap_bar_deadlift", series: 3 },
          { nombre: "A2. Kettlebell swing", detalle: "3×5 explosivos", tieneCarga: true, id: "kb_swing", series: 3 }
        ]
      },
      {
        titulo: "Bloque unilateral",
        ejercicios: [
          { nombre: "B1. Bulgarian Split Squat", detalle: "3×5 por pierna", tieneCarga: true, id: "bulgarian_ss", series: 3 },
          { nombre: "B2. Skater jumps (saltos laterales)", detalle: "3×4 por lado", tieneCarga: false }
        ]
      },
      {
        titulo: "Blindaje hombro (muy importante para grappling)",
        ejercicios: [
          { nombre: "C1. Landmine press unilateral", detalle: "3×5", tieneCarga: true, id: "landmine_press", series: 3 },
          { nombre: "C2. Pájaros en cable", detalle: "2×12", tieneCarga: true, id: "pajaros_cable", series: 2 },
          { nombre: "C3. Serratus push up", detalle: "2×12", tieneCarga: false },
          { nombre: "C4. Bottom-up kettlebell hold", detalle: "2×20 s", tieneCarga: true, id: "bu_kb_hold", series: 2 }
        ]
      },
      {
        titulo: "Core",
        ejercicios: [
          { nombre: "D1. Side plank", detalle: "2×30s", tieneCarga: false },
          { nombre: "D2. Dead hang", detalle: "2 series", tieneCarga: false }
        ]
      }
    ]
  }
};

// Estado de la app
let currentWeek = 1;
let currentDay = 1;
let currentSection = 'rutina';
let cargas = {};
let fotos = {}; // { weekN: { url: base64, date: 'YYYY-MM-DD' } }
let pesoData = []; // [{ date: '...', weight: 75, week: 1 }]
let userPin = null;
let currentPinInput = "";
let isEditingDieta = false;
let chartInstances = {};
let dieta = `PLAN NUTRICIONAL 8 SEMANAS – VOLUMEN Y FUERZA (MMA)

Objetivo: 3400–3600 kcal
Proteínas: 190 g aprox | Carbohidratos: 470–500 g | Grasas: 95 g aprox
Entrenamientos: MMA (lunes, miércoles, viernes) | Preparación física (martes, jueves)

Lunes (MMA)
Desayuno: 120 g avena choco+ 300 ml leche + 30 g whey  + 30 g crema de cacahuete + 100 g fresas.
Comida: 170 g arroz + 200 g contramuslo pollo + 200 g calabacín/pimiento/cebolla + 10 g AOVE + yogur 200 g.
Merienda: 180 g pan blanco + 100 g pechuga de pavo + 40 g mozzarella + 1 manzana (180 g) + 20 g nueces.
Cena: 600 g patata + 200 g salmón + ensalada 200 g (lechuga/tomate/pepino) + 10 g AOVE.

Martes (Preparación física)
Desayuno: 120 g avena choco + 300 ml leche + 30 g whey  + 30 g crema de cachuete + 100 g fresas.
Comida: 160 g pasta + 200 g carne picada de ternera 5 % + tomate natural + 200 g zanahoria/calabacín + 10 g AOVE.
Merienda: 300 g yogur griego + 100 g cereales corn + 20 g nueces + 1 manzana (170 g).
Cena: 500 g boniato + 200 g pechuga de pollo + 200 g brócoli + 10 g AOVE.

Miércoles (MMA)
Desayuno: 4 tostadas blancas (160 g) + 5 huevos + 1 aguacate pequeño (100 g) + fresas (200 g).
Comida: 170 g arroz + 200 g pavo + 200 g pimiento rojo/cebolla/champiñón + 10 g AOVE.
Merienda: 200 g pan + 1,5 latas de atún + tomate + 20 g nueces + 1 platano (200 g).
Cena: 600 g patata + 200 g merluza + ensalada 200 g + yogur 200 g.

Jueves (Preparación física)
Desayuno: 100 g cornflakes + 300 ml leche  + 20 g crema de cacahuete + 100 g fresa.
Comida: 500 g ñoquis + 2 latas de atún + 200 g calabacín/berenjena + 40 g mozzarella.
Merienda: 180 g pan + 100 g pavo + 1 manzana + 20 g nueces.
Cena: 500 g boniato + 200 g contramuslo de pollo desgrasado + 200 g champiñones + 10 g AOVE.

Viernes (MMA)
Desayuno: 120 g avena choco + 300 ml leche  + 30 g crema de cacahuete.
Comida: 170 g arroz + 200 g lomo + 200 g variadas + 10 g AOVE.
Merienda: 300 g yogur griego + 100 g cereales + 20 g nueces + 150 g fresas.
Cena: 600 g patata + 200 g filete de cerdo + ensalada 200 g + 10 g AOVE.`;


// Obtener fase según semana
function getPhase(week) {
  if (week <= 4) return { num: 1, nombre: "Fase 1", clase: "fase1" };
  if (week <= 8) return { num: 2, nombre: "Fase 2", clase: "fase2" };
  return { num: 3, nombre: "Fase 3", clase: "fase3" };
}

// Cargar datos guardados
function loadData() {
  try {
    const saved = localStorage.getItem("mma_rutina_data");
    if (saved) {
      const data = JSON.parse(saved);
      cargas = data.cargas || {};
      currentWeek = data.week || 1;
      fotos = data.fotos || {};
      pesoData = data.pesoData || [];
      userPin = data.userPin || null;
      // Si la dieta guardada está vacía, mantener la que precargamos arriba
      if (data.dieta && data.dieta.trim() !== "") {
        dieta = data.dieta;
      }
    }
  } catch (e) {
    console.error("Error cargando datos:", e);
  }
}

// Guardar datos
function saveData() {
  const data = {
    week: currentWeek,
    cargas: cargas,
    fotos: fotos,
    pesoData: pesoData,
    dieta: dieta,
    userPin: userPin,
    lastUpdate: new Date().toISOString()
  };
  localStorage.setItem("mma_rutina_data", JSON.stringify(data));
}

// Obtener clave de carga para un ejercicio (por serie)
function getLoadKey(exerciseId, setIndex, tipo) {
  return `w${currentWeek}_d${currentDay}_${exerciseId}_s${setIndex}_${tipo}`;
}

// Renderizado según sección
function renderContent() {
  const container = document.getElementById("dayContent");
  const dayNav = document.getElementById("dayNav");
  const saveBar = document.querySelector(".save-bar");
  const consideracionesBtn = document.getElementById("consideracionesBtn");

  // Mostrar/ocultar elementos auxiliares según sección
  dayNav.style.display = currentSection === 'rutina' ? 'grid' : 'none';
  saveBar.style.display = currentSection === 'rutina' ? 'flex' : 'none';
  consideracionesBtn.style.display = currentSection === 'rutina' ? 'block' : 'none';

  if (currentSection === 'rutina') {
    renderDay();
  } else if (currentSection === 'fotos') {
    renderFotos();
  } else if (currentSection === 'dieta') {
    renderDieta();
  } else if (currentSection === 'peso') {
    renderPeso();
  }
}

// Renderizar contenido del día (original actualizado)
function renderDay() {
  const diaKey = `dia${currentDay}`;
  const dia = RUTINA[diaKey];
  const container = document.getElementById("dayContent");

  if (!dia) {
    container.innerHTML = `<p class='error'>Día no disponible</p>`;
    return;
  }

  let html = `<h2 class="day-title">${dia.titulo}</h2>`;

  dia.secciones.forEach(seccion => {
    html += `<div class="section">`;
    html += `<h3 class="section-title">${seccion.titulo}</h3>`;
    if (seccion.faseInfo) {
      html += `<span class="info-badge">${seccion.faseInfo}</span>`;
    }

    seccion.ejercicios.forEach(ej => {
      html += `<div class="exercise-card">`;
      html += `<div class="exercise-name">${ej.nombre}</div>`;
      html += `<div class="exercise-detail">${ej.detalle}</div>`;

      if (ej.tieneCarga && ej.series) {
        html += `<div class="sets-grid">`;
        for (let i = 0; i < ej.series; i++) {
          const keyPeso = getLoadKey(ej.id, i, "peso");
          const keyRpe = getLoadKey(ej.id, i, "rpe");
          const pesoVal = cargas[keyPeso] || "";
          const rpeVal = cargas[keyRpe] || "";
          html += `<div class="set-row">`;
          html += `<span class="set-label">Serie ${i + 1}</span>`;
          html += `<input type="text" class="input-load input-peso" data-key="${keyPeso}" placeholder="kg" value="${pesoVal}" inputmode="decimal" title="Peso en kg">`;
          html += `<input type="text" class="input-load input-rpe" data-key="${keyRpe}" placeholder="RPE" value="${rpeVal}" inputmode="decimal" title="RPE 1-10">`;
          html += `</div>`;
        }
        html += `</div>`;
        html += `<span class="rpe-hint">RPE: esfuerzo percibido 1-10 (10 = máximo)</span>`;
      }

      html += `</div>`;
    });

    html += `</div>`;
  });

  container.innerHTML = html;

  // Vincular inputs: actualizar en memoria y guardado automático
  container.querySelectorAll(".input-load").forEach(input => {
    input.addEventListener("input", (e) => {
      cargas[e.target.dataset.key] = e.target.value.trim();
      triggerAutoSave();
    });
  });
}

function renderFotos() {
  const container = document.getElementById("dayContent");
  let html = `
    <div class="section">
        <h3 class="section-title">PROGRESO FÍSICO</h3>
        <p class="section-desc">Registra tu evolución visual con fecha.</p>
        <div class="fotos-grid">
  `;

  for (let w = 2; w <= 12; w += 2) {
    const fotoObj = fotos[`week${w}`] || { url: null, date: '' };
    html += `
        <div class="foto-card">
            <h4>Semana ${w}</h4>
            <div class="foto-placeholder" id="placeholder-w${w}" onclick="document.getElementById('input-w${w}').click()">
                ${fotoObj.url ? `<img src="${fotoObj.url}" alt="Semana ${w}">` : '<span>+ Foto</span>'}
            </div>
            <input type="date" class="input-foto-date" value="${fotoObj.date}" onchange="handleFotoDate(${w}, this)">
            <input type="file" id="input-w${w}" accept="image/*" style="display:none" onchange="handleFotoUpload(${w}, this)">
        </div>
    `;
  }

  html += `</div></div>`;
  container.innerHTML = html;
}

window.handleFotoUpload = (week, input) => {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (!fotos[`week${week}`]) fotos[`week${week}`] = { date: new Date().toISOString().split('T')[0] };
    fotos[`week${week}`].url = e.target.result;
    saveData();
    renderFotos();
  };
  reader.readAsDataURL(file);
};

window.handleFotoDate = (week, input) => {
    if (!fotos[`week${week}`]) fotos[`week${week}`] = { url: null };
    fotos[`week${week}`].date = input.value;
    saveData();
};

function renderDieta() {
  const container = document.getElementById("dayContent");
  
  if (window.isEditingDieta) {
    container.innerHTML = `
      <div class="section">
          <h3 class="section-title">CONFIGURAR DIETA</h3>
          <textarea id="dietaInput" class="dieta-textarea" placeholder="Escribe aquí tu plan...">${dieta}</textarea>
          <div class="dieta-actions">
              <button onclick="toggleEditDieta(false)" class="add-btn">Guardar y Ver</button>
          </div>
      </div>
    `;
    document.getElementById("dietaInput").addEventListener("input", (e) => {
      dieta = e.target.value;
      triggerAutoSave();
    });
  } else {
    const structuredDiet = parseDiet(dieta);
    container.innerHTML = `
      <div class="section">
          <div class="section-header-flex">
              <h3 class="section-title">PLAN NUTRICIONAL</h3>
              <button onclick="toggleEditDieta(true)" class="edit-plan-btn">Editar Plan</button>
          </div>
          <div class="diet-container">
              ${structuredDiet}
          </div>
      </div>
    `;
  }
}

window.toggleEditDieta = (edit) => {
  window.isEditingDieta = edit;
  renderDieta();
};

function parseDiet(text) {
  if (!text) return "<p class='text-muted'>No hay plan configurado.</p>";
  
  const lines = text.split('\n');
  let html = "";
  let inDay = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.match(/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)/i)) {
      if (inDay) html += `</div></div>`;
      html += `<div class="diet-day-card"><h4>${trimmed}</h4><div class="diet-meals">`;
      inDay = true;
    } else if (trimmed.includes(':') && inDay) {
      const [meal, content] = trimmed.split(':');
      html += `<div class="diet-meal"><strong>${meal}:</strong> <span>${content}</span></div>`;
    } else {
      if (inDay) html += `</div></div>`;
      html += `<p class="diet-info">${trimmed}</p>`;
      inDay = false;
    }
  });

  if (inDay) html += `</div></div>`;
  return html;
}

function renderPeso() {
  const container = document.getElementById("dayContent");
  const today = new Date().toISOString().split('T')[0];
  container.innerHTML = `
    <div class="section">
        <h3 class="section-title">SEGUIMIENTO DE PESO</h3>
        <div class="peso-form">
            <input type="date" id="pesoDateInput" value="${today}">
            <input type="number" id="pesoInput" step="0.1" placeholder="kg">
            <button onclick="addPeso()" class="add-btn">Añadir</button>
        </div>
        <div class="chart-container">
            <canvas id="pesoChart"></canvas>
        </div>
        <div class="peso-history">
            <h4>Historial</h4>
            <div id="pesoList"></div>
        </div>
    </div>
  `;
  updatePesoUI();
}

window.addPeso = () => {
    const input = document.getElementById("pesoInput");
    const dateInput = document.getElementById("pesoDateInput");
    const weight = parseFloat(input.value);
    if (isNaN(weight)) return;

    pesoData.push({
        date: dateInput.value,
        weight: weight,
        week: currentWeek
    });
    // Ordenar por fecha
    pesoData.sort((a, b) => new Date(a.date) - new Date(b.date));
    input.value = "";
    saveData();
    updatePesoUI();
};

function updatePesoUI() {
    const list = document.getElementById("pesoList");
    if (!list) return;

    list.innerHTML = pesoData.slice().reverse().map((p, i) => `
        <div class="peso-item">
            <span>${p.date} (Sem. ${p.week})</span>
            <strong>${p.weight} kg</strong>
            <button class="delete-btn" onclick="deletePeso(${pesoData.length - 1 - i})">×</button>
        </div>
    `).join("");

    renderChart();
}

window.deletePeso = (index) => {
    pesoData.splice(index, 1);
    saveData();
    updatePesoUI();
};

function renderChart() {
    const ctx = document.getElementById('pesoChart')?.getContext('2d');
    if (!ctx) return;

    if (chartInstances.peso) chartInstances.peso.destroy();

    const labels = pesoData.map(p => p.date);
    const data = pesoData.map(p => p.weight);

    chartInstances.peso = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Peso (kg)',
                data: data,
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: false, grid: { color: '#30363d' } },
                x: { grid: { color: '#30363d' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Actualizar UI de semana y fase
function updateWeekUI() {
  document.querySelectorAll(".week-btn").forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.dataset.week) === currentWeek);
  });

  const phase = getPhase(currentWeek);
  const badge = document.getElementById("phaseBadge");
  badge.textContent = phase.nombre;
  badge.className = `phase-badge ${phase.clase}`;
}

// Guardado automático con debounce (evita guardar en cada tecla)
let autoSaveTimer = null;
function triggerAutoSave() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    doSave();
    autoSaveTimer = null;
  }, 500);
}

function showSaveFeedback() {
  const status = document.getElementById("saveStatus");
  status.textContent = "GUARDADO";
  status.classList.add("saved");
  setTimeout(() => {
    status.textContent = "";
    status.classList.remove("saved");
  }, 1500);
}

function doSave() {
  document.querySelectorAll(".input-load").forEach(input => {
    cargas[input.dataset.key] = input.value.trim();
  });
  saveData();
  showSaveFeedback();
}

// Guardar y mostrar feedback (botón manual)
function handleSave() {
  doSave();
}

// PIN Logic
window.pressPin = (digit) => {
    if (currentPinInput.length < 4) {
        currentPinInput += digit;
        updatePinDots();
        if (currentPinInput.length === 4) {
            setTimeout(verifyPin, 200);
        }
    }
};

window.deletePin = () => {
    currentPinInput = currentPinInput.slice(0, -1);
    updatePinDots();
};

function updatePinDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
        dot.classList.toggle("filled", i < currentPinInput.length);
    });
}

function verifyPin() {
    const messageEl = document.getElementById("pinMessage");
    
    if (!userPin) {
        // Establecer PIN por primera vez
        userPin = currentPinInput;
        saveData();
        messageEl.textContent = "PIN CONFIGURADO CORRECTAMENTE";
        setTimeout(unlockApp, 1000);
    } else if (currentPinInput === userPin) {
        unlockApp();
    } else {
        messageEl.textContent = "PIN INCORRECTO";
        currentPinInput = "";
        setTimeout(() => {
            updatePinDots();
            messageEl.textContent = "";
        }, 1000);
    }
}

function unlockApp() {
    document.getElementById("pinScreen").classList.add("hidden");
    renderContent();
}

// Inicialización
function init() {
  loadData();
  
  if (userPin) {
      document.getElementById("pinTitle").textContent = "INTRODUCIR PIN";
  } else {
      document.getElementById("pinTitle").textContent = "CONFIGURAR PIN";
  }

  updateWeekUI();
  // No renderizar hasta que esté desbloqueado

  document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
          document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentSection = btn.dataset.section;
          renderContent();
      });
  });

  // Event listeners
  document.querySelectorAll(".week-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentWeek = parseInt(btn.dataset.week);
      updateWeekUI();
      renderContent();
    });
  });

  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentDay = parseInt(btn.dataset.day);
      renderContent();
    });
  });

  document.getElementById("saveBtn").addEventListener("click", handleSave);

  document.getElementById("consideracionesBtn").addEventListener("click", () => {
    document.getElementById("consideracionesModal").classList.remove("hidden");
  });

  document.getElementById("cerrarModal").addEventListener("click", () => {
    document.getElementById("consideracionesModal").classList.add("hidden");
  });

  document.getElementById("consideracionesModal").addEventListener("click", (e) => {
    if (e.target.id === "consideracionesModal") {
      e.target.classList.add("hidden");
    }
  });
}


init();
