class PoolPilotDashboardCard extends HTMLElement {
  static getConfigElement() { return document.createElement("pool-pilot-dashboard-editor"); }
  static getStubConfig() {
    return {
      title: "Piscine",
      theme: "flipr",
      show_weather: true,
      show_recommendations: true,
      enable_filter_pump: true,
      enable_heatpump: false,
      enable_electrolyzer: false,
      enable_counter_current: false,
    };
  }
  setConfig(config) {
    this.config = {
      title: "Piscine",
      theme: "flipr",
      show_weather: true,
      show_recommendations: true,
      enable_filter_pump: true,
      enable_heatpump: false,
      enable_electrolyzer: false,
      enable_counter_current: false,
      ...config,
    };
    this._tab = this._tab || "analysis";
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  set hass(hass) { this._hass = hass; this.render(); }
  getCardSize() { return 10; }

  _state(entityId) { return entityId && this._hass?.states?.[entityId] ? this._hass.states[entityId] : undefined; }
  _value(entityId, fallback = "—") {
    const s = this._state(entityId);
    if (!s || ["unknown", "unavailable", "none", "None"].includes(String(s.state))) return fallback;
    return s.state;
  }
  _num(entityId) { const n = parseFloat(String(this._value(entityId, "")).replace(",", ".")); return Number.isFinite(n) ? n : null; }
  _unit(entityId) { return this._state(entityId)?.attributes?.unit_of_measurement || ""; }
  _format(entityId, fallback = "—") { const v = this._value(entityId, fallback); const u = this._unit(entityId); return v === fallback ? v : `${v}${u ? " " + u : ""}`; }
  _friendly(entityId, fallback = "") { return this._state(entityId)?.attributes?.friendly_name || fallback || entityId || ""; }
  _isOn(entityId) { return ["on", "heat", "heating", "cool", "auto", "running"].includes(String(this._value(entityId, "off")).toLowerCase()); }
  _labelState(value) {
    const map = { safe:"Bon", ok:"Bon", good:"Bon", bon:"Bon", normal:"Bon", warning:"Attention", attention:"Attention", high:"Trop Haut", low:"Trop Bas", avoid:"Déconseillée", bad:"Mauvais", danger:"Danger", unknown:"Inconnu", unavailable:"Indisponible" };
    return map[String(value || "").toLowerCase()] || value || "—";
  }
  _qualityClass(value) {
    const v = String(value || "").toLowerCase();
    if (["safe", "ok", "good", "bon", "normal"].includes(v)) return "good";
    if (["warning", "attention", "high", "low"].includes(v)) return "warn";
    if (["avoid", "bad", "danger"].includes(v)) return "bad";
    return "neutral";
  }
  _phStatus(v) { const n = parseFloat(v); if (!Number.isFinite(n)) return "unknown"; if (n < 7.0) return "low"; if (n > 7.4) return "high"; return "good"; }
  _chlStatus() {
    const c = this._num(this.config.chlorine_entity); if (c !== null) { if (c < 1) return "low"; if (c > 3) return "high"; return "good"; }
    const o = this._num(this.config.orp_entity); if (o !== null) { if (o < 650) return "low"; if (o > 800) return "high"; return "good"; }
    return "unknown";
  }
  _hasAlert() {
    const c = this.config || {};
    if (!c.show_recommendations) return false;
    const actions = String(this._value(c.actions_entity, "")).trim().toLowerCase();
    const chem = String(this._value(c.chemistry_state_entity, "")).toLowerCase();
    const bath = String(this._value(c.bathing_state_entity, "")).toLowerCase();
    return Boolean(actions && !["aucune recommandation", "ok", "none", "—"].includes(actions)) || ["warning","avoid","bad","danger"].includes(chem) || ["warning","avoid","bad","danger"].includes(bath);
  }
  _call(entityId, action="toggle") {
    if (!entityId || !this._hass) return;
    const [domain] = entityId.split(".");
    if (domain === "button" || domain === "input_button") return this._hass.callService(domain, "press", { entity_id: entityId });
    if (domain === "climate") return this._hass.callService(domain, action === "off" ? "turn_off" : "turn_on", { entity_id: entityId });
    if (["switch", "input_boolean"].includes(domain)) return this._hass.callService(domain, action === "on" ? "turn_on" : action === "off" ? "turn_off" : "toggle", { entity_id: entityId });
  }
  _equipmentButton(label, icon, entity, action="toggle") {
    const on = this._isOn(entity);
    return `<button class="round ${on ? "on" : ""}" title="${label}" data-action="${action}" data-entity="${entity || ""}"><ha-icon icon="${icon}"></ha-icon></button>`;
  }
  _smallDevice(label, icon, entity) {
    if (!entity) return "";
    return `<div class="device-mini"><ha-icon icon="${icon}"></ha-icon><span>${label}</span><strong>${this._isOn(entity) ? "ON" : "OFF"}</strong></div>`;
  }
  _phGauge(value) {
    const n = parseFloat(value); const pct = Number.isFinite(n) ? Math.max(0, Math.min(1, (n - 6.8) / 1.0)) : .5;
    const deg = -135 + pct * 270;
    const status = this._phStatus(value);
    return `<div class="gauge ph-gauge">
      <div class="ph-ring" style="--deg:${deg}deg"><div class="ph-dot"></div><div class="gauge-value">${value || "—"}</div></div>
      <div class="gauge-label">pH</div><div class="pill ${this._qualityClass(status)}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this._labelState(status)}</div>
    </div>`;
  }
  _chlorineGauge(value) {
    const raw = this._num(this.config.chlorine_entity) ?? this._num(this.config.orp_entity);
    const min = this.config.chlorine_entity ? 0 : 400; const max = this.config.chlorine_entity ? 5 : 900;
    const pct = raw === null ? .5 : Math.max(0, Math.min(1, (raw - min) / (max - min)));
    const deg = -115 + pct * 230;
    const status = this._chlStatus();
    return `<div class="gauge chlorine-gauge">
      <div class="speedo"><div class="ticks"></div><div class="speed-needle" style="--deg:${deg}deg"></div><div class="gauge-value small">${value || "—"}</div></div>
      <div class="gauge-label">${this.config.chlorine_entity ? "Chlore" : "RedOx"}</div><div class="pill ${this._qualityClass(status)}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this._labelState(status)}</div>
    </div>`;
  }
  _alertPanel() {
    const c = this.config || {}; const actions = this._value(c.actions_entity, "Suivez les conseils ci-dessous pour résoudre le problème.");
    const phStatus = this._labelState(this._phStatus(this._value(c.ph_entity, "")));
    const title = phStatus === "Trop Haut" ? "Votre pH est trop élevé." : phStatus === "Trop Bas" ? "Votre pH est trop bas." : "Alerte en cours";
    return `<div class="modal-backdrop" data-close="1"><div class="alert-sheet"><button class="close" data-close="1"><ha-icon icon="mdi:close"></ha-icon></button><h1>Alerte en cours</h1><div class="alert-head"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><strong>${title} - ${c.title || "Piscine"}</strong><span>Suivez les conseils ci-dessous pour résoudre le problème.</span></div><div class="steps"><div><b>1</b><span>${actions}</span></div><div><b>2</b><span>Faites fonctionner la pompe pendant les 3 prochaines heures.</span></div><div><b>3</b><span>Effectuez cette action si possible le soir après la baignade.</span></div><div><b>4</b><span>Vérifiez votre niveau d'eau.</span></div></div><div class="alert-actions"><button data-close="1">Plus tard</button><button class="done" data-action="press" data-entity="${c.confirm_action_entity || ""}">C'est fait <ha-icon icon="mdi:check-circle-outline"></ha-icon></button></div></div></div>`;
  }
  render() {
    if (!this.shadowRoot || !this._hass) return;
    const c = this.config || {};
    const water = this._format(c.water_temp_entity); const air = this._format(c.air_temp_entity); const ph = this._value(c.ph_entity); const chlorine = this._format(c.chlorine_entity, this._format(c.orp_entity)); const uv = this._value(c.uv_entity, "0"); const filtration = this._format(c.filtration_duration_entity); const last = this._format(c.last_measure_entity, "—"); const alert = this._hasAlert();
    const devices = [
      c.enable_filter_pump ? this._smallDevice("Filtration", "mdi:pool", c.pump_entity) : "",
      c.enable_heatpump ? this._smallDevice("PAC", "mdi:heat-pump-outline", c.heatpump_entity) : "",
      c.enable_electrolyzer ? this._smallDevice("Électrolyseur", "mdi:creation-outline", c.electrolyzer_entity) : "",
      c.enable_counter_current ? this._smallDevice("Nage", "mdi:waves-arrow-right", c.counter_current_entity) : "",
    ].join("");

    this.shadowRoot.innerHTML = `<style>${this.styles()}</style><ha-card class="pool-card ${c.theme || "flipr"}">
      <div class="top"><div class="title">${c.title || "Piscine"}</div><div class="tabs"><button class="tab ${this._tab === "analysis" ? "active" : ""}" data-tab="analysis"><ha-icon icon="mdi:water-outline"></ha-icon> Analyse</button><button class="tab ${this._tab === "control" ? "active" : ""}" data-tab="control"><ha-icon icon="mdi:toggle-switch-outline"></ha-icon> Contrôle</button></div>${c.show_weather ? `<div class="weather"><span>air</span><strong>${air}</strong><span class="uv">UV ${uv}</span></div>` : ""}</div>
      ${this._tab === "analysis" ? `<div class="analysis-equipment">${devices || `<div class="device-mini muted"><ha-icon icon="mdi:plus"></ha-icon><span>Aucun équipement configuré</span></div>`}</div><div class="measure-card"><div class="trophy"><ha-icon icon="mdi:trophy-outline"></ha-icon></div><div><strong>Dernière Mesure</strong><span>${last}</span></div><button data-action="press" data-entity="${c.trigger_measure_entity || ""}"><ha-icon icon="mdi:tune-variant"></ha-icon></button></div><div class="wave"><div class="water-main"><span>eau</span><strong>${water}</strong></div></div><div class="gauges">${this._phGauge(ph)}${this._chlorineGauge(chlorine)}</div>` : this._controlPanel()}
      ${alert ? `<button class="bottom-alert"><ha-icon icon="mdi:alert-outline"></ha-icon> Alerte en cours : suivez nos instructions</button>` : ""}
      ${this._showAlert ? this._alertPanel() : ""}
    </ha-card>`;
    this.shadowRoot.querySelectorAll(".tab").forEach(el => el.addEventListener("click", () => { this._tab = el.dataset.tab; this._showAlert=false; this.render(); }));
    this.shadowRoot.querySelectorAll("button[data-action]").forEach(el => el.addEventListener("click", ev => { ev.stopPropagation(); this._call(ev.currentTarget.dataset.entity, ev.currentTarget.dataset.action); }));
    this.shadowRoot.querySelector(".bottom-alert")?.addEventListener("click", () => { this._showAlert = true; this.render(); });
    this.shadowRoot.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", ev => { if (ev.target === el || el.classList.contains("close") || el.tagName === "BUTTON") { this._showAlert=false; this.render(); } }));
  }
  _controlPanel() {
    const c = this.config || {}; const rows = [];
    if (c.enable_filter_pump) rows.push(this._controlDevice("Pompe à filtration", "mdi:pool", c.pump_entity, c.filtration_duration_entity ? `Filtration ce jour ${this._format(c.filtration_duration_entity)}` : ""));
    if (c.enable_heatpump) rows.push(this._controlDevice("Pompe à chaleur", "mdi:heat-pump-outline", c.heatpump_entity, c.heatpump_temp_entity ? `Consigne ${this._format(c.heatpump_temp_entity)}` : ""));
    if (c.enable_electrolyzer) rows.push(this._controlDevice("Électrolyseur", "mdi:creation-outline", c.electrolyzer_entity, "Traitement automatique"));
    if (c.enable_counter_current) rows.push(this._controlDevice("Nage à contre-courant", "mdi:waves-arrow-right", c.counter_current_entity, "Commande manuelle"));
    return `<div class="control-panel">${rows.join("") || `<div class="empty">Active des équipements dans l'éditeur visuel.</div>`}<button class="connect"><span>Connecter un nouvel équipement</span><ha-icon icon="mdi:plus"></ha-icon></button></div>`;
  }
  _controlDevice(label, icon, entity, sub) { return `<div class="control-device"><ha-icon icon="${icon}"></ha-icon><div><strong>${label}</strong><span>${sub || (this._isOn(entity) ? "En marche" : "Arrêté")}</span></div><div class="control-buttons">${this._equipmentButton("Auto", "mdi:lightning-bolt", "", "toggle")}${this._equipmentButton(label, "mdi:power", entity, "toggle")}</div></div>`; }
  styles() { return `
    ha-card.pool-card{position:relative;overflow:hidden;border-radius:28px;background:#eef7fb;color:#14233b;font-family:var(--primary-font-family);box-shadow:none}.top{padding:18px 18px 8px}.title{text-align:center;font-weight:600;font-size:18px;margin-bottom:14px}.tabs{display:grid;grid-template-columns:1fr 1fr;background:#aeb8c7;border-radius:18px;overflow:hidden}.tab{border:0;padding:13px 8px;font-size:16px;color:white;background:transparent;display:flex;align-items:center;justify-content:center;gap:8px}.tab.active{background:#10182d}.weather{display:flex;align-items:center;gap:10px;margin:18px 4px 10px}.weather span:first-child{font-size:24px;opacity:.9}.weather strong{font-size:42px;line-height:1}.uv{margin-left:auto;border:2px solid #14233b;border-radius:10px;padding:2px 8px;font-weight:600}.analysis-equipment{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 18px 70px}.device-mini{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:8px;background:white;border-radius:16px;padding:14px;min-height:55px}.device-mini ha-icon{--mdc-icon-size:36px;color:#111}.device-mini span{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.device-mini strong{font-size:12px;color:#97a4b7}.device-mini.muted{grid-column:1 / -1;color:#8d98aa}.measure-card{position:relative;z-index:2;margin:-42px 18px 0;background:rgba(225,255,252,.86);border-radius:14px;padding:10px;display:grid;grid-template-columns:52px 1fr 46px;gap:10px;align-items:center}.measure-card .trophy{width:52px;height:52px;border-radius:8px;background:#ff4db4;color:white;display:flex;align-items:center;justify-content:center}.measure-card strong,.measure-card span{display:block}.measure-card button{border:0;background:#10182d;color:white;border-radius:12px;width:44px;height:44px}.wave{height:155px;margin-top:-4px;position:relative;background:linear-gradient(160deg,#2ed5c7,#4a9bd8);border-radius:54% 46% 0 0 / 20% 18% 0 0;display:flex;justify-content:center;align-items:center;color:white}.water-main{text-align:center;transform:translateY(18px)}.water-main span{display:block;font-size:28px;opacity:.85}.water-main strong{font-size:48px;line-height:1}.gauges{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:4px 18px 22px;background:linear-gradient(160deg,#2ed5c7,#4a9bd8);color:white}.gauge{display:flex;flex-direction:column;align-items:center;gap:9px}.ph-ring{width:124px;height:124px;border-radius:50%;position:relative;background:conic-gradient(from 225deg,#11182d 0deg,#11182d 45deg,rgba(255,255,255,.22) 45deg,rgba(255,255,255,.22) 270deg,transparent 270deg);display:flex;align-items:center;justify-content:center}.ph-ring:after{content:"";position:absolute;inset:13px;border-radius:50%;background:linear-gradient(160deg,#31c9cc,#4aa6d7)}.ph-dot{position:absolute;left:50%;top:50%;width:21px;height:21px;background:white;border-radius:50%;transform:rotate(var(--deg)) translate(0,-62px);transform-origin:center;z-index:2}.gauge-value{position:relative;z-index:3;font-size:38px}.gauge-value.small{font-size:18px;position:absolute;bottom:8px}.speedo{width:132px;height:92px;position:relative;overflow:hidden}.speedo:before{content:"";position:absolute;left:7px;top:6px;width:118px;height:118px;border-radius:50%;border:12px solid rgba(255,255,255,.25);border-bottom-color:transparent;border-left-color:rgba(255,255,255,.25);transform:rotate(-20deg)}.ticks{position:absolute;right:10px;top:14px;width:62px;height:62px;border-radius:50%;border-right:3px dashed rgba(255,255,255,.9);transform:rotate(18deg)}.speed-needle{position:absolute;left:66px;top:66px;width:58px;height:13px;background:#10182d;border-radius:10px;transform-origin:5px 50%;transform:rotate(var(--deg))}.gauge-label{font-size:20px}.pill{border-radius:999px;padding:8px 14px;min-width:118px;text-align:center;font-size:16px;background:white;color:#14233b;display:flex;justify-content:center;align-items:center;gap:6px}.pill ha-icon{--mdc-icon-size:18px}.pill.good{border:2px solid rgba(255,255,255,.9);background:rgba(255,255,255,.12);color:white}.pill.warn{background:white;color:#14233b}.pill.bad{background:#ff8b4d;color:white}.bottom-alert{width:100%;border:0;display:flex;align-items:center;justify-content:center;gap:10px;background:#ff8b4d;color:white;padding:15px 12px;font-weight:800;font-size:17px}.control-panel{padding:8px 18px 24px}.control-device{display:grid;grid-template-columns:54px 1fr auto;align-items:center;gap:12px;background:white;border-radius:16px;padding:18px 14px;margin-bottom:14px}.control-device>ha-icon{--mdc-icon-size:45px;color:#111}.control-device strong,.control-device span{display:block}.control-device span{font-size:13px;color:#536176;margin-top:4px}.control-buttons{display:flex;gap:8px}.round{width:42px;height:42px;border-radius:50%;border:0;background:#edf1f7;color:#98a5b8;display:flex;align-items:center;justify-content:center}.round.on{background:#16d26b;color:white}.connect{width:100%;border:0;border-radius:16px;background:#10182d;color:white;padding:18px;font-weight:800;font-size:18px;display:flex;justify-content:space-between;align-items:center}.empty{padding:30px;text-align:center;color:#617086}.modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.25);z-index:10;display:flex;align-items:flex-end}.alert-sheet{position:relative;background:white;color:#14233b;border-radius:24px 24px 0 0;padding:24px 18px;max-height:92%;overflow:auto}.alert-sheet h1{font-size:34px;margin:0 0 18px}.close{position:absolute;right:18px;top:18px;border:0;background:#eef1f6;border-radius:50%;width:42px;height:42px}.alert-head{background:#203b50;color:white;border-radius:8px;padding:18px;text-align:center;display:flex;flex-direction:column;gap:8px}.alert-head ha-icon{color:#ff3f65;margin:auto;--mdc-icon-size:52px}.steps{margin:22px 0;display:grid;gap:16px}.steps div{display:grid;grid-template-columns:46px 1fr;gap:14px;align-items:center}.steps b{background:#203b50;color:white;padding:15px 0;text-align:center}.steps span{background:white;border-radius:10px;padding:15px;box-shadow:0 3px 14px rgba(22,42,70,.18)}.alert-actions{display:grid;grid-template-columns:1fr 1fr;gap:18px}.alert-actions button{border:0;border-radius:999px;padding:14px;font-weight:800;background:#dddaf3;color:#203b50}.alert-actions .done{background:#32d8b9;color:white;display:flex;align-items:center;justify-content:center;gap:8px}@media(max-width:430px){.analysis-equipment{grid-template-columns:1fr}.gauges{gap:6px}.ph-ring{width:112px;height:112px}.ph-dot{transform:rotate(var(--deg)) translate(0,-56px)}.speedo{width:120px}.pill{min-width:105px;font-size:14px}.control-device{grid-template-columns:44px 1fr}.control-buttons{grid-column:1 / -1;justify-content:flex-end}}
  `; }
}

class PoolPilotDashboardEditor extends HTMLElement {
  setConfig(config) { this.config = { theme:"flipr", show_weather:true, show_recommendations:true, enable_filter_pump:true, enable_heatpump:false, enable_electrolyzer:false, enable_counter_current:false, ...config }; this.render(); }
  set hass(hass) { this._hass = hass; this.render(); }
  _schema() {
    const s = [
      { name:"title", selector:{ text:{} } }, { name:"theme", selector:{ select:{ options:[{value:"flipr",label:"Flipr Classic"},{value:"dark",label:"Sombre"},{value:"ha",label:"Home Assistant"}] } } },
      { name:"water_temp_entity", selector:{ entity:{ domain:"sensor" } } }, { name:"air_temp_entity", selector:{ entity:{ domain:"sensor" } } }, { name:"uv_entity", selector:{ entity:{ domain:"sensor" } } },
      { name:"ph_entity", selector:{ entity:{ domain:"sensor" } } }, { name:"chlorine_entity", selector:{ entity:{ domain:"sensor" } } }, { name:"orp_entity", selector:{ entity:{ domain:"sensor" } } },
      { name:"last_measure_entity", selector:{ entity:{ domain:["sensor","input_datetime"] } } }, { name:"trigger_measure_entity", selector:{ entity:{ domain:["button","input_button","switch"] } } },
      { name:"chemistry_state_entity", selector:{ entity:{ domain:"sensor" } } }, { name:"bathing_state_entity", selector:{ entity:{ domain:"sensor" } } }, { name:"actions_entity", selector:{ entity:{ domain:"sensor" } } }, { name:"confirm_action_entity", selector:{ entity:{ domain:["button","input_button"] } } },
      { name:"enable_filter_pump", selector:{ boolean:{} } },
    ];
    if (this.config?.enable_filter_pump) s.push({name:"pump_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"filtration_duration_entity",selector:{entity:{domain:"sensor"}}});
    s.push({ name:"enable_heatpump", selector:{ boolean:{} } });
    if (this.config?.enable_heatpump) s.push({name:"heatpump_entity",selector:{entity:{domain:["switch","climate","input_boolean"]}}},{name:"heatpump_temp_entity",selector:{entity:{domain:"sensor"}}});
    s.push({ name:"enable_electrolyzer", selector:{ boolean:{} } });
    if (this.config?.enable_electrolyzer) s.push({name:"electrolyzer_entity",selector:{entity:{domain:["switch","input_boolean"]}}});
    s.push({ name:"enable_counter_current", selector:{ boolean:{} } });
    if (this.config?.enable_counter_current) s.push({name:"counter_current_entity",selector:{entity:{domain:["switch","input_boolean"]}}});
    s.push({ name:"show_weather", selector:{ boolean:{} } },{ name:"show_recommendations", selector:{ boolean:{} } });
    return s;
  }
  _labels(){ return { title:"Titre",theme:"Thème",water_temp_entity:"Température eau",air_temp_entity:"Température air",uv_entity:"Indice UV",ph_entity:"pH",chlorine_entity:"Chlore libre",orp_entity:"RedOx / ORP",last_measure_entity:"Date/heure dernière mesure Flipr",trigger_measure_entity:"Bouton déclencher/récupérer mesure",chemistry_state_entity:"État chimie",bathing_state_entity:"État baignade",actions_entity:"Actions / besoins produits",confirm_action_entity:"Bouton validation action",enable_filter_pump:"Ajouter la filtration",pump_entity:"Commande pompe filtration",filtration_duration_entity:"Durée filtration",enable_heatpump:"Ajouter la pompe à chaleur",heatpump_entity:"Commande PAC",heatpump_temp_entity:"Température/consigne PAC",enable_electrolyzer:"Ajouter l'électrolyseur",electrolyzer_entity:"Commande électrolyseur",enable_counter_current:"Ajouter la nage à contre-courant",counter_current_entity:"Commande nage à contre-courant",show_weather:"Afficher météo",show_recommendations:"Afficher alertes/recommandations" }; }
  render() { if (!this._hass) return; if (!this.shadowRoot) this.attachShadow({mode:"open"}); this.shadowRoot.innerHTML = `<style>.editor{padding:12px 0}.hint{color:var(--secondary-text-color);font-size:13px;margin:0 0 12px}</style><div class="editor"><p class="hint">Coche les équipements présents : les champs d'entités correspondants apparaissent ensuite.</p><ha-form></ha-form></div>`; const form=this.shadowRoot.querySelector("ha-form"); form.hass=this._hass; form.data=this.config; form.schema=this._schema(); form.computeLabel=(schema)=>this._labels()[schema.name]||schema.name; form.addEventListener("value-changed",ev=>{this.config=ev.detail.value; this.render(); this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:true,composed:true}));}); }
}
customElements.define("pool-pilot-dashboard", PoolPilotDashboardCard);
customElements.define("pool-pilot-dashboard-editor", PoolPilotDashboardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type:"pool-pilot-dashboard", name:"Pool Pilot Dashboard", description:"Dashboard piscine inspiré de Flipr avec éditeur graphique conditionnel.", preview:true });
console.info("%cPOOL-PILOT-DASHBOARD-CARD v0.4.0", "color:#2ed5c7;font-weight:bold");
