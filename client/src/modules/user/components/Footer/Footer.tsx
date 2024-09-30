// components/Footer.tsx
import styles from './Footer.module.css';
import { useRouter } from 'next/navigation';

const Footer: React.FC = () => {

  const router = useRouter();

  const goToAdmin = () => {
    router.push('/admin/admin-login'); // Navigates to the admin route
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.downloadSection}>
        <div className={styles.downloadContent}>
          <h2 className={styles.heading}>Download our mobile app ⚡</h2>
          <p className={styles.description}>
            Get exclusive access to car rentals with our mobile app. Download
            now and experience convenience on the go.
          </p>
        </div>
        <div className={styles.storeButtons}>
          <a href="/" className={styles.storeLink}>
            <img
              src="/Footer/app-store.svg" // Replace with your actual image
              alt="Download on the App Store"
              className={styles.storeImage}
            />
          </a>
          <a href="/" className={styles.storeLink}>
            <img
              src="/Footer/google-play.svg" // Replace with your actual image
              alt="Get it on Google Play"
              className={styles.storeImage}
            />
          </a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.logo}>
        <button onClick={goToAdmin} className={styles.logoButton} aria-label="Go to Admin">
          <img
            src="/Footer/Heading-logo.svg" // Replace with your actual logo image
            alt="LuxeDrive Logo"
            className={styles.logoImage}
          />
          </button>
        </div>
        <ul className={styles.footerLinks}>
          <li><a href="/">Rent</a></li>
          <li><a href="/">Share</a></li>
          <li><a href="/">About us</a></li>
          <li><a href="/">Contact</a></li>
        </ul>
        <div className={styles.socialIcons}>
          <a href="/"><img src="/Footer/instagram.svg" alt="Instagram" /></a>
          <a href="/"><img src="/Footer/dribbble.svg" alt="Dribbble" /></a>
          <a href="/"><img src="/Footer/twitter.svg" alt="Twitter" /></a>
          <a href="/"><img src="/Footer/youtube.svg" alt="YouTube" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
