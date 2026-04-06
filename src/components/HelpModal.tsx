import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-display uppercase tracking-widest text-white mb-2">Help & Info</h2>
            
            <div className="help-modal_body">
              <p className="mb-4">
                Welcome to the SK Group Universe. Scroll down to explore our reality-bending applications.
              </p>
              <p>
                Use the navigation menu to access different sections of the platform, including Apps, Characters, and News.
              </p>
            </div>

            <div className="flex justify-end">
              <button className="help-modal_close-btn hover:bg-white/40 hover:text-white" onClick={onClose}>
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
