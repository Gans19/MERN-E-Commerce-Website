"use client";

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion

import Logo from "./assets/EverShop.png";

// Dynamically import Lottie for Next.js (to avoid SSR issues)
const Lottie = dynamic(() => import('react-lottie').then(mod => mod.default), { 
  ssr: false, 
  loading: () => <p>Loading animation...</p>  // Optional loading text
});

export default function Home() {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  // Dynamically load the animation data to avoid SSR issues
  useEffect(() => {
    import('./assets/fda.json').then(data => setAnimationData(data.default));
  }, []);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    
  };

  // Simulate applying the coupon code
  const applyCouponCode = () => {
    setIsApplying(true); // Start loader

    setTimeout(() => {
      setIsApplying(false); // Stop loader after a delay
      setIsApplied(true);   // Show success state
      setIsFullScreen(true); // Trigger Lottie animation
    }, 2000); // Simulate a 2-second apply time
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <div>
      {/* Logo */}
      <div className="text-center py-8">
        <Image src={Logo} alt="Logo" width={100} height={100} />
      </div>

      {/* Coupon Code Input */}
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />

        {/* Apply Button */}
        <motion.button
          onClick={applyCouponCode}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
          disabled={isApplying}
        >
          {isApplying ? (
            // Show loader when applying
            <motion.div
              className="loader w-4 h-4 border-2 border-t-2 border-t-white border-blue-200 rounded-full animate-spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            // Show text when not applying
            'Apply Coupon'
          )}
        </motion.button>
      </div>

      {/* Fullscreen Lottie Animation */}
      {isFullScreen && (
        <Suspense fallback={<div>Loading animation...</div>}>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={closeFullScreen} // Click anywhere to close
          >
            {animationData && (
              <Lottie
                options={defaultOptions}
                height={350}
                width={350}
                speed={100}
                eventListeners={[
                  {
                    eventName: 'complete',
                    callback: () => closeFullScreen(), // Close fullscreen when animation completes
                  },
                ]}
              />
            )}
          </div>
        </Suspense>
      )}
    </div>
  );
}
