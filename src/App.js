import { useState, useEffect, useRef } from “react”;

const COMPANY = “PX PEPTIDES”;

const PXLogo = ({ height = 36, glowOpacity = 0.15 }) => (
<svg viewBox=“0 0 300 480” width={height * (300/480)} height={height} style={{ display: “block” }}>
<defs>
<linearGradient id="pxG1" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#7C3AED"/><stop offset="100%" stopColor="#00a090"/>
</linearGradient>
<linearGradient id="pxG2" x1="100%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" stopColor="#7C3AED"/><stop offset="100%" stopColor="#00a090"/>
</linearGradient>
</defs>
{/* P — long vertical stem + bowl at top */}
<path d="M130,28 L130,452 L166,452 L166,175 L210,175 C262,175 290,148 290,118 C290,80 262,28 210,28 Z M166,58 L205,58 C248,58 264,78 264,108 C264,132 248,145 205,145 L166,145 Z" fill="#1a202c" fillRule="evenodd"/>
{/* X glow */}
<line x1="30" y1="220" x2="270" y2="400" stroke="#7C3AED" strokeWidth="44" strokeLinecap="round" opacity={glowOpacity}/>
<line x1="270" y1="220" x2="30" y2="400" stroke="#7C3AED" strokeWidth="44" strokeLinecap="round" opacity={glowOpacity}/>
{/* X strokes */}
<line x1="30" y1="220" x2="270" y2="400" stroke="url(#pxG1)" strokeWidth="36" strokeLinecap="round"/>
<line x1="270" y1="220" x2="30" y2="400" stroke="url(#pxG2)" strokeWidth="36" strokeLinecap="round"/>
{/* Center intersection highlight */}
<circle cx="150" cy="310" r="5" fill="#fff" opacity="0.45"/>
</svg>
);
const TAGLINE = “Precision-Engineered Research Peptides”;

// — Molecular Model illustration —
const MolecularModel = ({ name = “PX-P2”, idx = 0 }) => {
const seed = (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; } return Math.abs(h); };
const rng = (s, i) => { const x = Math.sin(seed(s) * 9301 + i * 49297) * 49979; return x - Math.floor(x); };

