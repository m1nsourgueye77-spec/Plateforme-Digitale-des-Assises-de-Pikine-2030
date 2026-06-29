document.addEventListener("DOMContentLoaded", () => {

    const url = "https://script.google.com/macros/s/AKfycbwcdJSOB-BkoukphJM9tR1AtN9gPNionuu0lttqF4YSDtomjPW16XOBSBFPPrhs42rc/exec";

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            let ok = true;

            this.querySelectorAll("[required]").forEach(champ => {

                if (champ.value.trim() === "") {
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

            const formData = new FormData(this);
            let objet = {};

            formData.forEach((v, k) => objet[k] = v);

            fetch(url, {
                method: "POST",
                body: new URLSearchParams(objet)
            })
            .then(r => r.json())
            .then(rep => {

                // Génération automatique du PDF après l'envoi
                genererPDF(this);

                alert(rep.message || "Envoi réussi !");
                this.reset();

            })
            .catch(() => {

                alert("Erreur d'envoi (Apps Script)");

            });

        });

    });

});


// ===============================
// Bouton Export PDF
// ===============================
function exportPDF(formId) {

    const form = document.getElementById(formId);

    if (!form) {
        alert("Formulaire introuvable.");
        return;
    }

    genererPDF(form);

}


// ===============================
// Génération du PDF
// ===============================
function genererPDF(form) {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("ASSISES DE PIKINE 2030", 20, 20);

    pdf.setFontSize(14);
    pdf.text("Fiche d'inscription", 20, 30);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    let y = 45;

    const data = new FormData(form);

    data.forEach((value, key) => {

        let texte = key + " : " + value;

        let lignes = pdf.splitTextToSize(texte, 170);

        pdf.text(lignes, 20, y);

        y += lignes.length * 7;

        if (y > 270) {
            pdf.addPage();
            y = 20;
        }

    });

    pdf.text("Date : " + new Date().toLocaleString(), 20, y + 10);

    pdf.save("Assises_Pikine_2030.pdf");

}
