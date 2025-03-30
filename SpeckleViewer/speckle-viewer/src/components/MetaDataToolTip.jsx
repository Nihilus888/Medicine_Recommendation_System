import React from 'react';

const MetadataTooltip = ({ metadata, position = { x: 0, y: 0 } }) => {
  // If no metadata or empty array, don't render the tooltip
  if (!metadata || metadata.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: position?.y || 0,  // Ensure position is defined
        left: position?.x || 0,  // Ensure position is defined
        background: 'linear-gradient(145deg, rgba(135, 206, 235, 0.9), rgba(70, 130, 180, 0.8))',  // Gradient blue background
        color: 'black',  // Black text color for better contrast
        padding: '12px',  // Slightly more padding for a better feel
        borderRadius: '8px',  // Softer rounded corners
        fontSize: '13px',  // Slightly larger text for better readability
        maxWidth: '320px',  // Slightly wider max width
        pointerEvents: 'none',  // Prevent tooltip from blocking other interactions
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',  // Soft shadow for depth
      }}
    >
      {metadata.map((data, index) => (
        <div key={index}>
          <strong>Batch ID:</strong> {data.batchId} <br />
          <strong>Geometry ID:</strong> {data.geometryId} <br />
          <strong>Type:</strong> {data.geometryType} <br />
          <strong>Speckle Type:</strong> {data.speckleType}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MetadataTooltip;
