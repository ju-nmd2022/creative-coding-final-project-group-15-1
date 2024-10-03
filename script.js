/*let mic;
let started = false;
let maxLen = 100;
let currentLen = 0;
let leavesAppeared = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);

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

function draw() {
  let vol = 0;

  if (started) {
    vol = mic.getLevel() * 900; // Amplifying the mic input
  }

  let bgColor = map(vol, 0, 5, 200, 0); // Background color darkens with higher volume
  background(bgColor);

  randomSeed(6);
  translate(width / 2, height / 2 + 200);

  // Adjust tree growth speed based on the volume level (higher volume = slower growth)
  let growthRate = map(vol, 0, 5, 0.05, 0.01);

  if (currentLen < maxLen) {
    currentLen += growthRate; // Slowing down the growth based on volume
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

  // Drawing leaves when leavesAppear is true and the branch is small
  if (leavesAppeared && len < maxLen && len <= 10) {
    let r = 80 + random(-20, 20);
    let g = 120 + random(-20, 20);
    let b = 40 + random(-20, 20);
    fill(r, g, b, 150);
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
*/
let faceapi;
let detections = [];

let video;
let mic;
let started = false;
let maxLen = 100;
let currentLen = 0;
let leavesAppeared = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(60);

    // Setup webcam
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Initialize face detection with options
    const faceOptions = {
        withLandmarks: true,
        withExpressions: true,
        withDescriptors: true,
        minConfidence: 0.5,
    };
    faceapi = ml5.faceApi(video, faceOptions, faceReady);

    // Create button to start mic
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

// Face detection ready callback
function faceReady() {
    faceapi.detect(gotFaces);
}

// Callback when faces are detected
function gotFaces(error, result) {
    if (error) {
        console.log(error);
        return;
    }

    detections = result;
    faceapi.detect(gotFaces);  // Continue detecting faces
}

function draw() {
    let vol = 0;
    if (started) {
        vol = mic.getLevel() * 900;  // Amplifying mic input
    }

    let bgColor = map(vol, 0, 5, 200, 0);  // Adjust background color based on volume
    background(bgColor);

    // Show the webcam feed (lower-right corner for reference)
    image(video, width - 320, height - 240, 320, 240);

    // Adjust tree growth based on face detection and microphone input
    if (detections.length > 0) {
        if (currentLen < maxLen) {
            let growthRate = map(vol, 0, 5, 0.05, 0.01);  // Volume affects growth speed
            currentLen += growthRate;  // Tree grows if faces are detected
        }
    } else {
        if (currentLen > 0) {
            currentLen -= 0.1;  // Tree shrinks if no faces are detected
        }
    }

    randomSeed(6);
    translate(width / 2, height / 2 + 200);
    branch(currentLen);  // Draw the tree

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

    // Draw leaves when the tree is fully grown
    if (leavesAppeared && len < maxLen && len <= 10) {
        let r = 80 + random(-20, 20);
        let g = 120 + random(-20, 20);
        let b = 40 + random(-20, 20);
        fill(r, g, b, 150);
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
