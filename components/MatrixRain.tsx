import { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Set canvas size to window size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters (reduced set for better performance)
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const charArray = chars.split("");
    const fontSize = isMobile ? 16 : 20; // Smaller font size on mobile
    const columns =
      Math.ceil(canvas.width / (fontSize * (window.devicePixelRatio || 1))) + 1;
    const drops: number[] = [];
    const brightChars: boolean[] = [];
    const speeds: number[] = [];

    // Initialize drops with fewer columns on mobile
    const columnCount = isMobile ? Math.floor(columns * 0.6) : columns;
    for (let i = 0; i < columnCount; i++) {
      drops[i] = -Math.floor((Math.random() * canvas.height) / fontSize) - 1;
      brightChars[i] = Math.random() < 0.05; // Reduced bright characters
      speeds[i] = Math.random() * 0.3 + 0.5; // Slower speeds
    }

    // Load the Matrix font
    const matrixFont = new FontFace("MatrixCode", "url(/Matrix-Code.ttf)");
    matrixFont.load().then((font) => {
      document.fonts.add(font);
    });

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Increased opacity for better fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px MatrixCode`;

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() < 0.002) {
          // Reduced frequency of bright changes
          brightChars[i] = !brightChars[i];
        }

        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize - fontSize / 2;
        const y = drops[i] * fontSize;

        if (brightChars[i]) {
          // Simplified bright character rendering
          ctx.fillStyle = "#fff";
          ctx.fillText(char, x, y);
          ctx.fillStyle = "#afa";
          ctx.fillText(char, x, y);
        } else {
          // Simplified normal character rendering
          ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
          ctx.fillText(char, x, y);
        }

        if (drops[i] * fontSize > canvas.height) {
          drops[i] = -1;
          brightChars[i] = Math.random() < 0.05;
          speeds[i] = Math.random() * 0.3 + 0.5;
        }

        drops[i] += speeds[i];
      }
    };

    // Reduced frame rate on mobile
    const interval = setInterval(draw, isMobile ? 50 : 30);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "black",
        zIndex: -1,
      }}
    />
  );
};

export default MatrixRain;
