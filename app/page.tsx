"use client";

import { useState } from "react";
import { Preloader } from "@/components/ui/Preloader";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/reel/Hero";
import { Manifesto } from "@/components/reel/Manifesto";
import { Registrations } from "@/components/reel/Registrations";
import { FAQ } from "@/components/reel/FAQ";
import { Reel } from "@/components/reel/Reel";
import { Services } from "@/components/reel/Services";
import { Contact } from "@/components/reel/Contact";
import { Marquee, ScrollProgress } from "@/components/ui/motion";
import { ChapterRail } from "@/components/ui/ChapterRail";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <Preloader onDone={() => setStarted(true)} />
      <ScrollProgress />
      <ChapterRail />
      <Header started={started} />
      <main id="main">
        <Hero started={started} />
        <Marquee text="Finance — Technology — A.I. —" outline />
        <Manifesto />
        <Registrations />
        <FAQ />
        <Reel />
        <Services />
        <Marquee text="UAE — UK — US — Registered — Filed — Compliant —" speed={70} />
        <Contact />
      </main>
    </>
  );
}
