// exact same as nr.5,
// only the color of the clicekd point is based on the "number of bags" that year.

let data;
let data_cleaned;

// for the color data
let data_cleaned_1;
let y_factor;
let x_factor;
let point_size = 10;

// something similar to a hash table that makes lookup really fast
let data_coords = {};
let matchCoords = [];

// asynchronous data loading
function preload() {
  data = loadTable("./assets/arabica_data_cleaned_year.csv", "header");
}

function loadData() {
  data_cleaned = data.getColumn("Acidity");
  data_cleaned = data_cleaned.slice(0, 50);

  // add another column which we will use for color.
  data_cleaned_1 = data.getColumn("Number.of.Bags");
  data_cleaned_1 = data_cleaned_1.slice(0, 50);
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
    data_coords[x][y] = true;
  }
}

function setup() {
  createCanvas(800, 600);
  loadData();
  setXandYfactor();
  storeDataCoords();
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

// this function fires after the mouse has been clicked anywhere
function mouseClicked(mouse) {
  const { match, coords } = isMatch(mouse.x, mouse.y, data_coords);
  if (match) {
    matchCoords = coords;
  } else {
    matchCoords = [];
  }
}

function draw() {
  background("white");
  strokeWeight(point_size);

  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);

    if (x == matchCoords[0] && y == matchCoords[1]) {
      // new alphagetting function
      let { alpha } = getAlphaFromIndex(i);

      stroke(0, 0, 0);
      stroke(`rgba(0,0,0,${alpha})`);
    } else {
      stroke(`rgba(255,0,0,1)`);
    }

    point(x, y);
  }

  noStroke();
  textSize(30);
  text(
    "The dot opacity equals the number of bags that year",
    width / 2,
    height - 100
  );
  textAlign(CENTER);
}
