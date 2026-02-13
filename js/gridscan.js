import * as THREE from 'three';
import { EffectComposer, RenderPass, EffectPass, BloomEffect, ChromaticAberrationEffect } from 'postprocessing';

// Shaders do Grid
const vert = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const frag = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
varying vec2 vUv;
uniform float uScanStarts[8];
uniform float uScanCount;
const int MAX_SCANS = 8;

float smoother01(float a, float b, float x){
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    vec3 ro = vec3(0.0);
    vec3 rd = normalize(vec3(p, 2.0));

    float cR = cos(uTilt), sR = sin(uTilt);
    rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;
    float cY = cos(uYaw), sY = sin(uYaw);
    rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;

    vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
    rd.xy += skew * rd.z;

    vec3 color = vec3(0.0);
    float minT = 1e20;
    float gridScale = max(1e-5, uGridScale);
    float fadeStrength = 2.0;
    vec2 gridUV = vec2(0.0);
    float hitIsY = 1.0;

    for (int i = 0; i < 4; i++) {
        float isY = float(i < 2);
        float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
        float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
        float den = isY * rd.y + (1.0 - isY) * rd.x;
        float t = num / den;
        vec3 h = ro + rd * t;
        float depthBoost = smoothstep(0.0, 3.0, h.z);
        h.xy += skew * 0.15 * depthBoost;
        bool use = t > 0.0 && t < minT;
        gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
        minT = use ? t : minT;
        hitIsY = use ? isY : hitIsY;
    }

    vec3 hit = ro + rd * minT;
    float dist = length(hit - ro);

    float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
    if (jitterAmt > 0.0) {
        vec2 j = vec2(sin(gridUV.y * 2.7 + iTime * 1.8), cos(gridUV.x * 2.3 - iTime * 1.6)) * (0.15 * jitterAmt);
        gridUV += j;
    }

    float fx = fract(gridUV.x); float fy = fract(gridUV.y);
    float ax = min(fx, 1.0 - fx); float ay = min(fy, 1.0 - fy);
    float wx = fwidth(gridUV.x); float wy = fwidth(gridUV.y);
    float halfPx = max(0.0, uLineThickness) * 0.5;
    float tx = halfPx * wx; float ty = halfPx * wy;
    float aax = wx; float aay = wy;
    float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
    float lineY = 1.0 - smoothstep(ty, ty + aay, ay);
    float primaryMask = max(lineX, lineY);

    float fade = exp(-dist * fadeStrength);
    float dur = max(0.05, uScanDuration);
    float del = max(0.0, uScanDelay);
    float scanZMax = 2.0;
    float widthScale = max(0.1, uScanGlow);
    float sigma = max(0.001, 0.18 * widthScale * uScanSoftness);
    float sigmaA = sigma * 2.0;

    float combinedPulse = 0.0;
    float combinedAura = 0.0;
    float cycle = dur + del;
    float tCycle = mod(iTime, cycle);
    float scanPhase = clamp((tCycle - del) / dur, 0.0, 1.0);
    float phase = scanPhase;
    
    if (uScanDirection > 0.5 && uScanDirection < 1.5) { phase = 1.0 - phase; }
    else if (uScanDirection > 1.5) {
        float t2 = mod(max(0.0, iTime - del), 2.0 * dur);
        phase = (t2 < dur) ? (t2 / dur) : (1.0 - (t2 - dur) / dur);
    }

    float scanZ = phase * scanZMax;
    float dz = abs(hit.z - scanZ);
    float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
    float taper = clamp(uPhaseTaper, 0.0, 0.49);
    float headFade = smoother01(0.0, taper, phase);
    float tailFade = 1.0 - smoother01(1.0 - taper, 1.0, phase);
    float phaseWindow = headFade * tailFade;
    float pulseBase = lineBand * phaseWindow;
    combinedPulse += pulseBase * clamp(uScanOpacity, 0.0, 1.0);
    float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));
    combinedAura += (auraBand * 0.25) * phaseWindow * clamp(uScanOpacity, 0.0, 1.0);

    float lineVis = primaryMask;
    vec3 gridCol = uLinesColor * lineVis * fade;
    vec3 scanCol = uScanColor * combinedPulse;
    vec3 scanAura = uScanColor * combinedAura;

    color = gridCol + scanCol + scanAura;

    float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
    color += (n - 0.5) * uNoise;
    color = clamp(color, 0.0, 1.0);
    
    float alpha = clamp(max(lineVis, combinedPulse), 0.0, 1.0);
    float gx = 1.0 - smoothstep(tx * 2.0, tx * 2.0 + aax * 2.0, ax);
    float gy = 1.0 - smoothstep(ty * 2.0, ty * 2.0 + aay * 2.0, ay);
    float halo = max(gx, gy) * fade;
    alpha = max(alpha, halo * clamp(uBloomOpacity, 0.0, 1.0));
    
    fragColor = vec4(color, alpha);
}
void main(){
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}`;

// --- SETUP PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-canvas-container');
    if (!container) return;

    // Configurações Estáticas do Grid
    const options = {
        sensitivity: 0.55,
        lineThickness: 1.5,
        linesColor: "#b8b8b8", // Mesma cor do fundo: remove a 3ª linha (grade adormecida)
        scanColor: "#ffa600",  // Sua cor exata (--color-primaria)
        scanOpacity: 0.8,
        gridScale: 0.1,
        lineStyle: 0, 
        lineJitter: 0.0,
        scanDirection: 2, 
        bloomIntensity: 1.0, // Reduzido de 1.2 para 1.0 para o laranja não "queimar" pro vermelho
        chromaticAberration: 0.0, // ZERADO: Remove a linha "fantasma" duplicada
        noiseIntensity: 0.02,
        scanGlow: 0.5,
        scanSoftness: 2.0,
        scanPhaseTaper: 0.9,
        scanDuration: 2.0,
        scanDelay: 1.0,
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    function srgbColor(hex) {
        const c = new THREE.Color(hex);
        return c.convertSRGBToLinear();
    }

    const uniforms = {
        iResolution: { value: new THREE.Vector3(container.clientWidth, container.clientHeight, renderer.getPixelRatio()) },
        iTime: { value: 0 },
        uSkew: { value: new THREE.Vector2(0, 0) },
        uTilt: { value: 0 },
        uYaw: { value: 0 },
        uLineThickness: { value: options.lineThickness },
        uLinesColor: { value: srgbColor(options.linesColor) },
        uScanColor: { value: srgbColor(options.scanColor) },
        uGridScale: { value: options.gridScale },
        uLineStyle: { value: options.lineStyle },
        uLineJitter: { value: options.lineJitter },
        uScanOpacity: { value: options.scanOpacity },
        uNoise: { value: options.noiseIntensity },
        uBloomOpacity: { value: options.bloomIntensity },
        uScanGlow: { value: options.scanGlow },
        uScanSoftness: { value: options.scanSoftness },
        uPhaseTaper: { value: options.scanPhaseTaper },
        uScanDuration: { value: options.scanDuration },
        uScanDelay: { value: options.scanDelay },
        uScanDirection: { value: options.scanDirection },
        uScanStarts: { value: new Array(8).fill(0) },
        uScanCount: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        depthTest: false
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // Efeitos de Pós Processamento
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloom = new BloomEffect({ intensity: 1.0, luminanceThreshold: 0, luminanceSmoothing: 0 });
    bloom.blendMode.opacity.value = options.bloomIntensity;
    
    const chroma = new ChromaticAberrationEffect({
        offset: new THREE.Vector2(options.chromaticAberration, options.chromaticAberration),
        radialModulation: true,
        modulationOffset: 0.0
    });

    const effectPass = new EffectPass(camera, bloom, chroma);
    effectPass.renderToScreen = true;
    composer.addPass(effectPass);

    // Atualiza o tamanho se a janela mudar
    window.addEventListener('resize', () => {
        renderer.setSize(container.clientWidth, container.clientHeight);
        composer.setSize(container.clientWidth, container.clientHeight);
        material.uniforms.iResolution.value.set(container.clientWidth, container.clientHeight, renderer.getPixelRatio());
    });

    let lastTime = performance.now();

    function tick() {
        const now = performance.now();
        const dt = Math.max(0, Math.min(0.1, (now - lastTime) / 1000));
        lastTime = now;

        // Trava a perspectiva do grid no centro exato (sem distorção de mouse)
        material.uniforms.uSkew.value.set(0, 0);
        
        // Passa o tempo para a animação do scanner continuar rodando
        material.uniforms.iTime.value = now / 1000;

        composer.render(dt);
        requestAnimationFrame(tick);
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    const revealText = document.getElementById('reveal-text');
    const sectReveal = document.getElementById('sect-reveal'); 
    
    if (revealText && sectReveal) {
      const words = revealText.innerText.split(/(\s+)/);
      revealText.innerHTML = '';

      words.forEach(word => {
        if (word.match(/^\s+$/)) {
          revealText.appendChild(document.createTextNode(word));
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = word;
          span.style.opacity = '0.1';
          span.style.filter = 'blur(8px)';
          span.style.willChange = 'opacity, filter';
          revealText.appendChild(span);
        }
      });

      const wordElements = revealText.querySelectorAll('.word');

      window.gsap.to(wordElements, {
        ease: 'none',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.05, 
        scrollTrigger: {
          trigger: sectReveal,      
          start: 'top 70%',         
          end: 'center center',     
          scrub: 1                  
        }
      });
    }
    
    // Inicia o loop
    tick();
});