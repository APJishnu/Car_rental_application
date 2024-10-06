// pages/index.tsx

import React from "react";
import RegistrationForm from "../../../modules/user/components/Registration/Registration";
import styles from './page.module.css'

const Home: React.FC = () => {
  return (
    <div className={styles.mainDiv} style={{ padding: "0px" }}>
      <RegistrationForm />
    </div>
  );
};

export default Home;
