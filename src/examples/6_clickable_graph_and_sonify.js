function setup() {
  createCanvas(800, 600);
  loadData();
  setXandYfactor();
  storeDataCoords();
  loadAudio(0.5, true);
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

function playAudio() {
  const { sine_freq } = data_coords[matchCoords[0]][matchCoords[1]];
  sine.freq(sine_freq);
  env.play(sine);
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
