import "./pool-pilot-dashboard-card-base.js";

const POOL_PILOT_ENTITY_MAP = Object.freeze({
  water_temp_entity: ["sensor", "water_temperature"],
  ph_entity: ["sensor", "ph"],
  chlorine_entity: ["sensor", "free_chlorine"],
  orp_entity: ["sensor", "orp"],
  chemistry_state_entity: ["sensor", "chemistry_status"],
  bathing_state_entity: ["sensor", "bathing_status"],
  actions_entity: ["sensor", "action_summary"],
  action_summary_entity: ["sensor", "action_summary"],
  alert_entity: ["sensor", "alert_status"],
  alert_status_entity: ["sensor", "alert_status"],
  pool_alerts_entity: ["sensor", "pool_alerts"],
  smart_filtration_entity: ["sensor", "smart_filtration"],
  filtration_duration_entity: ["sensor", "recommended_filter_hours"],
  filtration_progress_entity: ["sensor", "filtration_progress"],
  pool_house_entity: ["sensor", "pool_house"],
  strip_test_entity: ["sensor", "strip_test"],
  raw_measurements_entity: ["sensor", "raw_measurements"],
  maintenance_journal_entity: ["sensor", "maintenance_journal"],
  confirm_action_entity: ["button", "confirm_current_action"],
  maintenance_entity: ["switch", "maintenance_mode"],
  filtration_center_hour_entity: ["number", "filtration_center_hour"],
  target_ph_entity: ["number", "target_ph"],
  target_fc_entity: ["number", "target_fc"],
  target_orp_entity: ["number", "target_orp"],
  filter_coef_entity: ["number", "filter_coef"],
  min_filter_hours_entity: ["number", "min_filter_hours"],
  max_filter_hours_entity: ["number", "max_filter_hours"],
  water_temp_alert_min_entity: ["number", "water_temp_alert_min"],
  water_temp_alert_max_entity: ["number", "water_temp_alert_max"],
  algae_risk_sensitivity_entity: ["number", "algae_risk_sensitivity"],
  filtration_placement_mode_entity: ["select", "filtration_placement_mode"],
  auto_start_time_entity: ["time", "auto_start_time"],
  auto_end_time_entity: ["time", "auto_end_time"],
});

let entityRegistryPromise;

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}

function loadEntityRegistry(hass) {
  if (!entityRegistryPromise) {
    entityRegistryPromise = hass
      .callWS({ type: "config/entity_registry/list" })
      .catch((error) => {
        entityRegistryPromise = undefined;
        throw error;
      });
  }
  return entityRegistryPromise;
}

function integrationGroup(entry) {
  if (entry.config_entry_id) return `entry:${entry.config_entry_id}`;
  if (entry.device_id) return `device:${entry.device_id}`;
  const uid = String(entry.unique_id || "");
  for (const [, key] of Object.values(POOL_PILOT_ENTITY_MAP)) {
    const suffix = `_${key}`;
    if (uid.endsWith(suffix)) return `uid:${uid.slice(0, -suffix.length)}`;
  }
  return "";
}

function isPoolPilotEntry(entry) {
  if (entry?.platform === "pool_pilot") return true;
  const uid = String(entry?.unique_id || "");
  return Object.values(POOL_PILOT_ENTITY_MAP).some(([, key]) =>
    uid.endsWith(`_${key}`),
  );
}

function entryMatches(entry, domain, key) {
  if (!entry?.entity_id || String(entry.entity_id).split(".")[0] !== domain) return false;
  const uid = String(entry.unique_id || "");
  return uid === key || uid.endsWith(`_${key}`);
}

