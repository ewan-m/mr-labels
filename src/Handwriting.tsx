import React, { useEffect, useRef, useState } from "react";
import "./HandwritingMeasurement.css";
import imagesMap from "./images.json";

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
const defaultDescriptions = {
  Angularity: "0.0",
  Loopiness: "0.0",
  ConnectionFluidity: "0.0",
  LetterSpacing: "0.0",
};
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
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const authors = Object.keys(imagesMap);

  const [authorIndex, setAuthorIndex] = useState(0);

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [descriptionScores, setDescriptionScores] =
    useState<Record<(typeof descriptionTypes)[number], string>>(
      defaultDescriptions,
    );

  const [measuring, setMeasuring] = useState<Measurement["type"]>("Slant");
  const [startPosition, setStartPosition] = useState<Coord | null>(null);

  useEffect(() => {
    const imageCanvas = imageCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (imageCanvas === null || drawCanvas === null) return;

    const img = new Image();
    img.src = `/images/${(imagesMap as Record<string, string[]>)[authors[authorIndex]][0]}.png`;

    img.onload = () => {
      const containerWidth = 800;
      const containerHeight = (containerWidth / img.width) * img.height;

      imageCanvas.width = drawCanvas.width = containerWidth;
      imageCanvas.height = drawCanvas.height = containerHeight;

      // Update container height
      const container = imageCanvas.parentElement;
      if (container) {
        container.style.height = `${containerHeight}px`;
      }

      const ctx = imageCanvas.getContext("2d");
      if (ctx === null) return;

      ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
      ctx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
      tryLoadMeasurements();
    };
  }, [authorIndex]);

  useEffect(() => {
    const drawCanvas = drawCanvasRef.current;
    if (drawCanvas === null) return;

    const drawCtx = drawCanvas.getContext("2d");
    if (drawCtx === null) return;
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    measurements.forEach((m) => drawLine(drawCtx, m.start, m.end, m.type));
  }, [measurements]);

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    start: Coord,
    end: Coord,
    type: MeasurementType,
  ) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = measurementColorMap[type];
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPosition({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!startPosition) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const endPosition = { x, y };

    const drawCanvas = drawCanvasRef.current;
    if (drawCanvas) {
      const ctx = drawCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        measurements.forEach((m) => drawLine(ctx, m.start, m.end, m.type));
        drawLine(ctx, startPosition, endPosition, measuring);
      }
    }
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

    const drawCanvas = drawCanvasRef.current;
    if (drawCanvas) {
      const ctx = drawCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        measurements.forEach((m) => drawLine(ctx, m.start, m.end, m.type));
        drawLine(ctx, startPosition, endPosition, measuring);
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
    a.download = `${(imagesMap as Record<string, string[]>)[authors[authorIndex]][0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const tryLoadMeasurements = async () => {
    try {
      const response = await fetch(
        `/measurements/${(imagesMap as Record<string, string[]>)[authors[authorIndex]][0]}.json`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }

      const data = await response.json();
      setMeasurements(data.measurements || []);
      setDescriptionScores(data.descriptionScores || {});
    } catch (error) {
      console.error("Error fetching or parsing JSON file:", error);
    }
  };

  return (
    <div className="container">
      <h3 className="title">Handwriting Measurement Tool</h3>
      <p className="info">
        A tool to provide more human insight into my handwriting style encoder -{" "}
        {(imagesMap as Record<string, string[]>)[authors[authorIndex]][0]}
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
      <div className="canvas-container">
        <canvas ref={imageCanvasRef} className="canvas image-canvas" />
        <canvas
          ref={drawCanvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="canvas draw-canvas"
        />
      </div>
      <div className="action-buttons">
        <button className="button" onClick={downloadJson}>
          Download
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setAuthorIndex((a) => (a + 1) % authors.length);
            setMeasurements([]);
            setDescriptionScores(defaultDescriptions);
          }}
          className="button"
        >
          Next
        </button>
      </div>
      <pre className="json-output">{jsonString}</pre>
    </div>
  );
};

export default HandwritingMeasurement;
