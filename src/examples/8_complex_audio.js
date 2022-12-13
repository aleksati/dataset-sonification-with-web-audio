let data;
// for dots
let data_cleaned;
// for the opcaity
let data_cleaned_1;
// for audio
let data_cleaned_2;

let y_factor;
let x_factor;
let point_size = 10;

// something similar to a hash table that makes lookup really fast
let data_coords = {};
let matchCoords = [];

// audio
let sine;
let env;

function setup() {
  createCanvas(800, 600);
  loadData();
  loadAudio();
  setXandYfactor();
  storeDataCoords();
}

function draw() {
  background("white");
  strokeWeight(point_size);
  drawText();

  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);

    if (x == matchCoords[0] && y == matchCoords[1]) {
      let { alpha } = getAlphaFromIndex(i);
      stroke(0, 0, 0);
      stroke(`rgba(0,255,0,${alpha})`);
    } else {
      stroke(`rgba(255,0,0,1)`);
    }

    point(x, y);
  }
}

// asynchronous data loading
function preload() {
  data = loadTable("./data/arabica_data_cleaned_year.csv", "header");
}

function loadData() {
  data_cleaned = data.getColumn("Acidity");
  data_cleaned = data_cleaned.slice(0, 50);

  // add another column which we will use for color.
  data_cleaned_1 = data.getColumn("Number.of.Bags");
  data_cleaned_1 = data_cleaned_1.slice(0, 50);

  // add another column which we will use for the "length" of the audio
  data_cleaned_2 = data.getColumn("Flavor");
  data_cleaned_2 = data_cleaned_2.slice(0, 50);
}

function loadAudio() {
  sine = new p5.Oscillator("sine");
  sine.freq(100);
  sine.amp(0);
  sine.start();

  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator("sine");
  modulator.start();
  modulator.amp(0);

  // add the modulator's output to modulate the carrier's amplitude
  modulator.disconnect();
  sine.freq(modulator);

  // envolope!
  env = new p5.Env();
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

function storeDataCoords() {
  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);
    data_coords[x] = {};
    data_coords[x][y] = {};

    // I add audio paramters to this index to be retrieved when clicking
    data_coords[x][y] = { audio: data_cleaned_2[i] };
  }
}

function isMatch(mouseX, mouseY, targetCoords) {
  // we take mouse value + and - the point_size to increase chances of hitting a dot.
  let mouseX_filtered = mouseX - point_size;
  let mouseY_filtered = mouseY - point_size;
  let match = false;
  let coords = [];

  // check for x matches
  for (let x = 0; x < point_size * 2; x++) {
    if (targetCoords[mouseX_filtered + x]) {
      let correctX = mouseX_filtered + x;

      // if X matches, check for Y matches
      for (let y = 0; y < point_size * 2; y++) {
        if (targetCoords[correctX][mouseY_filtered + y]) {
          let correctY = mouseY_filtered + y;
          match = true;
          coords = [correctX, correctY];

          return { match, coords };
        }
      }
    }
  }
  return { match, coords };
}

function getAlphaFromIndex(i) {
  // find the heightest value for normalization.
  // now i just hard code the value:
  let max = 300;

  // normalize value;
  let alpha = (1 / max) * data_cleaned_1[i];
  return { alpha };
}

function playAudio() {
  // get the machingCoords audio data
  let { audio } = data_coords[matchCoords[0]][matchCoords[1]];

  // apply some simple scaling
  let scaledAudio = (1 / 10) * audio;
  // set attackTime, decayTime, sustainRatio, releaseTime
  env.setADSR(0.001, 0.1, scaledAudio, scaledAudio);

  modulator.freq(60);

  // play it
  env.play(sine);
}

function mouseClicked(mouse) {
  const { match, coords } = isMatch(mouse.x, mouse.y, data_coords);
  if (match) {
    matchCoords = coords;
    playAudio();
  } else {
    matchCoords = [];
  }
}

function drawText() {
  noStroke();
  textSize(30);
  text(
    "Height of dot equals `Acidity` levels over time.",
    width / 2,
    height - 200
  );

  text(
    "Dot opacity (when clicked) equals `number of coffee bags`.",
    width / 2,
    height - 150
  );

  text(
    "Length of tone (when clicked) equals the `Flavor`.",
    width / 2,
    height - 100
  );

  textAlign(CENTER);
}
