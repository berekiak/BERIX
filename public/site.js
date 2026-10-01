(() => {
  const services = [
    "Sites web",
    "Applications",
    "Outils de gestion",
    "UI/UX Design",
    "Transformation numérique",
    "Solution sur mesure",
    "Autre",
  ];

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function setupMenu() {
    const button = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navigation");
    if (!button || !navigation) return;

    const close = () => {
      navigation.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Ouvrir le menu");
    };

    button.addEventListener("click", () => {
      const open = !navigation.classList.contains("open");
      navigation.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (event) => event.key === "Escape" && close());
    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !button.contains(event.target)) close();
    });
  }

  function selectMarkup(id, name, label, required = false) {
    const options = services.map((service) => `<option value="${escapeHtml(service)}">${escapeHtml(service)}</option>`).join("");
    return `<label for="${id}">${label}${required ? " *" : ""}</label><select class="native-select" id="${id}" name="${name}" ${required ? "required" : ""}><option value="">Sélectionnez une option</option>${options}</select>`;
  }

  function status(form, kind, message) {
    let element = form.querySelector(".form-status");
    if (!element) {
      element = document.createElement("div");
      element.className = "form-status";
      element.setAttribute("role", "status");
      element.setAttribute("aria-live", "polite");
      form.append(element);
    }
    element.className = `form-status ${kind}`;
    element.hidden = false;
    element.tabIndex = -1;
    element.textContent = message;
    element.focus?.();
  }

  async function sendRequest(payload) {
    const response = await fetch("/api/demandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: crypto.randomUUID(), website: "", ...payload }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "L’envoi n’a pas abouti. Veuillez réessayer.");
    return result;
  }

  function setupContactForm() {
    if (location.pathname.replace(/\/$/, "") !== "/contact") return;
    const form = document.querySelector(".project-form");
    if (!form) return;

    const serviceButton = form.querySelector("#contact-service");
    const serviceField = serviceButton?.closest(".field");
    if (serviceField) serviceField.innerHTML = selectMarkup("contact-service-native", "service", "Service concerné (facultatif)");

    const consentButton = form.querySelector("#consent");
    if (consentButton) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "consent";
      checkbox.name = "consent";
      checkbox.required = true;
      consentButton.parentNode.insertBefore(checkbox, consentButton);
      consentButton.remove();
      form.querySelector('.consent input[aria-hidden="true"]')?.remove();
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = "Envoi en cours…";
      const values = new FormData(form);
      try {
        const result = await sendRequest({
          kind: "contact",
          name: values.get("name"),
          email: values.get("email"),
          company: values.get("company"),
          phone: values.get("phone"),
          service: values.get("service") || "Autre",
          subject: values.get("subject"),
          message: values.get("message"),
          budget: "À définir ensemble",
          deadline: "Flexible",
          consent: values.get("consent") === "on",
        });
        form.reset();
        status(form, "success", `Votre message a bien été transmis à Nexora Digital. Référence : ${result.reference}. Nous vous répondrons dans les meilleurs délais.`);
      } catch (error) {
        status(form, "error", error.message);
      } finally {
        button.disabled = false;
        button.textContent = "Envoyer ma demande";
      }
    });
  }

  function setupQuoteForm() {
    if (location.pathname.replace(/\/$/, "") !== "/devis") return;
    const form = document.querySelector(".project-form");
    if (!form) return;

    const data = {};
    let step = 1;
    const whatsapp = '<div class="form-whatsapp-option"><span>Vous préférez WhatsApp ?</span><a href="https://wa.me/243858181330" target="_blank" rel="noreferrer">+243 85 81 81 330</a></div>';

    function saveVisibleFields() {
      new FormData(form).forEach((value, key) => { data[key] = value; });
      const consent = form.querySelector('[name=consent]');
      if (consent) data.consent = consent.checked ? "on" : "";
    }

    function frame(content, nextLabel = "Continuer", back = true) {
      const progress = Math.round((step / 3) * 100);
      return `<div class="form-delivery-note"><div><strong>Transmission directe par e-mail</strong><span>Votre demande sera envoyée à <a href="mailto:nexoradigitalrdc@gmail.com">nexoradigitalrdc@gmail.com</a>.</span></div></div><span class="eyebrow">ÉTAPE ${step} SUR 3</span><div class="relative h-2 w-full overflow-hidden rounded-full bg-primary/20" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><div class="h-full bg-primary transition-all" style="width:${progress}%"></div></div>${content}<div class="form-actions">${back ? '<button type="button" class="button secondary" data-back>Retour</button>' : "<span></span>"}<button type="submit" class="button primary">${nextLabel}</button></div>${whatsapp}<div class="form-status" role="status" aria-live="polite" hidden></div>`;
    }

    function render() {
      if (step === 1) {
        form.innerHTML = frame(`<h2>Votre projet</h2><div class="field">${selectMarkup("quote-service", "service", "Quelle expertise recherchez-vous ?", true)}</div><label class="field">Décrivez votre projet *<textarea name="message" required minlength="20" maxlength="5000" placeholder="Vos objectifs, les utilisateurs concernés, les fonctionnalités souhaitées…">${escapeHtml(data.message || "")}</textarea><small>20 caractères minimum.</small></label>`, "Continuer", false);
        form.querySelector("[name=service]").value = data.service || "";
      } else if (step === 2) {
        form.innerHTML = frame(`<h2>Budget et calendrier</h2><label class="field">Budget envisagé *<select class="native-select" name="budget" required><option value="">Sélectionnez une option</option><option>Moins de 1 000 USD</option><option>1 000 à 2 500 USD</option><option>2 500 à 5 000 USD</option><option>Plus de 5 000 USD</option><option>À définir ensemble</option></select></label><label class="field">Délai souhaité *<select class="native-select" name="deadline" required><option value="">Sélectionnez une option</option><option>Moins d’un mois</option><option>Sous 30 jours</option><option>1 à 3 mois</option><option>Plus de 3 mois</option><option>Flexible</option></select></label>`);
        form.querySelector("[name=budget]").value = data.budget || "";
        form.querySelector("[name=deadline]").value = data.deadline || "";
      } else {
        form.innerHTML = frame(`<h2>Vos coordonnées</h2><div class="form-grid"><label class="field">Votre nom *<input name="name" required minlength="2" maxlength="120" autocomplete="name" value="${escapeHtml(data.name || "")}"/></label><label class="field">Votre email *<input name="email" type="email" required maxlength="254" autocomplete="email" value="${escapeHtml(data.email || "")}"/></label></div><div class="form-grid"><label class="field">Entreprise<input name="company" maxlength="160" autocomplete="organization" value="${escapeHtml(data.company || "")}"/></label><label class="field">Téléphone (facultatif)<input name="phone" type="tel" maxlength="40" autocomplete="tel" value="${escapeHtml(data.phone || "")}"/></label></div><div class="quote-summary"><span><strong>Service :</strong> ${escapeHtml(data.service)}</span><span><strong>Budget :</strong> ${escapeHtml(data.budget)}</span><span><strong>Délai :</strong> ${escapeHtml(data.deadline)}</span></div><div class="consent"><input id="quote-consent" name="consent" type="checkbox" required/><label for="quote-consent">J’accepte que ces informations soient utilisées pour traiter ma demande. <a href="/confidentialite">Politique de confidentialité</a>.</label></div>`, "Envoyer ma demande de devis");
      }
      form.querySelector("[data-back]")?.addEventListener("click", () => { saveVisibleFields(); step -= 1; render(); });
      const consent = form.querySelector('[name=consent]');
      if (consent) consent.checked = data.consent === "on";
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      saveVisibleFields();
      if (step < 3) {
        step += 1;
        render();
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = "Envoi en cours…";
      try {
        const result = await sendRequest({
          kind: "devis",
          name: data.name,
          email: data.email,
          company: data.company || "",
          phone: data.phone || "",
          service: data.service,
          subject: "",
          message: data.message,
          budget: data.budget,
          deadline: data.deadline,
          consent: data.consent === "on",
        });
        form.innerHTML = `<div class="success-panel" role="status"><h2>Votre demande de devis a bien été envoyée.</h2><p>Merci pour votre confiance. L’équipe Nexora Digital examinera votre projet et vous répondra dans les meilleurs délais.</p><p><strong>Référence : ${escapeHtml(result.reference)}</strong></p></div>${whatsapp}`;
      } catch (error) {
        status(form, "error", error.message);
        button.disabled = false;
        button.textContent = "Envoyer ma demande de devis";
      }
    });

    render();
  }

  setupMenu();
  setupContactForm();
  setupQuoteForm();
})();
