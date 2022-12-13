function setup() {
  createCanvas(800, 600);
  loadData();
  setXandYfactor();
}

function draw() {
  background("white");
  strokeWeight(point_size);
  drawText();

  // for every column entry, create a point.
  // all points should together strech the length of the graph.
  for (i = 1; i < data_cleaned.length; i++) {
    let { x, y } = getXandYFromIndex(i);
    stroke(255, 0, 255);
    point(x, y);
  }
}

function drawText() {
  noStroke();
  textSize(30);
  text(
    "Height of dots equals `Acidity` levels over time.",
    width / 2,
    height - 100
  );
  textAlign(CENTER);
}
