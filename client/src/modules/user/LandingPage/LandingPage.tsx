"use client"
import React, { useRef } from "react";
import HeroSection from "../components/HeroSection/HeroSection";
import styles from "./LandingPage.module.css";
import RentByBrands from "../components/RentByCars/RentByCars";
import CarCollection from "../components/CarCollection/CarCollection"
import HowItWorks from "../components/HowItWorks/HowItWorks";
import OurServices from "../components/OurServices/OurServices";
import Testimonial from "../components/Testimonial/Testimonial"

const LandingPage: React.FC = () => {

  const rentByBrandsRef = useRef<HTMLDivElement>(null); // Ref for RentByBrands section

  const scrollToRentByBrands = () => {
    // Function to scroll to the RentByBrands section
    rentByBrandsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className={styles.main}>
    <HeroSection />
    <div ref={rentByBrandsRef}>
      <RentByBrands /> {/* Attach the ref to RentByBrands */}
    </div>
    <CarCollection onViewMore={scrollToRentByBrands} /> {/* Pass scroll function to CarCollection */}
    <HowItWorks />
    <OurServices />
    <Testimonial />
  </main>

  );
};

export default LandingPage;
