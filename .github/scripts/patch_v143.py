from pathlib import Path

marker = "POOL_PILOT_EDITOR_AUTOLINK_V143"
insertion = r'''

  // POOL_PILOT_EDITOR_AUTOLINK_V143
  const editorProto = PoolPilotDashboardEditor?.prototype;
  if (editorProto && !editorProto.__poolPilotEditorAutoLinkV143) {
    const editorHassDescriptor = Object.getOwnPropertyDescriptor(editorProto, "hass");
    const editorOriginalSetConfig = editorProto.setConfig;

    if (typeof editorOriginalSetConfig === "function") {
      editorProto.setConfig = function poolPilotEditorSetConfig(config) {
        this.__poolPilotUserConfig = { ...(config || {}) };
        this.__poolPilotEditorAutoLinked = false;
        return editorOriginalSetConfig.call(this, config);
      };
    }

    if (editorHassDescriptor?.set) {
      Object.defineProperty(editorProto, "hass", {
        configurable: true,
        enumerable: editorHassDescriptor.enumerable,
        get: editorHassDescriptor.get,
        set(hass) {
          editorHassDescriptor.set.call(this, hass);
          if (this.__poolPilotEditorAutoLinked || !hass?.callWS) return;
          this.__poolPilotEditorAutoLinked = true;
          if (!this.__poolPilotUserConfig) this.__poolPilotUserConfig = { ...(this.config || {}) };
          resolveEntities(this, hass)
            .then((changed) => {
              if (!changed) return;
              if (typeof this._updateForm === "function") this._updateForm(true);
              else if (typeof this.render === "function") this.render();
              console.info(
                "Pool Pilot Dashboard v1.4.3: entités internes affichées dans l'éditeur",
                this.__poolPilotAutoEntities || {},
              );
            })
            .catch((error) => {
              console.warn(
                "Pool Pilot Dashboard v1.4.3: auto-liaison éditeur indisponible",
                error,
              );
            });
        },
      });
    }

    Object.defineProperty(editorProto, "__poolPilotEditorAutoLinkV143", { value: true });
  }
'''

for filename in ["pool-pilot-dashboard-card.js", "dist/pool-pilot-dashboard-card.js"]:
    p = Path(filename)
    text = p.read_text(encoding="utf-8")
    if marker not in text:
        needle = '  Object.defineProperty(proto, "__poolPilotAutoLinkV142", { value: true });'
        if needle not in text:
            raise SystemExit(f"Insertion point not found in {filename}")
        text = text.replace(needle, insertion + "\n" + needle, 1)
    text = text.replace("POOL-PILOT-DASHBOARD-CARD v1.4.2", "POOL-PILOT-DASHBOARD-CARD v1.4.3")
    text = text.replace("Pool Pilot Dashboard v1.4.2:", "Pool Pilot Dashboard v1.4.3:")
    text = text.replace("v1.4.2 · auto-liaison interne", "v1.4.3 · auto-liaison interne")
    p.write_text(text, encoding="utf-8")
