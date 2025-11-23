import React, { useState } from 'react';

export function TutorialOverlay({ onClose, t }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Icons corresponding to the steps
  const icons = ["👋", "board", "🔄", "🎯", "🏆"];

  const steps = t ? t.tutorial.steps : [];
  const step = steps[currentStep] || {};
  const currentIcon = icons[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!t) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-4xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-white/5">
            {currentIcon === "board" ? "🗺️" : currentIcon}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">{step.title}</h3>
            <p className="text-stone-400 leading-relaxed">{step.content}</p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'bg-amber-500 w-6' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <div className="flex w-full gap-3 pt-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${
                currentStep === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t.buttons.prev}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold uppercase tracking-wider text-xs hover:shadow-lg hover:shadow-amber-900/40 transition-all transform hover:scale-[1.02]"
            >
              {currentStep === steps.length - 1 ? t.buttons.start : t.buttons.next}
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
