
import HeroSection from "@/components/HeroSection/HeroSection";
import styles from "./page.module.css";
import RentByBrands from "@/components/RentByCars/RentByCars";
import CarCollection from "../components/CarCollection/CarCollection"

export default function Home() {
  return (
    <main className={styles.main}>
     <HeroSection/>
     <RentByBrands/>
     <CarCollection />

    </main>
  );
}
