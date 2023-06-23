import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

function Progresbar() {
  const [progress, setProgress] = useState(0);
  const [buttonPosition, setButtonPosition] = useState(() => {
    const savedPosition = sessionStorage.getItem('buttonPosition');
    return savedPosition ? parseFloat(savedPosition) : 0;
  });
  const [hoveredHour, setHoveredHour] = useState(null);
  const buttonRef = useRef(null);
  const barRef = useRef(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;
    const barWidth = barRef.current.offsetWidth;
    const clickX = event.clientX - barRef.current.getBoundingClientRect().left;
    const newProgress = (clickX / barWidth) * 100;

    if (newProgress >= 0 && newProgress <= 100) {
      setProgress(newProgress);
      setButtonPosition(clickX);
      sessionStorage.setItem('buttonPosition', clickX.toString());

      const hour = Math.round((clickX / barWidth) * 24);
      setHoveredHour(hour);
    }
  };

  const handleMouseLeave = () => {
    setHoveredHour(null);
  };

  useEffect(() => {
    const savedProgress = sessionStorage.getItem('progress');
    if (savedProgress) {
      setProgress(parseFloat(savedProgress));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('progress', progress.toString());
  }, [progress]);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.left = `${buttonPosition}px`;
    }
  }, [buttonPosition]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <h2 style={{color: "white", paddingBottom: "100px"}}>Barre de progression</h2>
      <div
        style={{
          width: '50%',
          height: '3px',
          border: 'solid black 1px',
          position: 'relative',
        }}
        ref={barRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            width: `${progress}%`,
            height: '4px',
            backgroundColor: 'white',
          }}
        />
        {[...Array(24)].map((_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${(index / 23) * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'white',
            }}
          />
        ))}
        <button
          style={{
            position: 'absolute',
            top: '50%',
            left: buttonPosition,
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          ref={buttonRef}
          onMouseDown={handleMouseDown}
        />
        {hoveredHour !== null && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${buttonPosition}px`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            {hoveredHour}:00
          </div>
        )}
      </div>
    </div>
  );
}

export default Progresbar;
