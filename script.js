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



var table = document.getElementById("Plan");
var bouton = document.getElementById("btn");

document.getElementById("Date").addEventListener('change', (e) => {
  y = e.target.value
})

document.getElementById("Equipe").addEventListener('change',(e) => {
    eq = e.target.value
})

function gen_plan() {
  
  var an = new Date(y).getUTCFullYear()
  
  table.innerHTML= ""

  let tableBody = document.createElement("tbody"); 
  
  caption = document.createElement("caption");
  caption.innerHTML="Eq " + eq + " - " + an

  table.appendChild(caption)

  row = document.createElement("tr");

    for (var i = 0; i < 12; i++) {
      var entete = document.createElement("th");
      var enteteTexte = document.createTextNode(mois[i]);
      entete.appendChild(enteteTexte);
      row.appendChild(entete);
      tableBody.appendChild(row);
    }

    for (var j = 0; j < 31; j++) {
      row = document.createElement("tr");

      for (var k = 0; k < 12; k++) {
        var date_ref = new Date(Date.UTC(2018, 1, 12+7*eq));
        var date_g = new Date(Date.UTC(an, k, j+1 ));

        
        var cell = document.createElement("td");
          
        if (date_g.getDate() == j + 1) {
          var cellText = document.createTextNode(
            jour[date_g.getDay()] + " " + date_g.getDate()
          );
          cell.appendChild(cellText);
          var c = Math.round(((date_g - date_ref) / 1000 / 60 / 60 / 24) % 70);
          
          cell.className = cycle[c];
        }
        row.appendChild(cell);
      }
    
      tableBody.appendChild(row);
    }
    
    table.appendChild(tableBody);

  }
