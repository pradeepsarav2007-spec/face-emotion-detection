```javascript
const video = document.getElementById("video");
const emotionText = document.getElementById("emotion");
const startBtn = document.getElementById("startBtn");

// Models location
const MODEL_URL =
    "https://justadudewhohacks.github.io/face-api.js/models";

// Load face detection and emotion models
async function loadModels() {
    emotionText.innerText = "Loading AI models...";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

    emotionText.innerText = "Models loaded. Click Start Camera.";
}

// Start webcam
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

        emotionText.innerText = "Camera started. Detecting emotion...";
    } catch (error) {
        console.error(error);
        emotionText.innerText =
            "Camera access denied or unavailable.";
    }
}

// Detect emotion
video.addEventListener("play", () => {

    setInterval(async () => {

        const detections = await faceapi
            .detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceExpressions();

        if (detections.length > 0) {

            const expressions = detections[0].expressions;

            let maxEmotion = "neutral";
            let maxValue = 0;

            for (const emotion in expressions) {

                if (expressions[emotion] > maxValue) {
                    maxValue = expressions[emotion];
                    maxEmotion = emotion;
                }
            }

            emotionText.innerText =
                "Emotion: " + maxEmotion.toUpperCase();

        } else {

            emotionText.innerText =
                "Emotion: No face detected";
        }

    }, 500);
});

// Button
startBtn.addEventListener("click", startCamera);

// Load models when page opens
loadModels();
```
