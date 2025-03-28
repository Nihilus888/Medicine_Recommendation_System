import React, { useState, useEffect, useRef } from 'react';
import {
  Viewer,
  DefaultViewerParams,
  SpeckleLoader,
  CameraController,
  MeasurementsExtension,
  UrlHelper
} from '@speckle/viewer';

const fetchModelDataFromMongo = async () => {
  const response = await fetch('http://localhost:5000/api/models/67e6b1fc1e863b0dcf3aa431', { // Adjust this URL to the correct endpoint
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
    const [objectIds, setObjects] = useState([]); // Store objectIds here
    const authToken = "9e16053cbe2a0811802746b4e3531367a0874e43b0";  // Replace with your real token
    const projectId = 'c832429e56'; // Hardcoded project ID
  
    useEffect(() => {
      const initializeViewer = async () => {
        // Fetch model data
        const modelData = await fetchModelDataFromMongo();
        console.log('Model Data:', modelData);
        if (modelData && Array.isArray(modelData.objectIds)) {
          console.log('ModelData.objectIds', modelData.objectIds);
  
          // Set objectIds in state
          setObjects(modelData.objectIds);
  
          // Log the objectIds after state update
          console.log('Updated objectIds:', modelData.objectIds);
  
          if (viewerRef.current && !viewer) {
            const params = DefaultViewerParams;
            params.verbose = true;
  
            const newViewer = new Viewer(viewerRef.current, params);
            await newViewer.init();
  
            // Add the camera controller extension
            newViewer.createExtension(CameraController);
  
            // Add the measurements extension
            const measurements = newViewer.createExtension(MeasurementsExtension);
            measurements.enabled = true;
  
            setViewer(newViewer);
  
            // Load objects after viewer is initialized
            for (let objectId of modelData.objectIds) {
              console.log('objectId', objectId);
              const objectData = await fetchObjectData(projectId, objectId, authToken);
  
              if (objectData) {
                console.log('objectData for', objectId, ':', objectData);  // Log the objectData
    
                const urls = await UrlHelper.getResourceUrls(
                  `https://app.speckle.systems/projects/${projectId}/models/${objectId}`
                );
                console.log('Resource URLs for objectId', objectId, ':', urls);  // Log the resource URLs

                for (const url of urls) {
                    console.log('Loading URL:', url);  // Log each URL being loaded
                    const loader = new SpeckleLoader(newViewer.getWorldTree(), url, "");
                    await newViewer.loadObject(loader, true);
                  }
              } else {
                console.error(`No model found for object ${objectId}`);
              }
            }
          }
        } else {
          console.error("Model data or objectIds is invalid:", modelData);
        }
      };
  
      initializeViewer().catch((error) => {
        console.error("Failed to initialize viewer:", error);
      });
  
      return () => {
        if (viewer) {
          viewer.dispose();
        }
      };
    }, [viewerRef, viewer, authToken, projectId]);
  
    useEffect(() => {
      // Log objectIds whenever it changes
      console.log('Updated objectIds state:', objectIds);
    }, [objectIds]);
  
    return (
      <div>
        <div ref={viewerRef} style={{ width: '100%', height: '500px', marginTop: '80px' }} />
      </div>
    );
  };
  

export default SpeckleViewer;
