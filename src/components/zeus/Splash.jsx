import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/zeus/Logo";

const ROBOT_URL = "https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/a705301f8_image-removebg-preview.png";

export default function Splash() {
  const [show, setShow] = useState(() => !sessionStorage.getItem("zeus_splash"));

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("zeus_splash", "1");
    }, 2800);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <div className="absolute inset-0 zeus-grid-bg opacity-30" />
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="relative">
              <img src={ROBOT_URL} alt="Zeus" className="w-36 h-36 sm:w-44 sm:h-44 object-contain animate-float" />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.4 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute inset-0 -z-10 blur-3xl bg-zeus-gold/30 rounded-full"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative z-10 mt-4"
          >
            <Logo size={36} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="relative z-10 mt-2 text-xs text-muted-foreground font-body tracking-wider"
          >
            رفيقك الذكي في رحلة التعلّم
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 1.1, duration: 1.2 }}
            className="relative z-10 mt-5 h-0.5 bg-gradient-to-r from-transparent via-zeus-gold to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}