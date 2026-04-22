"use client";

import { jarallax } from "jarallax";
import { useEffect, useRef } from "react";

export default function ParallaxContainer(props) {
  const ref = useRef(null);

  useEffect(() => {
    console.log("=== ParallaxContainer mounted ===");
    console.log("WOW available:", !!window.WOW);
    console.log("Splitting available:", !!window.Splitting);
    console.log("jarallax available:", !!window.jarallax);
    console.log(".wow elements found:", document.querySelectorAll(".wow").length);
    console.log(".parallax-5 elements found:", document.querySelectorAll(".parallax-5").length);

    const elements = document.querySelectorAll(".parallax-5");
    if (elements.length) {
      jarallax(elements, { speed: 0.5 });
    }
  }, []);

  return (
    <div ref={ref} {...props}>
      {props.children}
    </div>
  );
}