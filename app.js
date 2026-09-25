const state = {
  historicalMode: "all",
  projectionMode: "all",
  scenario: "SSP2-4.5",
  year: 2023,
};

let climateData = null;

const numberFormatters = new Map();

function number(value, digits = 1) {
  if (!numberFormatters.has(digits)) {
    numberFormatters.set(
      digits,
      new Intl.NumberFormat("ca-ES", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }),
    );
  }
  return numberFormatters.get(digits).format(value);
}

function signed(value, digits = 2, suffix = " °C") {
  const prefix = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${prefix}${number(Math.abs(value), digits)}${suffix}`;
}

function percent(value, digits = 0) {
  return `${number(value * 100, digits)} %`;
}

function percentagePoints(value, digits = 1) {
  return `${value >= 0 ? "+" : "−"}${number(Math.abs(value * 100), digits)} punts`;
}

function pValue(value) {
  if (value < 0.001) return "p ajustada < 0,001";
  return `p ajustada = ${number(value, 3)}`;
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function dateObject(iso) {
  return new Date(`${iso}T12:00:00`);
}

function shortDate(iso) {
  return new Intl.DateTimeFormat("ca-ES", {
    day: "numeric",
    month: "short",
  })
    .format(dateObject(iso))
    .replace(" de ", " ");
}

function dateRange(startIso, endIso) {
  const start = dateObject(startIso);
  const end = dateObject(endIso);
  const monthFormatter = new Intl.DateTimeFormat("ca-ES", { month: "long" });
  const startMonth = monthFormatter.format(start);
  const endMonth = monthFormatter.format(end);
  if (startMonth === endMonth) {
    return `${start.getDate()}–${end.getDate()} de ${startMonth}`;
  }
  return `${start.getDate()} d’${startMonth} – ${end.getDate()} de ${endMonth}`;
}

function metricScale(metric, value) {
  const ranges = {
    mean: [19, 25],
    max: [27, 33],
    min: [14, 19],
    apparent: [20, 26],
  };
  const [minimum, maximum] = ranges[metric];
  return clamp(((value - minimum) / (maximum - minimum)) * 100, 2, 98);
}

function modeLabel(mode) {
  return mode === "all" ? "tots els anys" : "els anys sense cap dia coincident";
}

function setupQuiz() {
  const options = [...document.querySelectorAll(".quiz-option")];
  const answer = document.querySelector("#quiz-answer");
  const kicker = document.querySelector("#answer-kicker");
  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((candidate) => candidate.classList.remove("selected"));
      option.classList.add("selected");
      const messages = {
        b: "L’has encertada.",
        same: "La diferència no és enorme, però sí estadísticament clara.",
        a: "Les dades apunten en la direcció contrària.",
      };
      kicker.textContent = messages[option.dataset.guess];
      answer.hidden = false;
    });
  });
}

function setupModeControls() {
  document.querySelectorAll("[data-mode-control]").forEach((control) => {
    const target = control.dataset.modeControl;
    control.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        control.querySelectorAll("button").forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
        if (target === "historical") {
          state.historicalMode = button.dataset.mode;
          renderHistorical();
          renderConsistency();
          renderThresholds();
        } else {
          state.projectionMode = button.dataset.mode;
          renderProjection();
        }
      });
    });
  });
}

function setupScenarioPicker() {
  document.querySelectorAll(".scenario-picker button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".scenario-picker button").forEach((candidate) => {
        candidate.classList.toggle("active", candidate === button);
      });
      state.scenario = button.dataset.scenario;
      renderProjection();
    });
  });
}

function renderHistorical() {
  const mode = climateData.historical.modes[state.historicalMode];
  const explainer = document.querySelector("#history-mode-explainer");
  explainer.textContent =
    state.historicalMode === "all"
      ? "Sèrie completa: 76 anys. En 33 anys, els períodes compartixen entre un i tres dies."
      : "Prova de robustesa: només els 43 anys en què A i B estan formats per quatre dies completament diferents.";

  const metricOrder = ["mean", "max", "min", "apparent"];
  const container = document.querySelector("#historical-metrics");
  container.innerHTML = metricOrder
    .map((key) => {
      const metric = mode.metrics[key];
      const aPosition = metricScale(key, metric.a);
      const bPosition = metricScale(key, metric.b);
      const yearsText = metric.ties
        ? `${metric.bHigher} anys B > A · ${metric.aHigher} anys A > B · ${metric.ties} empats`
        : `${metric.bHigher} anys B > A · ${metric.aHigher} anys A > B`;
      return `
        <article class="metric-card">
          <div class="metric-title-row">
            <h3>${metric.label}</h3>
            <span class="metric-diff">${signed(metric.diff, 2)}</span>
          </div>
          <p class="metric-subtitle">Diferència mitjana B − A</p>
          <div class="metric-values">
            <span class="value-a"><i></i>A ${number(metric.a, 2)} °C</span>
            <span class="value-b"><i></i>B ${number(metric.b, 2)} °C</span>
          </div>
          <div class="dot-scale" style="--a-pos:${aPosition}%;--b-pos:${bPosition}%" aria-hidden="true">
            <span class="connector"></span>
            <span class="dot dot-a"></span>
            <span class="dot dot-b"></span>
          </div>
          <details>
            <summary>Quina incertesa té?</summary>
            <p>IC 95 %: ${signed(metric.ciLow, 2)} a ${signed(metric.ciHigh, 2)}. ${pValue(metric.pHolm)}. ${yearsText}.</p>
          </details>
        </article>
      `;
    })
    .join("");

  const mean = mode.metrics.mean;
  document.querySelector("#historical-callout-text").innerHTML =
    state.historicalMode === "all"
      ? `Les quatre variables continuen sent superiors en B després de corregir les comparacions múltiples. Per a la temperatura mitjana, la diferència és <strong>${signed(mean.diff, 2)}</strong> (IC 95 %: ${signed(mean.ciLow, 2)} a ${signed(mean.ciHigh, 2)}).`
      : `Eliminar tots els dies compartits no fa desaparèixer el resultat: l’amplia. La temperatura mitjana passa de +0,72 °C a <strong>${signed(mean.diff, 2)}</strong>, i les quatre variables continuen sent estadísticament clares.`;
}

function tileColor(diff) {
  if (Math.abs(diff) < 0.15) return "rgba(140, 154, 173, 0.58)";
  const strength = clamp(0.32 + Math.abs(diff) / 5, 0.34, 0.96);
  return diff > 0
    ? `rgba(255, 106, 73, ${strength})`
    : `rgba(74, 186, 255, ${strength})`;
}

function availableHistoricalYears() {
  const all = climateData.historical.annual;
  return state.historicalMode === "all" ? all : all.filter((row) => row.overlap === 0);
}

function renderConsistency() {
  const mode = climateData.historical.modes[state.historicalMode];
  const mean = mode.metrics.mean;
  document.querySelector("#consistency-copy").innerHTML =
    `B va tindre una temperatura mitjana superior en <strong>${mean.bHigher} de ${mode.n} anys</strong> (${percent(mean.bHigher / mode.n, 1)}). ` +
    `La conclusió descriu la diferència mitjana i la seua magnitud; no promet que B siga més calorós en cada edició.`;

  const years = availableHistoricalYears();
  if (!years.some((row) => row.year === state.year)) {
    state.year = years[years.length - 1].year;
  }

  const ribbon = document.querySelector("#year-ribbon");
  ribbon.innerHTML = years
    .map(
      (row) => `
        <button
          type="button"
          class="year-tile ${row.year === state.year ? "selected" : ""}"
          data-year="${row.year}"
          style="--tile-color:${tileColor(row.meanDiff)}"
          title="${row.year}: ${signed(row.meanDiff, 2)}"
          aria-label="Any ${row.year}: diferència B menys A ${signed(row.meanDiff, 2)}"
        ></button>
      `,
    )
    .join("");
  ribbon.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.year = Number(button.dataset.year);
      renderConsistency();
    });
  });

  const select = document.querySelector("#year-select");
  select.innerHTML = years
    .map((row) => `<option value="${row.year}" ${row.year === state.year ? "selected" : ""}>${row.year}</option>`)
    .join("");
  select.onchange = () => {
    state.year = Number(select.value);
    renderConsistency();
  };

  renderYearExplorer();
}

function renderYearExplorer() {
  const row = climateData.historical.annual.find((candidate) => candidate.year === state.year);
  const overlapText = row.overlap
    ? `Els dos intervals compartixen ${row.overlap} ${row.overlap === 1 ? "dia" : "dies"}.`
    : "Els dos intervals no compartixen cap dia.";

  document.querySelector("#selected-year-summary").innerHTML = `
    <div class="date-summary a"><span>Període A</span><strong>${dateRange(row.startA, row.endA)}</strong></div>
    <div class="date-summary b"><span>Període B</span><strong>${dateRange(row.startB, row.endB)}</strong></div>
    <p class="overlap-note">${overlapText}</p>
  `;

  const yearMetrics = [
    ["Temperatura mitjana", row.meanDiff],
    ["Màxima diürna", row.maxDiff],
    ["Mínima nocturna", row.minDiff],
    ["Temperatura aparent", row.apparentDiff],
  ];
  document.querySelector("#selected-year-metrics").innerHTML = yearMetrics
    .map(
      ([label, diff]) => `
        <div class="year-metric">
          <span>${label}<br />B − A</span>
          <strong style="color:${diff >= 0 ? "var(--b-bright)" : "var(--a)"}">${signed(diff, 2)}</strong>
        </div>
      `,
    )
    .join("");

  const daily = climateData.historical.daily[String(state.year)];
  document.querySelector("#daily-comparison").innerHTML = `
    <table class="daily-table">
      <thead>
        <tr>
          <th>Jornada</th>
          <th>Data A</th>
          <th>Mitjana A</th>
          <th>Data B</th>
          <th>Mitjana B</th>
          <th>B − A</th>
        </tr>
      </thead>
      <tbody>
        ${daily
          .map(
            (day) => `
              <tr>
                <td>Dia ${day.day}</td>
                <td>${shortDate(day.dateA)}</td>
                <td class="cell-a">${number(day.meanA, 1)} °C</td>
                <td>${shortDate(day.dateB)}</td>
                <td class="cell-b">${number(day.meanB, 1)} °C</td>
                <td>${signed(day.meanB - day.meanA, 1)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderThresholds() {
  const thresholds = climateData.historical.modes[state.historicalMode].thresholds;
  document.querySelector("#threshold-grid").innerHTML = [30, 32, 35]
    .map((threshold) => {
      const item = thresholds[String(threshold)];
      let significance;
      if (item.pHolm < 0.05) {
        significance = `<strong>Diferència estadísticament clara</strong> · ${pValue(item.pHolm)}`;
      } else if (item.pHolm < 0.1) {
        significance = `Senyal compatible amb més risc en B, però no supera el criteri corregit del 5 % · ${pValue(item.pHolm)}`;
      } else {
        significance = `No hi ha evidència clara d’una diferència · ${pValue(item.pHolm)}`;
      }
      return `
        <article class="threshold-card ${threshold === 32 ? "highlight" : ""}">
          <h3>&gt;${threshold} °C</h3>
          <p class="threshold-diff">${percentagePoints(item.diff)}</p>
          <div class="threshold-bar-row a">
            <span>A</span>
            <div class="threshold-track"><div class="threshold-fill" style="--width:${item.a * 100}%"></div></div>
            <strong>${percent(item.a, 1)}</strong>
          </div>
          <div class="threshold-bar-row b">
            <span>B</span>
            <div class="threshold-track"><div class="threshold-fill" style="--width:${item.b * 100}%"></div></div>
            <strong>${percent(item.b, 1)}</strong>
          </div>
          <p class="threshold-significance">${significance}</p>
        </article>
      `;
    })
    .join("");
}

function renderProjection() {
  const mode = climateData.projection[state.projectionMode];
  const scenario = mode.scenarios[state.scenario];
  const principal = scenario.principal;
  const sampleText =
    state.projectionMode === "all"
      ? "74 anys de calendari per model"
      : "40–42 anys sense coincidències per model";

  document.querySelector("#future-summary").innerHTML = `
    <article class="future-stat a">
      <span>Calfament d’A respecte de 1991–2020</span>
      <strong>${signed(principal.warmingA, 1)}</strong>
      <small>${scenario.label}</small>
    </article>
    <article class="future-stat b">
      <span>Calfament de B respecte de 1991–2020</span>
      <strong>${signed(principal.warmingB, 1)}</strong>
      <small>${scenario.label}</small>
    </article>
    <article class="future-stat diff">
      <span>Diferència de temperatura mitjana B − A</span>
      <strong>${signed(principal.meanDiff, 2)}</strong>
      <small>mediana dels 11 models</small>
    </article>
    <article class="future-stat">
      <span>Proporció d’anys simulats amb B més calorós</span>
      <strong>${percent(principal.pBHigher, 0)}</strong>
      <small>${sampleText}</small>
    </article>
  `;

  document.querySelector("#model-median").textContent = `Mediana ${signed(principal.meanDiff, 2)}`;
  const minScale = -0.5;
  const maxScale = 2;
  document.querySelector("#model-dot-chart").innerHTML = `
    <span class="model-zero" aria-hidden="true"></span>
    ${scenario.models
      .map((model, index) => {
        const x = clamp(((model.meanDiff - minScale) / (maxScale - minScale)) * 100, 1, 99);
        const y = 12 + (index % 4) * 27;
        return `<span class="model-dot" style="--x:${x}%;--y:${y}px" title="${model.name}: ${signed(model.meanDiff, 2)}" aria-label="${model.name}: ${signed(model.meanDiff, 2)}"></span>`;
      })
      .join("")}
  `;

  document.querySelector("#extreme-bars").innerHTML = `
    <div class="extreme-bar a">
      <span>A</span>
      <div class="track"><div class="fill" style="--width:${principal.over35A * 100}%"></div></div>
      <strong>${percent(principal.over35A, 0)}</strong>
    </div>
    <div class="extreme-bar b">
      <span>B</span>
      <div class="track"><div class="fill" style="--width:${principal.over35B * 100}%"></div></div>
      <strong>${percent(principal.over35B, 0)}</strong>
    </div>
  `;

  document.querySelector("#future-windows").innerHTML = scenario.windows
    .map(
      (window) => `
        <article class="window-card">
          <h3>${window.label}</h3>
          <p class="sample">11 models · mediana de ${number(window.medianYears, 0)} anys per model</p>
          <div class="window-values">
            <div><span>Diferència B − A</span><strong>${signed(window.meanDiff, 2)}</strong></div>
            <div><span>Algun dia &gt;35 °C en B</span><strong>${percent(window.over35B, 0)}</strong></div>
          </div>
        </article>
      `,
    )
    .join("");

  const scenarioDiffs = Object.values(mode.scenarios).map((item) => item.principal.meanDiff);
  const low = Math.min(...scenarioDiffs);
  const high = Math.max(...scenarioDiffs);
  document.querySelector("#future-conclusion").innerHTML =
    state.projectionMode === "all"
      ? `<strong>El patró persistix en els quatre escenaris.</strong> La mediana B − A se situa entre ${signed(low, 2)} i ${signed(high, 2)}. Els dos períodes es calfen; no hi ha evidència robusta que B es calfe més ràpid que A.`
      : `<strong>La comprovació sense dies coincidents arriba a la mateixa conclusió.</strong> La mediana B − A se situa entre ${signed(low, 2)} i ${signed(high, 2)}. La diferència major prové sobretot del calendari, no d’un calfament diferencial de B.`;
}

function setupShare() {
  const button = document.querySelector("#share-button");
  const status = document.querySelector("#share-status");
  button.addEventListener("click", async () => {
    const shareData = {
      title: "La calor de les Festes de Castalla",
      text: "Quatre dies de calendari poden canviar la calor de les Festes?",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        status.textContent = "Gràcies per compartir-ho.";
      } else {
        await navigator.clipboard.writeText(window.location.href);
        status.textContent = "Enllaç copiat.";
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        status.textContent = "No s’ha pogut compartir automàticament. Pots copiar l’adreça del navegador.";
      }
    }
  });
}

function showLoadError() {
  document.querySelector("main").innerHTML = `
    <div class="load-error">
      <h1>No s’han pogut carregar les dades</h1>
      <p>Actualitza la pàgina per tornar-ho a intentar.</p>
    </div>
  `;
}

async function init() {
  setupQuiz();
  setupModeControls();
  setupScenarioPicker();
  setupShare();
  try {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    climateData = await response.json();
    renderHistorical();
    renderConsistency();
    renderThresholds();
    renderProjection();
  } catch (error) {
    console.error(error);
    showLoadError();
  }
}

document.addEventListener("DOMContentLoaded", init);
