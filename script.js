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
//////////////////////////////////////


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
}

function draw() {
    let vol = 0;
    if (started) {
        vol = mic.getLevel() * 900;  
    }

    // Changing background color based on the number of detected faces
    if (detections.length === 2) {
        background(255,222,33); 
        leavesAppeared = true;  
    } else if (detections.length === 1) {
        background(71, 100, 73);  
        leavesAppeared = true; 
    } else if (detections.length === 3) {
      background(255,214,209);  
      leavesAppeared = true; 
    } else {
        let bgColor = map(vol, 0, 5, 200, 0);  
        background(bgColor);
        leavesAppeared = false; 
    }

    image(video, width - 320, height - 240, 320, 240);

    if (detections.length > 0) {
        if (currentLen < maxLen) {
            let growthRate = map(vol, 0, 5, 0.05, 0.01);  
            currentLen += growthRate;  
        }
    } else {
        if (currentLen > 0) {
            currentLen -= 0.1; 
        }
    }

    randomSeed(6);
    translate(width / 2, height / 2 + 200);
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

    // Changing the color of leaves based on the number of detected faces
    if (leavesAppeared && len < maxLen && len <= 10) {
        if (detections.length === 2) {
            fill(255, 25, 0, 150);  
        } else if (detections.length === 1) {
            fill(0, 255, 0, 150);  
        } else if (detections.length === 3) {
          fill(255, 163, 221);  
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
