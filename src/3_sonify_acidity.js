// sonify_acidity
// Use the acidity data to control the frequency of a simple oscillator

let data;
let data_cleaned; 
let carrier;
let carrier_amp = 0.4;
let carrier_waveform = "sine"
let data_scale_factor = 80;
let accumulator = 0;

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
  carrier.amp(carrier_amp); 
  
  // start oscillating
  carrier.start();
}

function setup() {
  createCanvas(800, 600);
  loadData();
  loadAudio();
}

function draw() {
  background(220);
  
  // use the acidity data to control the frequecy of our oscillator.
  carrier.freq(data_cleaned[accumulator]*data_scale_factor);
  
  
  // make sure we dont exceed the length of our data.
  if (accumulator >= data_cleaned.length) {
    accumulator = 0;  
  } else {
     accumulator += 1; 
  } 
}