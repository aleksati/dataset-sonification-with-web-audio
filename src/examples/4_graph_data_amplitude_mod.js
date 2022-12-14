let data; // table with the raw data, sorted after time (year)
let data_size = 50; // the number of rows in our data table we want to use
let data_cleaned; // array of a table column to use for the dots
let data_cleaned_1; // array of a table column we use for the frequency of our sine
let data_cleaned_2; // array of a table column we use for the frequency of our LFO

let y_factor; // scale Y to fit canvas
let x_factor; // scale X to fit canvas
let point_size = 10; // the size of the point

let data_coords = {}; // an object table used to store the x and y of every data dot
let match_coords = []; // store the current x and y of the user mouse click

let sine; // our sine wave oscillator
let env; // our envelope so we can play the sine as a note
let LFO; // our LFO that we use to control the amplitude of the sine

function setup() {
  createCanvas(800, 600);
  loadData();
  setXandYfactor();
  storeDataCoords();
  loadAudio(0.5, true);
  suspendAudioContext();
}

function draw() {
  background("white");
  strokeWeight(point_size);
  drawText();
  drawDots();
}

/////////////// utils ////////////////

//// new in "4_graph_data_amplitude_mod.js" ////

function drawText() {
  noStroke();
  textSize(30);
  text(
    "Height of dot equals coffee `Acidity` levels over time.",
    width / 2,
    height - 200
  );

  text(
    "Freq of sine (when clicked) equals the farm `Altitude`.",
    width / 2,
    height - 150
  );

  text(
    "Freq of LFO (when clicked) equals the `Number og bags`.",
    width / 2,
    height - 100
  );

  textAlign(CENTER);
}

function playAudio() {
  // when this function is called, we know there is a match. Therefore, we can
  // get the frequency from my data_coords nested structure with the match_coords
  // variable.

  // Then, we can set the sine frequency with this value, and use the env to play the note.
  // And, we set the lfo frequency,  and use the env to play the note.
  const { sine_freq, lfo_freq } = data_coords[match_coords[0]][match_coords[1]];

  sine.freq(sine_freq);
  LFO.freq(lfo_freq);

  env.play(sine);
  env.play(LFO);
}

function loadAudio(sine_amp) {
  // create an oscillator
  sine = new p5.Oscillator("sine");
  sine.amp(sine_amp);
  sine.freq(0);
  sine.start();

  // create an lfo
  LFO = new p5.Oscillator("sawtooth"); // experiment with "triangle", "square" and "sawtooth"
  LFO.disconnect(); // disconnect the LFO from the master output
  LFO.freq(0);
  LFO.amp(0);
  LFO.start();

  // set is up so that the LFO controls the amplitude of the sine wave oscillator.
  sine.amp(LFO);

  // envolope to make it play as a note
  // set attackTime, decayTime, sustainRatio, releaseTime
  env = new p5.Env();
  env.setADSR(0.01, 0.1, 0.7, 0.7);
}

function storeDataCoords() {
  // Here we store every x and y coord of our data into an object table, a nested structure.
  // later, in the isMatch function, we will use this nested object to quickly identify dots
  // in the canvas.

  // We also assign a frequency to every dot in this structure.

  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);
    data_coords[x] = {};
    data_coords[x][y] = {};
    data_coords[x][y] = {
      sine_freq: data_cleaned_1[i],
      lfo_freq: data_cleaned_2[i],
    };
  }
}

function loadData() {
  data_cleaned = data.getColumn("Acidity");
  data_cleaned = data_cleaned.slice(0, data_size);

  // add another column to use for the freq of our sine.
  data_cleaned_1 = data.getColumn("altitude_mean_meters");
  data_cleaned_1 = data_cleaned_1.slice(0, data_size);
  // clean the data a little. If altitude is 0, the freq should be 100.
  data_cleaned_1 = data_cleaned_1.map((number) => int(number) + 100);

  // add another column to use for the freq of our lfo.
  data_cleaned_2 = data.getColumn("Number.of.Bags");
  data_cleaned_2 = data_cleaned_2.slice(0, 50);
  // clean the data a little. Convert to numbers from string
  data_cleaned_2 = data_cleaned_2.map((string) => int(string));
}

/// new in "3_graph_data_sonify_click.js" ////

function drawDots() {
  // if the user has clicked a dot, we color the dot a different color
  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);
    if (x == match_coords[0] && y == match_coords[1]) {
      stroke(0, 255, 0);
    } else {
      stroke(255, 0, 0);
    }
    point(x, y);
  }
}

function isMatch(mouseX, mouseY, object_table) {
  // this is our simple matching algorithm, testing whether a mouse click (mouseX
  // and mouseY) matches any of the dots on the canvas (object_table).

  // we take mouse values and add and subtract the point_size to increase "hit target".
  let mouseX_filtered = mouseX - point_size;
  let mouseY_filtered = mouseY - point_size;
  let match = false;
  let coords = [];

  // First, check the object_table for matches along the x-axis with all the
  // x-values in our increased "hit target". If no x-matches, we simply return.
  for (let x = 0; x < point_size * 2; x++) {
    if (object_table[mouseX_filtered + x]) {
      let correctX = mouseX_filtered + x;

      // Seoncond, if we find an x-match, check the object_table for matches
      // along the y-axis with all the y-values in our increased "hit target".
      // If no x-matches, we return.
      for (let y = 0; y < point_size * 2; y++) {
        if (object_table[correctX][mouseY_filtered + y]) {
          let correctY = mouseY_filtered + y;
          match = true;
          coords = [correctX, correctY];

          // return a boolean representing if there is a hit or not, and
          // the coordates of the hit.
          return { match, coords };
        }
      }
    }
  }
  return { match, coords };
}

function mouseClicked(mouse) {
  resumeAudioContext();

  // if the user clicks a dot, we update the match_coords variable.
  const { match, coords } = isMatch(mouse.x, mouse.y, data_coords);
  if (match) {
    console.log("You hit a dot!");
    console.log("x:", coords[0], "y:", coords[1]);
    match_coords = coords;
    playAudio();
  } else {
    match_coords = [];
  }
}

//// new in "2_graph_data_sonify" ////

function suspendAudioContext() {
  getAudioContext().state === "running" ? getAudioContext().suspend() : null;
}

function resumeAudioContext() {
  getAudioContext().state === "suspended" ? getAudioContext().resume() : null;
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

function preload() {
  // asynchronous data loading
  data = loadTable("./data/arabica_data_cleaned_year.csv", "header");
}
