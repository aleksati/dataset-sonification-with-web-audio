function setup() {
  createCanvas(800, 600);
  loadData();
  loadAudio(0.5);
  setXandYfactor();
}

function draw() {
  background("white");
  drawText();

  // use the acidity data to control the frequecy of our oscillator.
  sine.freq(data_cleaned[accumulator] * 80);

  stroke(255, 0, 255);
  strokeWeight(point_size);

  // draw single point travelling across screen
  // let { x, y } = getXandYFromIndex(accumulator);
  // point(x, y);

  // draw a consecutive line
  for (let i = 0; i < accumulator; i++) {
    let { x, y } = getXandYFromIndex(i);
    point(x, y);
  }

  // make sure we dont exceed the length of our data.
  if (accumulator >= data_cleaned.length) {
    accumulator = 0;
  } else {
    accumulator += 1;
  }
}

function drawText() {
  noStroke();
  textSize(30);
  text(
    "Freq and height of dot equals `Acidity` levels over time.",
    width / 2,
    height - 100
  );
  textAlign(CENTER);
}
