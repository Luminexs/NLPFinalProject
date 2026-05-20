import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, History, Trash2, Zap, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewInput from './components/ReviewInput';
import ResultCard from './components/ResultCard';

const API_URL = 'http://localhost:8000';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('review_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('review_history', JSON.stringify(history));
  }, [history]);

  const handlePredict = async (text) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, { text });
      const newResult = response.data;
      setResult(newResult);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        text: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
        ...newResult
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 10)); // Keep last 10
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to the analysis server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('review_history');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">VeriReview AI</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Fake Review Detection System</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <a href="#" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
            <ExternalLink className="w-6 h-6" />
          </a>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Input & Results */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-xl leading-tight">
              Analyze product reviews with <span className="text-primary">BERT precision.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-lg">
              Identify deceptive patterns and AI-generated reviews in seconds using our fine-tuned transformer model.
            </p>
          </div>

          <ReviewInput onPredict={handlePredict} isLoading={loading} />

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="p-4 bg-fake/10 border border-fake/20 rounded-xl text-fake text-sm flex gap-3 items-center"
            >
              <Zap className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {result && <ResultCard key={result.id || 'current'} result={result} />}
          </AnimatePresence>
        </div>

        {/* Right Column: History */}
        <aside className="lg:col-span-4">
          <div className="glass-card p-6 sticky top-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Recent Analysis
              </h3>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="p-1.5 hover:bg-white/5 rounded-md text-gray-500 hover:text-fake transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-600">No recent activity</p>
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all cursor-pointer group"
                    onClick={() => setResult(item)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                        item.label === 'FAKE' ? 'bg-fake/20 text-fake' : 'bg-real/20 text-real'
                      }`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] text-gray-600 font-mono">
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-200 transition-colors">
                      "{item.text}"
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-primary tracking-wider">Fast Inference</p>
                  <p className="text-xs text-gray-400">Targeting 100-300ms latency</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="mt-24 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2026 VeriReview AI. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">API Status</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
