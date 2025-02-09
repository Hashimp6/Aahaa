import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const ShareProfileButton = ({ sellerData }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Get the current URL
  const currentUrl = `https://www.ebycedy.com/seller-profile/${sellerData._id}`;
  
  // Create share data
  const shareData = {
    title: `${sellerData.companyName} - Profile`,
    text: `Check out ${sellerData.companyName}'s profile!`,
    url: currentUrl
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to copy to clipboard
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-2 rounded-full bg-teal-50 hover:bg-teal-100 transition-colors"
      >
        {copied ? (
          <Check className="w-5 h-5 text-teal-600" />
        ) : (
          <Share2 className="w-5 h-5 text-teal-600" />
        )}
      </button>
      
      {/* Simple Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
          {copied ? 'Copied!' : 'Share profile'}
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
};

export default ShareProfileButton;