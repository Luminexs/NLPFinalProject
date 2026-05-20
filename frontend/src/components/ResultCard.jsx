import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import ConfidenceBar from './ConfidenceBar';

export default function ResultCard({ result }) {
  if (!result) return null;

  const isFake = result.label === 'FAKE';
  const colorClass = isFake ? 'text-fake' : 'text-real';
  const bgColorClass = isFake ? 'bg-fake/10' : 'bg-real/10';
  const borderColorClass = isFake ? 'border-fake/20' : 'border-real/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-8 border-2 ${borderColorClass} max-w-2xl mx-auto`}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-2xl ${bgColorClass}`}>
          {isFake ? (
            <AlertTriangle className={`w-8 h-8 ${colorClass}`} />
          ) : (
            <CheckCircle2 className={`w-8 h-8 ${colorClass}`} />
          )}
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Prediction Result</h2>
          <p className={`text-4xl font-bold tracking-tight ${colorClass}`}>
            {result.label} REVIEW
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-500 uppercase">Confidence</p>
          <p className="text-2xl font-mono">{(result.confidence * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="space-y-6">
        <ConfidenceBar 
          label="Likely Real" 
          value={result.probabilities.real} 
          color="bg-real" 
        />
        <ConfidenceBar 
          label="Likely Fake" 
          value={result.probabilities.fake} 
          color="bg-fake" 
        />
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex gap-3 text-sm text-gray-400 italic">
        <Info className="w-4 h-4 shrink-0" />
        <p>
          {isFake 
            ? "This review shows patterns commonly associated with generated or manipulative content."
            : "This review appears natural and consistent with genuine human feedback."}
        </p>
      </div>
    </motion.div>
  );
}
