/*var webcam = null;

function setup () {
    createCanvas (640, 480);

    // create webcam
    webcam = createCapture(VIDEO);
    webcam.size(width, height);
    webcam.hide();
}

function draw () {
    image(webcam, 0,0);

}
*/

let faceapi;
let detections = [];

let video;
function setup() {
   
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    createCanvas(640, 480);

    
    const faceOptions = {
        withLandmarks: true,
        withExpressions: true,
        withDescriptors: true,
        minConfidence: 0.5,
    };
    faceapi = ml5.faceApi(video, faceOptions, faceReady);
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

    clear(); 
    drawDetections(detections); 
    faceapi.detect(gotFaces); 
}
function drawDetections() {
    image(video, 0, 0, width, height);

    if (detections.length > 0) {
        console.log("drawDetections")
        for (let i = 0; i < detections.length; i++) {
            let { alignedRect } = detections[i];
            let { _x, _y, _width, _height } = alignedRect._box;
            noFill();
            stroke(0, 255, 0);
            strokeWeight(2);
            rect(_x, _y, _width, _height);
        }
    }
}
