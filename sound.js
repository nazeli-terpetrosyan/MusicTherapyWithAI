
function audioPlayback() {
    if (currentClass == 'One') soundOne.play(); else soundOne.pause();
    if (currentClass == 'Two') soundTwo.play(); else soundTwo.pause();
    if (currentClass == 'Three') soundThree.play(); else soundThree.pause();
}

if (playAudio==true) setInterval(audioPlayback, 100);

const file1 = document.getElementById("file1");
file1.addEventListener('change', loadSelectedFile1, false)
const file2 = document.getElementById("file2");
file2.addEventListener('change', loadSelectedFile2, false)
const file3 = document.getElementById("file3");
file3.addEventListener('change', loadSelectedFile3, false)

function loadSelectedFile1(event) {
    var file = this.files[0]
    var fileURL = URL.createObjectURL(file)
    soundOne = new Audio(fileURL);
}

function loadSelectedFile2(event) {
    var file = this.files[0]
    var fileURL = URL.createObjectURL(file)
    soundTwo = new Audio(fileURL);
}

function loadSelectedFile3(event) {
    var file = this.files[0]
    var fileURL = URL.createObjectURL(file)
    soundThree = new Audio(fileURL);
}