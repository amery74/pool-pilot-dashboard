from pathlib import Path
import re

replacement = r'''  const activePoolPilotStates = (hass) =>
    Object.entries(hass?.states || {})
      .map(([entity_id, state]) => ({
        entity_id,
        key: String(state?.attributes?.pool_pilot_key || ""),
        instance: String(state?.attributes?.pool_pilot_instance || ""),
      }))
      .filter((entry) => entry.key && entry.instance);

  const chooseStateInstance = (entries, userConfig) => {
    const byEntity = new Map(entries.map((entry) => [entry.entity_id, entry]));
    for (const field of Object.keys(ENTITY_MAP)) {
      if (!hasValue(userConfig, field)) continue;
      const anchored = byEntity.get(String(userConfig[field]));
      if (anchored?.instance) return anchored.instance;
    }
    const instances = [...new Set(entries.map((entry) => entry.instance).filter(Boolean))];
    if (instances.length === 1) return instances[0];
    if (instances.length > 1) {
      console.warn("Pool Pilot Dashboard: plusieurs instances Pool Pilot détectées.", instances);
    }
    return "";
  };

  const resolveEntities = async (card, hass) => {
    const userConfig = card.__poolPilotUserConfig || {};
    const stateEntries = activePoolPilotStates(hass);
    const instance = chooseStateInstance(stateEntries, userConfig);

    if (instance) {
      const resolved = {};
      for (const [field, [domain, key]] of Object.entries(ENTITY_MAP)) {
        if (hasValue(userConfig, field)) continue;
        const match = stateEntries.find((candidate) =>
          candidate.instance === instance &&
          candidate.key === key &&
          String(candidate.entity_id).split(".")[0] === domain
        );
        if (match?.entity_id) resolved[field] = match.entity_id;
      }
      if (Object.keys(resolved).length) {
        card.config = { ...(card.config || {}), ...resolved };
        card.__poolPilotAutoEntities = resolved;
        console.info("Pool Pilot Dashboard v1.4.4: entités liées via hass.states", { instance, resolved });
        return true;
      }
    }

    const registry = await loadRegistry(hass);
    const entries = activePoolPilotEntries(registry, hass);
    const prefix = choosePrefix(entries, userConfig);
    if (!prefix) return false;

    const resolved = {};
    for (const [field, [domain, key]] of Object.entries(ENTITY_MAP)) {
      if (hasValue(userConfig, field)) continue;
      const entry = entries.find((candidate) =>
        entityPrefix(candidate) === prefix &&
        entityKey(candidate) === key &&
        String(candidate.entity_id).split(".")[0] === domain
      );
      if (entry?.entity_id) resolved[field] = entry.entity_id;
    }
    if (!Object.keys(resolved).length) return false;
    card.config = { ...(card.config || {}), ...resolved };
    card.__poolPilotAutoEntities = resolved;
    return true;
  };

  const proto ='''

pattern = re.compile(r'  const resolveEntities = async \(card, hass\) => \{.*?\n  \};\n\n  const proto =', re.S)

for filename in ["pool-pilot-dashboard-card.js", "dist/pool-pilot-dashboard-card.js"]:
    path = Path(filename)
    text = path.read_text(encoding="utf-8")
    updated, count = pattern.subn(replacement, text, count=1)
    if count != 1:
        raise SystemExit(f"resolveEntities block not found in {filename}")
    updated = updated.replace("POOL-PILOT-DASHBOARD-CARD v1.4.3", "POOL-PILOT-DASHBOARD-CARD v1.4.4")
    updated = updated.replace("Pool Pilot Dashboard v1.4.3:", "Pool Pilot Dashboard v1.4.4:")
    updated = updated.replace("v1.4.3 · auto-liaison interne", "v1.4.4 · auto-liaison interne")
    path.write_text(updated, encoding="utf-8")
