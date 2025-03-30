import React, { useEffect, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-900 text-white relative overflow-hidden">

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <motion.h1 
          className="text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Visualize Your {" "}
          <motion.span 
            className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse"
            whileHover={{ scale: 1.1 }}
          >
            <Typed 
              strings={["Architectural Vision", "Designs Like Never Before", "Dreams into Reality"]}
              typeSpeed={80}
              backSpeed={50}
              backDelay={1000}
              loop
            />
          </motion.span>
        </motion.h1>

        <motion.p 
          className="mt-6 max-w-3xl text-xl text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 1 }}
        >
          Explore, interact, and share your 3D architectural models with powerful visualization tools and collaborative features.
        </motion.p>

        <div className="mt-10 flex space-x-4">
          <Link to="/speckle-viewer">
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 py-3 px-8 rounded-lg font-bold transition duration-300 transform hover:scale-105 flex items-center border-2 border-transparent hover:border-blue-300 hover:shadow-blue-400/50 hover:shadow-lg"
              whileHover={{ scale: 1.1 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              View Demo
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-black bg-opacity-30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              className="text-3xl font-bold mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              Powerful {" "}
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                <Typed 
                  strings={["Features for Architects", "Creative Design Tools", "Next-Gen Collaboration"]}
                  typeSpeed={80}
                  backSpeed={50}
                  backDelay={1000}
                  loop
                />
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-6 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl shadow-lg border-2 border-blue-300 hover:shadow-lg hover:shadow-blue-400/50"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-2">Cloud-Based Storage</h3>
              <p className="text-gray-300">Store, access, and share your models from anywhere with secure cloud integration.</p>
            </motion.div>

            <motion.div 
              className="p-6 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl shadow-lg border-2 border-blue-300 hover:shadow-lg hover:shadow-blue-400/50"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-2">Interactive Visualization</h3>
              <p className="text-gray-300">Explore models with advanced controls, measurements, and cross-section tools.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
