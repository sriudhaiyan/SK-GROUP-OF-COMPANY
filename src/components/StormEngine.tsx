import React, { useEffect, useRef } from 'react';
import './StormEngine.css';

export function StormEngine({ isActive }: { isActive: boolean }) {
  const lightningRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isActive) {
      document.body.classList.add('storm-on');
    } else {
      document.body.classList.remove('storm-on');
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    let timeoutId: NodeJS.Timeout;

    function triggerLightning() {
      if (!isActive || !lightningRef.current || !flashRef.current) return;

      lightningRef.current.style.opacity = "0.8";
      flashRef.current.style.opacity = "1";

      setTimeout(() => {
        if (lightningRef.current) lightningRef.current.style.opacity = "0";
        if (flashRef.current) flashRef.current.style.opacity = "0";
      }, 150);

      timeoutId = setTimeout(triggerLightning, Math.random() * 5000 + 1500);
    }

    triggerLightning();

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleGlobalTap = (e: MouseEvent | TouchEvent) => {
      if (!lightningRef.current || !flashRef.current) return;
      
      let x, y;
      if ('touches' in e) {
        x = (e as TouchEvent).touches[0].clientX;
        y = (e as TouchEvent).touches[0].clientY;
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      }

      const localFlash = document.createElement('div');
      localFlash.className = 'local-flash';
      localFlash.style.left = `${x}px`;
      localFlash.style.top = `${y}px`;
      containerRef.current?.appendChild(localFlash);

      lightningRef.current.style.opacity = "0.9";
      
      setTimeout(() => {
        if (lightningRef.current) lightningRef.current.style.opacity = "0";
        localFlash.remove();
      }, 200);
    };

    window.addEventListener('click', handleGlobalTap);
    window.addEventListener('touchstart', handleGlobalTap);

    return () => {
      window.removeEventListener('click', handleGlobalTap);
      window.removeEventListener('touchstart', handleGlobalTap);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;

      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = .5;
          for (int i = 0; i < 5; i++) {
              value += amplitude * noise(st);
              st *= 2.0;
              amplitude *= .5;
          }
          return value;
      }

      void main() {
          vec2 st = gl_FragCoord.xy / resolution.xy;
          st.x *= resolution.x / resolution.y;
          
          vec2 q = vec2(0.);
          q.x = fbm( st + 0.00 * time);
          q.y = fbm( st + vec2(1.0));

          vec2 r = vec2(0.);
          r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time );
          r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);

          float f = fbm(st+r);

          vec3 color = mix(vec3(0.01, 0.02, 0.05), vec3(0.1, 0.15, 0.2), clamp((f*f)*4.0,0.0,1.0));
          color = mix(color, vec3(0.2, 0.25, 0.3), clamp(length(q),0.0,1.0));
          color = mix(color, vec3(0.3, 0.35, 0.4), clamp(length(r.x),0.0,1.0));

          gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color, 0.4 * f);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const timeUniformLocation = gl.getUniformLocation(program, "time");
    const resolutionUniformLocation = gl.getUniformLocation(program, "resolution");

    let animationFrameId: number;
    const startTime = Date.now();

    function render() {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      gl?.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl?.uniform1f(timeUniformLocation, (Date.now() - startTime) / 1000);
      gl?.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

      gl?.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="storm-wrapper active" ref={containerRef}>
      <canvas ref={canvasRef} className="storm-clouds"></canvas>
      <div className="storm">
        <div className="rain back"></div>
        <div className="rain mid"></div>
        <div className="rain front"></div>

        <div className="lightning" ref={lightningRef}></div>
        <div className="flash" ref={flashRef}></div>

        <div className="wind"></div>
        <div className="glass"></div>
      </div>
    </div>
  );
}
