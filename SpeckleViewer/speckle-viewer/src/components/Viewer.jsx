import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing

function Viewer() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();  // Initialize navigate function

  // Placeholder for fetching data later
  const fetchMetadata = () => {
    const metadata = {
      objectId: "123456",
      name: "Sample Object",
      type: "Geometry",
      createdAt: "2025-03-28",
    };
    setData(metadata);
    
    // Navigate to the ThreeDViewer component and pass metadata as state
    navigate('/speckle-viewer', { state: { metadata } });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-3/4 max-w-md text-center">
      <h3 className="text-2xl font-semibold mb-4">📦 Object Metadata</h3>
      {data ? (
        <div className="text-left mb-6">
          <p><strong>ID:</strong> {data.objectId}</p>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Type:</strong> {data.type}</p>
          <p><strong>Created At:</strong> {data.createdAt}</p>
        </div>
      ) : (
        <p>No data fetched yet.</p>
      )}

      <button
        onClick={fetchMetadata}
        className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white"
      >
        Fetch Sample Metadata
      </button>
    </div>
  );
}

export default Viewer;
