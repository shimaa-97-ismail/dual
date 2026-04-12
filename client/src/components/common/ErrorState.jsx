import React from 'react'

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred.',
  onRetry,
  showRetry = true,
}) => (
  <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg text-center max-w-md mx-auto my-4">
    <div className="text-4xl mb-4">⚠️</div>
    <h2 className="text-red-800 text-xl font-semibold mb-2">{title}</h2>
    <p className="text-red-700 mb-4">{message}</p>
    {showRetry && onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
  )


