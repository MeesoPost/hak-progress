import CyberPercentage from "../components/MatrixPercentage";
import MatrixRain from "../components/MatrixRain";

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <MatrixRain />
      <div style={{ position: "relative", zIndex: 1 }}>
        <CyberPercentage />
      </div>
    </div>
  );
}
