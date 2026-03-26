import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Optional: Call your backend to verify the session
      console.log("Verifying session:", sessionId);
    }
  }, [sessionId]);
  
useEffect(() => {
  const verifyPayment = async () => {
    const { data } = await supabase
      .from('users')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    if (data?.subscription_status === 'active') {
       // Stop loading, show success UI
    }
  };
  verifyPayment();
}, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xl shadow-slate-200/60">
        {/* Animated Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-emerald-50">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          Payment Confirmed
        </h1>
        
        <p className="text-slate-600 mb-10 leading-relaxed">
          Thank you for your trust! Your subscription is now active. You’ve been upgraded to <span className="font-semibold text-slate-900">Pro</span> status.
        </p>

        <div className="space-y-4">
          <Link 
            to="/dashboard" 
            className="block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-slate-200"
          >
            Go to Dashboard
          </Link>
          
          <p className="text-xs text-slate-400">
            A receipt has been sent to your email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;