
import HeroSection from "../components/HeroSection/HeroSection";
import styles from "./LandingPage.module.css";
import RentByBrands from "../components/RentByCars/RentByCars";
import CarCollection from "../components/CarCollection/CarCollection"
import HowItWorks from "../components/HowItWorks/HowItWorks";
import OurServices from "../components/OurServices/OurServices";
import Testimonial from "../components/Testimonial/Testimonial"

const LandingPage: React.FC = () => {


  return (
    <main className={styles.main}>
     <HeroSection/>
     <RentByBrands/>
     <CarCollection />
     <HowItWorks />
     <OurServices />
     <Testimonial />
    </main>
  );
};

export default LandingPage;
