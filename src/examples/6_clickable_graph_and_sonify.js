let data;
// for dots
let data_cleaned;
// for the frequency of our audio
let data_cleaned_1;

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
      stroke(0, 255, 0);
    } else {
      stroke(255, 0, 0);
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

  // add another column which we will use for the LFO.
  data_cleaned_1 = data.getColumn("altitude_mean_meters");
  data_cleaned_1 = data_cleaned_1.slice(0, 50);
  // clean the data a little. IF altitude is 0, the freq should be 100.
  data_cleaned_1 = data_cleaned_1.map((number) => int(number) + 100);
}

function loadAudio() {
  // sine carrier
  sine = new p5.Oscillator("sine");
  sine.freq(0);
  sine.amp(0.5);
  sine.start();

  // envolope to make it play as a note
  // set attackTime, decayTime, sustainRatio, releaseTime
  env = new p5.Env();
  env.setADSR(0.01, 0.1, 0.7, 0.7);
}

function playAudio() {
  // get the machingCoords audio data
  // set the frequency of the sine
  // play it
  const { sine_freq } = data_coords[matchCoords[0]][matchCoords[1]];
  sine.freq(int(sine_freq));
  env.play(sine);
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
    data_coords[x][y] = { sine_freq: data_cleaned_1[i] };
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
    "Height of dot equals coffee `Acidity` levels over time.",
    width / 2,
    height - 150
  );

  text(
    "Freq of sine (when clicked) equals the farm `Altitude`.",
    width / 2,
    height - 100
  );

  textAlign(CENTER);
}
