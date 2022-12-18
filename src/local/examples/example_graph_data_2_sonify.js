let data; // table with the raw data, sorted after time (year)
let data_size = 50; // the number of rows in our data table we want to use
let data_cleaned; // array of a table column to use for the dots AND frequency of our sine

let accumulator = 0; // a number used to keep track of every draw() loop.

let y_factor; // scale Y to fit canvas
let x_factor; // scale X to fit canvas
let point_size = 10; // the size of the point

let sine; // our sine wave oscillator

function setup() {
  createCanvas(800, 600);
  loadData();
  setXandYfactor();
  loadAudio(0.5);
  suspendAudioContext();
}

function draw() {
  background("white");
  strokeWeight(point_size);
  drawText();
  drawDots();
  playAudio();

  // Make sure we dont exceed the length(index range) of our data.
  if (accumulator >= data_cleaned.length) {
    accumulator = 0;
  } else {
    accumulator += 1;
  }
}

/////////////// utils ////////////////

//// new in "2_graph_data_sonify" ////

function drawText() {
  noStroke();
  textSize(30);
  text(
    "Freq and height of dot equals `Acidity` levels over time.",
    width / 2,
    height - 100
  );
  textAlign(CENTER);
}

function mouseClicked() {
  resumeAudioContext();
}

function suspendAudioContext() {
  getAudioContext().state === "running" ? getAudioContext().suspend() : null;
}

function resumeAudioContext() {
  getAudioContext().state === "suspended" ? getAudioContext().resume() : null;
}

function drawDots() {
  // draw single point travelling across screen
  // let { x, y } = getXandYFromIndex(accumulator);
  // stroke(255, 0, 255);
  // point(x, y);

  // draw a line that gets bigger with every draw() loop
  for (let i = 0; i < accumulator; i++) {
    let { x, y } = getXandYFromIndex(i);
    stroke(255, 0, 255);
    point(x, y);
  }
}

function loadAudio(sine_amp) {
  // create an oscillator
  sine = new p5.Oscillator("sine");
  sine.amp(sine_amp);
  sine.freq(0);
  sine.start();
}

function playAudio() {
  // use the data to control the frequecy of the oscillator.
  sine.freq(data_cleaned[accumulator] * 80);
}

//// new in "1_graph_data.js" ////

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
  data = loadTable("./local/data/arabica_data_cleaned_year.csv", "header");
}
