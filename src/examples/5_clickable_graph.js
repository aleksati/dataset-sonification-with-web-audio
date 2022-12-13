let data;
//for dots
let data_cleaned;

let y_factor;
let x_factor;
let point_size = 10;

// something similar to a hash table that makes lookup really fast
let data_coords = {};
let matchCoords = [];

function setup() {
  createCanvas(800, 600);
  loadData();
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
  // limit our dataset a little bit with slice
  data_cleaned = data_cleaned.slice(0, 50);
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

    // we know that X will always be different. for every i
    data_coords[x] = {};
    data_coords[x][y] = true;
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

// this function fires after the mouse has been clicked anywhere
function mouseClicked(mouse) {
  const { match, coords } = isMatch(mouse.x, mouse.y, data_coords);
  if (match) {
    console.log("You clicked a dot!");
    console.log("Coordinate:", coords);
    matchCoords = coords;
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
    height - 150
  );
  text("Click dots and check console", width / 2, height - 100);
  textAlign(CENTER);
}
