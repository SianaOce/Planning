// SianaOce janv. 2023
// Représentation calendrier 5x8 Orano LH avec jours fériés et vacances scolaires

// Représentation des cycles 5x8 sous forme de tableau 100% - 80% n°1 - 80% n°2
const cycle_100 = [
  "m", "m", "a", "a", "n", "r", "r",
  "r", "r", "m", "m", "a", "n", "n",
  "r", "r", "r", "r", "m", "a", "a",
  "n", "n", "r", "r", "r", "m", "m",
  "a", "a", "n", "n", "r", "r", "r",
  "m", "m", "a", "a", "n", "r", "r",
  "r", "r", "m", "m", "a", "n", "n",
  "r", "r", "r", "h", "m", "a", "a",
  "n", "n", "r", "r", "r", "m", "m",
  "a", "a", "n", "n", "r", "r", "r",
];
const cycle_801 = [
  "m", "m", "r", "a", "n", "r", "r",
  "r", "r", "r", "m", "a", "n", "n",
  "r", "r", "r", "r", "m", "a", "r",
  "n", "n", "r", "r", "r", "m", "m",
  "a", "a", "r", "n", "r", "r", "r",
  "m", "m", "a", "a", "r", "r", "r",
  "r", "r", "m", "m", "a", "n", "n",
  "r", "r", "r", "h", "m", "r", "a",
  "n", "n", "r", "r", "r", "m", "r",
  "a", "a", "n", "n", "r", "r", "r",
];

const cycle_802 = [
  "r", "m", "a", "a", "n", "r", "r", 
  "r", "r", "m", "m", "a", "n", "r", 
  "r", "r", "r", "r", "m", "a", "r", 
  "n", "n", "r", "r", "r", "m", "m",
  "a", "a", "n", "r", "r", "r", "r",
  "m", "m", "a", "r", "n", "r", "r",
  "r", "r", "m", "m", "a", "n", "n",
  "r", "r", "r", "h", "r", "a", "a", 
  "n", "n", "r", "r", "r", "r", "m", 
  "a", "a", "n", "n", "r", "r", "r",
];

// Regroupement de 5 dates de référence pour chaque équipe dans un tableau
const dates_ref = [ 
  new Date(Date.UTC(2022,8,26)),
  new Date(Date.UTC(2022,10,7)),
  new Date(Date.UTC(2022,9,10)),
  new Date(Date.UTC(2022,10,21)),
  new Date(Date.UTC(2022,9,24)),
];

// Regroupement des 3 cycles dans un tableau
const cycle = [
  cycle_100,
  cycle_801,
  cycle_802,
];

// Tableau de choix du temps de travail
const Tps = [
  "100%","80% n°1","80% n°2",
];

// Tableau des mois en français
const mois = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// Tableau des entêtes des jours de la semaine
const jour = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

// URL pour récupérer au format JSON des jours fériés et des vacances scolaires
let URL_joursferies = 'https://calendrier.api.gouv.fr/jours-feries/metropole.json';
let URL_vacances = 'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?limit=100&refine=location%3A%22Normandie%22'

let jours_feries = {}
let vacances_scolaires = []

// Requêtes pour récupérer en JSON les jours fériés et les vacances scolaires
fetch(URL_joursferies)
  .then(r1 => r1.json())
  .then(r2 => {
      jours_feries = r2
      gen_plan()
  })

fetch(URL_vacances)
  .then(r3 => r3.json())
  .then(r4 => { 
      for (let e of r4.results) {
              let dates = new Date(e.start_date)
              let enddate = new Date(e.end_date)
              do{
                  vacances_scolaires.push(dates.getFullYear() + "-" + twoDigit(1+dates.getMonth()) + "-" + twoDigit(dates.getDate()))
                  dates.setDate(dates.getDate()+1)
              } while (enddate > dates)
      }
      gen_plan()
  })

// Récupération de l'année courante
const date = new Date();
const year = date.getFullYear();
document.getElementById("choice_year").innerText = year.toString();

// Récupération du n° d'équipe dans le stockage local navigateur si elle existe sinon mettre 2 par défaut
if (localStorage.getItem("eq_num") != null) {
  document.getElementById("choice_eq").innerText = localStorage.getItem("eq_num")
}
else{
  document.getElementById("choice_eq").innerText = "éq 2"
}

let t = Number
// Récupération de l'horaire de travail dans le stockage local navigateur si elle existe sinon mettre 100% par défaut
if (localStorage.getItem("tps") != null) {
  t = parseInt(localStorage.getItem("tps"))
}
else{
  t = 0
}

// Fonction pour mettre à jour le planning à l'année précédente
function year_moins() {
  let y = parseInt(document.getElementById("choice_year").innerText);
  if (y > year-2) {document.getElementById("choice_year").innerText = (y-1).toString()}
  gen_plan()
}

// Fonction pour mettre à jour le planning à l'année suivante  
function year_plus() {
  let y = parseInt(document.getElementById("choice_year").innerText);
  if (y < year+5) {
    document.getElementById("choice_year").innerText = (y+1).toString()
  }
  gen_plan()
}

