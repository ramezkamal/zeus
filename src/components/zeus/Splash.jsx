import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROBOT_URL = "https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/a705301f8_image-removebg-preview.png";

export default function Splash() {
  const [show, setShow] = useState(() => !sessionStorage.getItem("zeus_splash"));

  useEffect(() => {
    const theme = localStorage.getItem("zeus_theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("zeus_splash", "1");
    }, 2200);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img src={ROBOT_URL} alt="Zeus" className="w-32 h-32 object-contain animate-float" />
            </motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="font-heading font-extrabold text-5xl zeus-gold-text -mt-2"
            >
              Z
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}