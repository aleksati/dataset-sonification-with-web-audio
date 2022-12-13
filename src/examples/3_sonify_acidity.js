function setup() {
  createCanvas(800, 600);
  loadData();
  loadAudio(0.5);
}

function draw() {
  background("white");
  drawText();

  // use the acidity data to control the frequecy of our oscillator.
  // times 80 to make it scale a little better.
  sine.freq(data_cleaned[accumulator] * 80);

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
  text("Frequency equals `Acidity` levels over time.", width / 2, height - 100);
  textAlign(CENTER);
}
