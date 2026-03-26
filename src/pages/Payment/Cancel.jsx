import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xl shadow-slate-200/60">
        {/* Cancel/Alert Icon */}
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-amber-50">
          <svg 
            className="w-10 h-10" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2.5" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          Payment Cancelled
        </h1>
        
        <p className="text-slate-600 mb-10 leading-relaxed">
          No worries! Your account hasn't been charged. If you ran into a technical issue or changed your mind, we're here to help.
        </p>

        <div className="space-y-4">
          <Link 
            to="/subscription" 
            className="block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-slate-200"
          >
            Return to Pricing
          </Link>
          
          <Link 
            to="/support" 
            className="block w-full py-4 bg-white border border-slate-200 text-slate-600 font-semibold rounded-2xl hover:bg-slate-50 transition-all"
          >
            Contact Support
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Need a custom plan? <span className="underline cursor-pointer">Talk to us.</span>
        </p>
      </div>
    </div>
  );
};

export default Cancel;