class PoolPilotDashboardCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("pool-pilot-dashboard-editor");
  }

  static getStubConfig() {
    return {
      title: "Piscine",
      theme: "flipr",
      show_controls: true,
      show_weather: true,
      show_recommendations: true,
    };
  }

  setConfig(config) {
    if (!config) throw new Error("Configuration invalide");
    this.config = {
      title: "Piscine",
      theme: "flipr",
      show_controls: true,
      show_weather: true,
      show_recommendations: true,
      ...config,
    };
    this._tab = this._tab || "analysis";
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getCardSize() { return 8; }

  _state(entityId) {
    if (!entityId || !this._hass?.states?.[entityId]) return undefined;
    return this._hass.states[entityId];
  }

  _value(entityId, fallback = "—") {
    const s = this._state(entityId);
    if (!s || s.state === "unknown" || s.state === "unavailable") return fallback;
    return s.state;
  }

  _unit(entityId) {
    return this._state(entityId)?.attributes?.unit_of_measurement || "";
  }

  _friendly(entityId) {
    return this._state(entityId)?.attributes?.friendly_name || entityId || "";
  }

  _format(entityId, fallback = "—") {
    const v = this._value(entityId, fallback);
    const u = this._unit(entityId);
    if (v === fallback) return v;
    return `${v}${u ? " " + u : ""}`;
  }

  _isOn(entityId) {
    const v = this._value(entityId, "off");
    return ["on", "heat", "heating", "cool", "auto"].includes(String(v).toLowerCase());
  }

  _labelState(value) {
    const map = {
      safe: "Bon",
      ok: "Bon",
      good: "Bon",
      warning: "Attention",
      avoid: "Déconseillée",
      bad: "Mauvais",
      unknown: "Inconnu",
      unavailable: "Indisponible",
    };
    return map[String(value).toLowerCase()] || value || "—";
  }

  _qualityClass(value) {
    const v = String(value || "").toLowerCase();
    if (["safe", "ok", "good", "bon"].includes(v)) return "good";
    if (["warning", "attention"].includes(v)) return "warn";
    if (["avoid", "bad", "danger"].includes(v)) return "bad";
    return "neutral";
  }

  _callToggle(entityId) {
    if (!entityId || !this._hass) return;
    const [domain] = entityId.split(".");
    if (domain === "switch" || domain === "input_boolean") {
      this._hass.callService(domain, "toggle", { entity_id: entityId });
    }
  }

  _callTurnOn(entityId) {
    if (!entityId || !this._hass) return;
    const [domain] = entityId.split(".");
    if (["switch", "input_boolean"].includes(domain)) {
      this._hass.callService(domain, "turn_on", { entity_id: entityId });
    }
  }

  _callTurnOff(entityId) {
    if (!entityId || !this._hass) return;
    const [domain] = entityId.split(".");
    if (["switch", "input_boolean"].includes(domain)) {
      this._hass.callService(domain, "turn_off", { entity_id: entityId });
    }
  }

  _button(label, icon, entity, action = "toggle") {
    const on = this._isOn(entity);
    return `<button class="round ${on ? "on" : ""}" title="${label}" data-action="${action}" data-entity="${entity || ""}">
      <ha-icon icon="${icon}"></ha-icon>
    </button>`;
  }

  _gauge(label, value, status, type) {
    return `<div class="gauge ${type}">
      <div class="arc"><div class="needle"></div><div class="value">${value}</div></div>
      <div class="gauge-label">${label}</div>
      <div class="pill ${this._qualityClass(status)}">${this._labelState(status)}</div>
    </div>`;
  }

  render() {
    if (!this.shadowRoot || !this._hass) return;
    const c = this.config || {};
    const water = this._format(c.water_temp_entity);
    const air = this._format(c.air_temp_entity);
    const ph = this._value(c.ph_entity);
    const chlorine = this._format(c.chlorine_entity, this._format(c.orp_entity));
    const uv = this._value(c.uv_entity);
    const filtration = this._format(c.filtration_duration_entity);
    const bathing = this._value(c.bathing_state_entity);
    const chemistry = this._value(c.chemistry_state_entity);
    const actions = this._value(c.actions_entity, "Aucune recommandation");
    const pumpOn = this._isOn(c.pump_entity);
    const hpOn = this._isOn(c.heatpump_entity);

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <ha-card class="pool-card ${c.theme || "flipr"}">
        <div class="top">
          <div class="title">${c.title || "Piscine"}</div>
          <div class="tabs">
            <button class="tab ${this._tab === "analysis" ? "active" : ""}" data-tab="analysis"><ha-icon icon="mdi:water-outline"></ha-icon> Analyse</button>
            <button class="tab ${this._tab === "control" ? "active" : ""}" data-tab="control"><ha-icon icon="mdi:toggle-switch-outline"></ha-icon> Contrôle</button>
          </div>
          ${c.show_weather ? `<div class="weather"><span>air</span><strong>${air}</strong><span class="uv">UV ${uv}</span></div>` : ""}
        </div>

        <div class="equipment">
          <div class="pump-icon"><ha-icon icon="mdi:pool"></ha-icon></div>
          <div class="equipment-title">Pompe à filtration</div>
          <div class="equipment-sub">${filtration !== "—" ? `Filtration ce jour ${filtration}` : pumpOn ? "En marche" : "Arrêtée"}</div>
          <div class="equipment-actions">
            ${c.show_controls ? this._button("Mode auto", "mdi:lightning-bolt", c.auto_button_entity || "", "toggle") : ""}
            ${c.show_controls ? this._button("Programmation", "mdi:timer-outline", c.schedule_button_entity || "", "toggle") : ""}
            ${c.show_controls ? this._button("Pompe", "mdi:power", c.pump_entity, "toggle") : ""}
            ${c.show_controls ? this._button("PAC", "mdi:heat-pump-outline", c.heatpump_entity, "toggle") : ""}
          </div>
        </div>

        ${this._tab === "analysis" ? `
          <div class="wave"><div class="water-main"><span>eau</span><strong>${water}</strong></div></div>
          <div class="gauges">
            ${this._gauge("pH", ph, chemistry, "ph")}
            ${this._gauge(c.chlorine_entity ? "Chlore" : "RedOx", chlorine, bathing, "chlorine")}
          </div>
          ${c.show_recommendations ? `<div class="alert"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${actions}</span></div>` : ""}
        ` : `
          <div class="control-panel">
            <div class="control-row"><span>Pompe</span><strong>${pumpOn ? "Marche" : "Arrêt"}</strong></div>
            <div class="control-row"><span>Pompe à chaleur</span><strong>${hpOn ? "Active" : "Inactive"}</strong></div>
            <div class="control-row"><span>Filtration recommandée</span><strong>${filtration}</strong></div>
            <div class="large-actions">
              <button data-action="on" data-entity="${c.pump_entity || ""}">Démarrer pompe</button>
              <button data-action="off" data-entity="${c.pump_entity || ""}">Arrêter pompe</button>
            </div>
          </div>
          ${c.show_recommendations ? `<div class="alert"><ha-icon icon="mdi:clipboard-check-outline"></ha-icon><span>${actions}</span></div>` : ""}
        `}
      </ha-card>
    `;

    this.shadowRoot.querySelectorAll(".tab").forEach((el) => {
      el.addEventListener("click", () => { this._tab = el.dataset.tab; this.render(); });
    });
    this.shadowRoot.querySelectorAll("button[data-action]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        const entity = ev.currentTarget.dataset.entity;
        const action = ev.currentTarget.dataset.action;
        if (action === "on") this._callTurnOn(entity);
        else if (action === "off") this._callTurnOff(entity);
        else this._callToggle(entity);
      });
    });
  }

  styles() {
    return `
      ha-card.pool-card { overflow:hidden; border-radius:28px; background:#eef7fb; color:#14233b; font-family:var(--primary-font-family); }
      .top { padding:18px 18px 8px; }
      .title { text-align:center; font-weight:600; font-size:18px; margin-bottom:14px; }
      .tabs { display:grid; grid-template-columns:1fr 1fr; background:#aeb8c7; border-radius:18px; overflow:hidden; }
      .tab { border:0; padding:13px 8px; font-size:16px; color:white; background:transparent; display:flex; align-items:center; justify-content:center; gap:8px; }
      .tab.active { background:#10182d; }
      .weather { display:flex; align-items:center; gap:10px; margin:18px 4px 10px; }
      .weather span:first-child { font-size:24px; opacity:.9; }
      .weather strong { font-size:42px; line-height:1; }
      .uv { margin-left:auto; border:2px solid #14233b; border-radius:10px; padding:2px 8px; font-weight:600; }
      .equipment { position:relative; margin:12px 18px 22px; padding:20px 18px; background:white; border-radius:16px; min-height:95px; box-sizing:border-box; }
      .pump-icon ha-icon { --mdc-icon-size:52px; color:#111; }
      .equipment-title { margin-top:8px; font-size:17px; }
      .equipment-sub { position:absolute; right:18px; bottom:20px; font-size:15px; opacity:.9; }
      .equipment-actions { position:absolute; right:14px; top:18px; display:flex; gap:8px; }
      .round { width:42px; height:42px; border-radius:50%; border:0; background:#edf1f7; color:#98a5b8; box-shadow:inset 0 0 10px rgba(255,255,255,.7); display:flex; align-items:center; justify-content:center; }
      .round.on { background:#16d26b; color:white; }
      .wave { height:150px; margin-top:20px; position:relative; background:linear-gradient(160deg,#2ed5c7,#4a9bd8); border-radius:55% 45% 0 0 / 22% 18% 0 0; display:flex; justify-content:center; align-items:center; color:white; }
      .water-main { text-align:center; transform:translateY(12px); }
      .water-main span { display:block; font-size:28px; opacity:.85; }
      .water-main strong { font-size:48px; line-height:1; }
      .gauges { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 18px 18px; background:linear-gradient(160deg,#2ed5c7,#4a9bd8); color:white; }
      .gauge { display:flex; flex-direction:column; align-items:center; gap:8px; }
      .arc { width:118px; height:86px; border:10px solid rgba(255,255,255,.25); border-bottom:0; border-radius:110px 110px 0 0; position:relative; display:flex; align-items:flex-end; justify-content:center; }
      .arc:before { content:""; position:absolute; left:-10px; bottom:0; width:10px; height:70px; border-radius:10px; background:#11182d; }
      .chlorine .arc:before { left:auto; right:18px; bottom:24px; height:72px; transform:rotate(108deg); background:#11182d; }
      .value { font-size:34px; padding-bottom:8px; }
      .gauge-label { font-size:20px; }
      .pill { border-radius:999px; padding:8px 18px; min-width:120px; text-align:center; font-size:16px; background:white; color:#14233b; }
      .pill.good { border:2px solid rgba(255,255,255,.9); background:rgba(255,255,255,.12); color:white; }
      .pill.warn { background:white; color:#14233b; }
      .pill.bad { background:#ff8b4d; color:white; }
      .alert { display:flex; align-items:center; gap:10px; background:#ff8b4d; color:white; padding:14px 18px; font-weight:700; font-size:17px; }
      .control-panel { padding:8px 18px 24px; }
      .control-row { display:flex; justify-content:space-between; padding:14px 0; border-bottom:1px solid rgba(20,35,59,.1); font-size:17px; }
      .large-actions { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:18px; }
      .large-actions button { border:0; border-radius:14px; padding:14px 10px; background:#10182d; color:white; font-weight:700; }
      @media (max-width: 430px) { .equipment-actions { gap:4px; } .round { width:38px; height:38px; } .equipment-sub { position:static; margin-top:8px; } }
    `;
  }
}

class PoolPilotDashboardEditor extends HTMLElement {
  setConfig(config) {
    this.config = { show_controls: true, show_weather: true, show_recommendations: true, theme: "flipr", ...config };
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  _schema() {
    return [
      { name: "title", selector: { text: {} } },
      { name: "theme", selector: { select: { options: [
        { value: "flipr", label: "Flipr Classic" },
        { value: "dark", label: "Sombre" },
        { value: "ha", label: "Home Assistant" }
      ] } } },
      { name: "water_temp_entity", selector: { entity: { domain: "sensor" } } },
      { name: "air_temp_entity", selector: { entity: { domain: "sensor" } } },
      { name: "ph_entity", selector: { entity: { domain: "sensor" } } },
      { name: "chlorine_entity", selector: { entity: { domain: "sensor" } } },
      { name: "orp_entity", selector: { entity: { domain: "sensor" } } },
      { name: "uv_entity", selector: { entity: { domain: "sensor" } } },
      { name: "pump_entity", selector: { entity: { domain: ["switch", "input_boolean"] } } },
      { name: "heatpump_entity", selector: { entity: { domain: ["switch", "climate", "input_boolean"] } } },
      { name: "weather_entity", selector: { entity: { domain: "weather" } } },
      { name: "filtration_duration_entity", selector: { entity: { domain: "sensor" } } },
      { name: "bathing_state_entity", selector: { entity: { domain: "sensor" } } },
      { name: "chemistry_state_entity", selector: { entity: { domain: "sensor" } } },
      { name: "actions_entity", selector: { entity: { domain: "sensor" } } },
      { name: "auto_button_entity", selector: { entity: { domain: ["button", "input_button", "switch", "input_boolean"] } } },
      { name: "schedule_button_entity", selector: { entity: { domain: ["button", "input_button", "switch", "input_boolean"] } } },
      { name: "show_controls", selector: { boolean: {} } },
      { name: "show_weather", selector: { boolean: {} } },
      { name: "show_recommendations", selector: { boolean: {} } },
    ];
  }

  _labels() {
    return {
      title: "Titre",
      theme: "Thème",
      water_temp_entity: "Température eau",
      air_temp_entity: "Température air",
      ph_entity: "pH",
      chlorine_entity: "Chlore libre",
      orp_entity: "RedOx / ORP",
      uv_entity: "Indice UV",
      pump_entity: "Pompe filtration",
      heatpump_entity: "Pompe à chaleur",
      weather_entity: "Météo",
      filtration_duration_entity: "Durée filtration recommandée",
      bathing_state_entity: "État baignade",
      chemistry_state_entity: "État chimie",
      actions_entity: "Actions recommandées",
      auto_button_entity: "Bouton / switch mode auto",
      schedule_button_entity: "Bouton / switch programmation",
      show_controls: "Afficher les contrôles",
      show_weather: "Afficher la météo",
      show_recommendations: "Afficher les recommandations",
    };
  }

  render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .editor { padding: 12px 0; }
        .hint { color: var(--secondary-text-color); font-size: 13px; margin: 0 0 12px; }
      </style>
      <div class="editor">
        <p class="hint">Configure les entités directement ici. Les champs vides seront simplement masqués ou affichés avec “—”.</p>
        <ha-form
          .hass=${this._hass}
          .data=${this.config}
          .schema=${this._schema()}
          .computeLabel=${(schema) => this._labels()[schema.name] || schema.name}
        ></ha-form>
      </div>
    `;
    this.shadowRoot.querySelector("ha-form")?.addEventListener("value-changed", (ev) => {
      this.config = ev.detail.value;
      this.dispatchEvent(new CustomEvent("config-changed", {
        detail: { config: this.config }, bubbles: true, composed: true,
      }));
    });
  }
}

customElements.define("pool-pilot-dashboard", PoolPilotDashboardCard);
customElements.define("pool-pilot-dashboard-editor", PoolPilotDashboardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "pool-pilot-dashboard",
  name: "Pool Pilot Dashboard",
  description: "Dashboard piscine inspiré de Flipr avec configuration graphique.",
  preview: true,
});
