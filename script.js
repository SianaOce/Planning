var cycle = [
  "m", "m", "a", "a", "n", "r", "r", "r", "r",
  "m", "m", "a", "n", "n", "r", "r", "r", "h",
  "m", "a", "a", "n", "n", "r", "r", "r",
  "m", "m", "a", "a", "n", "n", "r", "r", "r",
  "m", "m", "a", "a", "n", "r", "r", "r", "r",
  "m", "m", "a", "n", "n", "r", "r", "r", "r", 
  "m", "a", "a", "n", "n", "r", "r", "r",
  "m", "m", "a", "a", "n", "n", "r", "r", "r",
];

var mois = [
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

var jour = ["D", "L", "M", "M", "J", "V", "S"];

var annee_select = document.querySelector("#annee")

  // On récupère l'année courante
  var date = new Date();
  var year = date.getFullYear();

  // On ajoute l'année courante et les 100 années à venir
  // dans l'élément <select> pour l'année
  for(var i = 0; i <= 20; i++) {
    var option = document.createElement('option');
    option.textContent = year+i;
    console.log(option)
    annee_select.appendChild(option);
  }

function gen_plan() {

  document.getElementById("plan").innerHTML=""

  const eq = document.querySelector('#equipe').value;
  const an = document.querySelector('#annee').value;
  const mois_c = document.querySelector('#mois').value;

  document.getElementById("Titre").innerHTML="Eq " + eq + " - " + an

    for (var i = 0; i < 12; i++) {
      var planning = document.createElement("table")
      row = document.createElement("tr");
      var entete = document.createElement("th");
      var enteteTexte = document.createTextNode(mois[i]);
      entete.appendChild(enteteTexte);
      row.appendChild(entete);
      planning.appendChild(row);

      for (var j = 0; j < 31; j++) {
        row = document.createElement("tr");
        
          var date_ref = new Date(Date.UTC(2018, 1, 12+7*eq));
          var date_g = new Date(Date.UTC(an, i, j+1 ));
          
          var cell = document.createElement("td");
            
          if (date_g.getDate() == j + 1) {
            var cellText = document.createTextNode(
              jour[date_g.getDay()] + " " + date_g.getDate()
            );
            cell.appendChild(cellText);
            var c = Math.round(((date_g - date_ref) / 1000 / 60 / 60 / 24) % 70);
            
            cell.className = cycle[c];
          } else{
                   
            cell.className = "v"}
          row.appendChild(cell);

        planning.appendChild(row);
      }

        document.getElementById("plan").appendChild(planning)       

    }
    
  }
