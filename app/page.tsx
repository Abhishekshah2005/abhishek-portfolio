"use client";

import { useState } from "react";
import { Preloader } from "@/components/ui/Preloader";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/reel/Hero";
import { Manifesto } from "@/components/reel/Manifesto";
import { Registrations } from "@/components/reel/Registrations";
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
        <Registrations />
        <Reel />
        <Services />
        <Marquee text="UAE — UK — US — Registered — Filed — Compliant —" speed={70} />
        <Contact />
      </main>
    </>
  );
}
