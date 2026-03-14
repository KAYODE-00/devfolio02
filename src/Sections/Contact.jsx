import { useGSAP } from "@gsap/react";
import AnimatedHeaderSection from "../Components/AnimatedHeaderSection";
import Marquee from "../Components/Marquee";
import { socials } from "../constants";
import gsap from "gsap";
import { Link } from "react-router-dom";


const Contact = () => {
  const text = `Got a question, how or project Idea?
    i’D love to hear from you and discus further!`;
  const items = [
    "I'm a Dev",
    "I'm a Dev",
    "I'm a Dev",
    "I'm a Dev",
    "I'm a Dev",
  ];
    const items2 = [
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "TYPESCRIPT",
    "REACT",
    "NEXT JS",
    "SUPABASE",
    "FIREBASE",
    "CLERK",
    // "JAVASCRIPT",
  ];
  useGSAP(() => {
    gsap.from(".social-link", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: {
        trigger: ".social-link",
      },
    });
  }, []);
  return (<>

          <Marquee
            items={items2}
            // iconClassName="stroke-gold stroke-2 text-primary"
            icon="tdesign:code"
          />
    <section
      id="contact"
      className="flex flex-col justify-between min-h-screen bg-black"
    >
      <div>
        <AnimatedHeaderSection
          subTitle={"You Dream It, I Code it"}
          title={"Contact"}
          text={text}
          textColor={"text-white"}
          withScrollTrigger={true}
        />
        <div className="flex px-10 font-light text-white uppercase lg:text-[32px] text-[26px] leading-none mb-10">
          <div className="flex flex-col w-full gap-10">
            <div className="social-link">
              <h2>Message Ai</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <Link
                to="/digitalVersion"
                className="text-xl tracking-widest hover:text-white transition-colors duration-300"
              >
                AI
              </Link>
            </div>
            <div className="social-link">
              <h2>E-mail</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <p className="text-xl tracking-wider lowercase md:text-2xl lg:text-3xl">
                abdulwahabkayode001@gmail.com
              </p>
            </div>
            <div className="social-link">
              <h2>Phone</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <p className="text-xl lowercase md:text-2xl lg:text-3xl">
                +2347-066242231
              </p>
            </div>
            <div className="social-link">
              <h2>Social Media</h2>
              <div className="w-full h-px my-2 bg-white/30" />
              <div className="flex flex-wrap gap-2">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-xs leading-loose tracking-wides uppercase md:text-sm hover:text-white/80 transition-colors duration-200"
                  >
                   
                    {social.name}

                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Marquee items={items} className="text-white bg-transparent" />
    </section>
    </>
  );
};

export default Contact;
