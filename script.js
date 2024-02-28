// SianaOce janv. 2023
// Representation calendrier 5x8 Orano LH avec jours feries et vacances scolaires

// Representation des cycles 5x8 sous forme de tableau
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
  "r", "r", "r", "h", "m", "a", "r",
  "n", "n", "r", "r", "r", "m", "m",
  "a", "a", "r", "n", "r", "r", "r",
  "m", "m", "a", "a", "r", "r", "r",
  "r", "r", "m", "m", "a", "n", "n",
  "r", "r", "r", "r", "m", "r", "a",
  "n", "n", "r", "r", "r", "m", "r",
  "a", "a", "n", "n", "r", "r", "r",
];

const cycle_802 = [
  "r", "m", "a", "a", "n", "r", "r", 
  "r", "r", "m", "m", "a", "n", "r", 
  "r", "r", "r", "h", "m", "a", "r", 
  "n", "n", "r", "r", "r", "m", "m",
  "a", "a", "n", "r", "r", "r", "r",
  "m", "m", "a", "r", "n", "r", "r",
  "r", "r", "m", "m", "a", "n", "n",
  "r", "r", "r", "r", "r", "a", "a", 
  "n", "n", "r", "r", "r", "r", "m", 
  "a", "a", "n", "n", "r", "r", "r",
];

// Regroupement de 5 dates de reference pour chaque équipe dans un tableau
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

// Tableau des entetes des jours de la semaine
const jour = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

// URL pour recuperer des JSON des jours feries et des vacances scolaires
let URL_joursferies = 'https://calendrier.api.gouv.fr/jours-feries/metropole.json';
let URL_vacancesscolaires = 'https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-calendrier-scolaire&q=&rows=100&sort=end_date&facet=description&facet=population&facet=start_date&facet=end_date&facet=location&facet=zones&facet=annee_scolaire&refine.location=Caen&refine.location=Normandie&disjunctive.location=true';

let jours_feries = {}
let vacances_scolaires = []

// Requetes pour recuperer en json les jours feries et les vacances scolaires
fetch(URL_joursferies)
  .then(r1 => r1.json())
  .then(r2 => {
      jours_feries = r2
  })
fetch(URL_vacancesscolaires)
  .then(r3 => r3.json())
  .then(r4 => { 
      for (var e of r4.records) {
              var dates = new Date(e.fields.start_date)
              var enddate = new Date(e.fields.end_date)
              do{
                  vacances_scolaires.push(dates.getFullYear() + "-" + twoDigit(1+dates.getMonth()) + "-" + twoDigit(dates.getDate()))
                  dates.setDate(dates.getDate()+1)
              } while (enddate > dates)
      }
  })

// Récupèration de l'année courante
var date = new Date();
var year = date.getFullYear();
document.getElementById("choice_year").innerText = year;

// Recupere l'équipe dans le stockage local navigateur si elle existe sinon mettre 2 par defaut
if (localStorage.getItem("eq_num") != null) {
  document.getElementById("choice_eq").innerText = localStorage.getItem("eq_num")
}
else{
  document.getElementById("choice_eq").innerText = "éq 2"
}

var t = new Number
// Recupere l'horaire de travail dans le stockage local navigateur si elle existe sinon mettre 100% par defaut
if (localStorage.getItem("tps") != null) {
  t = parseInt(localStorage.getItem("tps"))
}
else{
  t = 0
}

// Fonction pour mettre à jour le planning à l'année précedente
function year_moins() {
  var y = parseInt(document.getElementById("choice_year").innerText);
  if (y > year-2) {document.getElementById("choice_year").innerText = y-1}
  gen_plan()
}

// Fonction pour mettre à jour le planning à l'année suivante  
function year_plus() {
  var y = parseInt(document.getElementById("choice_year").innerText);
  if (y < year+5) {
    document.getElementById("choice_year").innerText = y+1
  }
  gen_plan()
}

// Fonction pour mettre à jour le planning avec l'équipe precedente
function eq_moins() {
  var e = parseInt(document.getElementById("choice_eq").innerText.charAt(3));
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
  var e = parseInt(document.getElementById("choice_eq").innerText.charAt(3));
  if (e < 5) {
    document.getElementById("choice_eq").innerText = "éq " + (e+1)
  }else{
    document.getElementById("choice_eq").innerText = "éq " + 1
  }
  localStorage.setItem("eq_num",document.getElementById("choice_eq").innerText)
  gen_plan()
}