const MOL = {
“PX-P3”:       { n: 39, hue: “#7C3AED”, sec: “#6D28D9”, accent: “#F472B6”, helical: true, label: “Triple Agonist” },
“PX-P2”:       { n: 39, hue: “#9B6FF7”, sec: “#5B21B6”, accent: “#FB7185”, helical: true, label: “Dual Agonist” },
“GLOW”:        { n: 15, hue: “#A78BFA”, sec: “#5B21B6”, accent: “#F9A8D4”, helical: false, label: “Tri-Blend” },
“KLOW”:        { n: 16, hue: “#9F7AEA”, sec: “#6D28D9”, accent: “#FBBF24”, helical: false, label: “Quad-Blend” },
“MOTS-c”:      { n: 16, hue: “#7C3AED”, sec: “#4C1D95”, accent: “#F472B6”, helical: false, label: “Mito-Peptide” },
“SS-31”:       { n: 4,  hue: “#6D28D9”, sec: “#4C1D95”, accent: “#EC4899”, helical: false, label: “Tetrapeptide” },
“Tesamorelin”: { n: 44, hue: “#7C3AED”, sec: “#5B21B6”, accent: “#FB923C”, helical: true, label: “GHRH Analog” },
“Ipamorelin”:  { n: 5,  hue: “#A78BFA”, sec: “#5B21B6”, accent: “#F472B6”, helical: false, label: “Pentapeptide” },
“BPC-157”:     { n: 15, hue: “#7C3AED”, sec: “#6D28D9”, accent: “#EC4899”, helical: false, label: “Pentadecapeptide” },
“TB-500”:      { n: 43, hue: “#9F7AEA”, sec: “#4C1D95”, accent: “#F9A8D4”, helical: true, label: “Tβ4 Fragment” },
“GHK-Cu”:      { n: 3,  hue: “#7C3AED”, sec: “#B45309”, accent: “#cc7733”, helical: false, label: “Cu²⁺ Complex” },
};
const c = MOL[name] || MOL[“PX-P2”];
const uid = `m${idx}`;
const W = 220, H = 310;
const cx = W / 2, cy = 145;

// Build backbone path + atoms
const atoms = [];
const bonds = [];
const backbone = [];
const count = Math.min(c.n, 28); // max visible residues

if (c.helical && count > 8) {
// Alpha helix — 3D spiral
const turns = count / 3.6;
const hStep = (H * 0.52) / count;
const radius = 38 + rng(name, 0) * 8;
const yStart = 55;
for (let i = 0; i < count; i++) {
const angle = (i / 3.6) * Math.PI * 2 + rng(name, 1) * Math.PI;
const x = cx + Math.cos(angle) * radius * (0.6 + 0.4 * Math.sin(angle * 0.5));
const y = yStart + i * hStep;
const depth = Math.sin(angle);
backbone.push({ x, y, depth });
atoms.push({ x, y, type: i % 4 === 0 ? “N” : i % 4 === 2 ? “O” : “C”, size: 5 + depth * 1.5, depth });
if (i > 0) bonds.push([i - 1, i]);
// Side chains
if (i % 3 === 1 && rng(name, i * 7) > 0.3) {
const sAngle = angle + Math.PI * 0.5 + rng(name, i * 13) * 0.8;
const sLen = 16 + rng(name, i * 9) * 14;
const sx = x + Math.cos(sAngle) * sLen;
const sy = y + Math.sin(sAngle) * sLen * 0.6;
atoms.push({ x: Math.max(14, Math.min(W - 14, sx)), y: Math.max(20, Math.min(H - 45, sy)), type: rng(name, i * 11) > 0.6 ? “O” : rng(name, i * 17) > 0.7 ? “S” : “N”, size: 3.5 + rng(name, i * 5) * 1.5, depth: depth * 0.5 });
bonds.push([i, atoms.length - 1]);
}
}
} else if (name === “GHK-Cu”) {
// Special copper complex — triangular with Cu center
const cuX = cx, cuY = cy - 5;
atoms.push({ x: cuX, y: cuY, type: “Cu”, size: 9, depth: 1 });
const triR = 48;
[“Gly”, “His”, “Lys”].forEach((aa, i) => {
const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
const ax = cuX + Math.cos(a) * triR;
const ay = cuY + Math.sin(a) * triR;
atoms.push({ x: ax, y: ay, type: “N”, size: 6.5, depth: 0.5 });
bonds.push([0, atoms.length - 1]);
// Sub-atoms for each amino acid
for (let j = 0; j < 3; j++) {
const sa = a + (j - 1) * 0.5 + rng(name, i * 10 + j) * 0.3;
const sr = 22 + j * 12 + rng(name, i * 5 + j) * 6;
atoms.push({ x: ax + Math.cos(sa) * sr, y: ay + Math.sin(sa) * sr, type: j === 0 ? “C” : j === 1 ? “O” : “C”, size: 4 + rng(name, i * 3 + j) * 2, depth: 0 });
bonds.push([atoms.length - 2 - (j === 0 ? 0 : -1 + 1), atoms.length - 1]);
}
});
// Coordination bonds (dashed) from Cu to N atoms
[1, 4, 7].forEach(ni => bonds.push([0, ni]));
} else {
// Extended chain (smaller peptides)
const spacing = Math.min(32, (W - 50) / Math.max(count, 2));
const startX = cx - ((count - 1) * spacing) / 2;
for (let i = 0; i < count; i++) {
const x = startX + i * spacing;
const yOff = Math.sin(i * 1.1 + rng(name, 2)) * 22 + rng(name, i * 7) * 14;
const y = cy + yOff - 10;
const depth = Math.cos(i * 0.8) * 0.5;
atoms.push({ x, y, type: i % 3 === 0 ? “N” : i % 3 === 1 ? “C” : “O”, size: 5.5 + depth * 1.5, depth });
if (i > 0) bonds.push([i - 1, i]);
// Side chains branching up or down
if (rng(name, i * 19) > 0.4) {
const dir = (i % 2 === 0) ? -1 : 1;
const sy = y + dir * (18 + rng(name, i * 23) * 16);
const sx = x + (rng(name, i * 31) - 0.5) * 14;
atoms.push({ x: Math.max(14, Math.min(W - 14, sx)), y: Math.max(25, Math.min(H - 45, sy)), type: rng(name, i * 37) > 0.65 ? “O” : rng(name, i * 41) > 0.7 ? “S” : “C”, size: 3.5 + rng(name, i * 43) * 2, depth: depth * 0.3 });
bonds.push([i, atoms.length - 1]);
// Occasional branch extension
if (rng(name, i * 53) > 0.7) {
const ex = atoms[atoms.length - 1].x + (rng(name, i * 59) - 0.5) * 20;
const ey = atoms[atoms.length - 1].y + dir * (10 + rng(name, i * 61) * 10);
atoms.push({ x: Math.max(14, Math.min(W - 14, ex)), y: Math.max(25, Math.min(H - 45, ey)), type: “C”, size: 3, depth: -0.2 });
bonds.push([atoms.length - 2, atoms.length - 1]);
}
}
}
}

const eCols = { C: “#607888”, N: “#4488cc”, O: “#dd5544”, S: “#ddaa33”, Cu: c.sec };

return (
<svg viewBox={`0 0 ${W} ${H}`} width=“100%” style={{ display: “block”, maxWidth: W }}>
<defs>
<radialGradient id={`${uid}bg`} cx=“50%” cy=“42%” r=“55%”>
<stop offset="0%" stopColor={c.hue} stopOpacity="0.06" />
<stop offset="100%" stopColor="#000" stopOpacity="0" />
</radialGradient>
<radialGradient id={`${uid}C`} cx=“30%” cy=“25%”><stop offset="0%" stopColor="#D4BBFF" /><stop offset="30%" stopColor="#B794F6" /><stop offset="100%" stopColor="#5B21B6" /></radialGradient>
<radialGradient id={`${uid}N`} cx=“30%” cy=“25%”><stop offset="0%" stopColor="#C4AAFF" /><stop offset="30%" stopColor="#A78BFA" /><stop offset="100%" stopColor="#4C1D95" /></radialGradient>
<radialGradient id={`${uid}O`} cx=“30%” cy=“25%”><stop offset="0%" stopColor="#E9DDFF" /><stop offset="30%" stopColor="#C4B5FD" /><stop offset="100%" stopColor="#6D28D9" /></radialGradient>
<radialGradient id={`${uid}S`} cx=“30%” cy=“25%”><stop offset="0%" stopColor="#F3ECFF" /><stop offset="30%" stopColor="#DDD6FE" /><stop offset="100%" stopColor="#7C3AED" /></radialGradient>
<radialGradient id={`${uid}Cu`} cx=“30%” cy=“25%”><stop offset="0%" stopColor="#C9A0FF" /><stop offset="30%" stopColor="#9F7AEA" /><stop offset="100%" stopColor="#3B0764" /></radialGradient>
<radialGradient id={`${uid}bond`} cx=“50%” cy=“0%” x2=“50%” y2=“100%”><stop offset="0%" stopColor="#c8c0dd" /><stop offset="100%" stopColor="#a8a0bb" /></radialGradient>
<filter id={`${uid}glow`}><feGaussianBlur stdDeviation="3"/></filter>
<filter id={`${uid}soft`}><feGaussianBlur stdDeviation="2.5"/></filter>
<filter id={`${uid}inner`}><feGaussianBlur stdDeviation="0.8"/></filter>
</defs>

```
  {/* Background */}
  <rect width={W} height={H} rx="10" fill="#ffffff" />
  <rect width={W} height={H} rx="10" fill={`url(#${uid}bg)`} />

  {/* Central glow */}
  <ellipse cx={cx} cy={cy} rx="80" ry="95" fill={c.hue} opacity="0.08" filter={`url(#${uid}glow)`} />
  <ellipse cx={cx} cy={cy} rx="50" ry="60" fill={c.hue} opacity="0.05" />

  <g className="mol-structure">
  {/* Animated Bonds */}
  {bonds.map(([a, b], bi) => {
    const aa = atoms[a], bb = atoms[b];
    if (!aa || !bb) return null;
    const avgDepth = ((aa.depth || 0) + (bb.depth || 0)) / 2;
    const opacity = 0.4 + avgDepth * 0.15;
    const isCu = name === "GHK-Cu" && (a === 0 || b === 0);
    const dx = bb.x - aa.x, dy = bb.y - aa.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const bw = isCu ? 1 : 2.8;
    const floatAnim = `atom-float-${(bi % 3) + 1}`;
    const dur = 3 + (bi % 5) * 0.8;
    return <g key={`b${bi}`} style={{ animation: `${floatAnim} ${dur}s ease-in-out infinite, bond-pulse ${dur * 1.5}s ease-in-out infinite`, animationDelay: `${bi * 0.15}s` }}>
      {/* Bond glow */}
      <line x1={aa.x} y1={aa.y} x2={bb.x} y2={bb.y}
        stroke="#7C3AED" strokeWidth={bw + 4} strokeLinecap="round" opacity="0.06" filter={`url(#${uid}soft)`} />
      {/* Bond shadow */}
      <line x1={aa.x + 1} y1={aa.y + 1.5} x2={bb.x + 1} y2={bb.y + 1.5}
        stroke="#00000020" strokeWidth={bw + 2} strokeLinecap="round" />
      {/* Bond body */}
      <line x1={aa.x} y1={aa.y} x2={bb.x} y2={bb.y}
        stroke={isCu ? "#A78BFA" : "#b8b0d0"} strokeWidth={bw} strokeLinecap="round"
        strokeDasharray={isCu ? "3,3" : "none"}
        opacity={isCu ? 0.6 : opacity + 0.15} />
      {/* Bond highlight */}
      {!isCu && <line x1={aa.x + nx * 0.7} y1={aa.y + ny * 0.7} x2={bb.x + nx * 0.7} y2={bb.y + ny * 0.7}
        stroke="#fff" strokeWidth={0.8} strokeLinecap="round" opacity="0.25" />}
    </g>;
  })}

  {/* Atom outer glow halos */}
  {atoms.map((at, ai) => {
    const depthScale = 1 + (at.depth || 0) * 0.15;
    const r = Math.max(at.size * depthScale, 7) * 1.15;
    const floatAnim = `atom-float-${(ai % 3) + 1}`;
    const dur = 3.5 + (ai % 4) * 0.7;
    return <circle key={`g${ai}`} cx={at.x} cy={at.y} r={r + 8} fill="#7C3AED" opacity="0.08"
      filter={`url(#${uid}glow)`}
      style={{ animation: `${floatAnim} ${dur}s ease-in-out infinite, atom-pulse ${dur * 1.3}s ease-in-out infinite`, animationDelay: `${ai * 0.12}s` }} />;
  })}

  {/* Atom deep shadows */}
  {atoms.map((at, ai) => {
    const floatAnim = `atom-float-${(ai % 3) + 1}`;
    const dur = 3.5 + (ai % 4) * 0.7;
    return <circle key={`s${ai}`} cx={at.x + 2} cy={at.y + 3} r={Math.max(at.size * (1 + (at.depth || 0) * 0.15), 7) * 1.15 + 3} fill="#3B0764" opacity="0.12"
      filter={`url(#${uid}soft)`}
      style={{ animation: `${floatAnim} ${dur}s ease-in-out infinite`, animationDelay: `${ai * 0.12}s` }} />;
  })}

  {/* Animated 3D Atoms with element labels */}
  {atoms.map((at, ai) => {
    const gid = `${uid}${at.type}`;
    const depthScale = 1 + (at.depth || 0) * 0.15;
    const r = Math.max(at.size * depthScale, 7) * 1.15;
    const fontSize = r < 8 ? 6 : r < 10 ? 7.5 : 9;
    const floatAnim = `atom-float-${(ai % 3) + 1}`;
    const dur = 3.5 + (ai % 4) * 0.7;
    return (
      <g key={`a${ai}`} style={{ animation: `${floatAnim} ${dur}s ease-in-out infinite`, animationDelay: `${ai * 0.12}s` }}>
        {/* Main sphere */}
        <circle cx={at.x} cy={at.y} r={r} fill={`url(#${gid})`} />
        {/* Rim light */}
        <circle cx={at.x + r * 0.2} cy={at.y + r * 0.25} r={r * 0.85} fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.1" />
        {/* Primary specular highlight */}
        <ellipse cx={at.x - r * 0.25} cy={at.y - r * 0.3} rx={r * 0.38} ry={r * 0.28} fill="#fff" opacity="0.55" filter={`url(#${uid}inner)`} />
        {/* Sharp specular */}
        <circle cx={at.x - r * 0.2} cy={at.y - r * 0.28} r={r * 0.14} fill="#fff" opacity="0.75" />
        {/* Element label */}
        <text x={at.x} y={at.y + fontSize * 0.35} textAnchor="middle" fontFamily="'Avenir','Avenir Next',-apple-system,sans-serif" fontSize={fontSize} fontWeight="700" fill="#fff" opacity="0.95" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>{at.type}</text>
      </g>
    );
  })}
  </g>

  {/* Bottom label */}
  <rect x="0" y={H - 36} width={W} height="36" rx="0" fill="#ffffff" opacity="0.92" />
  <text x={cx} y={H - 18} textAnchor="middle" fontFamily="'Avenir','Avenir Next',-apple-system,sans-serif" fontSize="10" fontWeight="700" letterSpacing="1.5" fill={c.hue} opacity="0.7">{name}</text>
  <text x={cx} y={H - 6} textAnchor="middle" fontFamily="'Avenir','Avenir Next',-apple-system,sans-serif" fontSize="7" fill="#8a95a0" letterSpacing="0.5">{c.label}</text>
</svg>
```

);
};

// — Molecular background canvas —
function MolecularBG() {
const canvasRef = useRef(null);
useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext(“2d”);
let animId;
let nodes = [];
const resize = () => {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
};
resize();
window.addEventListener(“resize”, resize);
for (let i = 0; i < 60; i++) {
nodes.push({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
vx: (Math.random() - 0.5) * 1.2,
vy: (Math.random() - 0.5) * 1.2,
r: Math.random() * 3.5 + 1.5,
});
}
const draw = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);
nodes.forEach((n) => {
n.x += n.vx;
n.y += n.vy;
if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
});
for (let i = 0; i < nodes.length; i++) {
for (let j = i + 1; j < nodes.length; j++) {
const dx = nodes[i].x - nodes[j].x;
const dy = nodes[i].y - nodes[j].y;
const dist = Math.sqrt(dx * dx + dy * dy);
if (dist < 180) {
ctx.beginPath();
ctx.moveTo(nodes[i].x, nodes[i].y);
ctx.lineTo(nodes[j].x, nodes[j].y);
ctx.strokeStyle = `rgba(124,58,237,${0.25 * (1 - dist / 180)})`;
ctx.lineWidth = 1.4;
ctx.stroke();
}
}
}
nodes.forEach((n) => {
ctx.beginPath();
ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
ctx.fillStyle = “rgba(124,58,237,0.6)”;
ctx.fill();
// Glow
ctx.beginPath();
ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
ctx.fillStyle = “rgba(124,58,237,0.1)”;
ctx.fill();
});
animId = requestAnimationFrame(draw);
};
draw();
return () => {
cancelAnimationFrame(animId);
window.removeEventListener(“resize”, resize);
};
}, []);
return (
<canvas
ref={canvasRef}
style={{
position: “absolute”,
top: 0,
left: 0,
width: “100%”,
height: “100%”,
pointerEvents: “none”,
}}
/>
);
}

// — Section wrapper with fade-in —
function Section({ id, children, className = “”, dark = false }) {
const ref = useRef(null);
const [animated, setAnimated] = useState(false);
useEffect(() => {
if (typeof IntersectionObserver === ‘undefined’) { setAnimated(true); return; }
const obs = new IntersectionObserver(
([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect(); } },
{ threshold: 0.01, rootMargin: “200px 0px” }
);
if (ref.current) obs.observe(ref.current);
const timer = setTimeout(() => setAnimated(true), 800);
return () => { obs.disconnect(); clearTimeout(timer); };
}, []);
return (
<section
id={id}
ref={ref}
className={className}
style={{
opacity: animated ? 1 : 0,
transform: animated ? “translateY(0)” : “translateY(40px)”,
transition: “opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1)”,
background: dark ? “#f0f3f6” : “transparent”,
}}
>
{children}
</section>
);
}

// — Data —
const PRODUCTS = [
{ name: “PX-P3”, cas: “2381089-83-2”, purity: “≥99%”, form: “Lyophilized”, mg: “15mg / 25mg”,
desc: “Triple-agonist peptide targeting GLP-1, GIP, and glucagon receptors. Referenced in published literature on multi-receptor agonism and metabolic pathway signaling.”,
layman: “Used in research for its ability to activate three key metabolic receptors involved in appetite, blood sugar regulation, and energy expenditure.”,
molecularName: “Retatrutide”, molecularWeight: “4625.2 Da”, formula: “C₂₀₇H₃₁₆N₅₆O₆₃S”,
aminoAcids: 39, sequence: “HXQGTFTSDYSIYLDKQAAXEFVNWLLAGGPSSGAPPPS-NH₂ (X = Aib)”,
appearance: “White to off-white powder”, solubility: “Soluble in sterile water, DMF, DMSO”,
storage: “Store at -20°C, desiccated. Avoid repeated freeze-thaw cycles.”,
options: [“15mg”, “25mg”], prices: { “15mg”: 79.99, “25mg”: 124.99 }, studies: [
{ title: “LY3437943, a novel triple GLP-1/GIP/glucagon receptor agonist for glycemic control and weight management”, journal: “Nature, 2022”, url: “https://pubmed.ncbi.nlm.nih.gov/35712743/”, summary: “Characterized LY3437943 as the first triple incretin receptor agonist, demonstrating balanced activity at GLP-1, GIP, and glucagon receptors in preclinical binding and signaling assays.” },
{ title: “Retatrutide, a GGG receptor tri-agonist, for adults — a phase 2 trial”, journal: “N Engl J Med, 2023”, url: “https://pubmed.ncbi.nlm.nih.gov/37351564/”, summary: “Phase 2 dose-ranging study evaluating retatrutide across multiple dose levels, reporting dose-dependent receptor activation and metabolic parameter changes over 48 weeks.” },
{ title: “Efficacy and safety of retatrutide in type 2 diabetes: a phase 2 trial”, journal: “Lancet, 2023”, url: “https://pubmed.ncbi.nlm.nih.gov/37385280/”, summary: “Assessed retatrutide in subjects with type 2 diabetes, measuring HbA1c reduction and fasting glucose modulation through combined GLP-1/GIP/glucagon receptor engagement.” },
{ title: “Triple hormone receptor agonism: a novel approach to metabolic pathway modulation”, journal: “Trends Endocrinol Metab, 2023”, url: “https://pubmed.ncbi.nlm.nih.gov/37716900/”, summary: “Reviewed the mechanistic rationale for simultaneous activation of three incretin-related receptors, including downstream effects on cAMP signaling and energy expenditure pathways.” },
]},
{ name: “PX-P2”, cas: “2023788-19-2”, purity: “≥99%”, form: “Lyophilized”, mg: “5mg / 10mg / 15mg”,
desc: “Dual GLP-1 and GIP receptor agonist (39 amino acids). Referenced in published literature on incretin receptor signaling and metabolic pathway research.”,
layman: “Used in research for targeting two gut hormone receptors that play a role in how the body processes food and manages blood sugar.”,
molecularName: “Tirzepatide”, molecularWeight: “4813.5 Da”, formula: “C₂₂₅H₃₄₈N₄₈O₆₈”,
aminoAcids: 39, sequence: “YXEGTFTSDYSIXLDKIAQKAFVQWLIAGGPSSGAPPPS-NH₂ (X = Aib)”,
appearance: “White to off-white powder”, solubility: “Soluble in sterile water, DMF, DMSO”,
storage: “Store at -20°C, desiccated. Avoid repeated freeze-thaw cycles.”,
options: [“5mg”, “10mg”, “15mg”], prices: { “5mg”: 34.99, “10mg”: 61.99, “15mg”: 88.99 }, studies: [
{ title: “Tirzepatide, a dual GIP/GLP-1 receptor agonist — SURPASS-2 trial”, journal: “N Engl J Med, 2021”, url: “https://pubmed.ncbi.nlm.nih.gov/34170647/”, summary: “Head-to-head comparison trial demonstrating tirzepatide’s dual receptor binding profile and its effects on glycemic markers relative to selective GLP-1 agonism alone.” },
{ title: “Tirzepatide once weekly for treatment in adults — a phase 3 trial”, journal: “N Engl J Med, 2022”, url: “https://pubmed.ncbi.nlm.nih.gov/35658024/”, summary: “Phase 3 study measuring tirzepatide’s sustained dual-agonist activity over 72 weeks, with dose-dependent changes in body composition and metabolic biomarkers.” },
{ title: “Efficacy and safety of tirzepatide monotherapy — SURPASS-1 trial”, journal: “Lancet, 2021”, url: “https://pubmed.ncbi.nlm.nih.gov/34186022/”, summary: “First monotherapy trial establishing tirzepatide’s pharmacodynamic profile through GIP and GLP-1 receptor co-activation, with fasting glucose and HbA1c as primary endpoints.” },
{ title: “GIP and GLP-1 dual agonism: receptor signaling mechanisms and pharmacology”, journal: “Mol Metab, 2021”, url: “https://pubmed.ncbi.nlm.nih.gov/33068776/”, summary: “Detailed the molecular pharmacology of simultaneous GIP/GLP-1 receptor engagement, including biased agonism, cAMP dose-response curves, and receptor internalization kinetics.” },
]},
{ name: “GLOW”, cas: “Blend”, purity: “≥99%”, form: “Solution”, mg: “70mg total”,
desc: “Tri-peptide research blend: GHK-Cu (50mg), BPC-157 (10mg), and TB-500 (10mg). Referenced in literature examining extracellular matrix signaling, collagen-related gene expression, and cell migration pathways.”,
layman: “A three-peptide blend studied for supporting tissue structure, collagen production, and cellular repair processes.”,
molecularName: “Proprietary Blend”, molecularWeight: “Varies by component”, formula: “Multi-peptide complex”,
aminoAcids: null, sequence: “GHK-Cu: Gly-His-Lys·Cu²⁺ | BPC-157: 15 aa pentadecapeptide | TB-500: 43 aa Tβ4 fragment”,
appearance: “Clear solution”, solubility: “Pre-reconstituted in bacteriostatic water”,
storage: “Store at 2–8°C. Protect from light. Use within 30 days of opening.”,
options: null, prices: { “70mg”: 97.99 }, studies: [
{ title: “GHK peptide as a natural modulator of multiple cellular pathways in skin fibroblasts”, journal: “Biomed Res Int, 2015”, url: “https://pubmed.ncbi.nlm.nih.gov/25861634/”, summary: “Demonstrated that GHK activates over 4,000 genes in human fibroblasts via microarray analysis, modulating pathways related to extracellular matrix remodeling and antioxidant response.” },
{ title: “Pentadecapeptide BPC 157 and its cytoprotective and mediating effects”, journal: “J Physiol Pharmacol, 2018”, url: “https://pubmed.ncbi.nlm.nih.gov/30898980/”, summary: “Comprehensive review of BPC-157’s interaction with the nitric oxide system, dopamine system, and prostaglandin pathways in multiple in-vitro and in-vivo models.” },
{ title: “Thymosin β4: actin-sequestering protein and cell migration modulator”, journal: “Ann NY Acad Sci, 2010”, url: “https://pubmed.ncbi.nlm.nih.gov/20392238/”, summary: “Characterized Tβ4’s role in G-actin sequestration and its downstream effects on lamellipodium extension, cell motility, and angiogenesis signaling in endothelial cell models.” },
]},
{ name: “KLOW”, cas: “Blend”, purity: “≥99%”, form: “Solution”, mg: “80mg total”,
desc: “Synergistic quad-peptide research blend: GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg), and KPV (10mg). Referenced in literature examining extracellular matrix interactions, cell migration, collagen-related gene expression, and cytokine signaling pathways.”,
layman: “A four-peptide blend studied for tissue repair, collagen support, cell migration, and modulating the body’s inflammatory response.”,
molecularName: “Proprietary Blend”, molecularWeight: “Varies by component”, formula: “Multi-peptide complex”,
aminoAcids: null, sequence: “GHK-Cu: Gly-His-Lys·Cu²⁺ | BPC-157: 15 aa | TB-500: 43 aa | KPV: Lys-Pro-Val tripeptide”,
appearance: “Clear solution”, solubility: “Pre-reconstituted in bacteriostatic water”,
storage: “Store at 2–8°C. Protect from light. Use within 30 days of opening.”,
options: null, prices: { “80mg”: 115.99 }, studies: [
{ title: “GHK-Cu may prevent oxidative stress in skin by regulating copper and modifying gene expression”, journal: “Int J Mol Sci, 2012”, url: “https://pubmed.ncbi.nlm.nih.gov/22408433/”, summary: “Investigated GHK-Cu’s role as a copper delivery vehicle, showing upregulation of antioxidant genes (SOD, glutathione) and downregulation of pro-oxidant gene clusters in dermal cell cultures.” },
{ title: “BPC 157: overview of cytoprotective signaling and NO system interaction”, journal: “Curr Med Chem, 2012”, url: “https://pubmed.ncbi.nlm.nih.gov/22204339/”, summary: “Mapped BPC-157’s interaction with the NO system including effects on NOS isoform expression, along with demonstrated cytoprotective signaling in gastrointestinal epithelial models.” },
{ title: “Alpha-MSH-related peptides: biochemistry, anti-inflammatory properties, and KPV signaling”, journal: “Ann NY Acad Sci, 2003”, url: “https://pubmed.ncbi.nlm.nih.gov/14681158/”, summary: “Identified KPV as the minimal active C-terminal fragment of α-MSH, demonstrating NF-κB inhibition and downstream suppression of IL-1β, IL-6, and TNF-α in activated immune cell assays.” },
{ title: “Thymosin β4 and cell migration: lamellipodium formation and actin organization”, journal: “J Invest Dermatol, 1999”, url: “https://pubmed.ncbi.nlm.nih.gov/10469319/”, summary: “Showed that Tβ4 accelerates keratinocyte migration via actin cytoskeleton reorganization, with dose-dependent effects on lamellipodia formation measured by time-lapse microscopy.” },
]},
{ name: “MOTS-c”, cas: “1627580-64-6”, purity: “≥99%”, form: “Lyophilized”, mg: “10mg / 20mg”,
desc: “Mitochondrial-derived peptide (16 amino acids). Referenced in published literature on mitochondrial signaling, AMPK pathway activation, and cellular energy metabolism.”,
layman: “Used in research for its role in how cells produce energy and regulate metabolism at the mitochondrial level.”,
molecularName: “MOTS-c (Mitochondrial ORF of the Twelve S rRNA type-c)”, molecularWeight: “1750.9 Da”, formula: “C₇₇H₁₁₈N₂₂O₂₃S₂”,
aminoAcids: 16, sequence: “MRWQEMGYIFYPRKLR”,
appearance: “White to off-white powder”, solubility: “Soluble in sterile water”,
storage: “Store at -20°C, desiccated. Stable for 24 months when stored properly.”,
options: [“10mg”, “20mg”], prices: { “10mg”: 43.99, “20mg”: 79.99 }, studies: [
{ title: “The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis and reduces diet-induced pathology”, journal: “Cell Metab, 2015”, url: “https://pubmed.ncbi.nlm.nih.gov/25738459/”, summary: “Discovery paper identifying MOTS-c as the first mitochondrial-encoded peptide to regulate nuclear gene expression, activating AMPK and enhancing glucose uptake via GLUT4 translocation.” },
{ title: “MOTS-c is an exercise-induced mitochondrial-encoded regulator of age-dependent physical decline”, journal: “Nat Commun, 2021”, url: “https://pubmed.ncbi.nlm.nih.gov/33589624/”, summary: “Demonstrated that MOTS-c translocates to the nucleus under metabolic stress and directly regulates ARE-containing gene promoters, with endogenous levels correlating to physical capacity.” },
{ title: “Mitochondrial-derived peptides in energy metabolism and cellular signaling”, journal: “Cell Metab, 2018”, url: “https://pubmed.ncbi.nlm.nih.gov/30146487/”, summary: “Reviewed the broader class of mitochondrial-derived peptides including MOTS-c and humanin, detailing their roles in folate-methionine cycle regulation and retrograde mitochondrial-to-nuclear signaling.” },
]},
{ name: “SS-31”, cas: “736992-21-5”, purity: “≥99%”, form: “Lyophilized”, mg: “10mg / 20mg”,
desc: “Mitochondria-targeted tetrapeptide (Elamipretide). Referenced in published literature on cardiolipin interactions, inner mitochondrial membrane structure, and reactive oxygen species modulation.”,
layman: “Used in research for protecting the powerhouses of cells by stabilizing their inner membranes and reducing oxidative damage.”,
molecularName: “Elamipretide (D-Arg-Dmt-Lys-Phe-NH₂)”, molecularWeight: “640.8 Da”, formula: “C₃₂H₄₉N₉O₅”,
aminoAcids: 4, sequence: “D-Arg-2′,6′-Dmt-Lys-Phe-NH₂”,
appearance: “White to off-white powder”, solubility: “Freely soluble in water and DMSO”,
storage: “Store at -20°C, desiccated. Protect from light.”,
options: [“10mg”, “20mg”], prices: { “10mg”: 49.99, “20mg”: 88.99 }, studies: [
{ title: “Mitochondria-targeted cytoprotective peptides: SS-31 and cardiolipin interaction”, journal: “AAPS J, 2006”, url: “https://pubmed.ncbi.nlm.nih.gov/17233541/”, summary: “Demonstrated that the alternating aromatic-cationic motif of SS-31 enables selective accumulation in the inner mitochondrial membrane, binding cardiolipin at a 1:1 stoichiometric ratio.” },
{ title: “SS-31 peptide targets mitochondrial inner membrane and modifies cardiolipin interactions”, journal: “J Am Soc Nephrol, 2013”, url: “https://pubmed.ncbi.nlm.nih.gov/23620398/”, summary: “Showed that SS-31 stabilizes cardiolipin-cytochrome c interactions, preventing cardiolipin peroxidation and preserving electron transport chain complex integrity in isolated mitochondria.” },
{ title: “Mitochondria-targeted peptide elamipretide in mitochondrial myopathy: a randomized trial”, journal: “Neurology, 2019”, url: “https://pubmed.ncbi.nlm.nih.gov/30728309/”, summary: “Randomized controlled trial measuring elamipretide’s effects on mitochondrial ATP synthesis rate and 6-minute walk distance as functional endpoints in subjects with primary mitochondrial myopathy.” },
{ title: “Elamipretide: review of cardiolipin remodeling and mitochondrial bioenergetics”, journal: “Expert Opin Investig Drugs, 2020”, url: “https://pubmed.ncbi.nlm.nih.gov/32372679/”, summary: “Comprehensive pharmacological review covering elamipretide’s mechanism of cardiolipin stabilization, ROS scavenging at complex III, and restoration of mitochondrial membrane potential in disease models.” },
]},
{ name: “Tesamorelin”, cas: “218949-48-5”, purity: “≥99%”, form: “Lyophilized”, mg: “10mg / 20mg”,
desc: “Growth hormone-releasing hormone analog (44 amino acids). Referenced in published literature on GHRH receptor binding, somatotroph signaling, and pituitary axis research.”,
layman: “Used in research for stimulating the pituitary gland to release growth hormone through natural signaling pathways.”,
molecularName: “Tesamorelin acetate (trans-3-hexenoic acid-GHRH(1-44)-NH₂)”, molecularWeight: “5135.9 Da”, formula: “C₂₂₁H₃₆₆N₇₂O₆₇S”,
aminoAcids: 44, sequence: “Hex-YADAIFTNSYRKVLGQLSARKLLQDIMSRQQGESNQERGARARL-NH₂”,
appearance: “White lyophilized powder”, solubility: “Soluble in sterile water, acetic acid”,
storage: “Store at -20°C, desiccated. Reconstitute immediately before use.”,
options: [“10mg”, “20mg”], prices: { “10mg”: 39.99, “20mg”: 70.99 }, studies: [
{ title: “Effects of tesamorelin on GH pulsatility and somatotroph signaling”, journal: “N Engl J Med, 2007”, url: “https://pubmed.ncbi.nlm.nih.gov/18046031/”, summary: “Demonstrated tesamorelin’s ability to restore physiological GH pulsatile secretion patterns through GHRH receptor activation on anterior pituitary somatotroph cells.” },
{ title: “Tesamorelin: a GHRH analog and its effects on the GH/IGF-1 axis”, journal: “J Clin Endocrinol Metab, 2015”, url: “https://pubmed.ncbi.nlm.nih.gov/26037513/”, summary: “Assessed the downstream effects of tesamorelin-induced GH release on hepatic IGF-1 production, with serum IGF-1 levels measured as a pharmacodynamic biomarker of axis activation.” },
{ title: “Growth hormone-releasing hormone agonists: receptor pharmacology and pituitary axis research”, journal: “Ann Intern Med, 2010”, url: “https://pubmed.ncbi.nlm.nih.gov/21149844/”, summary: “Reviewed GHRH receptor pharmacology including receptor desensitization kinetics, cAMP-PKA signaling cascade activation, and the role of somatostatin feedback in modulating GH output.” },
]},
{ name: “Ipamorelin”, cas: “170851-70-4”, purity: “≥99%”, form: “Lyophilized”, mg: “5mg”,
desc: “Growth hormone secretagogue pentapeptide. Referenced in published literature on ghrelin receptor (GHS-R1a) binding selectivity and somatotroph signaling pathways.”,
layman: “Used in research for selectively triggering growth hormone release without affecting other hormones like cortisol or insulin.”,
molecularName: “Ipamorelin (NNC 26-0161)”, molecularWeight: “711.9 Da”, formula: “C₃₈H₄₉N₉O₅”,
aminoAcids: 5, sequence: “Aib-His-D-2-Nal-D-Phe-Lys-NH₂”,
appearance: “White to off-white powder”, solubility: “Soluble in sterile water, DMSO”,
storage: “Store at -20°C, desiccated. Stable for 24 months.”,
options: null, prices: { “5mg”: 31.99 }, studies: [
{ title: “Ipamorelin, the first selective growth hormone secretagogue”, journal: “Eur J Endocrinol, 1998”, url: “https://pubmed.ncbi.nlm.nih.gov/9916862/”, summary: “Identified ipamorelin as the first GH secretagogue with selectivity for the GHS-R1a receptor, releasing GH without significant changes in ACTH, cortisol, prolactin, or FSH/LH levels.” },
{ title: “Pharmacokinetic and pharmacodynamic characterization of ipamorelin GHS-R1a selectivity”, journal: “Growth Horm IGF Res, 1999”, url: “https://pubmed.ncbi.nlm.nih.gov/10512692/”, summary: “Characterized ipamorelin’s binding kinetics at the ghrelin receptor, establishing EC50 values and demonstrating a steep dose-response curve for GH release with minimal off-target hormone effects.” },
{ title: “Growth hormone secretagogues: receptor binding, selectivity, and signaling mechanisms”, journal: “Endocr Rev, 2005”, url: “https://pubmed.ncbi.nlm.nih.gov/15961614/”, summary: “Comprehensive review of GHS-R1a signaling including Gαq-PLC-IP3 calcium mobilization, constitutive receptor activity, and the structural determinants of ligand selectivity across GHS subtypes.” },
]},
{ name: “BPC-157”, cas: “137525-51-0”, purity: “≥99%”, form: “Lyophilized”, mg: “10mg / 20mg”,
desc: “Pentadecapeptide fragment, 15 amino acids. Widely referenced in published literature on cytoprotective signaling and nitric oxide pathway modulation.”,
layman: “One of the most widely studied peptides in research for its role in protecting cells and supporting the body’s natural repair mechanisms.”,
molecularName: “BPC-157 (Body Protection Compound-157)”, molecularWeight: “1419.5 Da”, formula: “C₆₂H₉₈N₁₆O₂₂”,
aminoAcids: 15, sequence: “Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val”,
appearance: “White lyophilized powder”, solubility: “Freely soluble in water”,
storage: “Store at -20°C, desiccated. Protect from light and moisture.”,
options: [“10mg”, “20mg”], prices: { “10mg”: 34.99, “20mg”: 61.99 }, studies: [
{ title: “Stable gastric pentadecapeptide BPC 157: novel cytoprotective mediator and NO system interaction”, journal: “Curr Med Chem, 2012”, url: “https://pubmed.ncbi.nlm.nih.gov/22204339/”, summary: “Mapped BPC-157’s bidirectional modulation of the NO system — counteracting both L-NAME-induced NO depletion and L-arginine-induced NO excess — across gastrointestinal and vascular tissue models.” },
{ title: “BPC 157 and its function in modulating nitric oxide system signaling”, journal: “J Physiol Pharmacol, 2018”, url: “https://pubmed.ncbi.nlm.nih.gov/30898980/”, summary: “Detailed BPC-157’s effects on eNOS, iNOS, and COX-2 expression, demonstrating dose-dependent modulation of NO production and prostaglandin synthesis in multiple organ system models.” },
{ title: “Pentadecapeptide BPC 157 and the central nervous system: signaling pathways in vitro”, journal: “Curr Neuropharmacol, 2016”, url: “https://pubmed.ncbi.nlm.nih.gov/26813123/”, summary: “Examined BPC-157’s interactions with dopaminergic, serotonergic, and GABAergic signaling pathways in neuronal cell cultures, including effects on dopamine D2 receptor sensitization.” },
{ title: “BPC 157: review of cytoprotective and signaling mechanisms in in-vitro models”, journal: “J Physiol Pharmacol, 2022”, url: “https://pubmed.ncbi.nlm.nih.gov/36454716/”, summary: “Updated systematic review covering BPC-157’s effects on VEGF-mediated angiogenesis signaling, FAK-paxillin pathway activation, and JAK-2/STAT-3 phosphorylation in cell culture systems.” },
]},
{ name: “TB-500”, cas: “77591-33-4”, purity: “≥99%”, form: “Lyophilized”, mg: “5mg”,
desc: “Thymosin Beta-4 fragment. Referenced in published literature on actin-binding interactions and cell migration signaling.”,
layman: “Used in research for helping cells move and organize their internal scaffolding, which is important in tissue repair and wound response.”,
molecularName: “Thymosin Beta-4 (Tβ4)”, molecularWeight: “4921.5 Da”, formula: “C₂₁₂H₃₅₀N₅₆O₇₈S”,
aminoAcids: 43, sequence: “SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES”,
appearance: “White lyophilized powder”, solubility: “Soluble in sterile water, PBS”,
storage: “Store at -20°C, desiccated. Avoid repeated freeze-thaw cycles.”,
options: null, prices: { “5mg”: 31.99 }, studies: [
{ title: “Thymosin β4: structure, function, and biological activities as actin-sequestering protein”, journal: “Expert Opin Biol Ther, 2012”, url: “https://pubmed.ncbi.nlm.nih.gov/22171665/”, summary: “Reviewed Tβ4’s central role in maintaining the G/F-actin equilibrium, including its 1:1 binding stoichiometry with G-actin monomers and the resulting effects on cytoskeletal dynamics.” },
{ title: “Thymosin β4 promotes cell migration and angiogenesis signaling in vitro”, journal: “Ann NY Acad Sci, 2010”, url: “https://pubmed.ncbi.nlm.nih.gov/20392238/”, summary: “Demonstrated Tβ4-dependent upregulation of VEGF and MMP expression in endothelial cell models, with quantified effects on tube formation and transwell migration assays.” },
{ title: “Thymosin β4 and lamellipodium formation: actin-binding mechanisms in cell motility”, journal: “J Invest Dermatol, 1999”, url: “https://pubmed.ncbi.nlm.nih.gov/10469319/”, summary: “Used fluorescence microscopy to show that Tβ4 increases the rate of lamellipodium extension by 40–60% in keratinocyte scratch-wound models through actin cytoskeletal reorganization.” },
]},
{ name: “GHK-Cu”, cas: “49557-75-7”, purity: “≥99%”, form: “Lyophilized”, mg: “50mg”,
desc: “Copper tripeptide complex. Referenced in published literature on metallopeptide-copper interactions and gene expression modulation.”,
layman: “A naturally occurring copper-peptide studied for influencing thousands of genes related to skin health, collagen, and antioxidant defense.”,
molecularName: “Copper peptide GHK-Cu (Glycyl-L-Histidyl-L-Lysine·Cu²⁺)”, molecularWeight: “403.9 Da”, formula: “C₁₄H₂₄N₆O₄·Cu”,
aminoAcids: 3, sequence: “Gly-His-Lys·Cu²⁺”,
appearance: “Blue to blue-green powder”, solubility: “Freely soluble in water”,
storage: “Store at -20°C, desiccated. Protect from light and moisture.”,
options: null, prices: { “50mg”: 37.99 }, studies: [
{ title: “GHK peptide as a natural modulator of multiple cellular pathways in skin fibroblasts”, journal: “Biomed Res Int, 2015”, url: “https://pubmed.ncbi.nlm.nih.gov/25861634/”, summary: “Broad Connectivity Map analysis showing GHK modulates 4,048 genes at 1μM concentration, with significant effects on TGF-β superfamily signaling, DNA repair genes, and ubiquitin-proteasome pathways.” },
{ title: “GHK-Cu may prevent oxidative stress by regulating copper and modifying gene expression”, journal: “Int J Mol Sci, 2012”, url: “https://pubmed.ncbi.nlm.nih.gov/22408433/”, summary: “Demonstrated GHK-Cu’s dual function as both a copper chaperone and a gene expression modulator, upregulating SOD3, TIMP-1, and decorin while suppressing pro-inflammatory IL-6 signaling.” },
{ title: “Tripeptide-copper complex GHK-Cu: stimulation of collagen synthesis in fibroblast cultures”, journal: “FEBS Lett, 1988”, url: “https://pubmed.ncbi.nlm.nih.gov/3169244/”, summary: “Early characterization showing GHK-Cu stimulates collagen type I synthesis in human dermal fibroblast cultures at nanomolar concentrations, with copper coordination essential for biological activity.” },
{ title: “GHK and DNA: gene expression resetting by the human tripeptide-copper complex”, journal: “Biomed Res Int, 2014”, url: “https://pubmed.ncbi.nlm.nih.gov/24527449/”, summary: “Demonstrated that GHK-Cu can shift gene expression patterns associated with tissue damage toward regenerative profiles, affecting 31% of human genes through genome-wide meta-analysis.” },
]},
];

// — Seed Reviews —
const SEED_REVIEWS = {
“PX-P3”: [
{ name: “Dr. M. Chen”, rating: 5, text: “Exceptional purity. HPLC results confirmed ≥99% on independent verification. Will reorder.”, date: “2026-01-15” },
{ name: “R. Vasquez”, rating: 5, text: “Fast shipping, well-packaged with cold chain intact. COA matched our in-house MS analysis.”, date: “2026-01-28” },
{ name: “Lab Director — UC”, rating: 4, text: “Consistent batch-to-batch quality. Reconstitution was straightforward. Solid product for receptor binding assays.”, date: “2026-02-04” },
],
“PX-P2”: [
{ name: “S. Nakamura, PhD”, rating: 5, text: “Third order from PX. Purity verified via our UPLC system — results align perfectly with provided COA.”, date: “2026-01-10” },
{ name: “BioCore Labs”, rating: 5, text: “Reliable supplier. Product integrity maintained through shipping. Excellent for our in-vitro signaling studies.”, date: “2026-01-22” },
{ name: “J. Whitfield”, rating: 4, text: “Good product overall. Packaging could be slightly improved but peptide quality is top-notch.”, date: “2026-02-12” },
],
“GLOW”: [
{ name: “Aesthetic Research Co.”, rating: 5, text: “Pre-reconstituted blend saves significant prep time. All three components verified on our end.”, date: “2026-01-18” },
{ name: “K. Patel”, rating: 4, text: “Convenient formulation for multi-target pathway studies. Quality is consistent with standalone products.”, date: “2026-02-01” },
],
“KLOW”: [
{ name: “Dermal Sciences Lab”, rating: 5, text: “The quad-peptide blend is ideal for our cytokine signaling research. KPV addition is a differentiator.”, date: “2026-01-25” },
{ name: “A. Rodriguez, MS”, rating: 5, text: “Outstanding quality. Each component verified independently. Will be ordering monthly.”, date: “2026-02-08” },
],
“MOTS-c”: [
{ name: “Mitochondrial Research Group”, rating: 5, text: “Critical peptide for our AMPK pathway work. Purity exceeded expectations — verified at 99.3%.”, date: “2026-01-12” },
{ name: “T. Okamoto”, rating: 4, text: “Excellent product. Lyophilized cake reconstituted cleanly. Reliable for metabolic assays.”, date: “2026-01-30” },
{ name: “EndoLab Systems”, rating: 5, text: “We’ve tested multiple suppliers — PX consistently delivers the highest purity MOTS-c available.”, date: “2026-02-14” },
],
“SS-31”: [
{ name: “CardioResearch Inc.”, rating: 5, text: “Essential for our cardiolipin interaction studies. Analytical verification confirmed identity and purity.”, date: “2026-01-08” },
{ name: “Prof. L. Andersen”, rating: 5, text: “Publication-grade quality. We cite PX as our supplier in our manuscripts. That says everything.”, date: “2026-02-02” },
],
“Tesamorelin”: [
{ name: “Endocrine Studies Lab”, rating: 5, text: “44-mer synthesized cleanly. MS fragmentation pattern matches expected sequence. Excellent.”, date: “2026-01-20” },
{ name: “W. Harper, PhD”, rating: 4, text: “Reliable GHRH analog for receptor binding research. COA is thorough and transparent.”, date: “2026-02-06” },
{ name: “NeuroPeptide Core”, rating: 5, text: “Switched from a previous supplier. PX quality is noticeably superior. No going back.”, date: “2026-02-15” },
],
“Ipamorelin”: [
{ name: “GH Signaling Lab”, rating: 5, text: “Highly selective GHS-R1a agonist confirmed in our binding assays. Purity is impeccable.”, date: “2026-01-14” },
{ name: “D. Kim”, rating: 4, text: “Clean product, fast delivery. Would appreciate a 10mg option in the future.”, date: “2026-02-10” },
],
“BPC-157”: [
{ name: “GI Research Division”, rating: 5, text: “Gold standard for our cytoprotective signaling work. Batch consistency over 6 months of orders has been flawless.”, date: “2026-01-05” },
{ name: “Peptide Analytics Core”, rating: 5, text: “Independent HPLC/MS verification matches COA within 0.2%. That’s rare in this industry.”, date: “2026-01-19” },
{ name: “Dr. S. Morales”, rating: 4, text: “Excellent pentadecapeptide. Solubility profile is exactly as described. Recommend for NO pathway studies.”, date: “2026-02-07” },
],
“TB-500”: [
{ name: “Cell Motility Lab”, rating: 5, text: “Critical for our actin dynamics research. PX delivers consistent, verified product every time.”, date: “2026-01-16” },
{ name: “J. Andersen, MS”, rating: 5, text: “Cleanest TB-500 we’ve sourced. Reconstitution is immediate. COA is comprehensive.”, date: “2026-02-03” },
],
“GHK-Cu”: [
{ name: “Matrix Biology Core”, rating: 5, text: “Copper tripeptide complex with verified Cu²⁺ coordination. Essential for our gene expression studies.”, date: “2026-01-11” },
{ name: “Skin Sciences Institute”, rating: 4, text: “High-quality GHK-Cu. 50mg size is generous. Metallopeptide integrity maintained through shipping.”, date: “2026-01-27” },
{ name: “R. Petrov, PhD”, rating: 5, text: “Third year ordering from PX. Quality has never wavered. Our go-to supplier for copper peptides.”, date: “2026-02-11” },
],
};

// — Star Rating Component —
const StarRating = ({ rating, onRate, size = 16, interactive = false }) => (

  <div style={{ display: "flex", gap: 2, cursor: interactive ? "pointer" : "default" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width={size} height={size} viewBox="0 0 24 24" onClick={() => interactive && onRate && onRate(star)}
        style={{ transition: "transform 0.15s", transform: interactive ? "scale(1)" : "none" }}
        onMouseOver={(e) => interactive && (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseOut={(e) => interactive && (e.currentTarget.style.transform = "scale(1)")}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={star <= rating ? "#7C3AED" : "#e2e8f0"} stroke={star <= rating ? "#7C3AED" : "#d0d8e0"} strokeWidth="1"/>
      </svg>
    ))}
  </div>
);

const TEAM = [
{ name: “Kris Machain”, role: “Founder & CEO”, bio: “B.S. Molecular & Cellular Biology, University of Arizona. Background in financial planning and wealth management, with extensive experience in client advisory and operational leadership. Combines a deep understanding of biological sciences with business strategy to bring research-grade peptides to market.” },
{ name: “Dr. Whitney Wright”, role: “Medical Advisor”, bio: “Licensed healthcare professional with a doctoral-level clinical background. Provides medical guidance and advisory support on product quality standards, research protocols, and regulatory compliance for PX Peptides.” },
];

// — Main App —
export default function PeptideSite() {
const [menuOpen, setMenuOpen] = useState(false);
const [activeProduct, setActiveProduct] = useState(null);
const [selectedOption, setSelectedOption] = useState(null);
const [modalQty, setModalQty] = useState(1);
const [formData, setFormData] = useState({ name: “”, email: “”, message: “” });
const [formSent, setFormSent] = useState(false);
const [reviews, setReviews] = useState(SEED_REVIEWS);
const [reviewForm, setReviewForm] = useState({ name: “”, rating: 0, text: “” });
const [reviewSubmitted, setReviewSubmitted] = useState(false);

const [cart, setCart] = useState([]);
const [cartOpen, setCartOpen] = useState(false);
const [discountCode, setDiscountCode] = useState(””);
const [appliedDiscount, setAppliedDiscount] = useState(null);

const DISCOUNT_CODES = { “PX10”: 10, “RESEARCH15”: 15, “LAUNCH20”: 20 };

const addToCart = (product, size, price, qty = 1) => {
setCart((prev) => {
const existing = prev.find((item) => item.name === product.name && item.size === size);
if (existing) return prev.map((item) => item.name === product.name && item.size === size ? { …item, qty: item.qty + qty } : item);
return […prev, { name: product.name, size, price, qty, molecularName: product.molecularName }];
});
};
const updateQty = (name, size, delta) => {
setCart((prev) => prev.map((item) => item.name === name && item.size === size ? { …item, qty: Math.max(0, item.qty + delta) } : item).filter((item) => item.qty > 0));
};
const removeFromCart = (name, size) => setCart((prev) => prev.filter((item) => !(item.name === name && item.size === size)));
const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
const discountAmount = appliedDiscount ? (cartTotal * appliedDiscount / 100) : 0;
const finalTotal = cartTotal - discountAmount;
const applyDiscount = () => {
const pct = DISCOUNT_CODES[discountCode.toUpperCase()];
if (pct) { setAppliedDiscount(pct); } else { setAppliedDiscount(null); }
};

const getProductReviews = (productName) => reviews[productName] || [];
const getAvgRating = (productName) => {
const r = getProductReviews(productName);
if (r.length === 0) return 0;
return (r.reduce((sum, rev) => sum + rev.rating, 0) / r.length).toFixed(1);
};
const submitReview = (productName) => {
if (!reviewForm.name || !reviewForm.rating || !reviewForm.text) return;
const newReview = { …reviewForm, date: new Date().toISOString().split(“T”)[0] };
setReviews((prev) => ({ …prev, [productName]: […(prev[productName] || []), newReview] }));
setReviewForm({ name: “”, rating: 0, text: “” });
setReviewSubmitted(true);
setTimeout(() => setReviewSubmitted(false), 3000);
};

const NAV = [
{ label: “Products”, href: “#products” },
{ label: “Science”, href: “#science” },
{ label: “About”, href: “#about” },
{ label: “Contact”, href: “#contact” },
{ label: “Disclosures”, href: “#disclosures” },
];

const getProductPrice = (p, size) => {
if (p.prices) {
if (size && p.prices[size]) return p.prices[size];
const keys = Object.keys(p.prices);
return p.prices[keys[0]];
}
return null;
};
const getDefaultSize = (p) => {
if (p.options) return p.options[0];
return Object.keys(p.prices || {})[0] || p.mg;
};

const scrollTo = (href) => {
setMenuOpen(false);
document.querySelector(href)?.scrollIntoView({ behavior: “smooth” });
};

return (
<div style={{ background: “#ffffff”, color: “#2d3748”, minHeight: “100vh”, fontFamily: “‘Avenir’, ‘Avenir Next’, -apple-system, sans-serif”, overflowX: “hidden” }}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

```
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    ::selection { background: #00a09044; color: #1a202c; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #f0f2f4; }
    ::-webkit-scrollbar-thumb { background: #7C3AED33; border-radius: 3px; }

    .nav-link { color: #5a6778; text-decoration: none; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; transition: color 0.25s; font-weight: 500; }
    .nav-link:hover { color: #7C3AED; }

    .accent { color: #7C3AED; }
    .mono { font-family: 'Avenir', 'Avenir Next', -apple-system, sans-serif; font-weight: 600; }

    .btn-primary {
      background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
      color: #ffffff; font-weight: 700; border: none; padding: 14px 36px;
      font-size: 14px; letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer;
      transition: all 0.3s; font-family: 'Avenir', 'Avenir Next', -apple-system, sans-serif;
    }
    .btn-primary:hover { box-shadow: 0 0 30px #7C3AED55; transform: translateY(-2px); }

    .btn-ghost {
      background: transparent; color: #7C3AED; border: 1px solid #7C3AED33;
      padding: 12px 32px; font-size: 13px; letter-spacing: 1.2px; text-transform: uppercase;
      cursor: pointer; transition: all 0.3s; font-family: 'Avenir', 'Avenir Next', -apple-system, sans-serif; font-weight: 500;
    }
    .btn-ghost:hover { border-color: #7C3AED; background: #7C3AED11; }

    .product-card {
      background: linear-gradient(165deg, #ffffff 0%, #f8fafb 100%);
      border: 1px solid #e2e8f0; padding: 28px; cursor: pointer;
      transition: all 0.4s cubic-bezier(.22,1,.36,1); position: relative; overflow: hidden;
      z-index: 1;
    }
    .product-card::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
      background: linear-gradient(90deg, transparent, #7C3AED, transparent);
      opacity: 0; transition: opacity 0.35s;
    }
    .product-card:hover { border-color: #00a09044; transform: scale(1.06); box-shadow: 0 20px 60px #7C3AED12, 0 8px 24px rgba(0,0,0,0.12); z-index: 2; }
    .product-card:hover::before { opacity: 1; }

    .tag { display: inline-block; background: #00a09015; color: #00a090; font-size: 11px; padding: 4px 10px; letter-spacing: 0.8px; text-transform: uppercase; font-family: 'Avenir', 'Avenir Next', -apple-system, sans-serif; font-weight: 600; border: 1px solid #00a09030; }

    .section-label {
      font-family: 'Avenir', 'Avenir Next', -apple-system, sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 3px;
      text-transform: uppercase; color: #7C3AED; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;
    }
    .section-label::before { content: ''; width: 24px; height: 1px; background: #7C3AED; }

    .section-title { font-size: clamp(28px, 4vw, 44px); font-weight: 700; line-height: 1.15; margin-bottom: 20px; color: #1a202c; }

    .input-field {
      background: #f6f8fa; border: 1px solid #d8e0e8; color: #2d3748; padding: 14px 18px;
      font-size: 15px; font-family: 'Avenir', 'Avenir Next', -apple-system, sans-serif; width: 100%; outline: none;
      transition: border-color 0.3s;
    }
    .input-field:focus { border-color: #7C3AED55; }
    .input-field::placeholder { color: #94a3b8; }

    .stat-number { font-family: 'Avenir', 'Avenir Next', -apple-system, sans-serif; font-weight: 600; font-size: clamp(36px, 5vw, 56px); font-weight: 700; color: #7C3AED; line-height: 1; }
    .stat-label { font-size: 13px; color: #00a090; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 8px; }

    .team-card {
      background: linear-gradient(165deg, #ffffff 0%, #f8fafb 100%);
      border: 1px solid #e2e8f0; padding: 32px; transition: all 0.35s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .team-card:hover { border-color: #7C3AED33; }

    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.35);
      z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px;
      backdrop-filter: blur(8px);
    }
    .modal-box {
      background: #ffffff; border: 1px solid #d8e0e8; max-width: 640px; width: 100%; padding: 40px;
      position: relative; max-height: 80vh; overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }

    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-toggle { display: flex !important; }
      .grid-2 { grid-template-columns: 1fr !important; }
      .grid-products { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
      .hero-content { padding: 0 20px !important; }
      .product-card { padding: 12px !important; overflow: visible !important; }
      .product-card:hover { transform: none !important; }
      .product-card .card-layout { flex-direction: column !important; gap: 10px !important; }
      .product-card .mol-col { width: 100% !important; max-width: 120px !important; margin: 0 auto 4px !important; }
      .product-card .card-details .card-title { font-size: 14px !important; }
      .product-card .card-details .card-mol-name { font-size: 10px !important; }
      .product-card .card-details .card-desc { display: none !important; }
      .product-card .card-details .card-layman { font-size: 10px !important; margin-bottom: 8px !important; }
      .product-card .card-details .card-specs { display: none !important; }
      .product-card .card-details .card-meta { font-size: 9px !important; gap: 4px !important; }
      .product-card .card-details .card-price-row { margin-top: 8px !important; padding-top: 8px !important; flex-direction: column !important; gap: 8px !important; align-items: flex-start !important; }
      .product-card .card-details .card-price { font-size: 15px !important; }
      .mol-wrap:hover { transform: none !important; }
      .modal-box { margin: 8px !important; max-height: 92vh !important; }
      .modal-box .modal-header { flex-direction: column !important; align-items: center !important; text-align: center !important; }
      .modal-box .modal-mol { width: 120px !important; margin: 0 auto 16px !important; }
      .modal-box .modal-info { text-align: center !important; }
      .modal-box .spec-grid { grid-template-columns: 1fr !important; }
      .modal-box .price-row { flex-direction: column !important; align-items: stretch !important; text-align: center !important; }
      .modal-box .price-controls { justify-content: center !important; flex-wrap: wrap !important; }
      .cart-panel { width: 100% !important; max-width: 100% !important; }
      .stats-bar { grid-template-columns: 1fr !important; gap: 12px !important; max-width: 320px !important; margin: 0 auto !important; }
    }
    @media (min-width: 769px) {
      .mobile-toggle { display: none !important; }
      .mobile-menu { display: none !important; }
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px #7C3AED11; }
      50% { box-shadow: 0 0 40px #7C3AED22; }
    }

    @keyframes atom-float-1 {
      0%, 100% { transform: translate(0px, 0px); }
      25% { transform: translate(3px, -4px); }
      50% { transform: translate(-2px, -6px); }
      75% { transform: translate(-4px, -2px); }
    }
    @keyframes atom-float-2 {
      0%, 100% { transform: translate(0px, 0px); }
      25% { transform: translate(-4px, 3px); }
      50% { transform: translate(3px, 5px); }
      75% { transform: translate(5px, -3px); }
    }
    @keyframes atom-float-3 {
      0%, 100% { transform: translate(0px, 0px); }
      25% { transform: translate(5px, 2px); }
      50% { transform: translate(-3px, -4px); }
      75% { transform: translate(2px, 5px); }
    }
    @keyframes atom-pulse {
      0%, 100% { opacity: 0.15; r: inherit; }
      50% { opacity: 0.35; }
    }
    @keyframes bond-pulse {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 0.6; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) forwards; }
    .fade-up-d1 { animation-delay: 0.15s; opacity: 0; }
    .fade-up-d2 { animation-delay: 0.3s; opacity: 0; }
    .fade-up-d3 { animation-delay: 0.45s; opacity: 0; }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes mol-rotate {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }
    .mol-wrap {
      transition: transform 0.4s cubic-bezier(.22,1,.36,1);
      transform-origin: center center;
      border-radius: 10px;
      cursor: pointer;
    }
    .mol-wrap:hover {
      transform: scale(1.3);
      z-index: 10;
      position: relative;
    }
    .mol-structure {
      transform-origin: center center;
      transform-box: fill-box;
    }
    .mol-wrap:hover .mol-structure {
      animation: mol-rotate 4s linear infinite;
    }
  `}</style>

  {/* === NAV === */}
  <nav style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50, background: "linear-gradient(135deg, #5B21B6ee, #4C1D95ee)", backdropFilter: "blur(16px)", borderBottom: "1px solid #ffffff15" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => scrollTo("#hero")}>
        <PXLogo height={44} />
        <span className="mono" style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, color: "#f0f4f8" }}>PEPTIDES</span>
      </div>
      <div className="desktop-nav" style={{ display: "flex", gap: 32 }}>
        {NAV.map((n) => (
          <a key={n.label} className="nav-link" href={n.href} onClick={(e) => { e.preventDefault(); scrollTo(n.href); }}>{n.label}</a>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", color: "#2d3748", cursor: "pointer", flexDirection: "column", gap: 5, padding: 8 }}>
          <span style={{ width: 22, height: 2, background: menuOpen ? "#7C3AED" : "#8a9bae", transition: "0.3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ width: 22, height: 2, background: "#5a6778", opacity: menuOpen ? 0 : 1, transition: "0.3s" }} />
          <span style={{ width: 22, height: 2, background: menuOpen ? "#7C3AED" : "#8a9bae", transition: "0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
        <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 6 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a9bae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: -2, right: -4, background: "#00a090", color: "#f6f8fa", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif" }}>{cartCount}</span>
          )}
        </button>
      </div>
    </div>
    {menuOpen && (
      <div className="mobile-menu" style={{ background: "#f6f8fa", borderTop: "1px solid #e2e8f0", padding: "20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        {NAV.map((n) => (
          <a key={n.label} className="nav-link" href={n.href} onClick={(e) => { e.preventDefault(); scrollTo(n.href); }} style={{ fontSize: 15 }}>{n.label}</a>
        ))}
      </div>
    )}
  </nav>

  {/* === HERO === */}
  <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    <MolecularBG />
    <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, background: "radial-gradient(circle, #7C3AED08 0%, transparent 70%)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: "15%", right: "8%", width: 400, height: 400, background: "radial-gradient(circle, #7C3AED05 0%, transparent 70%)", pointerEvents: "none" }} />
    <div className="hero-content" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, padding: "0 32px" }}>
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <span className="tag">Research Use Only</span>
      </div>
      <h1 className="fade-up fade-up-d1" style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 700, lineHeight: 1.05, color: "#1a202c", marginBottom: 24 }}>
        {COMPANY.split(" ")[0]} <span className="accent">{COMPANY.split(" ")[1]}</span>
      </h1>
      <p className="fade-up fade-up-d2" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#4a5568", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 500 }}>
        {TAGLINE}. HPLC-verified, third-party tested, and manufactured under strict quality protocols for in-vitro research.
      </p>
      <div className="fade-up fade-up-d3" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={() => scrollTo("#products")}>Browse Catalog</button>
        <button className="btn-ghost" onClick={() => scrollTo("#science")}>Our Science</button>
      </div>
    </div>
    <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 }}>
      <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#00a090", fontWeight: 700 }}>Scroll</span>
      <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, #7C3AED55, transparent)" }} />
    </div>
  </section>

  {/* === MISSION === */}
  <Section id="definition">
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "#ffffff", border: "1px solid #e2e8f0", padding: "40px 48px", position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 60, height: 2, background: "linear-gradient(90deg, transparent, #7C3AED, transparent)" }} />
        <p style={{ fontSize: "clamp(18px, 2.2vw, 24px)", color: "#1a202c", lineHeight: 1.7, maxWidth: 620, margin: "0 auto", fontWeight: 400 }}>
          Purity is not a target — it's the <span className="accent" style={{ fontWeight: 600 }}>standard</span>. Every compound verified. Every batch traced. No exceptions.
        </p>
      </div>
    </div>
  </Section>

  {/* === STATS BAR === */}
  <Section id="stats">
    <div style={{ background: "#f2f5f8", padding: "60px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 32, textAlign: "center" }} className="stats-bar">
        {[
          { num: "≥99%", label: "Purity Standard" },
          { num: "GMP", label: "Compliant Facility" },
          { num: "HPLC", label: "& MS Verified" },
          { num: "7+", label: "Years Manufacturing" },
          { num: "3rd", label: "Party Verified" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#7C3AED", lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: 13, color: "#1a202c88", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </Section>

  {/* === PRODUCTS === */}
  <Section id="products">
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 8vw, 100px) clamp(16px, 4vw, 32px)" }}>
      <div className="section-label">Catalog</div>
      <h2 className="section-title">Research Peptides</h2>
      <p style={{ color: "#4a5568", maxWidth: 560, marginBottom: 48, lineHeight: 1.7, fontSize: 16 }}>
        Every peptide is manufactured in a GMP-compliant facility, verified via HPLC and mass spectrometry, third-party tested, and shipped with a full Certificate of Analysis.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="grid-products">
        {PRODUCTS.map((p, i) => (
          <div key={i} className="product-card" onClick={() => { setActiveProduct(p); setSelectedOption(null); setModalQty(1); setReviewForm({ name: "", rating: 0, text: "" }); setReviewSubmitted(false); }} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="card-layout" style={{ display: "flex", gap: 20 }}>
              <div className="mol-col" style={{ flexShrink: 0, width: 100 }}>
                <div className="mol-wrap">
                  <MolecularModel name={p.name} idx={i} />
                </div>
              </div>
              <div className="card-details" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <h3 className="mono card-title" style={{ fontSize: 20, fontWeight: 700, color: "#1a202c", marginBottom: 4 }}>{p.name}</h3>
                    {p.molecularName && p.molecularName !== "Proprietary Blend" && (
                      <div className="card-mol-name" style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>{p.molecularName}</div>
                    )}
                  </div>
                  <span className="tag">{p.purity}</span>
                </div>
                <p className="card-desc" style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, marginBottom: 12 }}>{p.desc}</p>
                {p.layman && <p className="card-layman" style={{ fontSize: 12, color: "#00a090", lineHeight: 1.55, marginBottom: 12, fontStyle: "italic", fontWeight: 600 }}>⚛ {p.layman}</p>}
                <div className="card-specs" style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {[
                    ["MW", p.molecularWeight],
                    ["Form", p.form],
                    p.aminoAcids ? ["Residues", `${p.aminoAcids} aa`] : null,
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} style={{ background: "#f0f4f880", padding: "3px 8px", border: "1px solid #e2e8f066", fontSize: 10 }}>
                      <span style={{ color: "#00a090", fontWeight: 700 }}>{k}: </span>
                      <span className="mono" style={{ color: "#5a6778" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="card-meta" style={{ display: "flex", gap: 12, fontSize: 11, color: "#94a3b8", alignItems: "center", flexWrap: "wrap" }}>
                  <span className="mono">CAS: {p.cas}</span>
                  <span>•</span>
                  <span>{p.options ? `${p.options.length} sizes` : p.mg} • 3 mL vial</span>
                  <span>•</span>
                  <span>{p.studies.length} studies</span>
                </div>
                {getProductReviews(p.name).length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid #e2e8f044" }}>
                    <StarRating rating={Math.round(parseFloat(getAvgRating(p.name)))} size={13} />
                    <span className="mono" style={{ fontSize: 12, color: "#00a090", fontWeight: 700 }}>{getAvgRating(p.name)}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>({getProductReviews(p.name).length} reviews)</span>
                  </div>
                )}
                <div className="card-price-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f044" }}>
                  <div className="mono card-price" style={{ fontSize: 18, fontWeight: 700, color: "#7C3AED" }}>
                    ${getProductPrice(p, getDefaultSize(p)).toFixed(2)}
                    {p.options && p.options.length > 1 && <span style={{ fontSize: 11, color: "#00a090", fontWeight: 600, marginLeft: 4 }}>from</span>}
                  </div>
                  <button className="btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(p, getDefaultSize(p), getProductPrice(p, getDefaultSize(p))); }} style={{ padding: "6px 14px", fontSize: 11 }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 40, padding: "20px 24px", background: "#f0f4f866", border: "1px solid #e2e8f044", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 9, color: "#00a090", fontWeight: 700, background: "#00a09012", padding: "3px 8px", letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif", border: "1px solid #00a09025", flexShrink: 0, marginTop: 2 }}>Notice</span>
        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
          All products sold by PX Peptides are strictly intended for in-vitro research and laboratory use only. They are not intended for human or animal consumption, therapeutic use, cosmetic application, or any form of self-administration. Product descriptions and cited literature are provided for reference purposes only and do not constitute medical advice. PX Peptides makes no claims regarding the safety, efficacy, or suitability of its products for the diagnosis, prevention, treatment, or cure of any disease or medical condition.
        </p>
      </div>
    </div>
  </Section>
  {/* Product Modal */}
  {activeProduct && (
    <div className="modal-overlay" onClick={() => { setActiveProduct(null); setSelectedOption(null); setModalQty(1); }}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <button onClick={() => { setActiveProduct(null); setSelectedOption(null); setModalQty(1); }} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "#4a5568", fontSize: 24, cursor: "pointer", zIndex: 2 }}>×</button>
        <div className="modal-header" style={{ display: "flex", gap: 28, marginBottom: 24 }}>
          <div className="modal-mol" style={{ flexShrink: 0, width: 140 }}>
            <div className="mol-wrap">
              <MolecularModel name={activeProduct.name} idx={99} />
            </div>
          </div>
          <div className="modal-info" style={{ flex: 1 }}>
            <span className="tag" style={{ marginBottom: 12, display: "inline-block" }}>{activeProduct.purity} Purity</span>
            <h3 className="mono" style={{ fontSize: 28, fontWeight: 700, color: "#1a202c", marginBottom: 4 }}>{activeProduct.name}</h3>
            {activeProduct.molecularName && (
              <div style={{ fontSize: 14, color: "#94a3b8", fontStyle: "italic", marginBottom: 12 }}>{activeProduct.molecularName}</div>
            )}
            <p style={{ color: "#4a5568", lineHeight: 1.7, fontSize: 14 }}>{activeProduct.desc}</p>
            {activeProduct.layman && <p style={{ color: "#00a090", lineHeight: 1.7, fontSize: 13, marginTop: 8, fontStyle: "italic", fontWeight: 600 }}>⚛ {activeProduct.layman}</p>}
          </div>
        </div>

        {activeProduct.options && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#00a090", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>Select Size</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {activeProduct.options.map((opt) => (
                <button key={opt} onClick={() => setSelectedOption(opt)} style={{
                  background: selectedOption === opt ? "#7C3AED18" : "#f6f8fa",
                  border: selectedOption === opt ? "1px solid #7C3AED" : "1px solid #e2e8f0",
                  color: selectedOption === opt ? "#7C3AED" : "#8a9bae",
                  padding: "10px 20px", cursor: "pointer", fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif",
                  fontSize: 13, transition: "all 0.25s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}>
                  <span>{opt}</span>
                  {activeProduct.prices && activeProduct.prices[opt] && (
                    <span style={{ fontSize: 11, color: selectedOption === opt ? "#7C3AED" : "#4a5b6e" }}>${activeProduct.prices[opt].toFixed(2)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price + Quantity + Add to Cart */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "18px 20px", marginBottom: 24 }}>
          <div className="price-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "#7C3AED" }}>
                ${(getProductPrice(activeProduct, selectedOption || getDefaultSize(activeProduct)) * modalQty).toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "#00a090", fontWeight: 600 }}>
                {modalQty > 1 ? `${modalQty} vials × $${getProductPrice(activeProduct, selectedOption || getDefaultSize(activeProduct)).toFixed(2)}` : "per 3 mL vial"} • {selectedOption || getDefaultSize(activeProduct)}
              </div>
            </div>
            <div className="price-controls" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Quantity controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #e2e8f0", background: "#f6f8fa" }}>
                <button onClick={() => setModalQty(q => Math.max(1, q - 1))} style={{
                  width: 36, height: 36, background: "none", border: "none", borderRight: "1px solid #e2e8f0",
                  color: modalQty <= 1 ? "#2a3540" : "#8a9bae", fontSize: 18, cursor: modalQty <= 1 ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s",
                }}>−</button>
                <div className="mono" style={{ width: 44, textAlign: "center", fontSize: 15, fontWeight: 700, color: "#1a202c" }}>{modalQty}</div>
                <button onClick={() => setModalQty(q => Math.min(99, q + 1))} style={{
                  width: 36, height: 36, background: "none", border: "none", borderLeft: "1px solid #e2e8f0",
                  color: "#5a6778", fontSize: 18, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s",
                }}>+</button>
              </div>
              <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }} onClick={() => {
                const size = selectedOption || getDefaultSize(activeProduct);
                const price = getProductPrice(activeProduct, size);
                addToCart(activeProduct, size, price, modalQty);
                setModalQty(1);
              }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div style={{ fontSize: 11, color: "#00a090", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 1, background: "#00a09044" }} />
          Specifications
        </div>
        <div className="spec-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            ["CAS Number", activeProduct.cas],
            ["Molecular Weight", activeProduct.molecularWeight],
            ["Formula", activeProduct.formula],
            ["Amino Acids", activeProduct.aminoAcids ? `${activeProduct.aminoAcids} residues` : "Multi-component"],
            ["Purity", activeProduct.purity],
            ["Form", activeProduct.form],
            ["Quantity", activeProduct.options ? (selectedOption || "Select above") : activeProduct.mg],
            ["Vial Size", "3 mL"],
            ["Appearance", activeProduct.appearance],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "#ffffff", padding: "10px 12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, color: "#00a090", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, fontWeight: 700 }}>{k}</div>
              <div className="mono" style={{ fontSize: 13, color: "#2d3748" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Sequence */}
        {activeProduct.sequence && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#00a090", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 1, background: "#00a09044" }} />
              Sequence
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "12px 14px", fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif", fontSize: 12, color: "#5a6778", lineHeight: 1.8, wordBreak: "break-all" }}>
              {activeProduct.sequence}
            </div>
          </div>
        )}

        {/* Handling */}
        <div className="spec-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {[
            ["Solubility", activeProduct.solubility],
            ["Storage", activeProduct.storage],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "#ffffff", padding: "10px 12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 10, color: "#00a090", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, fontWeight: 700 }}>{k}</div>
              <div style={{ fontSize: 12, color: "#5a6778", lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Studies */}
        {activeProduct.studies && activeProduct.studies.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 1, background: "#00a09044" }} />
              Published Literature
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeProduct.studies.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", background: "#ffffff", border: "1px solid #e2e8f0", padding: "12px 14px",
                  textDecoration: "none", transition: "border-color 0.25s",
                }} onMouseOver={(e) => e.currentTarget.style.borderColor = "#00a09044"} onMouseOut={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}>
                  <div style={{ fontSize: 13, color: "#5a6778", lineHeight: 1.5, marginBottom: 4 }}>{s.title}</div>
                  <span className="mono" style={{ fontSize: 11, color: "#94a3b8" }}>{s.journal}</span>
                  {s.summary && (
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, marginTop: 8, paddingTop: 8, borderTop: "1px solid #e2e8f044" }}>{s.summary}</div>
                  )}
                </a>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8", lineHeight: 1.5, fontStyle: "italic" }}>
              Literature cited for reference purposes only. PX Peptides makes no therapeutic claims. All products are intended strictly for in-vitro research.
            </div>
          </div>
        )}
        {/* Reviews Section */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 1, background: "#00a09044" }} />
              Customer Reviews
            </div>
            {getProductReviews(activeProduct.name).length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <StarRating rating={Math.round(parseFloat(getAvgRating(activeProduct.name)))} size={12} />
                <span className="mono" style={{ fontSize: 12, color: "#00a090", fontWeight: 700 }}>{getAvgRating(activeProduct.name)}</span>
                <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "none" }}>({getProductReviews(activeProduct.name).length})</span>
              </div>
            )}
          </div>

          {/* Existing Reviews */}
          {getProductReviews(activeProduct.name).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, maxHeight: 280, overflowY: "auto" }}>
              {getProductReviews(activeProduct.name).map((rev, ri) => (
                <div key={ri} style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, #7C3AED${15 + ri * 5}, #e8f0f4)`, border: "1px solid #7C3AED22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED" }}>{rev.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: "#2d3748", fontWeight: 500 }}>{rev.name}</div>
                        <div className="mono" style={{ fontSize: 10, color: "#94a3b8" }}>{rev.date}</div>
                      </div>
                    </div>
                    <StarRating rating={rev.rating} size={11} />
                  </div>
                  <p style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.6, margin: 0 }}>{rev.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20, fontStyle: "italic" }}>No reviews yet. Be the first to review this product.</p>
          )}

          {/* Write Review Form */}
          <div style={{ background: "#f6f8fa", border: "1px solid #e2e8f0", padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: "#4a5568", fontWeight: 500, marginBottom: 14 }}>Write a Review</div>
            {reviewSubmitted ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
                <p style={{ color: "#7C3AED", fontSize: 14, fontWeight: 500 }}>Review Submitted</p>
                <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Thank you for your feedback.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <input className="input-field" placeholder="Your Name / Lab" value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      style={{ fontSize: 13, padding: "8px 12px" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Rating</span>
                    <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} size={18} interactive />
                  </div>
                </div>
                <textarea className="input-field" placeholder="Share your experience with this product — purity verification, packaging, analytical results..."
                  rows={3} style={{ resize: "vertical", fontSize: 13, padding: "8px 12px" }}
                  value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} />
                <button className="btn-primary" style={{ alignSelf: "flex-start", padding: "8px 24px", fontSize: 13 }}
                  onClick={() => submitReview(activeProduct.name)}
                  disabled={!reviewForm.name || !reviewForm.rating || !reviewForm.text}>
                  Submit Review
                </button>
              </div>
            )}
            <div style={{ marginTop: 10, fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>
              Reviews reflect individual research experiences. PX Peptides does not verify reviewer claims. All products are for research use only.
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* === CART OVERLAY === */}
  {cartOpen && (
    <div className="modal-overlay" onClick={() => setCartOpen(false)} style={{ zIndex: 10001 }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "fixed", top: 0, right: 0, width: "min(420px, 100vw)", height: "100vh",
        background: "#f6f8fa", borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column",
        animation: "slideIn 0.3s ease-out",
      }}>
        {/* Cart Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: "#1a202c", letterSpacing: 1 }}>Cart</span>
            {cartCount > 0 && <span style={{ fontSize: 12, color: "#94a3b8" }}>({cartCount} items)</span>}
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#4a5568", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a2530" strokeWidth="1.5" style={{ marginBottom: 16 }}>
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>Your cart is empty</p>
              <p style={{ color: "#2a3a4a", fontSize: 12, marginTop: 4 }}>Browse our catalog to add research peptides</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.map((item, ci) => (
                <div key={ci} style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: "#1a202c" }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.molecularName} • {item.size}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.name, item.size)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>×</button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #e2e8f0" }}>
                      <button onClick={() => updateQty(item.name, item.size, -1)} style={{ background: "#ffffff", border: "none", color: "#5a6778", width: 32, height: 32, cursor: "pointer", fontSize: 16, fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif" }}>−</button>
                      <span className="mono" style={{ width: 36, textAlign: "center", fontSize: 14, color: "#1a202c", display: "inline-block" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.name, item.size, 1)} style={{ background: "#ffffff", border: "none", color: "#5a6778", width: 32, height: 32, cursor: "pointer", fontSize: 16, fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif" }}>+</button>
                    </div>
                    <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: "#7C3AED" }}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: "1px solid #e2e8f0", padding: "20px 24px" }}>
            {/* Discount Code */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#00a090", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>Discount Code</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input-field" placeholder="Enter code" value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyDiscount()}
                  style={{ flex: 1, fontSize: 13, padding: "8px 12px", textTransform: "uppercase" }} />
                <button onClick={applyDiscount} style={{
                  background: "none", border: "1px solid #e2e8f0", color: "#5a6778", padding: "8px 16px",
                  cursor: "pointer", fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif", fontSize: 12, transition: "all 0.25s",
                }}>Apply</button>
              </div>
              {appliedDiscount && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#7C3AED", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>✓</span> {appliedDiscount}% discount applied
                  <button onClick={() => { setAppliedDiscount(null); setDiscountCode(""); }} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}>Remove</button>
                </div>
              )}
              {discountCode && !appliedDiscount && discountCode.length > 2 && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#6a4a4a" }}>Invalid code</div>
              )}
            </div>

            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4a5568" }}>
                <span>Subtotal</span>
                <span className="mono">${cartTotal.toFixed(2)}</span>
              </div>
              {appliedDiscount && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7C3AED" }}>
                  <span>Discount ({appliedDiscount}%)</span>
                  <span className="mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8" }}>
                <span>Shipping</span>
                <span className="mono" style={{ color: "#7C3AED" }}>FREE</span>
              </div>
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a202c" }}>Total</span>
                <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: "#7C3AED" }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn-primary" style={{ width: "100%", padding: "14px 0", fontSize: 15 }}>
              Checkout
            </button>
            <div style={{ marginTop: 10, fontSize: 10, color: "#94a3b8", textAlign: "center", fontStyle: "italic" }}>
              All products are for in-vitro research use only.
            </div>
          </div>
        )}
      </div>
    </div>
  )}

  {/* === SCIENCE === */}
  <Section id="science" dark>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 8vw, 100px) clamp(16px, 4vw, 32px)" }}>
      <div className="section-label">Methodology</div>
      <h2 className="section-title">The Science Behind Our Process</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginTop: 48 }} className="grid-2">
        <div>
          <p style={{ color: "#5a6778", lineHeight: 1.8, fontSize: 16, marginBottom: 24 }}>
            All PX Peptides products are manufactured in a GMP-compliant, ISO-certified facility with over 7 years of peptide production expertise. From raw materials to finished product, every stage is subject to strict end-to-end quality control — ensuring consistent purity, identity, and reproducibility across every batch.
          </p>
          <p style={{ color: "#4a5568", lineHeight: 1.8, fontSize: 15, marginBottom: 24 }}>
            Each product is analyzed using HPLC and mass spectrometry (MS), with a detailed Certificate of Analysis (CoA) included with every order. Batches are additionally sent to independent third-party laboratories for verification, providing an additional layer of analytical assurance.
          </p>
          <p style={{ color: "#4a5568", lineHeight: 1.8, fontSize: 15 }}>
            Full documentation and batch tracking are maintained for every order, ensuring complete traceability from synthesis through delivery.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { step: "01", title: "GMP Manufacturing", desc: "Produced in a GMP-compliant, ISO-certified facility with strict environmental controls and 7+ years of peptide synthesis expertise." },
            { step: "02", title: "In-House QC Testing", desc: "Every batch analyzed by HPLC for purity and MS for molecular weight confirmation. Detailed CoA generated per lot." },
            { step: "03", title: "Third-Party Verification", desc: "Random samples sent to independent laboratories (e.g., Janoshik) for unbiased purity and identity verification." },
            { step: "04", title: "Lyophilization & Packaging", desc: "Peptides are freeze-dried and sealed in glass vials under controlled conditions for maximum stability and shelf life." },
            { step: "05", title: "Temperature-Controlled Shipping", desc: "Products shipped with appropriate insulation and climate protection via trusted carriers (DHL, FedEx, EMS) with full order tracking." },
          ].map((s) => (
            <div key={s.step} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <span className="mono accent" style={{ fontSize: 28, fontWeight: 700, opacity: 0.6, lineHeight: 1 }}>{s.step}</span>
              <div>
                <h4 style={{ color: "#1a202c", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{s.title}</h4>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 0.8, lineHeight: 1.6 }}>All methodologies and processes described are applied exclusively to products intended for in-vitro research and laboratory use only.</span>
      </div>
    </div>
  </Section>
  {/* === ABOUT === */}
  <Section id="about">
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 8vw, 100px) clamp(16px, 4vw, 32px)" }}>
      <div className="section-label">About Us</div>
      <h2 className="section-title">Who We Are</h2>
      <div style={{ maxWidth: 720, marginBottom: 56 }}>
        <p style={{ color: "#5a6778", lineHeight: 1.85, fontSize: 16, marginBottom: 20 }}>
          <span className="accent" style={{ fontWeight: 600 }}>PX</span> takes its mark from the Chi-Rho — the ancient christogram formed by overlaying the Greek letters <em style={{ color: "#4a5568" }}>Chi (Χ)</em> and <em style={{ color: "#4a5568" }}>Rho (Ρ)</em>, a symbol of precision, purpose, and unwavering standard. It represents what we stand for: the right compound, at the right purity, at the right time.
        </p>
        <p style={{ color: "#4a5568", lineHeight: 1.85, fontSize: 15 }}>
          Founded on the principle that researchers deserve uncompromising quality without exception, PX Peptides manufactures every compound in a GMP-compliant facility, verifies identity and purity through HPLC and mass spectrometry, and subjects every batch to independent third-party testing. We don't cut corners. We don't ship without a Certificate of Analysis. Precision isn't a marketing term — it's our operating standard.
        </p>
      </div>

      <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 20, height: 1, background: "#00a09044" }} />
        Leadership
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, maxWidth: 800 }} className="grid-2">
        {TEAM.map((t, i) => (
          <div key={i} className="team-card">
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, #7C3AED${20 + i * 10}, #e8f0f4)`, border: "1px solid #7C3AED33", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="mono accent" style={{ fontSize: 16, fontWeight: 700 }}>{t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
            </div>
            <h4 style={{ color: "#1a202c", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{t.name}</h4>
            <p className="accent" style={{ fontSize: 12, letterSpacing: 0.5, marginBottom: 12, fontWeight: 500 }}>{t.role}</p>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{t.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>

  {/* === CONTACT === */}
  <Section id="contact" dark>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 8vw, 100px) clamp(16px, 4vw, 32px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="grid-2">
        <div>
          <div className="section-label">Get in Touch</div>
          <h2 className="section-title">Contact Us</h2>
          <p style={{ color: "#4a5568", lineHeight: 1.7, fontSize: 16, marginBottom: 32 }}>
            For bulk orders, custom synthesis requests, or general inquiries — our team typically responds within 24 hours.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["Email", "info@pxpeptides.com"],
              ["Phone", "+1 (800) 555-0142"],
              ["Hours", "Mon–Fri, 8AM–6PM EST"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: 1, width: 56, flexShrink: 0 }}>{k}</span>
                <span className="mono" style={{ color: "#5a6778", fontSize: 14 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          {formSent ? (
            <div style={{ background: "#f6f8fa", border: "1px solid #7C3AED33", padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <h3 style={{ color: "#1a202c", fontSize: 20, marginBottom: 8 }}>Message Sent</h3>
              <p style={{ color: "#4a5568", fontSize: 14 }}>We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="input-field" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input className="input-field" placeholder="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <textarea className="input-field" placeholder="Your message or inquiry..." rows={5} style={{ resize: "vertical" }} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              <button className="btn-primary" onClick={() => setFormSent(true)} style={{ alignSelf: "flex-start" }}>Send Message</button>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 0.8 }}>All inquiries pertain to products intended for in-vitro research and laboratory use only.</span>
      </div>
    </div>
  </Section>

  {/* === DISCLOSURES === */}
  <Section id="disclosures">
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px, 8vw, 100px) clamp(16px, 4vw, 32px)" }}>
      <div className="section-label">Legal</div>
      <h2 className="section-title">Disclosures</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginTop: 32 }} className="grid-2">
        <div>
          <h4 style={{ color: "#1a202c", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Research Use Only</h4>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
            All products sold by PX Peptides are strictly intended for in-vitro research and laboratory use only. They are not intended for human or animal consumption, therapeutic use, cosmetic application, or any form of self-administration. By purchasing from PX Peptides, buyers agree that products will be used exclusively for legitimate scientific research purposes.
          </p>
          <h4 style={{ color: "#1a202c", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>No Medical Claims</h4>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8 }}>
            PX Peptides makes no claims regarding the safety, efficacy, or suitability of its products for the diagnosis, prevention, treatment, or cure of any disease or medical condition. Product descriptions reference published research literature and do not constitute medical advice.
          </p>
        </div>
        <div>
          <h4 style={{ color: "#1a202c", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Regulatory Compliance</h4>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
            Buyers are solely responsible for ensuring compliance with all applicable local, state, federal, and international laws and regulations governing the purchase, possession, and use of research peptides in their jurisdiction. PX Peptides reserves the right to refuse or cancel orders at its discretion.
          </p>
          <h4 style={{ color: "#1a202c", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Limitation of Liability</h4>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8 }}>
            PX Peptides shall not be held liable for any damages, injuries, or losses arising from the misuse, mishandling, or improper storage of its products. Certificates of analysis are provided for informational purposes and reflect testing at the time of manufacture.
          </p>
        </div>
      </div>
    </div>
  </Section>

  {/* === RESEARCH USE ONLY BANNER === */}
  <div style={{ background: "#7C3AED", padding: "14px 32px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", textAlign: "center" }}>
      <span style={{ fontFamily: "'Avenir', 'Avenir Next', -apple-system, sans-serif", fontSize: 11, fontWeight: 700, color: "#ffffff", letterSpacing: 1.5, textTransform: "uppercase" }}>For Research Use Only</span>
      <span style={{ color: "#ffffffaa", fontSize: 12 }}>—</span>
      <span style={{ fontSize: 12, color: "#ffffffcc", lineHeight: 1.5 }}>
        All PX Peptides products are intended exclusively for in-vitro research and laboratory use. Not for human or animal consumption, therapeutic application, or self-administration.
      </span>
    </div>
  </div>

  {/* === FOOTER === */}
  <footer style={{ borderTop: "1px solid #e2e8f0", padding: "40px 32px", background: "#f0f3f6" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <PXLogo height={32} glowOpacity={0.1} />
        <span className="mono" style={{ fontSize: 12, letterSpacing: 2, color: "#94a3b8" }}>PX PEPTIDES</span>
      </div>
      <p style={{ color: "#94a3b8", fontSize: 12, letterSpacing: 0.5 }}>
        © 2026 PX Peptides. All rights reserved. For research use only.
      </p>
      <div style={{ display: "flex", gap: 24 }}>
        {["Privacy Policy", "Terms of Service", "Shipping"].map((l) => (
          <a key={l} href="#" style={{ color: "#94a3b8", fontSize: 12, textDecoration: "none", letterSpacing: 0.5, transition: "color 0.25s" }} onMouseOver={(e) => e.target.style.color = "#7C3AED"} onMouseOut={(e) => e.target.style.color = "#4a5b6e"}>{l}</a>
        ))}
      </div>
    </div>
  </footer>
</div>
```

);
}
