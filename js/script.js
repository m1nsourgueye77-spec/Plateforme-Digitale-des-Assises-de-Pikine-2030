document.addEventListener("DOMContentLoaded", () => {

  const url = "https://script.google.com/macros/s/AKfycbwcdJSOB-BkoukphJM9tR1AtN9gPNionuu0lttqF4YSDtomjPW16XOBSBFPPrhs42rc/exec"; // 👈 remplace ici par ton lien Apps Script

  const forms = document.querySelectorAll("form");

  forms.forEach(form => {

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let ok = true;

      // 🔴 validation des champs requis
      this.querySelectorAll("[required]").forEach(champ => {
        if (champ.value.trim() == "") {
          champ.style.border = "2px solid red";
          ok = false;
        } else {
          champ.style.border = "1px solid #ccc";
        }
      });

      if (!ok) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      // ✅ préparation des données
      const formData = new FormData(this);
      let objet = {};

      formData.forEach((v, k) => objet[k] = v);

      // 🚀 envoi vers Google Sheets (Apps Script)
      fetch(url, {
        method: "POST",
        body: JSON.stringify(objet),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(r => r.json())
      .then(rep => {
        alert(rep.message || "Envoi réussi !");
        this.reset();
      })
      .catch(() => {
        alert("Erreur d'envoi.");
      });

    });

  });

});