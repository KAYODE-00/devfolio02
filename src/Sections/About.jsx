import { useRef } from "react";
import AnimatedHeaderSection from "../Components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../Components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const About = () => {
  const text = `Modern React & Next.js Developer
Building scalable, responsive web applications
Focused on clean UI, performance, and real-world products`;

  const aboutText = `I’m a modern React developer passionate about building clean, responsive, and production-ready web applications. From pixel-perfect interfaces to fully functional integrations, I care deeply about structure, performance, and user experience.

My core stack includes React, Next.js, JavaScript, and Tailwind CSS — supported by modern UI systems like shadcn/ui and Acernity UI. I integrate authentication and databases using Clerk, Supabase, Firebase, and Neon to turn frontend experiences into complete working products.

I approach every project with intention: plan the architecture, design the experience in Figma, and build reusable components that scale.

When I’m not coding:
⚡️ Improving my fullstack architecture skills through deep practice  
🎨 Designing clean UI systems and experimenting with layouts  
🚀 Planning and building SaaS-style projects  

My long-term goal is to master fullstack development and build digital products that are fast, reliable, and impactful.`;

  const imgRef = useRef(null);

  useGSAP(() => {
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
        markers: false,
      },
      ease: "power1.inOut",
    });

    gsap.set(imgRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    gsap.to(imgRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "power4.out",
      scrollTrigger: { trigger: imgRef.current },
    });
  });

  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Code with purpose. Built for real-world impact."}
        title={"About Me"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />

      <div className="flex flex-col items-center justify-between gap-16 px-10 pb-16 text-xl font-light tracking-wide lg:flex-row md:text-2xl lg:text-3xl text-white/60">
        <img
          ref={imgRef}
          src="images/man.jpg"
          alt="Abdulwahab Kayode"
          className="w-md rounded-3xl"
        />
        <AnimatedTextLines text={aboutText} className={"w-full"} />
      </div>
    </section>
  );
};

export default About;
