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
        vol = mic.getLevel() * 500;  // Increase sensitivity for better visualization
    }

    // Base color depending on the number of faces detected
    let baseColor;
    if (detections.length === 2) {
        baseColor = color(255, 222, 33); // Yellowish
        leavesAppeared = true;
    } else if (detections.length === 1) {
        baseColor = color(71, 100, 73);  // Greenish
        leavesAppeared = true;
    } else if (detections.length === 3) {
        baseColor = color(255, 214, 209);  // Pinkish
        leavesAppeared = true;
    } else {
        baseColor = color(255);  // Default white when no faces detected
        leavesAppeared = false;
    }

    // Map the mic input to a range of darkening effect
    let darkness = map(vol, 0, 100, 0, 100); // Map volume to a 0-100 range for darkening
    let bgColor = lerpColor(baseColor, color(0), darkness / 100);  // Darken the base color based on volume
    background(bgColor);

    image(video, width - 320, height - 240, 320, 240);

    // Grow or shrink the tree based on mic volume
    if (detections.length > 0) {
        if (currentLen < maxLen) {
            let growthRate = map(vol, 0, 100, 0.05, 0.1);  
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
            fill(255, 25, 0, 150);  // Red leaves for 2 faces
        } else if (detections.length === 1) {
            fill(0, 255, 0, 150);  // Green leaves for 1 face
        } else if (detections.length === 3) {
            fill(255, 163, 221);  // Pink leaves for 3 faces
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
