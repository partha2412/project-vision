import React, { useRef, useEffect } from "react";

export default function VTO() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);



    useEffect(() => {
        // API calling
        const results = '';

        const image_png = "../glass1.png"; 
        const size = 1.9;
        const horizontal = 0;
        const vertical = -0.03;



        const loadFaceMesh = async () => {
            const [{ FaceMesh }, { Camera }] = await Promise.all([
                import("@mediapipe/face_mesh"),
                import("@mediapipe/camera_utils"),
            ]);

            const faceMesh = new FaceMesh({
                locateFile: (file) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            const glasses = new Image();
            glasses.src = image_png; // place this in /public/models

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            faceMesh.onResults((results) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (results.multiFaceLandmarks?.length > 0) {
                    const landmarks = results.multiFaceLandmarks[0];

                    // Landmarks for eyes
                    const leftEye = landmarks[33];
                    const rightEye = landmarks[263];

                    const x1 = leftEye.x * canvas.width;
                    const y1 = leftEye.y * canvas.height;
                    const x2 = rightEye.x * canvas.width;
                    const y2 = rightEye.y * canvas.height;

                    // Midpoint between eyes
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    const eyeDistance = Math.hypot(x2 - x1, y2 - y1);
                    const angle = Math.atan2(y2 - y1, x2 - x1);
                    //console.log(angle);
                    

                    // Glasses size (relative to eye distance)
                    const glassesWidth = eyeDistance * (size);
                    const glassesHeight =
                        glassesWidth * (glasses.height / glasses.width || 0.5);

                    // Position offsets (adjust as needed)
                    const offsetX = horizontal; // move left/right
                    const offsetY = -eyeDistance * (vertical); // move up/down

                    ctx.save();
                    ctx.translate(midX, midY);
                    ctx.rotate(angle);

                    // --- Remove white background ---
                    const offCanvas = document.createElement("canvas");
                    offCanvas.width = glasses.width;
                    offCanvas.height = glasses.height;
                    const offCtx = offCanvas.getContext("2d");

                    offCtx.drawImage(glasses, 0, 0);
                    const imageData = offCtx.getImageData(
                        0,
                        0,
                        offCanvas.width,
                        offCanvas.height
                    );
                    const data = imageData.data;

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        if (r > 240 && g > 240 && b > 240) {
                            data[i + 3] = 0; // make transparent
                        }
                    }

                    offCtx.putImageData(imageData, 0, 0);

                    // Draw glasses with offsets
                    ctx.drawImage(
                        offCanvas,
                        -glassesWidth / 2 + offsetX,
                        -glassesHeight / 2 + offsetY,
                        glassesWidth,
                        glassesHeight
                    );

                    ctx.restore();
                }
            });

            const video = videoRef.current;
            const startCamera = async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;

                video.onloadedmetadata = () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    const camera = new Camera(video, {
                        onFrame: async () => {
                            await faceMesh.send({ image: video });
                        },
                        width: video.videoWidth,
                        height: video.videoHeight,
                    });
                    camera.start();
                };
            };

            startCamera();
        };

        loadFaceMesh();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            <h2 className="text-2xl font-bold text-white mb-4">
                👓 Virtual Try-On (AR Overlay)
            </h2>

            <div className="relative w-[600px] h-[400px] border-4 border-white rounded-lg shadow-lg">
                {/* Webcam */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1] rounded-lg"
                />

                {/* Overlay Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full transform scale-x-[-1] pointer-events-none"
                />
            </div>
        </div>
    );
}
