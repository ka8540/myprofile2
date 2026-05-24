import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";

type ThemeMode = "light" | "dark";

type ParticleBackgroundProps = {
  theme: ThemeMode;
  debug?: boolean;
};

const getDeviceProfile = () => {
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowCores = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = Number.isFinite(deviceMemory) && (deviceMemory as number) <= 4;
  const lowPower = reducedMotion || lowCores || lowMemory;

  return { mobile, reducedMotion, lowPower };
};

const buildOptions = (profile: ReturnType<typeof getDeviceProfile>, debug = false): ISourceOptions => {
  const desktopCount = profile.lowPower ? 50 : 62;
  const mobileCount = profile.lowPower ? 20 : 26;
  const debugColor = "#ff0000";

  return {
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: "transparent" },
    detectRetina: false,
    fpsLimit: 60,
    pauseOnBlur: true,
    particles: {
      number: {
        value: profile.mobile ? mobileCount : desktopCount,
        density: { enable: true, area: profile.mobile ? 900 : 1100 }
      },
      color: { value: debug ? debugColor : "#333333" },
      shape: { type: "circle" },
      opacity: { value: { min: debug ? 1 : 0.7, max: debug ? 1 : 0.8 } },
      size: { value: { min: debug ? 4 : 2, max: debug ? 6 : profile.mobile ? 3 : 3.6 } },
      links: {
        enable: true,
        distance: profile.mobile ? 100 : 125,
        color: debug ? debugColor : "#888888",
        opacity: 0.3,
        width: 1
      },
      move: {
        enable: true,
        direction: "none",
        speed: profile.lowPower ? 0.5 : 0.6,
        random: false,
        straight: false,
        outModes: { default: "out" }
      },
      shadow: { enable: false },
      image: { src: "" }
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: !profile.lowPower && !profile.reducedMotion,
          mode: "repulse"
        },
        resize: { enable: true }
      },
      modes: {
        repulse: {
          distance: profile.mobile ? 55 : 70,
          duration: 0.28
        }
      }
    },
    themes: [
      {
        name: "light",
        default: { value: true, mode: "light" },
        options: {
          particles: {
            color: { value: "#444444" },
            links: { color: "#888888", opacity: 0.3 }
          }
        }
      },
      {
        name: "dark",
        default: { value: true, mode: "dark" },
        options: {
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#00FFC6", opacity: 0.3 }
          }
        }
      }
    ]
  };
};

export default function ParticleBackground({ theme, debug = false }: ParticleBackgroundProps) {
  const [ready, setReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [profileKey, setProfileKey] = useState("init");
  const containerRef = useRef<Container | null>(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateProfile = () => {
      const profile = getDeviceProfile();
      setProfileKey(`${profile.mobile ? "m" : "d"}-${profile.lowPower ? "l" : "n"}`);
    };

    updateProfile();
    window.addEventListener("resize", updateProfile, { passive: true });
    return () => window.removeEventListener("resize", updateProfile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => setIsVisible(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof containerRef.current.loadTheme !== "function") return;
    containerRef.current.loadTheme(theme);
  }, [theme]);

  const options = useMemo(() => {
    if (typeof window === "undefined") return {};
    return buildOptions(getDeviceProfile(), debug);
  }, [profileKey, debug]);

  if (!ready || !isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none"
      }}
    >
      <Particles
        id="ambientParticles"
        options={options}
        particlesLoaded={async (container) => {
          containerRef.current = container ?? null;
          console.log("Particles loaded");
          if (container && typeof container.loadTheme === "function") {
            await container.loadTheme(theme);
          }
        }}
      />
    </div>
  );
}
