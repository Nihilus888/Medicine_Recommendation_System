import React from 'react';
import '../styled-components/MetaToolTip.css';

const MetadataTooltip = ({ metadata, position = { x: 0, y: 0 } }) => {
  // If no metadata or empty array, don't render the tooltip
  if (!metadata || metadata.length === 0) return null;

  return (
    <div
      className="metadata-tooltip"
      style={{ top: position?.y || 0, left: position?.x || 0 }}
    >
      {/* Metadata content */}
      {metadata.map((data, index) => (
        <div key={index} style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '6px', fontWeight: '600' }}>
            <strong style={{ textDecoration: 'underline', color: '#f0f0f0' }}>Batch ID:</strong> 
            <span style={{ color: '#f0f0f0' }}> {data.batchId}</span>
          </div>
          <div style={{ marginBottom: '6px', fontWeight: '600' }}>
            <strong style={{ textDecoration: 'underline', color: '#f0f0f0' }}>Geometry ID:</strong> 
            <span style={{ color: '#f0f0f0' }}> {data.geometryId}</span>
          </div>
          <div style={{ marginBottom: '6px', fontWeight: '600' }}>
            <strong style={{ textDecoration: 'underline', color: '#f0f0f0' }}>Type:</strong> 
            <span style={{ color: '#f0f0f0' }}> {data.geometryType}</span>
          </div>
          <div style={{ marginBottom: '6px', fontWeight: '600' }}>
            <strong style={{ textDecoration: 'underline', color: '#f0f0f0' }}>Speckle Type:</strong> 
            <span style={{ color: '#f0f0f0' }}>{data.speckleType}</span>
          </div>
          <div style={{ marginBottom: '6px', fontWeight: '600' }}>
            <strong style={{ textDecoration: 'underline', color: '#f0f0f0' }}>Material Hash:</strong> 
            <span style={{ color: '#f0f0f0' }}> {data.materialHash}</span>
          </div>
          {index !== metadata.length - 1 && <hr style={{ margin: '10px 0' }} />}
        </div>
      ))}
    </div>
  );
};

export default MetadataTooltip;
