"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface FullscreenIframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  title?: string;
  allow?: string;
}

export function FullscreenIframeModal({
  isOpen,
  onClose,
  src,
  title = "Fullscreen Content",
  allow = "fullscreen",
}: FullscreenIframeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure we're on the client side before rendering portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  const modalContent = (
    <div
      ref={modalRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000",
      }}
      onClick={(e) => {
        // Close if clicking on backdrop (not the iframe or header)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: "1rem 1.5rem",
          background: "rgba(0, 0, 0, 0.8)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a06af9 0%, #6366f1 100%)",
              boxShadow: "0 0 10px rgba(160, 106, 249, 0.5)",
            }}
          />
          <span
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {title}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "0.375rem",
            padding: "0.5rem 0.75rem",
            color: "rgba(255, 255, 255, 0.9)",
            cursor: "pointer",
            fontSize: "0.875rem",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
          aria-label="Close fullscreen"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          Close
        </button>
      </div>

      {/* Iframe Container */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "#000",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          allow={allow}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            background: "#000",
          }}
        />
      </div>
    </div>
  );

  // Use React Portal to render outside the normal DOM hierarchy
  // Only render if document.body exists (client-side)
  if (typeof document !== "undefined" && document.body) {
    return createPortal(modalContent, document.body);
  }
  return null;
}
