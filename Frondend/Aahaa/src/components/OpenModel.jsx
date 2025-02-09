import React from "react";
import { X } from "lucide-react";

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Enlarged view"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            style={{ margin: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
