"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ScrollAnimation = ({ 
  children, 
  animation = "fadeIn", 
  duration = 0.8, 
  delay = 0,
  threshold = 0.2,
  className = ""
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: threshold,
  });

  const animations = {
    fadeIn: {
      opacity: inView ? 1 : 0,
      transition: {
        duration: duration,
        delay: delay,
      },
    },
    slideUp: {
      opacity: inView ? 1 : 0,
      y: inView ? 0 : 50,
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
        stiffness: 35,
        damping: 15,
      },
    },
    slideDown: {
      opacity: inView ? 1 : 0,
      y: inView ? 0 : -50,
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
        stiffness: 35,
        damping: 15,
      },
    },
    slideLeft: {
      opacity: inView ? 1 : 0,
      x: inView ? 0 : -50,
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
        stiffness: 35,
        damping: 15,
      },
    },
    slideRight: {
      opacity: inView ? 1 : 0,
      x: inView ? 0 : 50,
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
        stiffness: 35,
        damping: 15,
      },
    },
    scaleUp: {
      opacity: inView ? 1 : 0,
      scale: inView ? 1 : 0.5,
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
        stiffness: 70,
        damping: 15,
      },
    },
    scaleDown: {
      opacity: inView ? 1 : 0,
      scale: inView ? 1 : 1.5,
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
        stiffness: 70,
        damping: 15,
      },
    },
    rotate: {
      opacity: inView ? 1 : 0,
      rotate: inView ? 0 : 45,
      transition: {
        duration: duration,
        delay: delay,
      },
    },
    flipX: {
      opacity: inView ? 1 : 0,
      rotateX: inView ? 0 : 90,
      transition: {
        duration: duration * 1.3,
        delay: delay,
      },
    },
    flipY: {
      opacity: inView ? 1 : 0,
      rotateY: inView ? 0 : 90,
      transition: {
        duration: duration * 1.3,
        delay: delay,
      },
    },
    zoomWithBounce: {
      opacity: inView ? 1 : 0,
      scale: inView ? 1 : 0.3,
      transition: {
        type: "spring",
        stiffness: 160,
        damping: 25,
        delay: delay,
        duration: duration * 1.5,
      },
    },
    popUp: {
      opacity: inView ? 1 : 0,
      scale: inView ? 1 : 0,
      transition: {
        duration: duration * 1.2,
        delay: delay,
        type: "spring",
        stiffness: 180,
        damping: 20,
      },
    },
    elasticUp: {
      opacity: inView ? 1 : 0,
      y: inView ? 0 : 100,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay,
        duration: duration * 1.5,
      },
    },
    elasticLeft: {
      opacity: inView ? 1 : 0,
      x: inView ? 0 : -100,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay,
        duration: duration * 1.5,
      },
    },
    elasticRight: {
      opacity: inView ? 1 : 0,
      x: inView ? 0 : 100,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay,
        duration: duration * 1.5,
      },
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={animations[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation; 