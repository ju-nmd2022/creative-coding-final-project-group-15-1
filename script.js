let maxLen = 100;
let currentLen = 0;
let leavesAppeared = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);
}

function draw() {
  background(200);
  randomSeed(6);
  translate(width / 2, height / 2 + 200);

  if (currentLen < maxLen) {
    currentLen += 0.05;
  }
  branch(currentLen);

  if (currentLen > 30) {
    leavesAppeared = true;
  }
}

function branch(len) {
  push();
  if (len > 10) {
    strokeWeight(map(len, 10, 100, 1, 15));
    stroke(70, 40, 20);
    line(0, 0, 0, -len);
    translate(0, -len);
    rotate(random(-20, -30));
    branch(len * random(0.7, 0.9));
    rotate(random(50, 60));
    branch(len * random(0.7, 0.9));
  }

  if (leavesAppeared && len < maxLen && len <= 10) {
    var r = 80 + random(-20, 20);
    var g = 120 + random(-20, 20);
    var b = 40 + random(-20, 20);
    fill(r, g, b, 150);
    noStroke();

    beginShape();
    for (var i = 45; i < 135; i++) {
      var rad = 15;
      var x = rad * cos(i);
      var y = rad * sin(i);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  pop();
}
