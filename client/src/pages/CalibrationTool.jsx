import React, { useState, useRef, useEffect } from "react";

export default function CalibrationTool() {
  const canvasRef = useRef(null);
  const [glassesImg] = useState("/models/glasses3.png"); // make sure in public/models
  const [faceImg] = useState("/models/face_sample.jpg"); // sample face image in /public/models

  // adjustable values
  const [size, setSize] = useState(1.9);
  const [horizontal, setHorizontal] = useState(0);
  const [vertical, setVertical] = useState(-0.2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const face = new Image();
    const glasses = new Image();

    face.src = faceImg;
    glasses.src = glassesImg;

    face.onload = () => {
      canvas.width = face.width;
      canvas.height = face.height;
      draw(ctx, face, glasses);
    };

    glasses.onload = () => {
      if (face.complete) {
        draw(ctx, face, glasses);
      }
    };

    function draw(ctx, face, glasses) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(face, 0, 0);

      // ❗ Example eye coordinates (for the static face image)
      // You’d measure once manually for your sample face
      const leftEye = { x: 220, y: 240 };
      const rightEye = { x: 370, y: 240 };

      const x1 = leftEye.x;
      const y1 = leftEye.y;
      const x2 = rightEye.x;
      const y2 = rightEye.y;

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      const eyeDistance = Math.hypot(x2 - x1, y2 - y1);
      const angle = Math.atan2(y2 - y1, x2 - x1);

      const glassesWidth = eyeDistance * size;
      const glassesHeight =
        glassesWidth * (glasses.height / glasses.width || 0.5);

      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);

      ctx.drawImage(
        glasses,
        -glassesWidth / 2 + horizontal,
        -glassesHeight / 2 + vertical * eyeDistance,
        glassesWidth,
        glassesHeight
      );

      ctx.restore();
    }
  }, [size, horizontal, vertical, faceImg, glassesImg]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">🛠 Calibration Tool</h2>
      <canvas ref={canvasRef} className="border rounded shadow" />

      {/* Sliders */}
      <div className="flex flex-col gap-2 w-80">
        <label>
          Size: {size.toFixed(2)}
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={size}
            onChange={(e) => setSize(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>

        <label>
          Horizontal: {horizontal.toFixed(2)}
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={horizontal}
            onChange={(e) => setHorizontal(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>

        <label>
          Vertical: {vertical.toFixed(2)}
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={vertical}
            onChange={(e) => setVertical(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
      </div>

      <div className="mt-4 p-2 bg-gray-200 rounded">
        <p>👉 Copy these values into your VTO:</p>
        <code>size = {size.toFixed(2)}</code>,{" "}
        <code>horizontal = {horizontal.toFixed(2)}</code>,{" "}
        <code>vertical = {vertical.toFixed(2)}</code>
      </div>
    </div>
  );
}
