// graph_acidity
// Make a simple XY plot where the harvest year is on the X-axis and the acidity score of the coffee is on the Y-axis.

let data;
let data_cleaned;
let y_factor;
let x_factor;
let point_size = 3;

// asynchronous data loading
function preload() {
  data = loadTable("./assets/arabica_data_cleaned_year.csv", "header");
}

function loadData() {
  //console.log(data)
  //console.log(data.getColumn("Year"))
  data_cleaned = data.getColumn("Acidity");
}

function setXandYfactor() {
  y_factor = height / 10;
  x_factor = width / data_cleaned.length;
}

function getXandYFromIndex(i) {
  let x = Math.floor(x_factor * i);
  let y = Math.floor(height - data_cleaned[i] * y_factor);
  return { x, y };
}

function setup() {
  createCanvas(800, 600);
  loadData();
  setXandYfactor();
}

function draw() {
  background("white");

  stroke(255, 0, 255);
  strokeWeight(point_size);

  // for every column entry, create a point.
  // all points should together strech the length of the graph.
  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);
    point(x, y);
  }
}
