import { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Better mobile detection using screen width and touch capability
    const isMobile = window.innerWidth <= 768 || "ontouchstart" in window;

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

    // Matrix characters - full set for both mobile and desktop
    const chars =
      "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890*+-<>:;=[]|";
    const charArray = chars.split("");

    const fontSize = isMobile ? 16 : 20; // Smaller font size on mobile
    const columns =
      Math.ceil(canvas.width / (fontSize * (window.devicePixelRatio || 1))) + 1;
    const drops: number[] = [];
    const brightChars: boolean[] = [];
    const speeds: number[] = [];

    // Initialize drops with fewer columns on mobile
    const columnCount = isMobile ? Math.floor(columns * 0.5) : columns; // Reduced from 0.7 to 0.5 for better performance

    // Calculate column spacing to distribute evenly across the screen
    const columnSpacing = canvas.width / columnCount;

    for (let i = 0; i < columnCount; i++) {
      drops[i] = -Math.floor((Math.random() * canvas.height) / fontSize) - 1;
      brightChars[i] = Math.random() < 0.1; // Same bright character probability
      speeds[i] = Math.random() * 0.5 + 0.7; // Same speed range
    }

    // Load the Matrix font
    const matrixFont = new FontFace("MatrixCode", "url(/Matrix-Code.ttf)");
    matrixFont.load().then((font) => {
      document.fonts.add(font);
    });

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Same fade effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px MatrixCode`;

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() < 0.001) {
          // Same frequency of bright changes
          brightChars[i] = !brightChars[i];
        }

        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Calculate x position to distribute columns evenly across the screen
        const x = i * columnSpacing + columnSpacing / 2;
        const y = drops[i] * fontSize;

        if (brightChars[i]) {
          if (isMobile) {
            // Simplified bright character rendering for mobile
            ctx.fillStyle = "#fff";
            ctx.fillText(char, x, y);
            ctx.fillStyle = "#afa";
            ctx.fillText(char, x, y);
          } else {
            // Full effect for desktop
            // White core
            ctx.fillStyle = "#fff";
            ctx.fillText(char, x, y);

            // Green overlay with slight offset for glow effect
            ctx.fillStyle = "#afa";
            ctx.fillText(char, x, y);

            // Additional glow effect
            ctx.fillStyle = "rgba(170, 255, 170, 0.4)";
            ctx.fillText(char, x, y);
          }
        } else {
          if (isMobile) {
            // Simplified normal character rendering for mobile
            ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
            ctx.fillText(char, x, y);
          } else {
            // Full effect for desktop
            const gradient = ctx.createLinearGradient(x, y - fontSize, x, y);
            gradient.addColorStop(0, "rgba(0, 255, 0, 0.2)");
            gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.7)");
            gradient.addColorStop(1, "rgba(0, 255, 0, 1.0)");

            ctx.fillStyle = gradient;
            ctx.fillText(char, x, y);
          }
        }

        if (drops[i] * fontSize > canvas.height) {
          drops[i] = -1;
          brightChars[i] = Math.random() < 0.1;
          speeds[i] = Math.random() * 0.5 + 0.7;
        }

        drops[i] += speeds[i];
      }
    };

    // Significantly reduced frame rate on mobile for better performance
    const interval = setInterval(draw, isMobile ? 60 : 30);

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
