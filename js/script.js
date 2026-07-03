//==================================================
// ASSISES DE PIKINE 2030
// script.js
// Partie 1 : Validation + Envoi Google Sheets
//==================================================

document.addEventListener("DOMContentLoaded", () => {

const url="https://script.google.com/macros/s/AKfycbxttuUCoYQXfBX9cq6yaMXSqvLIyy-Bzra4QaVoNConna229BhxepsK-pPcrHS2lJtm/exec";

const forms=document.querySelectorAll("form");

forms.forEach(form=>{

form.addEventListener("submit",function(e){

e.preventDefault();

let ok=true;

//==========================
// Vérification des champs
//==========================

this.querySelectorAll("[required]").forEach(champ=>{

if(champ.value.trim()===""){

champ.style.border="2px solid red";
ok=false;

}else{

champ.style.border="1px solid #cccccc";

}

});

if(!ok){

alert("Veuillez remplir tous les champs obligatoires.");

return;

}

//==========================
// Préparation des données
//==========================

const formData=new FormData(this);

let objet={};

// Champs classiques

formData.forEach((value,key)=>{

objet[key]=value;

});

//==========================
// Cases à cocher
//==========================

// Défis

objet.defis=Array.from(

this.querySelectorAll('input[name="defis"]:checked')

)

.map(el=>el.value)

.join(", ");

// Priorités

objet.priorites=Array.from(

this.querySelectorAll('input[name="priorites"]:checked')

)

.map(el=>el.value)

.join(", ");

// Sous-thèmes Contributions

objet.themes=Array.from(

this.querySelectorAll('input[name="themes"]:checked')

)

.map(el=>el.value)

.join(", ");

// Sous-thèmes Participants

objet.themesParticipant=Array.from(

this.querySelectorAll('input[name="themesParticipant"]:checked')

)

.map(el=>el.value)

.join(", ");

//==========================
// Message de chargement
//==========================

const status=document.getElementById("statusMsg");

if(status){

status.style.color="blue";
status.innerHTML="⏳ Envoi en cours...";

}

//==========================
// Envoi Apps Script
//==========================

fetch(url,{

method:"POST",

body:new URLSearchParams(objet)

})

.then(response=>response.json())

.then(rep=>{

//=====================
// Génération PDF
//=====================

genererPDF(this);

//=====================
// Message succès
//=====================

if(status){

status.style.color="green";

status.innerHTML="✅ "+(rep.message||"Enregistrement effectué.");

}

alert(rep.message||"Enregistrement effectué avec succès.");

//=====================
// Réinitialisation
//=====================

this.reset();

// Nettoyage Contributions

const tc=document.getElementById("themesContainer");

if(tc){

tc.innerHTML="Choisissez d'abord un axe stratégique.";

}

// Nettoyage Participant

const tp=document.getElementById("themesParticipant");

if(tp){

tp.innerHTML="Choisissez d'abord un axe stratégique.";

}

})

.catch(()=>{

if(status){

status.style.color="red";

status.innerHTML="❌ Erreur d'envoi.";

}

alert("Erreur d'envoi (Apps Script)");

});

});

});

});




//==================================================
// PARTIE 2
// Export PDF professionnel
//==================================================

// Bouton Export PDF
function exportPDF(formId){

    const form=document.getElementById(formId);

    if(!form){

        alert("Formulaire introuvable.");

        return;

    }

    genererPDF(form);

}



//==================================================
// Génération PDF
//==================================================

function genererPDF(form){

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    // ----------------------------
    // En-tête
    // ----------------------------

    pdf.setFont("helvetica","bold");

    pdf.setFontSize(18);

    pdf.text("ASSISES DE PIKINE 2030",105,18,{align:"center"});

    pdf.setFontSize(12);

    pdf.text("Unir les acteurs • Partager la vision • Transformer Pikine",105,26,{align:"center"});

    pdf.setDrawColor(0,102,204);

    pdf.line(15,32,195,32);

    // ----------------------------
    // Titre
    // ----------------------------

    pdf.setFontSize(15);

    pdf.text("Fiche d'inscription",15,42);

    pdf.setFontSize(11);

    pdf.setFont("helvetica","normal");

    let y=55;

    const data=new FormData(form);

    data.forEach((value,key)=>{

        // Ignore les champs vides

        if(value==="") return;

        let texte=key.replace(/_/g," ")+" : "+value;

        let lignes=pdf.splitTextToSize(texte,170);

        pdf.text(lignes,20,y);

        y+=lignes.length*7;

        if(y>270){

            pdf.addPage();

            y=20;

        }

    });

    // ----------------------------
    // Pied de page
    // ----------------------------

    y+=10;

    pdf.setDrawColor(180);

    pdf.line(15,y,195,y);

    y+=8;

    pdf.setFontSize(10);

    pdf.text("Date : "+new Date().toLocaleString(),20,y);

    y+=7;

    pdf.text("Plateforme numérique officielle des Assises de Pikine 2030",20,y);

    y+=7;

    pdf.text("Développée par Gi.Code",20,y);

    // ----------------------------
    // Nom du fichier
    // ----------------------------

    let nom="Formulaire";

    if(form.id){

        nom=form.id;

    }

    pdf.save(nom+"_"+Date.now()+".pdf");

}



