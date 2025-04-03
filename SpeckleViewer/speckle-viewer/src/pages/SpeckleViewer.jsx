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
import { makeMeasurementsUI } from '../components/MeasurementsUI'; 
import ExtendedSelection from '../components/ExtendedSelection';

import '../styled-components/HomeButton.css';

// Fetch Data from MongoDB like objectID
const fetchModelDataFromMongo = async () => {
  const databaseConnection = import.meta.env.VITE_DATABASE;
  const response = await fetch(`${databaseConnection}/api/models/67e6b1fc1e863b0dcf3aa431`, {
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
  const navigate = useNavigate();  

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
          measurements.enabled = true; 

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
          makeMeasurementsUI(newViewer);
          
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
        className="home-button"
        onClick={() => {
          navigate('/');  
          window.location.reload();  
        }}
      >
        Home
      </button>

    </div>
  );
};

export default SpeckleViewer;
