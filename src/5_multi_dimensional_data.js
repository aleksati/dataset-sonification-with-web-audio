// graph_acidity
// Make a simple XY plot where the harvest year is on the X-axis and the acidity score of the coffee is on the Y-axis.

let data;
let data_cleaned;
let y_factor;
let x_factor;
let point_size = 8;

// something similar to a hash table
// makes lookup really fast
let data_coords = {};

// the area around each dot we accept as a "hit"
let wiggle_room = 5;

// asynchronous data loading
function preload() {
  data = loadTable("./assets/arabica_data_cleaned_year.csv", "header");
}

function loadData() {
  data_cleaned = data.getColumn("Acidity");
  // limit our dataset a little bbit
  data_cleaned = data_cleaned.slice(0, 50);
}

function storeDataCoords() {
  y_factor = height / 10;
  x_factor = width / data_cleaned.length;

  for (i = 1; i < data_cleaned.length; i++) {
    x = Math.floor(x_factor * i);
    y = Math.floor(height - data_cleaned[i] * y_factor);

    // we know that X will always be different. for every i
    data_coords[x] = y;
  }
}

function setup() {
  createCanvas(800, 600);
  loadData();
  storeDataCoords();
}

function isMatch(mouseX, mouseY, targetCoords) {
  // we do mouse value + and - the wiggle_room.
  let mouseX_filtered = mouseX - wiggle_room;
  let mouseY_filtered = mouseY - wiggle_room;
  let match = false;
  let vals = [];

  //   console.log("org x and y: ", mouseX, mouseY);
  //   console.log("first coord:", targetCoords);

  // check for x matches
  for (let x = 0; x < wiggle_room * 2; x++) {
    if (targetCoords[mouseX_filtered + x]) {
      let correctX = mouseX_filtered + x;

      // if X matches, check for Y matches
      for (let y = 0; y < wiggle_room * 2; y++) {
        if (targetCoords[correctX] == mouseY_filtered + y) {
          let correctY = mouseY_filtered + y;
          match = true;
          vals = [correctX, correctY];

          return { match, vals };
        }
      }
    }
  }
  return { match, vals };
}

// this function fires after the mouse has been clicked anywhere
function mouseClicked(mouse) {
  //   console.log(data_coords);
  //   console.log("mouse:", mouse.x, mouse.y);

  const { match, vals } = isMatch(mouse.x, mouse.y, data_coords);
  console.log(match, vals);
}

function draw() {
  background(220);

  stroke(255, 0, 255);
  strokeWeight(point_size);

  // for every column entry, create a point.
  // all points should together strech the length of the graph.
  for (i = 1; i < data_cleaned.length; i++) {
    point(x_factor * i, height - data_cleaned[i] * y_factor);
  }
}
