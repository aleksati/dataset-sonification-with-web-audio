// 5_clickable_graph

let data;
let data_cleaned;
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
  // limit our dataset a little bbit
  data_cleaned = data_cleaned.slice(0, 50);
}

function setXandYfactor() {
  y_factor = height / 10;
  x_factor = width / data_cleaned.length;
}

function storeDataCoords() {
  for (i = 1; i < data_cleaned.length; i++) {
    x = Math.floor(x_factor * i);
    y = Math.floor(height - data_cleaned[i] * y_factor);

    // we know that X will always be different. for every i
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
  let vals = [];

  //   console.log("org x and y: ", mouseX, mouseY);
  //   console.log("first coord:", targetCoords);

  // check for x matches
  for (let x = 0; x < point_size * 2; x++) {
    if (targetCoords[mouseX_filtered + x]) {
      let correctX = mouseX_filtered + x;

      // if X matches, check for Y matches
      for (let y = 0; y < point_size * 2; y++) {
        if (targetCoords[correctX][mouseY_filtered + y]) {
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
  const { match, vals } = isMatch(mouse.x, mouse.y, data_coords);
  if (match) {
    console.log("You clicked a dot!");
    console.log("Coordinate:", vals);
    matchCoords = vals;
  } else {
    matchCoords = [];
  }
}

function draw() {
  background(225, 255, 255, 255);
  strokeWeight(point_size);

  for (i = 1; i < data_cleaned.length; i++) {
    let x = Math.floor(x_factor * i);
    let y = Math.floor(height - data_cleaned[i] * y_factor);

    if (x == matchCoords[0] && y == matchCoords[1]) {
      stroke(0, 255, 0);
    } else {
      stroke(255, 0, 0);
    }

    point(x, y);
  }

  noStroke();
  textSize(50);
  text("Click the dots!", width / 2, height - 100);
  textAlign(CENTER);
}
