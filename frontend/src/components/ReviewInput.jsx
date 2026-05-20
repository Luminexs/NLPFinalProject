import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ReviewInput({ onPredict, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onPredict(text);
    }
  };

  const sampleReviews = [
    "I absolutely love this product! It works perfectly and the quality is amazing. Highly recommend to everyone.",
    "The item arrived broken and customer service was terrible. Do not buy from this seller, total scam!",
    "Great value for money. It's not perfect but for the price, you can't complain. Fast shipping too.",
    "Very nice set. Good quality. We have had the set for two months now and have not been",
    "love it, a great upgrade from the original. I've had mine for a couple of years"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a product review here to check its authenticity..."
          className="input-field min-h-[160px] text-lg resize-none pr-12 pt-4"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {sampleReviews.map((sample, i) => (
          <button
            key={i}
            onClick={() => setText(sample)}
            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all"
          >
            Sample {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
