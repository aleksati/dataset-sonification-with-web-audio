// plot data points over time
// dynamic and multi-dimentional data
// Also, sonfication of this data

let canvas;
let wrapper;
let wrapperID = "vrtx-person-main-content-wrapper";
//let wrapperID = "synth-holder"; // for development
let parentID = "synth-holder";

let data; // table with the raw data
let data_size = 1000; // the number of rows in our data table we want to use
let data_cleaned; //a column of data
let data_cleaned_2;
let data_cleaned_3;
let data_cleaned_4;

let accumulator = 0; // a number used to keep track of every draw() loop.

let y_factor; // scale Y to fit canvas
let x_factor; // scale X to fit canvas
let point_size = 10; // the size of the point

let sine;

function setup() {
  // setup canvas
  wrapper = document.getElementById(wrapperID);
  parent = document.getElementById(parentID);
  canvasWidth = wrapper.offsetWidth;
  canvas = createCanvas(canvasWidth, 400);
  canvas.mouseClicked(handleClick);
  canvas.parent(parentID);

  loadData();
  setXandYfactor();
  getAudioContext().suspend();
  loadAudio(0.5);
}

function draw() {
  background("white");
  drawText();
  drawDots();
  playAudio();
  incrementAccumulator();
}

// utils
// new in "uio-page version". handle the audioContext
function handleClick() {
  getAudioContext().state === "suspended"
    ? getAudioContext().resume()
    : getAudioContext().suspend();
}

// new in "template_3.js"
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

// new in "template_2.js"
function drawText() {
  noStroke();
  textSize(20);
  text("Red-ness equals the amount of bags.", width / 2, height - 100);
  text("Size of dot equals the month of the year.", width / 2, height - 60);
  text(
    "Height of dot equals `Acidity` levels over time.",
    width / 2,
    height - 20
  );
  textAlign(CENTER);
}

function drawDots() {
  // draw a line that gets bigger with every draw() loop
  for (let i = 0; i < accumulator; i++) {
    let { x, y } = getXandYFromIndex(i);

    strokeWeight(data_cleaned_2[i]);
    stroke(data_cleaned_3[i], 0, 0);
    point(x, y);
  }

  noStroke();
  textSize(12);
  let { x } = getXandYFromIndex(accumulator);
  text(data_cleaned_4[accumulator], x, height - 200);
}

function incrementAccumulator() {
  // Makes sure we dont exceed the length(index range) of our data.
  if (accumulator >= data_cleaned.length) {
    accumulator = 0;
  } else {
    accumulator += 1;
  }
}

function loadData() {
  data_cleaned = data.getColumn("Acidity");
  data_cleaned = data_cleaned.slice(0, data_size);

  data_cleaned_2 = data.getColumn("Month");
  data_cleaned_2 = data_cleaned_2.slice(0, data_size);

  data_cleaned_3 = data.getColumn("Number.of.Bags");
  data_cleaned_3 = data_cleaned_3.slice(0, data_size);

  data_cleaned_4 = data.getColumn("Year");
  data_cleaned_4 = data_cleaned_4.slice(0, data_size);
}

// new in "template_1.js"
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

function preload() {
  // asynchronous data loading
  data = loadTable("./app/arabica_data_cleaned_year.csv", "header");
}
