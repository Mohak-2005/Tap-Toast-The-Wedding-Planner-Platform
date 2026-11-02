import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface ColorPicker2DProps {
  color: string; // Hex string, e.g. '#8B1E3F'
  onChange: (hex: string) => void;
  darkMode?: boolean;
}

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  const normL = l / 100;
  const a = (s * Math.min(normL, 1 - normL)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const col = normL - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Convert Hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleaned.length !== 6) {
    return { h: 345, s: 65, l: 30 }; // Default burgundy
  }

  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export const ColorPicker2D: React.FC<ColorPicker2DProps> = ({ color, onChange, darkMode = false }) => {
  const initialHsl = hexToHsl(color);
  const [hue, setHue] = useState<number>(initialHsl.h);
  const [saturation, setSaturation] = useState<number>(initialHsl.s);
  const [lightness, setLightness] = useState<number>(initialHsl.l);

  const spectrumRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingSpectrum = useRef<boolean>(false);
  const isDraggingSlider = useRef<boolean>(false);

  // Sync state if color prop changes externally
  useEffect(() => {
    const hsl = hexToHsl(color);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  }, [color]);

  // Notify parent on change
  const updateColor = useCallback(
    (newH: number, newS: number, newL: number) => {
      setHue(newH);
      setSaturation(newS);
      setLightness(newL);
      const hex = hslToHex(newH, newS, newL);
      onChange(hex);
    },
    [onChange]
  );

  // Handle 2D Spectrum Pointer interaction
  const handleSpectrumMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!spectrumRef.current) return;
      const rect = spectrumRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.x));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.y));

      const newHue = Math.round((x / rect.width) * 360);
      // y=0 top is 100% saturation, y=height bottom is 15% saturation
      const newSat = Math.round(100 - (y / rect.height) * 85);

      updateColor(newHue, newSat, lightness);
    },
    [lightness, updateColor]
  );

  // Handle Vertical Slider Pointer interaction
  const handleSliderMove = useCallback(
    (clientY: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const y = Math.max(0, Math.min(rect.height, clientY - rect.y));
      // y=0 top is 95% lightness (white), y=height bottom is 5% lightness (black)
      const newL = Math.round(95 - (y / rect.height) * 90);

      updateColor(hue, saturation, newL);
    },
    [hue, saturation, updateColor]
  );

  // Global mouse/touch listeners for dragging
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingSpectrum.current) {
        handleSpectrumMove(e.clientX, e.clientY);
      } else if (isDraggingSlider.current) {
        handleSliderMove(e.clientY);
      }
    };

    const onMouseUp = () => {
      isDraggingSpectrum.current = false;
      isDraggingSlider.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      if (isDraggingSpectrum.current) {
        handleSpectrumMove(e.touches[0].clientX, e.touches[0].clientY);
      } else if (isDraggingSlider.current) {
        handleSliderMove(e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      isDraggingSpectrum.current = false;
      isDraggingSlider.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleSpectrumMove, handleSliderMove]);

  // Spectrum Pointer Coordinates (X: 0..100%, Y: 0..100%)
  const pointerX = (hue / 360) * 100;
  const pointerY = ((100 - saturation) / 85) * 100;

  // Slider Pointer Y (0..100%)
  const sliderY = ((95 - lightness) / 90) * 100;

  const currentHex = hslToHex(hue, saturation, lightness);

  return (
    <div
      className={`rounded-xl p-3 select-none transition-all ${
        darkMode
          ? 'bg-[#181310] border border-[#3d3024] shadow-md text-white'
          : 'bg-[#fcfbf9] border border-[#e8ded0] shadow-2xs text-[#15110e]'
      }`}
    >
      {/* Custom Color Spectrum Header */}
      <div className={`flex items-center justify-between pb-1.5 mb-2 border-b ${darkMode ? 'border-[#3d3024]' : 'border-[#ede5d8]'}`}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🎨</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c6b3e]">
            Custom Color Spectrum
          </span>
        </div>
        <span className="text-[9px] text-[#8b7b6b]">
          Drag to pick custom shade
        </span>
      </div>

      {/* 2D Spectrum Box + Vertical Lightness Bar (Exact Image 3 Layout) */}
      <div className="flex items-center gap-3">
        {/* 2D Spectrum Gradient Canvas / Box */}
        <div
          ref={spectrumRef}
          onMouseDown={(e) => {
            isDraggingSpectrum.current = true;
            handleSpectrumMove(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            isDraggingSpectrum.current = true;
            if (e.touches.length > 0) {
              handleSpectrumMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className={`relative flex-1 h-[135px] rounded-lg cursor-crosshair overflow-hidden border shadow-inner ${
            darkMode ? 'border-[#3d3024]' : 'border-[#d5c7b5]'
          }`}
          style={{
            background: `
              linear-gradient(to top, rgba(120, 120, 120, 0.85) 0%, rgba(255, 255, 255, 0) 100%),
              linear-gradient(to right,
                #ff0000 0%,
                #ff9900 12%,
                #ffff00 20%,
                #00ff00 36%,
                #00ffff 50%,
                #0066ff 66%,
                #9900ff 80%,
                #ff0099 92%,
                #ff0000 100%
              )
            `,
          }}
        >
          {/* Circular Crosshair Pointer */}
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-[0_0_3px_rgba(0,0,0,0.8)] pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${Math.max(0, Math.min(100, pointerX))}%`,
              top: `${Math.max(0, Math.min(100, pointerY))}%`,
              backgroundColor: currentHex,
            }}
          />
        </div>

        {/* Vertical Lightness Slider Bar + Triangle Pointer (Right) */}
        <div className="relative flex items-center pr-3">
          <div
            ref={sliderRef}
            onMouseDown={(e) => {
              isDraggingSlider.current = true;
              handleSliderMove(e.clientY);
            }}
            onTouchStart={(e) => {
              isDraggingSlider.current = true;
              if (e.touches.length > 0) {
                handleSliderMove(e.touches[0].clientY);
              }
            }}
            className={`w-4 h-[135px] rounded-md cursor-ns-resize border shadow-inner ${
              darkMode ? 'border-[#3d3024]' : 'border-[#d5c7b5]'
            }`}
            style={{
              background: `linear-gradient(to bottom, #ffffff 0%, hsl(${hue}, ${saturation}%, 50%) 50%, #000000 100%)`,
            }}
          />

          {/* Triangle Pointer indicating lightness level */}
          <div
            className="absolute right-0 pointer-events-none -translate-y-1/2 transition-[top] duration-75"
            style={{
              top: `${Math.max(0, Math.min(100, sliderY))}%`,
            }}
          >
            <div
              className={`w-0 h-0 border-y-[5px] border-y-transparent border-r-[7px] ${
                darkMode ? 'border-r-[#bd9661]' : 'border-r-[#15110e]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Swatch Preview & Hex input */}
      <div
        className={`mt-2.5 flex items-center justify-between gap-3 pt-2 border-t ${
          darkMode ? 'border-[#2b221a]' : 'border-[#f0ede4]'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg border shadow-xs shrink-0 ${
              darkMode ? 'border-[#3d3024]' : 'border-[#d5c7b5]'
            }`}
            style={{ backgroundColor: currentHex }}
          />
          <div>
            <div className="text-[9px] font-bold text-[#8b7b6b] uppercase">COLOR</div>
            <div className={`font-mono text-xs font-bold ${darkMode ? 'text-[#fce4ca]' : 'text-[#15110e]'}`}>
              {currentHex}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-[9px] font-bold text-[#8b7b6b] uppercase">HEX</label>
          <input
            type="text"
            value={currentHex}
            onChange={(e) => {
              const val = e.target.value.trim();
              if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                onChange(val);
              }
            }}
            className={`w-20 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-center outline-none border transition-colors ${
              darkMode
                ? 'bg-[#15110e] border-[#3d3024] text-[#fce4ca] focus:border-[#bd9661]'
                : 'bg-white border-[#d5c7b5] text-[#15110e] focus:border-[#bd9661]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
