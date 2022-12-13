// Basic setup for loading and displaying data
let data;
let data_cleaned; 

// asynchronous data loading 
function preload() {
  data = loadTable("./assets/arabica_data_cleaned.csv", "header");
}

function loadData() {
  //console.log(data)
  //console.log(data.something)
  data_cleaned = data.getColumn("Acidity");
}

function setup() {
  createCanvas(400, 400);
  loadData();
}

function draw() {
  background(220);
}