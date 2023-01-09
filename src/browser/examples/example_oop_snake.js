// Draw and listen to a continuous "Snake" that represents the balance and body
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

let data_size = 50;
let dot_size = 20;

let slider;
let curr_slider_val;

let owner_1 = "Kona Pacific Farmers Cooperative";
let owner_2 = "Eiopia Commodity Exchange";

let dot_snake_1;
let dot_snake_2;

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
    "" + data.getColumn("Year").slice(0, data_size + 1)[curr_slider_val],
    10,
    height - 60
  );

  textSize(8);
  textAlign(LEFT);
  text("Column index: " + curr_slider_val, 10, height - 40);
}

function drawSnakes() {
  dot_snake_1.drawSnake();
  dot_snake_2.drawSnake();

  // we dont need to go further if the slider hasnt moved.
  let sliderval = slider.value();
  if (sliderval === curr_slider_val) return;

  let curr_owner = owners[slider.value()];
  let curr_pos = [data_x[slider.value()], data_y[slider.value()]];

  // add body part to snake
  if (sliderval > curr_slider_val) {
    if (curr_owner === dot_snake_1.owner)
      dot_snake_1.addToBody(curr_pos, sliderval);
    if (curr_owner === dot_snake_2.owner)
      dot_snake_2.addToBody(curr_pos, sliderval);
  }

  // remove body part from snake
  if (sliderval < curr_slider_val) {
    if (curr_owner === dot_snake_1.owner) dot_snake_1.removeFromBody(sliderval);
    if (curr_owner === dot_snake_2.owner) dot_snake_2.removeFromBody(sliderval);
  }

  curr_slider_val = sliderval;
}

function loadSlider() {
  slider = createSlider(0, data_size, 0); // min, max, value
  slider.position(10, height - 30);
  slider.style("width", "200px");
}

function loadSnakes() {
  dot_snake_1 = new Snake(owner_1, dot_size, "sine", [255, 0, 0, 0.2]);
  dot_snake_2 = new Snake(owner_2, dot_size, "sawtooth", [0, 255, 0, 0.2]);
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
  constructor(owner, point_size, waveform, rgbColor = []) {
    this.pointSize = point_size;
    this.body = []; // array of arrays. [x, y, sliderval]
    this.color = rgbColor;
    this.owner = owner;
    this.sines = []; // array of oscillators
    this.waveform = waveform;
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

    // interpolate between each x and y in the body.
    this.body.forEach((curr, index, body) => {
      if (index === 0) return point(...curr);
      this.interpolate([curr[0], curr[1]], body[index - 1]);
    });

    this.sines.forEach((sine) => sine.amp(1 / this.sines.length));
  }

  addToBody(newPos, sliderval) {
    // add new body part and sine wave
    this.body.push([...newPos, sliderval]);
    this.addSound();
  }

  removeFromBody(sliderval) {
    // remove last element from body and sines.

    // get only the slidervals that I have stored with the dot coordinates
    let bodySliderVals = this.body.reduce(
      (accum, curr) => [...accum, curr[2]],
      []
    );
    // remove everything that is greater then the current sliderval
    let bodySliderValsFiltered = bodySliderVals.filter(
      (val) => val < sliderval
    );

    // use this filtered array to remove sines and bodyparts above a certian threshold.
    this.body = this.body.slice(0, bodySliderValsFiltered.length - 1);

    this.sines.forEach((sine, index) =>
      index >= bodySliderValsFiltered.length - 1 ? sine.stop() : null
    );
    this.sines = this.sines.slice(0, bodySliderValsFiltered.length - 1);
  }

  // interpolate (draw) points between new and old pos in snake body
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
      point(
        intX[longest_range_axis === "x" ? i : short_i],
        intY[longest_range_axis === "y" ? i : short_i]
      );
    }
  }
}
