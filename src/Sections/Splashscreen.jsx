import React, { useEffect, useState } from "react";

const Splashscreen = ({ isReady, setIsReady }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsLeaving(true), 1200);
    const exitTimer = setTimeout(() => setIsReady(true), 1700);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [setIsReady]);

  if (isReady) return null;

  return (
    <section
      className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-DarkLava text-primary transition-all duration-500 ${
        isLeaving ? "opacity-0 translate-y-8 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(207,163,85,0.26),transparent_48%),radial-gradient(circle_at_80%_70%,rgba(139,139,115,0.22),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-4xl px-8 md:px-12">
        <p className="text-xs sm:text-sm uppercase tracking-[0.45rem] text-primary/80">Hi, I'm a dev</p>
        <h2 className="mt-4 text-[14vw] leading-[0.9] uppercase sm:text-[108px] text-primary">
          Abdulwahab Kayode
        </h2>
        <p className="mt-6 text-lg font-light text-primary/90 sm:text-2xl">
          Building premium web experiences
        </p>

      </div>
    </section>
  );
};

export default Splashscreen;
