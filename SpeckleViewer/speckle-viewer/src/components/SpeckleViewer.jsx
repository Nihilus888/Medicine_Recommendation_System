import React, { useState, useEffect, useRef } from 'react';
import {
  Viewer,
  DefaultViewerParams,
  SpeckleLoader,
  CameraController,
  MeasurementsExtension,
  UrlHelper
} from '@speckle/viewer';

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
  const authToken = "2f6643db506822f49a201f9ed48aed0dafbe494746";
  const projectId = 'c832429e56'; // Hardcoded project ID

  const objectIds = [
    "2722643df1aa812ba2e90f0d775edb14",
    "69cc0e9b45f4a1c51f138a3c1402ba40",
    "abbb72b174c5b5691ab66d9fffb964ff",
    "6cd769d3ed0a2ec88407506ee5ca912a",
  ];

  // Initialize the viewer once with extensions
  useEffect(() => {
    if (viewerRef.current && !viewer) {
      const params = DefaultViewerParams;
      params.verbose = true;

      const newViewer = new Viewer(viewerRef.current, params);
      newViewer.init().then(async () => {
        // Add the camera controller extension
        newViewer.createExtension(CameraController);

        // Add the measurements extension
        const measurements = newViewer.createExtension(MeasurementsExtension);
        measurements.enabled = true;

        setViewer(newViewer);

        // Load objects after viewer is initialized
        for (let objectId of objectIds) {
          const objectData = await fetchObjectData(projectId, objectId, authToken);
          if (objectData) {
            const urls = await UrlHelper.getResourceUrls(
              `https://app.speckle.systems/projects/${projectId}/models/${objectId}`
            );
            for (const url of urls) {
              const loader = new SpeckleLoader(newViewer.getWorldTree(), url, "");
              await newViewer.loadObject(loader, true);
            }
          }
        }
      });

      return () => {
        newViewer.dispose(); // Cleanup on unmount
      };
    }
  }, [viewerRef, viewer, authToken, projectId, objectIds]);

  return (
    <div>
      <div ref={viewerRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default SpeckleViewer;
