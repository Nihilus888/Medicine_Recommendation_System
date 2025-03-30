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
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        maxWidth: '300px',
        pointerEvents: 'none',  // Prevent tooltip from blocking other interactions
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
