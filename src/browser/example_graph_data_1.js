let data; // table with the raw data, sorted after time (year)
let data_size = 50; // the number of rows in our data table we want to use
let data_cleaned; // array of a table column to use for the dots

let y_factor; // scale Y to fit canvas
let x_factor; // scale X to fit canvas
let point_size = 10; // the size of the point

function setup() {
  createCanvas(600, 400);
  loadData();
  setXandYfactor();
}

function draw() {
  background("white");
  strokeWeight(point_size);
  drawText();
  drawDots();
}

/////////////// utils ////////////////

//// new in "1_graph_data.js" ////
function drawText() {
  noStroke();
  textSize(20);
  text(
    "Height of dots equals `Acidity` levels over time.",
    width / 2,
    height - 100
  );
  textAlign(CENTER);
}

function drawDots() {
  // for every column entry, create a point.
  // all points should together strech the length of the graph.
  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);
    stroke(255, 0, 0);
    point(x, y);
  }
}

function getXandYFromIndex(i) {
  let x = Math.floor(x_factor * i);
  // we do "height - y" so that the high values appear higher up in the canvas
  let y = Math.floor(height - data_cleaned[i] * y_factor);
  return { x, y };
}

function setXandYfactor() {
  // we scale the Y to 10 because the acidity values are all usually between 0 and 10.
  y_factor = height / 10;
  x_factor = width / data_cleaned.length;
}

function loadData() {
  data_cleaned = data.getColumn("Acidity");
  data_cleaned = data_cleaned.slice(0, data_size);
}

function preload() {
  // asynchronous data loading
  data = loadTable("./arabica_data_cleaned_year.csv", "header");
}
