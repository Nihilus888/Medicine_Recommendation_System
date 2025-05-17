import React, { useState } from 'react';

function RecommendByUsage() {
  const [medicineName, setMedicineName] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async (e) => {
    if (e) e.preventDefault(); // prevent form submit reload

    if (!medicineName.trim()) {
      setError('Please enter a medicine name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/recommend/usage?name=${encodeURIComponent(medicineName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const data = await response.json();
      setRecommendations(data.recommended || []);
      setMedicineName(''); // clear input after submit, optional
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Recommend Medicines by Usage</h2>

      <form onSubmit={fetchRecommendations} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          aria-label="Medicine name"
          placeholder="Enter medicine name"
          value={medicineName}
          onChange={e => setMedicineName(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !medicineName.trim()}
          style={{
            padding: '0 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: loading || !medicineName.trim() ? '#ccc' : '#007bff',
            color: 'white',
            cursor: loading || !medicineName.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
      )}

      {recommendations.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {recommendations.map((med, index) => (
            <li
              key={index}
              style={{
                padding: '0.5rem',
                borderBottom: '1px solid #eee',
                fontWeight: '500',
              }}
            >
              {med}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p style={{ textAlign: 'center', color: '#555' }}>No recommendations yet.</p>
      )}
    </div>
  );
}

export default RecommendByUsage;