function selectPoolPilotGroup(entries, userConfig) {
  const groups = new Map();
  for (const entry of entries.filter(isPoolPilotEntry)) {
    const group = integrationGroup(entry);
    if (!group) continue;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(entry);
  }

  if (!groups.size) return null;

  const explicitIds = new Set(
    Object.keys(POOL_PILOT_ENTITY_MAP)
      .filter((field) => hasOwn(userConfig, field) && userConfig[field])
      .map((field) => String(userConfig[field])),
  );
  if (explicitIds.size) {
    for (const groupEntries of groups.values()) {
      if (groupEntries.some((entry) => explicitIds.has(entry.entity_id))) return groupEntries;
    }
  }

  if (groups.size === 1) return groups.values().next().value;

  console.warn(
    "Pool Pilot Dashboard: plusieurs instances Pool Pilot détectées. " +
      "Renseignez au moins une entité Pool Pilot dans la carte pour sélectionner l'instance à utiliser.",
  );
  return null;
}

async function resolvePoolPilotEntities(card, hass) {
  const userConfig = card.__poolPilotUserConfig || {};
  const registry = await loadEntityRegistry(hass);
  const group = selectPoolPilotGroup(Array.isArray(registry) ? registry : [], userConfig);
  if (!group) return false;

  const resolved = {};
  for (const [field, [domain, key]] of Object.entries(POOL_PILOT_ENTITY_MAP)) {
    if (hasOwn(userConfig, field)) continue;
    const entry = group.find((candidate) => entryMatches(candidate, domain, key));
    if (entry?.entity_id) resolved[field] = entry.entity_id;
  }

  if (!Object.keys(resolved).length) return false;
  card.config = { ...(card.config || {}), ...resolved };
  card.__poolPilotAutoEntities = resolved;
  return true;
}

function patchCard() {
  const Card = customElements.get("pool-pilot-dashboard");
  if (!Card || Card.prototype.__poolPilotAutoLinkPatched) return;

  const proto = Card.prototype;
  const originalSetConfig = proto.setConfig;
  const hassDescriptor = Object.getOwnPropertyDescriptor(proto, "hass");

  proto.setConfig = function setConfigWithPoolPilotAutoLink(config) {
    this.__poolPilotUserConfig = { ...(config || {}) };
    this.__poolPilotAutoLinked = false;
    this.__poolPilotAutoLinkPending = false;
    return originalSetConfig.call(this, config);
  };

  if (hassDescriptor?.set) {
    Object.defineProperty(proto, "hass", {
      configurable: true,
      enumerable: hassDescriptor.enumerable,
      get: hassDescriptor.get,
      set(hass) {
        hassDescriptor.set.call(this, hass);
        if (this.__poolPilotAutoLinked || this.__poolPilotAutoLinkPending || !hass?.callWS) return;

        this.__poolPilotAutoLinkPending = true;
        resolvePoolPilotEntities(this, hass)
          .then((changed) => {
            this.__poolPilotAutoLinked = true;
            this.__poolPilotAutoLinkPending = false;
            if (changed) hassDescriptor.set.call(this, hass);
          })
          .catch((error) => {
            this.__poolPilotAutoLinkPending = false;
            console.warn("Pool Pilot Dashboard: auto-liaison indisponible", error);
          });
      },
    });
  }

  Object.defineProperty(proto, "__poolPilotAutoLinkPatched", {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

function patchEditorLabels() {
  const Editor = customElements.get("pool-pilot-dashboard-editor");
  if (!Editor || Editor.prototype.__poolPilotAutoLinkPatched) return;
  const proto = Editor.prototype;
  const originalLabels = proto._labels;
  if (typeof originalLabels === "function") {
    proto._labels = function labelsWithAutoLinkHint() {
      const labels = originalLabels.call(this);
      for (const field of Object.keys(POOL_PILOT_ENTITY_MAP)) {
        if (labels[field]) labels[field] = `${labels[field]} (auto Pool Pilot)`;
      }
      return labels;
    };
  }
  Object.defineProperty(proto, "__poolPilotAutoLinkPatched", {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

patchCard();
patchEditorLabels();

console.info(
  "%cPOOL-PILOT-DASHBOARD-CARD v1.4.0 · auto-liaison Pool Pilot",
  "color:#2ed5c7;font-weight:bold",
);
