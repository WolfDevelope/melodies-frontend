import React from 'react';

const SignupHeader = ({ currentStep = 1 }) => {
  return (
    <div className="w-full max-w-md mx-auto pt-12">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Melodies
        </h1>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div 
            className={`h-1 flex-1 rounded transition-all duration-300 ${
              currentStep >= 1 ? 'bg-pink-500' : 'bg-gray-600'
            }`}
          ></div>
          <div 
            className={`h-1 flex-1 rounded mx-2 transition-all duration-300 ${
              currentStep >= 2 ? 'bg-pink-500' : 'bg-gray-600'
            }`}
          ></div>
          <div 
            className={`h-1 flex-1 rounded transition-all duration-300 ${
              currentStep >= 3 ? 'bg-pink-500' : 'bg-gray-600'
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SignupHeader;
