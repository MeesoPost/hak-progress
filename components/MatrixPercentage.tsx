import styles from "./MatrixPercentage.module.css";

const MatrixPercentage = () => {
  return (
    <div className={styles["matrix-percentage"]}>
      <div className={styles["percentage-container"]}>
        <div className={styles.title}>HAK S3.5</div>
        <div className={styles.percentage}>50%</div>
      </div>
    </div>
  );
};

export default MatrixPercentage;
