// asynchronous data loading
let data;
// for dots
let data_cleaned;
// for the frequency of our audio
let data_cleaned_1;
// for the freqyency of our LFO
let data_cleaned_2;

let accumulator = 0;

// for the dots
let y_factor;
let x_factor;
let point_size = 10;

// something similar to a hash table that makes lookup really fast
let data_coords = {};

// store the mouse click coords
let matchCoords = [];

// audio
let sine;
let LFO;
let env;

function preload() {
  data = loadTable("./data/arabica_data_cleaned_year.csv", "header");
}

function loadData() {
  data_cleaned = data.getColumn("Acidity");
  data_cleaned = data_cleaned.slice(0, 50);

  // add another column which we will use for the sine.
  data_cleaned_1 = data.getColumn("altitude_mean_meters");
  data_cleaned_1 = data_cleaned_1.slice(0, 50);
  // clean the data a little. If altitude is 0, the freq should be 100.
  data_cleaned_1 = data_cleaned_1.map((number) => int(number) + 100);

  // add another column which we will use for the LFO.
  data_cleaned_2 = data.getColumn("Number.of.Bags");
  data_cleaned_2 = data_cleaned_2.slice(0, 50);
  // convert to number
  data_cleaned_2 = data_cleaned_2.map((string) => int(string));
}

function loadAudio(sine_amp, hasEnv = false, hasLFO = false) {
  // create an oscillator
  sine = new p5.Oscillator("sine");
  sine.amp(sine_amp);
  sine.freq(0);
  sine.start();

  if (hasLFO) {
    LFO = new p5.Oscillator("sine");
    LFO.disconnect(); // disconnect the LFO from the master output
    LFO.freq(0);
    LFO.amp(0);
    LFO.start();

    // control the amplitude of the sine with the LFO.
    sine.amp(LFO);
  }

  if (hasEnv) {
    // envolope to make it play as a note
    // set attackTime, decayTime, sustainRatio, releaseTime
    env = new p5.Env();
    env.setADSR(0.01, 0.1, 0.7, 0.7);
  }
}

function isMatch(mouseX, mouseY, object_table) {
  // we take mouse value + and - the point_size to increase chances of hitting a dot.
  let mouseX_filtered = mouseX - point_size;
  let mouseY_filtered = mouseY - point_size;
  let match = false;
  let coords = [];

  // check for x matches
  for (let x = 0; x < point_size * 2; x++) {
    if (object_table[mouseX_filtered + x]) {
      let correctX = mouseX_filtered + x;

      // if X matches, check for Y matches
      for (let y = 0; y < point_size * 2; y++) {
        if (object_table[correctX][mouseY_filtered + y]) {
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

function getXandYFromIndex(i) {
  let x = Math.floor(x_factor * i);
  let y = Math.floor(height - data_cleaned[i] * y_factor);
  return { x, y };
}

function setXandYfactor() {
  y_factor = height / 10;
  x_factor = width / data_cleaned.length;
}

function mouseClicked(mouse) {
  const { match, coords } = isMatch(mouse.x, mouse.y, data_coords);
  if (match) {
    console.log("You hit a dot!");
    console.log("x:", coords[0], "y:", coords[1]);
    matchCoords = coords;
    playAudio();
  } else {
    matchCoords = [];
  }
}

function storeDataCoords() {
  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);
    data_coords[x] = {};
    data_coords[x][y] = {};

    // I add audio paramters to this index to be retrieved when clicking
    data_coords[x][y] = {
      sine_freq: data_cleaned_1[i],
      lfo_freq: data_cleaned_2[i],
    };
  }
}
