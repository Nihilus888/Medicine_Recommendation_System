import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import {
  Viewer,
  DefaultViewerParams,
  SpeckleLoader,
  CameraController,
  MeasurementsExtension,
  UrlHelper,
} from '@speckle/viewer';

import MetadataTooltip from '../components/MetaDataToolTip';
import { makeMeasurementsUI } from '../components/MeasurementsUI'; // Import your UI function
import ExtendedSelection from '../components/ExtendedSelection';

// Fetch Data from Mongo DB like objectID
const fetchModelDataFromMongo = async () => {
  const response = await fetch('http://localhost:5000/api/models/67e6b1fc1e863b0dcf3aa431', {
    method: 'GET',
  });

  if (!response.ok) {
    console.error('Failed to fetch model data from backend.');
    return null;
  }

  const data = await response.json();
  return data;
};

// Fetch object data from speckle
const fetchObjectData = async (projectId, objectId, authToken) => {
  const response = await fetch(
    `https://app.speckle.systems/objects/${projectId}/${objectId}/single`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.error(`Failed to fetch object: ${objectId}`);
    return null;
  }

  const data = await response.json();
  return data;
};

const SpeckleViewer = () => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [selectedMetadata, setSelectedMetadata] = useState(null);
  const authToken = import.meta.env.VITE_SPECKLE_TOKEN;
  const projectId = import.meta.env.VITE_APP_PROJECT_ID; 
  const navigate = useNavigate();  // Use the useNavigate hook

  useEffect(() => {
    const initializeViewer = async () => {
      // Fetch model data
      const modelData = await fetchModelDataFromMongo();
      if (modelData && Array.isArray(modelData.objectIds)) {
        // Set objectIds
        const objectIds = modelData.objectIds;

        if (viewerRef.current && !viewer) {
          const params = DefaultViewerParams;
          params.verbose = true;

          // Initialize Viewer
          const newViewer = new Viewer(viewerRef.current, params);
          await newViewer.init();

          // Add Extensions
          newViewer.createExtension(CameraController);

          // Initialize Measurement UI
          const measurements = newViewer.createExtension(MeasurementsExtension);
          measurements.enabled = true; // Activate measurements UI

          // Wait for all objects to load and then load the objects
          const loadPromises = [];
          for (let objectId of objectIds) {
            const objectData = await fetchObjectData(projectId, objectId, authToken);
            if (objectData) {
              const urls = await UrlHelper.getResourceUrls(
                `https://app.speckle.systems/projects/${projectId}/models/${objectId}`
              );
              for (const url of urls) {
                const loader = new SpeckleLoader(newViewer.getWorldTree(), url, "");
                loadPromises.push(newViewer.loadObject(loader, true));
              }
            } else {
              console.error(`No model found for object ${objectId}`);
            }
          }

          // Initialize Extended Selection
          const extendedSelection = newViewer.createExtension(ExtendedSelection);
          extendedSelection.init();

          extendedSelection.setMetadataCallback(setSelectedMetadata);

          // Wait for all objects to load
          await Promise.all(loadPromises);

          setViewer(newViewer);

          // Initialize Measurements UI
          makeMeasurementsUI(newViewer); // Call your UI function
          
        }
      } else {
        console.error("Model data or objectIds is invalid:", modelData);
      }
    };

    initializeViewer().catch((error) => {
      console.error("Failed to initialize viewer:", error);
    });

    // Cleanup viewer on component unmount
    return () => {
      if (viewer) viewer.dispose();
    };
  }, [viewerRef, viewer, authToken, projectId]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div ref={viewerRef} style={{ flex: 1, height: '650px' }} />

      {/* Metadata Tooltip Component */}
      {selectedMetadata && <MetadataTooltip metadata={selectedMetadata} />}

      {/* Home Button */}
      <button
        onClick={() => {
          navigate('/');  
          window.location.reload();  
        }}
  
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '50%',
          transform: 'translate(-50%, 50%)',  // Center the button at the bottom
          padding: '12px 24px',
          backgroundColor: '#5a009c',  // Indigo background
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease-in-out',  // Smooth transition for hover and active states
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translate(-50%, 50%) scale(1.1)';  // Slight scale-up effect
          e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translate(-50%, 50%) scale(1)';  // Reset scale
          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';  // Reset shadow
        }}
        onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(90, 0, 156, 0.8)'} // Focus effect
        onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'} // Remove focus effect
      >
        Home
      </button>

    </div>
  );
};

export default SpeckleViewer;
