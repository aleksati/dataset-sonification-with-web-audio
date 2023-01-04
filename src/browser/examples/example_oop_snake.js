// Draw and listen to a continuos "Snake" that represents the balance and body
// of a particular coffee dispacth over the years. Uses an object oriented
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
let dot_size = 20;

let slider;
let curr_slider_val;

let owner_1 = "Kona Pacific Farmers Cooperative";
// let owner_2 = "Ethiopia Commodity Exchange";

let dot_snake_1;
// let dot_snake_2;

function setup() {
  createCanvas(canvas_width, canvas_height);
  loadData();
  setScaleFactor();
  data_x = scaleAxis(data_x, canvas_width);
  data_y = scaleAxis(data_y, canvas_height);
  loadSlider();
  loadSnakes();
}

function draw() {
  background("white");
  drawText();
  drawSnakes();
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
    "" + data.getColumn("Year").slice(0, data_size)[curr_slider_val],
    10,
    height - 60
  );

  textSize(8);
  textAlign(LEFT);
  text("Column index: " + curr_slider_val, 10, height - 40);
}

function drawSnakes() {
  let curr_owner = owners[slider.value()];
  let curr_pos = [data_x[slider.value()], data_y[slider.value()]];

  // only update/enlargen the "dot snake" when moving forward in time.
  if (slider.value() > curr_slider_val) {
    if (curr_owner === dot_snake_1.owner) dot_snake_1.updateBody(curr_pos);
  }

  curr_slider_val = slider.value();

  dot_snake_1.drawSnake();
}

function loadSlider() {
  slider = createSlider(0, data_size, 0); // min, max, value
  slider.position(10, height - 30);
  slider.style("width", "300px");
}

function loadSnakes() {
  dot_snake_1 = new Snake(owner_1, dot_size, [255, 0, 0, 0.2], "sine");
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

class Snake {
  constructor(owner, point_size, rgbColor = [], waveform) {
    this.pointSize = point_size;
    this.body = [[0, 0]]; // array of arrays
    this.color = rgbColor;
    this.owner = owner;
    this.sines = []; // array of oscillators
    this.waveform = waveform;

    this.addSound(); // init with one oscillator
  }

  addSound() {
    let sine = new p5.Oscillator(this.waveform);
    let sine_freq = this.body.length ? this.body[this.body.length - 1][1] : 0;
    sine.freq(sine_freq);
    sine.amp(0);
    sine.start();
    this.sines.push(sine);
  }

  drawSnake() {
    stroke(`rgba(${this.color})`);
    strokeWeight(this.pointSize);

    this.body.forEach((coord) => point(...coord));
    this.sines.forEach((sine) => sine.amp(1 / this.sines.length));
  }

  updateBody(newPos) {
    // if new pos and old pos are equal, do nothing.
    if (
      JSON.stringify(newPos) == JSON.stringify(this.body[this.body.length - 1])
    )
      return;

    // enlargen body at the path between oldPos and newPos
    this.interpolate(this.body[this.body.length - 1], newPos);

    // enlargen body even more
    this.body.push(newPos);

    // add sound to the new "body part"
    this.addSound();
  }

  // interpolate between new and old pos for snake body
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

      // add the interpolation with varying indexes
      this.body.push([
        intX[longest_range_axis === "x" ? i : short_i],
        intY[longest_range_axis === "y" ? i : short_i],
      ]);
    }
  }
}