// ==========================================
// CHARGEMENT DYNAMIQUE DES SOUS-THÈMES
// ==========================================

// Contribution citoyenne
function chargerThemes() {

    const axe = document.getElementById("axe").value;
    const zone = document.getElementById("themesContainer");

    afficherThemes(axe, zone, "themes");

}


// Participant
function chargerThemesParticipant() {

    const axe = document.getElementById("axeParticipant").value;
    const zone = document.getElementById("themesParticipant");

    afficherThemes(axe, zone, "themesParticipant");

}


// Diaspora
function chargerThemesDiaspora() {

    const axe = document.getElementById("axeDiaspora").value;
    const zone = document.getElementById("themesDiaspora");

    afficherThemes(axe, zone, "themesDiaspora");

}


// Contribution
function chargerThemesContribution() {

    const axe = document.getElementById("axe").value;
    const zone = document.getElementById("themesContribution");

    afficherThemes(axe, zone, "themesContribution");

}


// ==========================================
// FONCTION COMMUNE
// ==========================================

function afficherThemes(axe, zone, nomChamp) {

    const themes = {

        "1": [
            "Gouvernance territoriale",
            "Décentralisation",
            "Participation citoyenne",
            "Digitalisation de l'administration",
            "Transparence",
            "Coopération décentralisée",
            "Intercommunalité",
            "Diaspora",
            "Suivi-évaluation"
        ],

        "2": [
            "PME",
            "Commerce",
            "Industrie",
            "Artisanat",
            "Économie numérique",
            "Économie sociale et solidaire",
            "Économie bleue",
            "Entrepreneuriat",
            "Formation professionnelle",
            "Emploi des jeunes",
            "Investissements"
        ],

        "3": [
            "Urbanisme",
            "Habitat",
            "Voirie",
            "Transport",
            "Mobilité",
            "Éclairage public",
            "Espaces publics",
            "Patrimoine bâti",
            "Smart City"
        ],

        "4": [
            "Eau potable",
            "Assainissement",
            "Déchets",
            "Inondations",
            "Changements climatiques",
            "Pollution",
            "Biodiversité",
            "Reboisement",
            "Économie circulaire"
        ],

        "5": [
            "Santé",
            "Éducation",
            "Formation",
            "Nutrition",
            "Protection sociale",
            "Famille",
            "Petite enfance",
            "Handicap",
            "Personnes âgées"
        ],

        "6": [
            "Jeunesse",
            "Leadership",
            "Autonomisation des femmes",
            "Sports",
            "Loisirs",
            "Citoyenneté",
            "Prévention de la violence",
            "Inclusion"
        ],

        "7": [
            "Culture",
            "Patrimoine",
            "Artisanat",
            "Industries créatives",
            "Tourisme",
            "Événementiel",
            "Mémoire de Pikine"
        ],

        "8": [
            "Numérique",
            "Intelligence artificielle",
            "Données territoriales",
            "Open Data",
            "Wi-Fi public",
            "Services numériques",
            "Administration numérique",
            "Sécurité intelligente",
            "Innovation"
        ],

        "9": [
            "Sécurité",
            "Protection civile",
            "Gestion des catastrophes",
            "Incendies",
            "Inondations",
            "Santé publique",
            "Prévention"
        ],

        "10": [
            "Budget",
            "Fiscalité locale",
            "PPP",
            "RSE",
            "Coopération",
            "Diaspora",
            "Financements innovants",
            "Fonds verts",
            "Investissements"
        ]

    };

    if (!axe || !themes[axe]) {

        zone.innerHTML =
            "<em>Choisissez d'abord un axe stratégique.</em>";

        return;

    }

    let html = "";

    themes[axe].forEach(theme => {

        html += `
            <label>
                <input type="checkbox"
                       name="${nomChamp}"
                       value="${theme}">
                ${theme}
            </label><br>
        `;

    });

    zone.innerHTML = html;

}
