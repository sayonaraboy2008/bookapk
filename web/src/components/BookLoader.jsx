import React from 'react';
import { BookOpen } from 'lucide-react';

export default function BookLoader({ text = "Sahifalar ochilmoqda..." }) {
  return (
    <div className="book-loader-overlay">
      <div className="book-loader-box">
        {/* Animated 3D Flipping Book */}
        <div className="book-3d">
          <div className="book-spine" />
          <div className="book-page-back" />
          
          {/* Flipping pages with staggered animation */}
          <div className="flipping-page flip-1">
            <div className="page-line line-1" />
            <div className="page-line line-2" />
            <div className="page-line line-3" />
          </div>
          <div className="flipping-page flip-2">
            <div className="page-line line-1" />
            <div className="page-line line-2" />
          </div>
          <div className="flipping-page flip-3">
            <div className="page-line line-2" />
            <div className="page-line line-3" />
          </div>
          <div className="flipping-page flip-4">
            <div className="page-line line-1" />
            <div className="page-line line-3" />
          </div>
          
          <div className="book-page-front" />
        </div>

        {/* Brand Badge */}
        <div className="loader-brand-row">
          <div className="loader-brand-icon">
            <BookOpen size={16} strokeWidth={2.5} />
          </div>
          <span className="loader-brand-title">folio</span>
        </div>

        {/* Shimmering Loading Text */}
        <p className="loader-caption">{text}</p>

        {/* Micro progress glow */}
        <div className="loader-progress-track">
          <div className="loader-progress-bar" />
        </div>
      </div>
    </div>
  );
}
