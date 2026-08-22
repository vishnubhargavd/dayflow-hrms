import React, { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const AmbientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen w-full bg-[#0c0d14] text-zinc-100 selection:bg-[#714B67] selection:text-white overflow-x-hidden font-sans">
      {/* Dynamic Specular Mouse Glow */}
      <motion.div
        className="pointer-events-none fixed -inset-px z-30 opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(113, 75, 103, 0.18), rgba(1, 126, 132, 0.08), transparent 70%)`,
        }}
      />

      {/* Enterprise Fine Grid Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Ambient Glow Orb */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#714B67]/25 via-[#017E84]/12 to-transparent blur-[120px] pointer-events-none z-0 rounded-full" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
export default AmbientBackground;
