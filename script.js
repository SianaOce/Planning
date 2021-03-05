var cycle = [
  "m", "m", "a", "a", "n", "r", "r", "r", "r",
  "m", "m", "a", "n", "n", "r", "r", "r",
  "h", "m", "a", "a", "n", "n", "r", "r", "r",
  "m", "m", "a", "a", "n", "n", "r", "r", "r",
];

var mois = [
  "Jan",
  "Fév",
  "Mars",
  "Avr",
  "Mai",
  "Juin",
  "Jui",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

var jour = ["L", "M", "M", "J", "V", "S", "D"];

let date_ref = new Date(Date.UTC(2018, 1, 11));


function gen_plan() {
  var div = document.getElementById("Planning");

  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

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
      var date_g = new Date(Date.UTC(2021, k, j + 1));

      var cell = document.createElement("td");

      if (date_g.getDate() == j + 1) {
        var cellText = document.createTextNode(
          jour[date_g.getDay()] +" " + date_g.getDate()
        );
        cell.appendChild(cellText);
        var c = Math.round(((date_g - date_ref) / 1000 / 60 / 60 / 24) % 35);

        
        cell.className = cycle[c];
      }
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }

  table.appendChild(tableBody);
  div.appendChild(table);
}
