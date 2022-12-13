// let us do a combination of parts 2 and 3.

let data;
let data_cleaned;
let carrier;
let carrier_amp = 0.4;
let carrier_waveform = "sine";
let data_scale_factor = 80;
let accumulator = 0;

let y_factor;
let x_factor;
let point_size = 15;

// asynchronous data loading
function preload() {
  data = loadTable("./assets/arabica_data_cleaned_year.csv", "header");
}

function loadData() {
  data_cleaned = data.getColumn("Acidity");
}

function loadAudio() {
  // create an oscillator
  carrier = new p5.Oscillator(carrier_waveform);
  carrier.amp(carrier_amp); // set amplitude
  carrier.freq(0); // set frequency
  carrier.start(); // start oscillating

  // try changing the type to 'square', 'sine' or 'triangle'
  //modulator = new p5.Oscillator('sawtooth');
  //modulator.start();

  // add the modulator's output to modulate the carrier's amplitude
  //modulator.disconnect();
  //carrier.amp(modulator);
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
  loadAudio();
  setXandYfactor();
}

function draw() {
  background("white");

  // use the acidity data to control the frequecy of our oscillator.
  carrier.freq(data_cleaned[accumulator] * data_scale_factor);

  stroke(255, 0, 255);
  strokeWeight(point_size);

  // draw single point
  let { x, y } = getXandYFromIndex(accumulator);
  point(x, y);

  // draw a consecutive line
  //for (let i=0; i<accumulator; i++) {
  //  let { x, y } = getXandYFromIndex(i);
  //  point(x, y);
  //}

  // make sure we dont exceed the length of our data.
  if (accumulator >= data_cleaned.length) {
    accumulator = 0;
  } else {
    accumulator += 1;
  }
}
