import React from 'react';
import { motion } from 'framer-motion';

// FeatureCard Component to display individual feature information
function FeatureCard({ title, description }) {
  return (
    <motion.div
      className="p-6 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl shadow-lg border-2 border-blue-300 hover:shadow-lg hover:shadow-blue-400/50"
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}

export default FeatureCard;
