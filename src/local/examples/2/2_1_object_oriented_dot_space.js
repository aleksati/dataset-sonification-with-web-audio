let canvas_height = 600;
let canvas_width = 800;

let data;
let data_x;
let data_y;
let data_x_y_min;
let data_x_y_max;
let data_size = 500;

let owners_array;

let dot_size = 40;

let slider;
let slider_val;

let owner_1 = "Ethiopia Commodity Exchange";
let owner_2 = "Kona Pacific Farmers Cooperative";
let owner_3 = "Exportadora de Cafe Condor S.A";

let dot_1;
let dot_2;
let dot_3;

function setup() {
  createCanvas(canvas_width, canvas_height);
  loadData();
  loadDots();
  loadSlider();
}

function draw() {
  background("white");
  drawText();
  slider_val = slider.value();
  drawDots();
}

function drawText() {
  noStroke();
  textSize(20);

  textAlign(CENTER);
  text("Body", width / 2, height - 10);

  textAlign(LEFT);
  text("Balance", 10, height / 2);

  textSize(12);
  textAlign(LEFT);
  text(
    "" + data.getColumn("Year").slice(0, data_size)[slider_val],
    10,
    height - 40
  );
}

function drawDots() {
  let currOwner = owners_array[slider_val];
  if (currOwner === dot_1.owner) dot_1.updateCurrPos(slider_val);
  if (currOwner === dot_2.owner) dot_2.updateCurrPos(slider_val);
  if (currOwner === dot_3.owner) dot_3.updateCurrPos(slider_val);

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
  dot_1 = new Dot(owner_1, data_x, data_y, dot_size, [255, 0, 0]);
  dot_2 = new Dot(owner_2, data_x, data_y, dot_size, [0, 255, 0]);
  dot_3 = new Dot(owner_3, data_x, data_y, dot_size, [0, 0, 255]);

  dot_1.scaleXandY(canvas_width, canvas_height, data_x_y_min, data_x_y_max);
  dot_2.scaleXandY(canvas_width, canvas_height, data_x_y_min, data_x_y_max);
  dot_3.scaleXandY(canvas_width, canvas_height, data_x_y_min, data_x_y_max);
}

function loadData() {
  data_x = data.getColumn("Body").slice(0, data_size); // min=6, max=9
  data_y = data.getColumn("Balance").slice(0, data_size); // min=6, max=9
  data_x_y_min = 6;
  data_x_y_max = 9;

  owners_array = data.getColumn("Owner.1").slice(0, data_size);
}

function preload() {
  // asynchronous data loading
  data = loadTable("./data/arabica_data_cleaned_year.csv", "header");
}

class Dot {
  constructor(owner, x_array, y_array, point_size, rgbColor = []) {
    this.owner = owner;
    this.scaleFactor;
    this.pointSize = point_size;
    this.xArray = x_array;
    this.yArray = y_array;
    this.currPos = [0, 0];
    this.color = rgbColor;
  }

  scaleXandY(canvas_width, canvas_height, data_min_val, data_max_val) {
    this.scaleFactor = 100 / (data_max_val - data_min_val);

    this.xArray = this.xArray.map((x) => {
      let x_zero = float(x) - data_min_val;
      let x_factor = Math.floor(this.scaleFactor * x_zero);
      let x_scaled = (canvas_width / 100) * x_factor;
      return x_scaled;
    });

    this.yArray = this.yArray.map((y) => {
      let y_zero = float(y) - data_min_val;
      let y_factor = Math.floor(this.scaleFactor * y_zero);
      let y_scaled = (canvas_height / 100) * y_factor;
      return y_scaled;
    });
  }

  drawDot() {
    stroke(this.color);
    strokeWeight(this.pointSize);
    point(...this.currPos);
  }

  updateCurrPos(slider_val) {
    this.currPos = [this.xArray[slider_val], this.yArray[slider_val]];
  }
}

// function interpolateXandY(x_scaled, y_scaled) {
//   let intX = [];
//   let intY = [];

//   for (let i = 0; i < Math.abs(x_scaled - x); i++) {
//     if (x_scaled > x) {
//       intX.push(x + i);
//     } else if (x_scaled < x) {
//       intX.push(x - i);
//     }
//   }

//   for (let i = 0; i < Math.abs(y_scaled - y); i++) {
//     if (y_scaled > y) {
//       intY.push(y + i);
//     } else if (y_scaled < y) {
//       intY.push(y - i);
//     }
//   }
// }
