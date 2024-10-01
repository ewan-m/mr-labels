import React, { useRef, useState, useEffect } from 'react';

type Coord = {x: number, y: number};

type Measurement = {
  start: Coord;
  end: Coord;
  type: "Slant" | "TopToMid" | "MidToBase" | "BaseToBottom" | "LetterSpacing";
}

const HandwritingMeasurement: React.FC<{imageUrl: string}> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [startPosition, setStartPosition] = useState<Coord>({x: 0, y: 0});
  const [currentPosition, setCurrentPosition] = useState<Coord>({x: 0, y: 0});

  const [measuring, setMeasuring] = useState<Measurement["type"]>("Slant");

  useEffect(() => {

    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;    
      const ctx = canvas.getContext('2d');
      if (ctx === null) {
        return;
      }

      ctx.drawImage(img, 0, 0, img.width, img.height);
    };
  }, [imageUrl]);

  const drawMeasurement = ({ startX, startY, endX, endY }) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw line for the measurement
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();

  };



  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <h3>Handwriting Measurement Tool</h3>
      <select value={measuring} onChange={(e) => {
        setMeasuring(e.target.value as Measurement["type"]);
      }}>
        <option>Slant</option>
        <option>TopToMid</option>
        <option>MidToBase</option>
        <option>BaseToBottom</option>
        <option>LetterSpacing</option>
      </select>
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setMeasurements(m => [...m, {start: startPosition, end: {x,y}, type :measuring}])
        }}

        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setCurrentPosition({x,y})
        }}
        onMouseUp={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setStartPosition({x,y})
        }}
      />
    </div>
  );
};

export default HandwritingMeasurement;
