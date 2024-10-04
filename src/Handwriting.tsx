import React, { useEffect, useRef, useState } from "react";
import "./HandwritingMeasurement.css";
import imagesMap from './images.json';

const measurementTypes = [
  "Slant",
  "TopToMid",
  "MidToBase",
  "BaseToBottom",
  "LetterWidth",
] as const;
type MeasurementType = (typeof measurementTypes)[number];
const descriptionTypes = [
  "Angularity",
  "Loopiness",
  "ConnectionFluidity",
  "LetterSpacing",
] as const;
const measurementColorMap: Record<MeasurementType, string> = {
  Slant: "red",
  TopToMid: "blue",
  MidToBase: "green",
  BaseToBottom: "brown",
  LetterWidth: "purple",
};

type Coord = { x: number; y: number };

type Measurement = {
  start: Coord;
  end: Coord;
  type: MeasurementType;
};

const HandwritingMeasurement = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const authors = Object.keys(imagesMap);

  const [authorIndex, setAuthorIndex] = useState(0);


  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [descriptionScores, setDescriptionScores] = useState<
    Record<(typeof descriptionTypes)[number], string>
  >({
    Angularity: "0.0",
    Loopiness: "0.0",
    ConnectionFluidity: "0.0",
    LetterSpacing: "0.0",
  });

  const [measuring, setMeasuring] = useState<Measurement["type"]>("Slant");
  const [startPosition, setStartPosition] = useState<Coord | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const img = new Image();
    img.src = `/${(imagesMap as Record<string, string[]>)[authors[authorIndex]][0]}.png`;

    img.onload = () => {
      canvas.width = 800;
      canvas.height = (800 / img.width) * img.height;
      const ctx = canvas.getContext("2d");
      if (ctx === null) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [authorIndex, authors]);

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    start: Coord,
    end: Coord,
  ) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = measurementColorMap[measuring];
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPosition({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!startPosition) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const endPosition = { x, y };

    setMeasurements((m) => [
      ...m,
      { start: startPosition, end: endPosition, type: measuring },
    ]);
    setStartPosition(null);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawLine(ctx, startPosition, endPosition);
      }
    }
  };

  const jsonString = JSON.stringify(
    { measurements: measurements, descriptionScores },
    null,
    2,
  );

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `measurements-${authors[authorIndex]}.json`;
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <h3 className="title">Handwriting Measurement Tool</h3>
      <p className="info">
        A tool to provide more human insight into my author similarity matchy
        matchy algorithm
      </p>
      <div className="inputs">
        {descriptionTypes.map((type) => (
          <label key={type} className="label">
            {type}{" "}
            <input
              className="input"
              value={descriptionScores[type]}
              type="text"
              onChange={(e) => {
                setDescriptionScores((c) => ({ ...c, [type]: e.target.value }));
              }}
            />{" "}
          </label>
        ))}
      </div>
      <div className="buttons">
        {measurementTypes.map((type) => (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setMeasuring(type);
            }}
            key={type}
            className={`button ${measuring === type ? "active" : ""}`}
          >
            {type}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="canvas"
      />
      <div className="action-buttons">
        <button className="button" onClick={downloadJson}>
          Download
        </button>
        <button onClick={(e) => {
          e.preventDefault();
          setAuthorIndex(a => a+1);
        }} className="button">Next</button>
      </div>
      <pre className="json-output">{jsonString}</pre>
    </div>
  );
};

export default HandwritingMeasurement;
