"use client";

import { useState } from "react";
import { Preloader } from "@/components/ui/Preloader";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/chapters/Hero";
import { About } from "@/components/chapters/About";
import { Work } from "@/components/chapters/Work";
import { Playground } from "@/components/chapters/Playground";
import { Capabilities } from "@/components/chapters/Capabilities";
import { Contact } from "@/components/chapters/Contact";
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
        <Marquee text="See clearly — Run leaner — Scale confidently —" />
        <About />
        <Work />
        <Playground />
        <Capabilities />
        <Marquee
          text="Finance — Technology — A.I. —"
          speed={60}
          className="border-t-0"
        />
        <Contact />
      </main>
    </>
  );
}
