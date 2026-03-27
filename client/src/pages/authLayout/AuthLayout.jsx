import React from 'react';
import logo from "../../assets/logo.jpeg"; // adjust path
import dual from "../../assets/dual.jpeg"; // adjust path

export const AuthLayout = ({ children, headerTitle }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">
      {/* Left side - Header + Form */}
      <div className="flex flex-col w-full p-4 md:w-1/2 sm:p-6 lg:p-8">
        <div>
          <div className="flex justify-start mb-2">
            <img src={logo} alt="logo" width={50} className="ml-3" />
            <h2 className="mt-3 text-xl">جمعية رؤى للتنمية بالمشاركة</h2>
          </div>
          <h1 className="text-2xl font-bold text-primary text-right">
            الوحدة الاقليمية للتعليم والتدريب الفنى المزدوج
          </h1>
        </div>
        <div className="flex items-center justify-center w-full max-w-md mx-auto mt-25">
          <div className="w-full p-12 bg-white bg-opacity-90 rounded-xl shadow-lg">
            <h2
              className="mb-6 text-2xl font-bold text-center"
              style={{ color: "var(--text-dark)" }}
            >
              {headerTitle}
            </h2>
            {children}
          </div>
        </div>
      </div>

      {/* Right side - Image only (hidden on mobile) */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={dual}
          alt="login"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

