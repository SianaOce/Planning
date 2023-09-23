// SianaOce janv. 2023
// Representation calendrier 5x8 Orano LH avec jours feries et vacances scolaires

// Representation du cycle 5x8 sous forme de tableau
const cycle = [
  "m", "m", "a", "a", "n", "r", "r", "r", "r",
  "m", "m", "a", "n", "n", "r", "r", "r", "h",
  "m", "a", "a", "n", "n", "r", "r", "r",
  "m", "m", "a", "a", "n", "n", "r", "r", "r",
  "m", "m", "a", "a", "n", "r", "r", "r", "r",
  "m", "m", "a", "n", "n", "r", "r", "r", "r", 
  "m", "a", "a", "n", "n", "r", "r", "r",
  "m", "m", "a", "a", "n", "n", "r", "r", "r",
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
  document.getElementById("choice_eq").innerText = 2
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
  var e = parseInt(document.getElementById("choice_eq").innerText);
  if (e > 1) {
    document.getElementById("choice_eq").innerText = e-1
  }else{
    document.getElementById("choice_eq").innerText = 5
  }
  localStorage.setItem("eq_num",document.getElementById("choice_eq").innerText)
  gen_plan()
}

// Fonction pour mettre à jour le planning avec l'équipe suivante
function eq_plus() {
  var e = parseInt(document.getElementById("choice_eq").innerText);
  if (e < 5) {
    document.getElementById("choice_eq").innerText = e+1
  }else{
    document.getElementById("choice_eq").innerText = 1
  }
  localStorage.setItem("eq_num",document.getElementById("choice_eq").innerText)
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

  // Recupere dans des constantes l'année et l'équipe choisie
  const an = parseInt(document.getElementById("choice_year").innerText);
  const eq = parseInt(document.getElementById("choice_eq").innerText);

  // Calcul la date de reference du cycle pour l'équipe choisie 
  const date_ref = new Date(Date.UTC(2018, 1, 12+42*eq));

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
              cell.className = cycle[c];
              
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

setTimeout(() => {
  gen_plan()
},"800")
