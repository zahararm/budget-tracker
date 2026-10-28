var names = ["food", "utilities", "entertainment", "transport"];
var labels = {food: "Food", utilities: "Utilities", entertainment: "Entertainment", transport: "Transport"};

function money(n) { return "$" + Math.abs(n).toFixed(2); }
function getNum(id) {
  var v = document.getElementById(id).value;
  return v === "" ? 0 : Number(v);
}

function save() {
  try {
    var data = {income: document.getElementById("income").value};
    for (var i = 0; i < names.length; i++) data[names[i]] = document.getElementById(names[i]).value;
    localStorage.setItem("budget", JSON.stringify(data));
  } catch (e) {}
}

function load() {
  try {
    var data = JSON.parse(localStorage.getItem("budget"));
    if (data) {
      document.getElementById("income").value = data.income || "";
      for (var i = 0; i < names.length; i++) document.getElementById(names[i]).value = data[names[i]] || "";
    }
  } catch (e) {}
}

function calculate() {
  var err = document.getElementById("error");
  err.textContent = "";
  var all = ["income"].concat(names);
  for (var i = 0; i < all.length; i++) {
    var n = getNum(all[i]);
    if (isNaN(n) || n < 0) {
      err.textContent = "Enter numbers only, like 2500 or 45.50.";
      return;
    }
  }

  var income = getNum("income");
  var total = 0;
  for (var j = 0; j < names.length; j++) total += getNum(names[j]);
  var net = income - total;
  var rate = income > 0 ? (net / income) * 100 : 0;

  var big = document.getElementById("rNet");
  big.textContent = (net < 0 ? "-" : "") + money(net);
  big.className = "big" + (net < 0 ? " neg" : "");
  document.getElementById("rIncome").textContent = money(income);
  document.getElementById("rExp").textContent = money(total);
  document.getElementById("rRate").textContent = rate.toFixed(1) + "%";

  var msg = document.getElementById("msg");
  if (net < 0) {
    msg.className = "msg bad";
    msg.textContent = "You’re spending more than you earn this month. Lock in twin.";
  } else if (rate < 20) {
    msg.className = "msg ok";
    msg.textContent = "You’re saving " + rate.toFixed(1) + "%. Try to get closer to 20% or else...";
  } else {
    msg.className = "msg good";
    msg.textContent = "Nice! You’re saving more than 20% of your income. Slide me some!";
  }

  var html = "";
  for (var k = 0; k < names.length; k++) {
    var amt = getNum(names[k]);
    var pct = total > 0 ? (amt / total) * 100 : 0;
    html += "<div class='cat'><div class='top'><span>" + labels[names[k]] + "</span><span>" + money(amt) + "</span></div>" +
            "<div class='track'><div class='fill' style='width:" + pct.toFixed(1) + "%'></div></div></div>";
  }
  document.getElementById("cats").innerHTML = html;

  document.getElementById("placeholder").style.display = "none";
  document.getElementById("report").style.display = "block";
  save();
}

function downloadCsv() {
  var d = new Date();
  var y = d.getFullYear();
  var m = ("0" + (d.getMonth() + 1)).slice(-2);
  var text = "Date,Description,Amount,Category\n";
  text += y + "-" + m + "-01,Monthly Income," + getNum("income") + ",Income\n";
  text += y + "-" + m + "-02,Food,-" + getNum("food") + ",Food\n";
  text += y + "-" + m + "-03,Utilities & Bills,-" + getNum("utilities") + ",Utilities\n";
  text += y + "-" + m + "-04,Entertainment & Fun,-" + getNum("entertainment") + ",Entertainment\n";
  text += y + "-" + m + "-05,Transport & Gas,-" + getNum("transport") + ",Transport\n";
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], {type: "text/csv"}));
  a.download = "clean_ledger.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function clearAll() {
  var all = ["income"].concat(names);
  for (var i = 0; i < all.length; i++) document.getElementById(all[i]).value = "";
  document.getElementById("report").style.display = "none";
  document.getElementById("placeholder").style.display = "block";
  document.getElementById("error").textContent = "";
  save();
}

document.getElementById("go").onclick = calculate;
document.getElementById("clear").onclick = clearAll;
document.getElementById("csv").onclick = downloadCsv;
load();