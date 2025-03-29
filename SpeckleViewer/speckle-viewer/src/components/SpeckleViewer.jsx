import React, { useState, useEffect, useRef } from 'react';
import {
  Viewer,
  DefaultViewerParams,
  SpeckleLoader,
  CameraController,
  MeasurementsExtension,
  UrlHelper,
} from '@speckle/viewer';

import { makeMeasurementsUI } from './MeasurementsUI'; // Import your UI function

const fetchModelDataFromMongo = async () => {
  const response = await fetch('http://localhost:5000/api/models/67e6b1fc1e863b0dcf3aa431', { 
    method: 'GET',
  });

  if (!response.ok) {
    console.error('Failed to fetch model data from backend.');
    return null;
  }

  const data = await response.json();
  console.log('Backend response:', data);
  return data;
};

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
  const [objectIds, setObjects] = useState([]);
  const authToken = "9e16053cbe2a0811802746b4e3531367a0874e43b0"; // Replace with your token
  const projectId = 'c832429e56'; // Hardcoded project ID

  useEffect(() => {
    const initializeViewer = async () => {
      // Fetch model data
      const modelData = await fetchModelDataFromMongo();
      if (modelData && Array.isArray(modelData.objectIds)) {
        setObjects(modelData.objectIds);

        if (viewerRef.current && !viewer) {
          const params = DefaultViewerParams;
          params.verbose = true;

          // Initialize Viewer
          const newViewer = new Viewer(viewerRef.current, params);
          await newViewer.init();

          // Add Extensions
          newViewer.createExtension(CameraController);
          const measurements = newViewer.createExtension(MeasurementsExtension);
          measurements.enabled = true; // Enable Measurements

          setViewer(newViewer);

          // Load Objects
          for (let objectId of modelData.objectIds) {
            const objectData = await fetchObjectData(projectId, objectId, authToken);
            if (objectData) {
              const urls = await UrlHelper.getResourceUrls(
                `https://app.speckle.systems/projects/${projectId}/models/${objectId}`
              );
              for (const url of urls) {
                const loader = new SpeckleLoader(newViewer.getWorldTree(), url, "");
                await newViewer.loadObject(loader, true);
              }
            } else {
              console.error(`No model found for object ${objectId}`);
            }
          }

          // Initialize Measurements UI
          console.log("Initializing Measurements UI...");
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

  useEffect(() => {
    console.log('Updated objectIds state:', objectIds);
  }, [objectIds]);

  return (
    <div>
      <div 
        ref={viewerRef} 
        style={{ width: '100%', height: '500px', marginTop: '80px' }} 
      />
    </div>
  );
};

export default SpeckleViewer;
