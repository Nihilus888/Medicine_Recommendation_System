import Viewer from '../components/Viewer';

function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-4xl font-bold mb-4">🚀 Speckle 3D Viewer</h2>
      <p className="text-lg text-gray-400 mb-6">Visualize your 3D models with metadata.</p>

      <Viewer />
    </div>
  );
}

export default Home;
