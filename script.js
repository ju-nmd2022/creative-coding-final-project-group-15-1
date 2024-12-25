//The logic behind the visual system is implemented from https://youtu.be/-3HwUKsovBE?si=XKVmyXNl04A2dKCN
//The logic behind the face detection system is implemented from https://www.geeksforgeeks.org/how-to-implement-face-detection-with-ml5js/ 

let detections = [];
let video;
let mic;
let started = false;
let maxLen = 100;
let currentLen = 0;
let leavesAppeared = false;
let hearts = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5,
  };
  faceapi = ml5.faceApi(video, faceOptions, faceReady);

  let startButton = createButton("Start Mic");
  startButton.position(10, 10);
  startButton.mousePressed(startAudio);
}

function startAudio() {
  if (!started) {
    userStartAudio().then(() => {
      mic = new p5.AudioIn();
      mic.start();
      started = true;
    });
  }
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;
  faceapi.detect(gotFaces);

  if (detections.length > 0) {
    detections.forEach((detection) => {
      if (detection.expressions) {
        let emotions = Object.entries(detection.expressions);
        emotions.forEach(([emotion, confidence]) => {
          if (confidence > 0.2) {
            let heartColor = getEmotionColor(emotion);
            let x = random(width);
            let y = height;
            hearts.push(new Heart(x, y, heartColor));
          }
        });
      }
    });
  }
}

function draw() {
  let vol = 0;
  if (started) {
    vol = mic.getLevel() * 500;
  }

  let baseColor;
  if (detections.length === 2) {
    baseColor = color(255, 234, 174);
    leavesAppeared = true;
  } else if (detections.length === 1) {
    baseColor = color(171, 199, 152);
    leavesAppeared = true;
  } else if (detections.length === 3) {
    baseColor = color(251, 220, 226);
    leavesAppeared = true;
  } else {
    baseColor = color(255);
    leavesAppeared = false;
  }

  let darkness = map(vol, 0, 100, 0, 100);
  let bgColor = lerpColor(baseColor, color(0), darkness / 100);
  background(bgColor);

  if (detections.length > 0 && currentLen < maxLen) {
    let growthRate = map(vol, 0, 100, 0.05, 0.5);
    currentLen += growthRate;
  } else if (currentLen > 0) {
    currentLen -= 0.1;
  }

  image(video, width - 320, height - 240, 320, 240);

  randomSeed(6);
  push();
  translate(width / 2, height - 100);
  branch(currentLen);
  pop();

  if (currentLen > 30) {
    leavesAppeared = true;
  }

  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].draw();
    hearts[i].update();
    if (hearts[i].isOffScreen()) {
      hearts.splice(i, 1);
    }
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
    if (detections.length === 2) {
      r = 180 + random(-20, 20);
      g = 120 + random(-20, 20);
      b = 40 + random(-20, 20);
      fill(r, g, b, 200);
    } else if (detections.length === 1) {
      var r = 80 + random(-20, 20);
      var g = 120 + random(-20, 20);
      var b = 40 + random(-20, 20);
      fill(r, g, b, 150);
    } else if (detections.length === 3) {
      r = 220 + random(-20, 20);
      g = 120 + random(-20, 20);
      b = 170 + random(-20, 20);
      fill(r, g, b, 200);
    }
    noStroke();

    beginShape();
    for (let i = 45; i < 135; i++) {
      let rad = 15;
      let x = rad * cos(i);
      let y = rad * sin(i);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  pop();
}

class Heart {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = random(20, 40);
    this.speed = random(1, 3);
  }

  draw() {
    fill(this.color);
    noStroke();
    beginShape();
    vertex(this.x, this.y);
    bezierVertex(this.x - this.size / 2, this.y - this.size / 2, this.x - this.size, this.y + this.size / 3, this.x, this.y + this.size);
    bezierVertex(this.x + this.size, this.y + this.size / 3, this.x + this.size / 2, this.y - this.size / 2, this.x, this.y);
    endShape(CLOSE);
  }

  update() {
    this.y -= this.speed;
  }

  isOffScreen() {
    return this.y < -this.size;
  }
}

function getEmotionColor(emotion) {
  switch (emotion) {
    case "happy":
      return color(random(200, 255), random(200, 255), random(0, 50));
    case "sad":
      return color(random(0, 50), random(0, 50), random(200, 255));
    case "angry":
      return color(random(200, 255), random(0, 50), random(0, 50));
    case "surprised":
      return color(random(0, 50), random(200, 255), random(0, 50));
    case "neutral":
      return color(random(200, 255), random(200, 255), random(200, 255));
    default:
      return color(255);
  }
}