// Fonction pour mettre à jour le planning avec l'équipe précédente
function eq_moins() {
  let e = parseInt(document.getElementById("choice_eq").innerText.charAt(3));
  if (e > 1) {
    document.getElementById("choice_eq").innerText = "éq " + (e-1)
  }else{
    document.getElementById("choice_eq").innerText = "éq " + 5
  }
  localStorage.setItem("eq_num",document.getElementById("choice_eq").innerText)
  gen_plan()
}

// Fonction pour mettre à jour le planning avec l'équipe suivante
function eq_plus() {
  let e = parseInt(document.getElementById("choice_eq").innerText.charAt(3));
  if (e < 5) {
    document.getElementById("choice_eq").innerText = "éq " + (e+1)
  }else{
    document.getElementById("choice_eq").innerText = "éq " + 1
  }
  localStorage.setItem("eq_num",document.getElementById("choice_eq").innerText)
  gen_plan()
}

// Fonction pour mettre à jour le planning avec l'horaire de travail précédent
function tps_moins() {
  if (t > 0) {
    t=t-1
  }else{
    t=2
  }
  gen_plan()
}

// Fonction pour mettre à jour le planning avec l'horaire de travail suivant
function tps_plus() {
  if (t < 2) {
    t=t+1
  }else{
    t=0
  }
  gen_plan()
}

// Fonction pour transformer les jours et les mois en format XX (01,02,..)
function twoDigit(number) {
    return number >= 10 ? number : "0" + number.toString();
}

// Fonction pour générer le planning
function gen_plan() {

  // Efface les tableaux correspondant aux mois
  document.getElementById("plan").innerHTML=""

  // Met à jour l'affichage et stocke en local le "planning temps de travail" choisi
  document.getElementById("choice_tps").innerText = Tps[t]
  localStorage.setItem("tps",t)

  // Récupération dans des constantes de l'année et du n° de l'équipe choisie
  const an = parseInt(document.getElementById("choice_year").innerText);
  const eq = parseInt(document.getElementById("choice_eq").innerText.charAt(3));

  // Récupération de la date de référence du cycle pour l'équipe choisie
  const date_ref = dates_ref[eq-1];

  // Boucle de création des 12 tableaux mensuels
  for (let i = 0; i < 12; i++) {
      // Création du tableau
      let planning = document.createElement("table")
      // Nommage du tableau mois + année
      let row = document.createElement("tr");
      let entete = document.createElement("th");
      let enteteTexte = document.createTextNode(mois[i] + " " + an);
      entete.appendChild(enteteTexte);
      entete.colSpan = 7;
      
      row.appendChild(entete);
      planning.appendChild(row);
      row = document.createElement("tr");
      // Boucle de création des entêtes des jours de la semaine
      for (let x = 0; x < 7; x++){
          let cell = document.createElement("td");
          cell.className = "jour_semaine";
          let cellText = document.createTextNode(jour[x]);
          cell.appendChild(cellText);
          row.appendChild(cell);
      }
      planning.appendChild(row);
      
      let date_g = new Date(Date.UTC(an, i, 1));
      let compteur_jour_semaine = 0
      let jour_semaine_france
      row = document.createElement("tr");

      // Boucle de création des jours dans le mois
      do {
          // Mise en format AAAA-MM-DD du jour à tester
          let jour_test = date_g.getFullYear() + "-" + twoDigit(1+date_g.getMonth()) + "-" + (twoDigit(date_g.getDate()))
          // Création de la "cellule" représentant le jour
          let cell = document.createElement("td");
          cell.id = jour_test;
          // Ajout d'un événement
          cell.addEventListener("click", (event) => {
              cell.textContent = `${cell.id}`;
          });
          
          jour_semaine_france = date_g.getDay() - 1
          if (jour_semaine_france === -1){
              jour_semaine_france = 6
          }
          if (jour_semaine_france === compteur_jour_semaine && date_g.getMonth() === i) {
              let cellText = document.createTextNode(date_g.getDate().toString());
              cell.appendChild(cellText);
              // Vérification du poste du jour (matin, AM, Nuit, HN, repos)
              let c = Math.round(((date_g - date_ref) / 1000 / 60 / 60 / 24) % 70);
              cell.className = cycle[t][c];

              // Vérification si le jour est férié
              if(jour_test in jours_feries){
                cell.style.borderColor="Black"
              }
              // Vérification si le jour fait partie des vacances scolaires
              if (vacances_scolaires.includes(jour_test)){
                  cell.style.borderColor="Black"
              }

              date_g.setDate(date_g.getDate()+1)

          } else{
              cell.className = "v"
          }

          row.appendChild(cell);
          compteur_jour_semaine++
          if (compteur_jour_semaine === 7 && date_g.getMonth() === i) {
              compteur_jour_semaine = 0
              planning.appendChild(row);
              row = document.createElement("tr");
          }
      planning.appendChild(row);
      }while (!(compteur_jour_semaine === 7 && date_g.getMonth() !== i))
  
  // Création pied de tableau pour compenser les différences de taille des tableaux selon les mois
  let ligne_pied = document.createElement("tr");
  let cellule_pied = document.createElement("td");
  cellule_pied.className = "foot"
  cellule_pied.colSpan = 7;
  ligne_pied.appendChild(cellule_pied)
  planning.appendChild(ligne_pied)
  document.getElementById("plan").appendChild(planning)         
  }         
}

function a_propos(){
  document.getElementById("apropos").hidden = !document.getElementById("apropos").hidden;
}

gen_plan()

