import React from "react";
import styles from "./Loading.module.css"; // Create a CSS module for styling

const Loading: React.FC = () => {
  return (
    <div className={styles.loadingOverlay}>
           

      <div className={styles.loader}>
        <div className={styles.carWrapper}>
       
          <div className={styles.carBody}>
            <img src="/carLoading1.svg" alt="" />
          </div>

          <div className={styles.road}></div>
          {/* Lamp Post */}
          <svg
            viewBox="0 0 453.459 453.459"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.lampPost}
          >
            <path
              d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
                c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
                c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
                c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
                h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
                v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
                V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
                M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
                h78.747C231.693,100.736,232.77,106.162,232.77,111.694z"
            ></path>
          </svg>

           {/* Wind Effect */}
           <div className={`${styles.wind} ${styles.wind1}`}></div>
          <div className={`${styles.wind} ${styles.wind2}`}></div>
          <div className={`${styles.wind} ${styles.wind3}`}></div>
          <div className={`${styles.wind} ${styles.wind4}`}></div>
          <div className={`${styles.wind} ${styles.wind5}`}></div>
        </div>

        <div className={styles.spinnerContainer}>
    <div className={styles.dot}></div>
    <div className={styles.dot}></div>
    <div className={styles.dot}></div>
  </div>
      </div>
      
    </div>

    
  );
};

export default Loading;