// Fonction pour mettre à jour le planning avec l'horaire de travail precedent
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
  var twodigit = number >= 10 ? number : "0" + number.toString();
  return twodigit;
}

// Fonction pour generer le planning
function gen_plan() {

  // Efface les tableaux correspondant aux mois
  document.getElementById("plan").innerHTML=""

  // Met à jour l'affichage et stocke en local le "planning temps de travail" choisi
  document.getElementById("choice_tps").innerText = Tps[t]
  localStorage.setItem("tps",t)

  // Recupere dans des constantes l'année et l'équipe choisie
  const an = parseInt(document.getElementById("choice_year").innerText);
  const eq = parseInt(document.getElementById("choice_eq").innerText.charAt(3));

  // Récuperation de la date de reference du cycle pour l'équipe choisie 
  const date_ref = dates_ref[eq-1];
 

  // Boucle creation des 12 tableaux mensuelles
  for (var i = 0; i < 12; i++) {
      // Creation du tableau
      var planning = document.createElement("table")
      // Nommage du tableau mois + année
      row = document.createElement("tr");
      var entete = document.createElement("th");
      var enteteTexte = document.createTextNode(mois[i] + " " + an);
      entete.appendChild(enteteTexte);
      entete.colSpan = 7;
      
      row.appendChild(entete);
      planning.appendChild(row);
      row = document.createElement("tr");
      // Boucle de création des entetes des jours de la semaine
      for (var x = 0; x < 7; x++){
          var cell = document.createElement("td");
          cell.className = "jour_semaine";
          var cellText = document.createTextNode(jour[x]);
          cell.appendChild(cellText);
          row.appendChild(cell);
      }
      planning.appendChild(row);
      
      var date_g = new Date(Date.UTC(an, i, 1));
      var compteur_jour_semaine = 0
      var jour_semaine_france
      row = document.createElement("tr");

      // Boucle de creation des jours dans le mois
      do {
          var cell = document.createElement("td");
          
          jour_semaine_france = date_g.getDay() - 1
          if (jour_semaine_france == -1){
              jour_semaine_france = 6
          }
          if (jour_semaine_france == compteur_jour_semaine && date_g.getMonth() == i) {
              var cellText = document.createTextNode(date_g.getDate());
              cell.appendChild(cellText);
              // Verification du poste du jour (matin,AM,Nuit,HN,repos)
              var c = Math.round(((date_g - date_ref) / 1000 / 60 / 60 / 24) % 70);
              cell.className = cycle[t][c];
              
              // Mise en format AAAA-MM-DD du jour à tester
              jour_test = date_g.getFullYear() + "-" + twoDigit(1+date_g.getMonth()) + "-" + (twoDigit(date_g.getDate()))
              //Verification si le jour est ferié
              if(jour_test in jours_feries){
                cell.style.borderColor="Black"
              }
              // Verification si le jour fait partie des vacances scolaires
              if (vacances_scolaires.includes(jour_test)){
                  cell.style.borderColor="Black"
              }
                              
              date_g.setDate(date_g.getDate()+1)

          } else{
              cell.className = "v"
          }
          
          row.appendChild(cell);
          compteur_jour_semaine++
          if (compteur_jour_semaine == 7 && date_g.getMonth() == i) {
              compteur_jour_semaine = 0
              planning.appendChild(row);
              row = document.createElement("tr");
          }
      planning.appendChild(row);
      }while (!(compteur_jour_semaine == 7 && date_g.getMonth() != i))
  
  // Création pied de tableau pour compenser les differences de taille des tableaux selon les mois
  ligne_pied = document.createElement("tr");
  var cellule_pied = document.createElement("td");
  cellule_pied.className = "foot"
  cellule_pied.colSpan = 7;
  ligne_pied.appendChild(cellule_pied)
  planning.appendChild(ligne_pied)
  document.getElementById("plan").appendChild(planning)         
  }         
}

function a_propos(){
  if (document.getElementById("apropos").hidden){
    document.getElementById("apropos").hidden = false
  }
  else {
    document.getElementById("apropos").hidden = true
  }
 

}


setTimeout(() => {
  gen_plan()
},"800")
