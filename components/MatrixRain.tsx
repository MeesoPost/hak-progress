import { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      // Get device pixel ratio for sharper text on high DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      // Scale context according to device pixel ratio
      ctx.scale(dpr, dpr);

      // Set text rendering options for sharper text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters (using a mix of katakana and symbols)
    const chars =
      "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890*+-<>:;=[]|";
    const charArray = chars.split("");
    const fontSize = 20; // Slightly smaller font size for cleaner look
    const columns =
      Math.ceil(canvas.width / (fontSize * (window.devicePixelRatio || 1))) + 1;
    const drops: number[] = [];
    const brightChars: boolean[] = [];
    const speeds: number[] = [];

    // Initialize drops starting from above the screen
    for (let i = 0; i < columns; i++) {
      drops[i] = -Math.floor((Math.random() * canvas.height) / fontSize) - 1; // Start above screen
      brightChars[i] = Math.random() < 0.1;
      speeds[i] = Math.random() * 0.5 + 0.7;
    }

    // Load the Matrix font
    const matrixFont = new FontFace("MatrixCode", "url(/Matrix-Code.ttf)");
    matrixFont.load().then((font) => {
      document.fonts.add(font);
    });

    const draw = () => {
      // Semi-transparent black background to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set base font with normal weight for cleaner look
      ctx.font = `${fontSize}px MatrixCode`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        if (Math.random() < 0.001) {
          brightChars[i] = !brightChars[i];
        }

        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize - fontSize / 2; // Offset to cover screen edges
        const y = drops[i] * fontSize;

        // Create varying brightness effects
        if (brightChars[i]) {
          // Multiple passes for bright characters
          const offsets = [-0.5, 0, 0.5];
          offsets.forEach((offset) => {
            // White core
            ctx.fillStyle = "#fff";
            ctx.fillText(char, x + offset, y);
            ctx.fillText(char, x, y + offset);

            // Green overlay
            ctx.fillStyle = "#afa";
            ctx.fillText(char, x + offset, y);
            ctx.fillText(char, x, y + offset);
          });

          // Glow effect
          ctx.fillStyle = "rgba(170, 255, 170, 0.4)";
          ctx.fillText(char, x, y);
        } else {
          // Multiple passes for normal characters
          const gradient = ctx.createLinearGradient(x, y - fontSize, x, y);
          gradient.addColorStop(0, "rgba(0, 255, 0, 0.2)");
          gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.7)");
          gradient.addColorStop(1, "rgba(0, 255, 0, 1.0)");

          const offsets = [-0.3, 0, 0.3];
          offsets.forEach((offset) => {
            ctx.fillStyle = gradient;
            ctx.fillText(char, x + offset, y);
            ctx.fillText(char, x, y + offset);
          });
        }

        // Reset drop to top when it reaches bottom
        if (drops[i] * fontSize > canvas.height) {
          drops[i] = -1; // Reset to just above screen
          brightChars[i] = Math.random() < 0.1;
          speeds[i] = Math.random() * 0.5 + 0.7;
        }

        drops[i] += speeds[i];
      }
    };

    // Animation loop with higher frame rate
    const interval = setInterval(draw, 30);

    // Cleanup
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
