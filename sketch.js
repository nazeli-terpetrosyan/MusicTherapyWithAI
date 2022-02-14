let currentClass;
let video;
// KNN classifier
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;

// Enabling sound
var playAudio=true;

var soundOne = new Audio("sound.m4a");
var soundTwo = new Audio("sound2.m4a");
var soundThree = new Audio("sound3.m4a");

function setup() {
  // Create a featureExtractor that can extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  noCanvas();
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  video.size(600, 500);
  // Create the UI buttons
  createButtons();
}

function modelReady(){
  
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);
  
  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
parent.postMessage(["console",JSON.stringify('There is no examples in any label')], "*");
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Use knnClassifier to classify which label do these features belong to
  knnClassifier.classify(features, gotResults);

}

// A util function to create UI buttons
function createButtons() {
  buttonA = select('#addClassOne');
  buttonA.mousePressed(function() {
    addExample('One');
  });

  buttonB = select('#addClassTwo');
  buttonB.mousePressed(function() {
    addExample('Two');
  });


  buttonC = select('#addClassThree');
  buttonC.mousePressed(function() {
    addExample('Three');
  });

  resetBtnA = select('#resetOne');
  resetBtnA.mousePressed(function() {
    clearLabel('One');
  });
	
  resetBtnB = select('#resetTwo');
  resetBtnB.mousePressed(function() {
    clearLabel('Two');
  });
	
  resetBtnC = select('#resetThree');
  resetBtnC.mousePressed(function() {
    clearLabel('Three');
  });

  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllLabels);


  // Get classifier dataset
  buttonGetData = select('#save');
  buttonGetData.mousePressed(saveMyKNN);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
parent.postMessage(["console",JSON.stringify(err)], "*");
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      currentClass = result.label;
      select('#result').html(result.label);
      select('#confidence').html(`${confidences[result.label] * 100} %`);
    }

    select('#confidenceOne').html(`${confidences['One'] ? confidences['One'] * 100 : 0} %`);
    select('#confidenceTwo').html(`${confidences['Two'] ? confidences['Two'] * 100 : 0} %`);
    select('#confidenceThree').html(`${confidences['Three'] ? confidences['Three'] * 100 : 0} %`);
  }

  classify();
}

// Update the example count for each label	
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();

  select('#exampleOne').html(counts['One'] || 0);
  select('#exampleTwo').html(counts['Two'] || 0);
  select('#exampleThree').html(counts['Three'] || 0);
}

// Clear the examples in one label
function clearLabel(label) {
  knnClassifier.clearLabel(label);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

// Save dataset as myKNNDataset.json
function saveMyKNN() {
  knnClassifier.save('myKNNDataset');
}

// Load dataset to the classifier
function loadMyKNN() {
  knnClassifier.load('./myKNNDataset.json', updateCounts);
}