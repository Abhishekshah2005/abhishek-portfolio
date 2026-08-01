"use client";

import { useState } from "react";
import { Preloader } from "@/components/ui/Preloader";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/reel/Hero";
import { Manifesto } from "@/components/reel/Manifesto";
import { Reel } from "@/components/reel/Reel";
import { Services } from "@/components/reel/Services";
import { Contact } from "@/components/reel/Contact";
import { Marquee, ScrollProgress } from "@/components/ui/motion";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <Preloader onDone={() => setStarted(true)} />
      <ScrollProgress />
      <Header started={started} />
      <main id="main">
        <Hero started={started} />
        <Marquee text="Finance — Technology — A.I. —" outline />
        <Manifesto />
        <Reel />
        <Services />
        <Marquee text="See clearly — Run leaner — Scale confidently —" speed={70} />
        <Contact />
      </main>
    </>
  );
}
