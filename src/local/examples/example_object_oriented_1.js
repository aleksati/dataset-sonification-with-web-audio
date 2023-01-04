// Create a dot space that visualizes, compares and sonifes the body and
// balance of different coffee dispaches over the years. Uses an object oriented
// method to create dots from differ coffee owners/companies.

let canvas_height = 400;
let canvas_width = 600;
let scaleFactor;

let data;
let owners;
let data_x;
let data_y;
let data_x_y_min;
let data_x_y_max;

let data_size = 200;
let dot_size = 40;

let slider;
let slider_val;

// More owner-specifc data graphing and sonification over time.
// look at relationships between data and clustering
let owner_1 = "Ethiopia Commodity Exchange";
let owner_2 = "Kona Pacific Farmers Cooperative";
let owner_3 = "Exportadora de Cafe Condor S.A";

let dot_1;
let dot_2;
let dot_3;

function setup() {
  createCanvas(canvas_width, canvas_height);
  loadData();
  setScaleFactor();
  data_x = scaleAxis(data_x, canvas_width);
  data_y = scaleAxis(data_y, canvas_height);
  loadSlider();
  loadDots();
  suspendAudioContext();
}

function draw() {
  background("white");
  drawText();
  slider_val = slider.value();
  drawDots();
}

function drawText() {
  noStroke();
  textSize(12);

  textAlign(CENTER);
  text("Body", width / 2, height - 10);

  textAlign(LEFT);
  text("Balance", 10, height / 2);

  textAlign(LEFT);
  text(
    "" + data.getColumn("Year").slice(0, data_size)[slider_val],
    10,
    height - 60
  );

  textSize(8);
  textAlign(LEFT);
  text("Column index: " + slider_val, 10, height - 40);
}

function drawDots() {
  let curr_owner = owners[slider_val];
  let curr_pos = [data_x[slider_val], data_y[slider_val]];

  if (curr_owner === dot_1.owner) dot_1.updatePos(curr_pos);
  if (curr_owner === dot_2.owner) dot_2.updatePos(curr_pos);
  if (curr_owner === dot_3.owner) dot_3.updatePos(curr_pos);

  dot_1.drawDot();
  dot_2.drawDot();
  dot_3.drawDot();
}

function loadSlider() {
  slider = createSlider(0, data_size, 0); // min, max, value
  slider.position(10, height - 30);
  slider.style("width", "300px");
}

function loadDots() {
  dot_1 = new Dot(owner_1, dot_size, [255, 0, 0]);
  dot_2 = new Dot(owner_2, dot_size, [0, 255, 0]);
  dot_3 = new Dot(owner_3, dot_size, [0, 0, 255]);
}

function scaleAxis(data_array, target_range) {
  return data_array.map((item) => {
    let item_zero = float(item) - data_x_y_min;
    let item_factor = Math.floor(scaleFactor * item_zero);
    let item_scaled = (target_range / 100) * item_factor;
    return item_scaled;
  });
}

function setScaleFactor() {
  scaleFactor = 100 / (data_x_y_max - data_x_y_min);
}

function loadData() {
  data_x = data.getColumn("Body").slice(0, data_size); // min=6, max=9
  data_y = data.getColumn("Balance").slice(0, data_size); // min=6, max=9

  data_x_y_min = 6;
  data_x_y_max = 9;

  owners = data.getColumn("Owner.1").slice(0, data_size);
}

function preload() {
  // asynchronous data loading
  data = loadTable("./arabica_data_cleaned_year.csv", "header");
}

class Dot {
  constructor(owner, point_size, rgbColor = []) {
    this.pointSize = point_size;
    this.currPos = [0, 0];
    this.color = rgbColor;
    this.owner = owner;

    this.sine;
    this.amp = 0.4;
    this.LFO;
    this.env;

    this.initSound();
  }

  makeSound() {
    this.sine.freq(this.currPos[1]);
    this.LFO.freq(this.currPos[0] / 50);

    // this.env.play(this.sine);
    // this.env.play(this.LFO);
  }

  initSound() {
    this.sine = new p5.Oscillator("sine");
    this.sine.freq(0);
    this.sine.amp(this.amp);
    this.sine.start();

    this.LFO = new p5.Oscillator("sine");
    this.LFO.amp(this.amp);
    this.LFO.freq(0);
    this.LFO.disconnect();
    this.LFO.start();

    this.sine.amp(this.LFO);

    // this.env = new p5.Env();
    // this.env.setADSR(0.01, 0.1, 0.5, 0.7);
  }

  drawDot() {
    stroke(this.color);
    strokeWeight(this.pointSize);
    point(...this.currPos);

    this.makeSound();
  }

  updatePos(newPos) {
    if (JSON.stringify(newPos) == JSON.stringify(this.currPos)) return;
    this.interpolate(this.currPos, newPos);
    this.currPos = newPos;
  }

  // simple interpolation algorithm for dot movement
  interpolate(prevPos, newPos) {
    let intX = [];
    let intY = [];

    // x
    for (let i = 0; i < Math.abs(prevPos[0] - newPos[0]); i++) {
      if (newPos[0] > prevPos[0]) {
        intX.push(prevPos[0] + i);
      } else if (newPos[0] < prevPos[0]) {
        intX.push(prevPos[0] - i);
      }
    }

    // y
    for (let i = 0; i < Math.abs(prevPos[1] - newPos[1]); i++) {
      if (newPos[1] > prevPos[1]) {
        intY.push(prevPos[1] + i);
      } else if (newPos[1] < prevPos[1]) {
        intY.push(prevPos[1] - i);
      }
    }

    if (!intX.length) intX.push(prevPos[0]);
    if (!intY.length) intY.push(prevPos[1]);

    let longest_range;
    let shortest_range;
    let longest_range_axis;

    // take the longest "route" as the default
    if (intX.length > intY.length) {
      longest_range = intX.length;
      shortest_range = intY.length;
      longest_range_axis = "x";
    } else {
      longest_range = intY.length;
      shortest_range = intX.length;
      longest_range_axis = "y";
    }

    for (let i = 0; i < longest_range; i++) {
      // longest route is from 0 to steps.
      // but the shortest route needs to be equally "long".
      // I covert the i in longest_range range to the shortest_range range.
      // i use "short i" to index the shortest axis.
      let short_i = Math.floor((i / longest_range) * shortest_range);

      // draw the interpolation with varying indexes
      stroke(this.color);
      strokeWeight(this.pointSize);
      point(
        intX[longest_range_axis === "x" ? i : short_i],
        intY[longest_range_axis === "y" ? i : short_i]
      );
    }
  }
}

/////// formalities regarding the audio context /////
function mouseClicked() {
  resumeAudioContext();
}

function suspendAudioContext() {
  getAudioContext().state === "running" ? getAudioContext().suspend() : null;
}

function resumeAudioContext() {
  getAudioContext().state === "suspended" ? getAudioContext().resume() : null;
}
