import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import {
  Globe,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Shield,
  Radio,
  Zap,
  Crosshair,
  Server,
  Info,
} from 'lucide-react';
import {
  WORLD_GEO_DATA,
  CYBER_LOCATIONS,
  CyberLocation,
} from '../data/worldGeoData';

interface AttackArc {
  id: string;
  source: CyberLocation;
  target: CyberLocation;
  protocol: string;
  threatName: string;
  progress: number;
}

export const ThreatGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Interaction & Animation States
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<CyberLocation | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeDecoysCount] = useState<number>(
    CYBER_LOCATIONS.filter((l) => l.type === 'decoy').length
  );
  const [trappedAttacksCount, setTrappedAttacksCount] = useState<number>(1842);

  // Keep refs for animation loop
  const rotationRef = useRef<[number, number, number]>([-20, -15, 0]);
  const isDraggingRef = useRef<boolean>(false);
  const isRotatingRef = useRef<boolean>(true);
  const animFrameIdRef = useRef<number | null>(null);
  const zoomRef = useRef<number>(1);

  // Active attacks simulating real-time decoy redirection
  const activeAttacksRef = useRef<AttackArc[]>([
    {
      id: 'atk-1',
      source: CYBER_LOCATIONS.find((c) => c.id === 'att-amsterdam')!,
      target: CYBER_LOCATIONS.find((c) => c.id === 'decoy-useast')!,
      protocol: 'TCP/2222',
      threatName: 'Log4j / JNDI LDAP Injection',
      progress: 0.1,
    },
    {
      id: 'atk-2',
      source: CYBER_LOCATIONS.find((c) => c.id === 'att-stpete')!,
      target: CYBER_LOCATIONS.find((c) => c.id === 'decoy-eucentral')!,
      protocol: 'TCP/9000',
      threatName: 'Spring4Shell RCE Payload',
      progress: 0.45,
    },
    {
      id: 'atk-3',
      source: CYBER_LOCATIONS.find((c) => c.id === 'att-shenzhen')!,
      target: CYBER_LOCATIONS.find((c) => c.id === 'decoy-apeast')!,
      protocol: 'TCP/8080',
      threatName: 'Mirai Mirrored C2 Probe',
      progress: 0.75,
    },
    {
      id: 'atk-4',
      source: CYBER_LOCATIONS.find((c) => c.id === 'att-sofia')!,
      target: CYBER_LOCATIONS.find((c) => c.id === 'decoy-uksouth')!,
      protocol: 'TCP/445',
      threatName: 'SMB Zero-Day Metasploit',
      progress: 0.3,
    },
    {
      id: 'atk-5',
      source: CYBER_LOCATIONS.find((c) => c.id === 'att-saopaulo')!,
      target: CYBER_LOCATIONS.find((c) => c.id === 'decoy-uswest')!,
      protocol: 'TCP/3389',
      threatName: 'RDP Credential Stuffing',
      progress: 0.6,
    },
  ]);

  // Keep state and ref in sync
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    zoomRef.current = zoomLevel;
  }, [zoomLevel]);

  // Periodic increment to simulate live incoming trapped threats
  useEffect(() => {
    const interval = setInterval(() => {
      setTrappedAttacksCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Main D3 Rendering Function
  const renderGlobe = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 480;
    const height = Math.max(380, Math.min(width * 0.9, 480));
    const baseRadius = Math.min(width, height) * 0.42;
    const radius = baseRadius * zoomRef.current;

    const svg = d3.select(svgRef.current);
    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    // D3 Orthographic Projection (3D Globe)
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .rotate(rotationRef.current)
      .clipAngle(90) // Clips back hemisphere
      .precision(0.3);

    const pathGenerator = d3.geoPath().projection(projection);

    // Center coordinates for visible hemisphere check
    const center: [number, number] = [-rotationRef.current[0], -rotationRef.current[1]];

    // --- 1. Background Sphere with Cyber Atmosphere ---
    svg.select('.globe-ocean').attr('d', pathGenerator({ type: 'Sphere' }) || '');
    svg.select('.globe-atmosphere')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius * 1.03);

    // --- 2. Wireframe Graticules (Longitudes & Latitudes) ---
    const graticule = d3.geoGraticule10();
    svg.select('.globe-graticule').attr('d', pathGenerator(graticule) || '');

    // --- 3. World Continental Landmasses ---
    const landGroup = svg.select('.globe-land');
    const landPaths = landGroup.selectAll<SVGPathElement, any>('path')
      .data(WORLD_GEO_DATA.features);

    landPaths.enter()
      .append('path')
      .merge(landPaths)
      .attr('d', (d: any) => pathGenerator(d as any) || '')
      .attr('fill', '#071d1a')
      .attr('fill-opacity', 0.5)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 0.75)
      .attr('stroke-opacity', 0.4);

    landPaths.exit().remove();

    // --- 4. Outer Sphere Rim ---
    svg.select('.globe-border').attr('d', pathGenerator({ type: 'Sphere' }) || '');

    // --- 5. Traffic Attack Arcs (Curves to Decoys) ---
    const arcsGroup = svg.select('.globe-arcs');
    const arcData = activeAttacksRef.current;

    const arcs = arcsGroup.selectAll<SVGPathElement, any>('path.attack-arc')
      .data(arcData, (d: any) => (d as AttackArc).id);

    arcs.enter()
      .append('path')
      .attr('class', 'attack-arc')
      .merge(arcs)
      .attr('d', (d: any) => {
        const item = d as AttackArc;
        const lineGeo: any = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [item.source.coordinates, item.target.coordinates],
          },
        };
        return pathGenerator(lineGeo) || '';
      })
      .attr('fill', 'none')
      .attr('stroke', 'url(#arc-gradient)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 2')
      .attr('stroke-opacity', (d: any) => {
        const item = d as AttackArc;
        const distSrc = d3.geoDistance(center, item.source.coordinates);
        const distTgt = d3.geoDistance(center, item.target.coordinates);
        return distSrc < Math.PI / 2 || distTgt < Math.PI / 2 ? 0.8 : 0.1;
      });

    arcs.exit().remove();

    // Traveling photons along arcs
    const photons = arcsGroup.selectAll<SVGCircleElement, any>('circle.attack-photon')
      .data(arcData, (d: any) => (d as AttackArc).id);

    photons.enter()
      .append('circle')
      .attr('class', 'attack-photon')
      .attr('r', 2.5)
      .attr('fill', '#38bdf8')
      .attr('filter', 'url(#glow-filter)')
      .merge(photons)
      .attr('cx', (d: any) => {
        const item = d as AttackArc;
        const interpolator = d3.geoInterpolate(item.source.coordinates, item.target.coordinates);
        const currentCoord = interpolator(item.progress);
        const projected = projection(currentCoord);
        return projected ? projected[0] : -999;
      })
      .attr('cy', (d: any) => {
        const item = d as AttackArc;
        const interpolator = d3.geoInterpolate(item.source.coordinates, item.target.coordinates);
        const currentCoord = interpolator(item.progress);
        const projected = projection(currentCoord);
        return projected ? projected[1] : -999;
      })
      .attr('opacity', (d: any) => {
        const item = d as AttackArc;
        const interpolator = d3.geoInterpolate(item.source.coordinates, item.target.coordinates);
        const currentCoord = interpolator(item.progress);
        const dist = d3.geoDistance(center, currentCoord);
        return dist < Math.PI / 2 ? 1 : 0;
      });

    photons.exit().remove();

    // --- 6. Nodes (Decoy Honeypots & Attacker Origins) ---
    const nodesGroup = svg.select('.globe-nodes');
    const visibleLocations = CYBER_LOCATIONS.filter((loc) => {
      const distance = d3.geoDistance(center, loc.coordinates);
      return distance < Math.PI / 2; // only visible hemisphere
    });

    const nodeElements = nodesGroup.selectAll<SVGGElement, CyberLocation>('g.cyber-node')
      .data(visibleLocations, (d) => d.id);

    const nodeEnter = nodeElements.enter()
      .append('g')
      .attr('class', 'cyber-node cursor-pointer')
      .on('click', (_, d) => {
        setSelectedNode(d);
      });

    // Outer pulse ring for decoys
    nodeEnter.append('circle')
      .attr('class', 'pulse-ring')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5);

    // Core node circle
    nodeEnter.append('circle')
      .attr('class', 'core-circle')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1);

    // Label tag
    nodeEnter.append('text')
      .attr('class', 'node-label')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('text-anchor', 'start')
      .attr('dx', 8)
      .attr('dy', 3);

    const nodeUpdate = nodeEnter.merge(nodeElements)
      .attr('transform', (d) => {
        const pos = projection(d.coordinates);
        return pos ? `translate(${pos[0]}, ${pos[1]})` : 'translate(-999,-999)';
      });

    nodeUpdate.select('circle.pulse-ring')
      .attr('r', (d) => (d.type === 'decoy' ? 9 : 6))
      .attr('stroke', (d) => (d.type === 'decoy' ? '#10b981' : '#f43f5e'))
      .attr('stroke-opacity', 0.6)
      .attr('class', (d) => (d.type === 'decoy' ? 'animate-ping' : ''));

    nodeUpdate.select('circle.core-circle')
      .attr('r', (d) => (d.type === 'decoy' ? 4.5 : 3.5))
      .attr('fill', (d) => (d.type === 'decoy' ? '#10b981' : '#f43f5e'))
      .attr('filter', 'url(#glow-filter)');

    nodeUpdate.select('text.node-label')
      .text((d) => (d.type === 'decoy' ? d.name.split(' ')[0] : ''))
      .attr('fill', '#a7f3d0')
      .attr('font-weight', '600');

    nodeElements.exit().remove();
  }, []);

  // Animation Loop (Continuous Rotation + Photon Arcs)
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Rotate if active and not dragging
      if (isRotatingRef.current && !isDraggingRef.current) {
        rotationRef.current[0] += 12 * delta; // Longitude speed
        if (rotationRef.current[0] > 180) rotationRef.current[0] -= 360;
      }

      // Advance photon attack progress along arcs
      activeAttacksRef.current.forEach((atk) => {
        atk.progress += delta * 0.45;
        if (atk.progress > 1) {
          atk.progress = 0;
        }
      });

      renderGlobe();
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderGlobe]);

  // Setup D3 Drag Gesture
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const drag = d3
      .drag<SVGSVGElement, unknown>()
      .on('start', () => {
        isDraggingRef.current = true;
      })
      .on('drag', (event) => {
        const sensitivity = 70 / (zoomRef.current * 100);
        rotationRef.current[0] += event.dx * sensitivity;
        rotationRef.current[1] = Math.max(
          -70,
          Math.min(70, rotationRef.current[1] - event.dy * sensitivity)
        );
        renderGlobe();
      })
      .on('end', () => {
        isDraggingRef.current = false;
      });

    svg.call(drag);

    return () => {
      svg.on('.drag', null);
    };
  }, [renderGlobe]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      renderGlobe();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderGlobe]);

  // Center on a specific decoy node
  const focusLocation = (location: CyberLocation) => {
    setSelectedNode(location);
    setIsRotating(false);
    // Orient globe so coordinates are at center
    rotationRef.current = [-location.coordinates[0], -location.coordinates[1], 0];
    renderGlobe();
  };

  // Reset to default angle
  const handleReset = () => {
    rotationRef.current = [-20, -15, 0];
    setZoomLevel(1);
    setSelectedNode(null);
    setIsRotating(true);
    renderGlobe();
  };

  return (
    <div
      id="threat-globe-card"
      className="bg-[#070b12] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-slate-300 relative h-full select-none"
    >
      {/* Globe Header Bar */}
      <div className="bg-[#0d131f] px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/[0.08] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-500/80 inline-block" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs min-w-0">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-semibold tracking-tight text-[11px] sm:text-xs truncate">
              trinetra-threat-globe
            </span>
            <span className="text-slate-500 hidden md:inline text-[11px]">
              (d3.geoOrthographic)
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] sm:text-[10px] font-semibold">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{activeDecoysCount} DECOYS</span>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
            className="p-1 sm:p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
            title="Zoom in"
            className="p-1 sm:p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer hidden xs:inline-flex"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.15))}
            title="Zoom out"
            className="p-1 sm:p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer hidden xs:inline-flex"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            title="Reset globe orientation"
            className="p-1 sm:p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Globe Visualizer Stage */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[340px] sm:min-h-[380px] flex items-center justify-center bg-[#050810] overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Wireframe background scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(#10b981 1px, transparent 1px), linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.4) 51%)',
            backgroundSize: '24px 24px, 100% 4px',
          }}
        />

        {/* SVG Container for D3 rendering */}
        <svg ref={svgRef} className="w-full h-full block">
          <defs>
            {/* Outer atmosphere radial glow */}
            <radialGradient id="globe-glow-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.0" />
              <stop offset="92%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.35" />
            </radialGradient>

            {/* Ocean depth radial gradient */}
            <radialGradient id="ocean-gradient" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#0b1722" />
              <stop offset="60%" stopColor="#060c14" />
              <stop offset="100%" stopColor="#020408" />
            </radialGradient>

            {/* In-flight attack arc gradient */}
            <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>

            {/* Node glow filter */}
            <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render Groups in Optical Z-Order */}
          <g className="globe-base">
            <circle className="globe-atmosphere" fill="url(#globe-glow-gradient)" />
            <path className="globe-ocean" fill="url(#ocean-gradient)" />
            <path
              className="globe-graticule"
              fill="none"
              stroke="#059669"
              strokeWidth="0.65"
              strokeOpacity="0.28"
            />
          </g>

          <g className="globe-land" />
          <g className="globe-arcs" />
          <g className="globe-nodes" />

          {/* Sharp wireframe rim */}
          <path
            className="globe-border"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.2"
            strokeOpacity="0.45"
          />
        </svg>

        {/* Floating Cyber Legend (Top-Left overlay) */}
        <div className="absolute top-3 left-3 bg-[#0a101b]/85 backdrop-blur-md border border-white/[0.08] rounded-lg p-2 text-[10px] space-y-1 select-none pointer-events-none hidden sm:block">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Decoy Honeypots (Trapping)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
            <span>Inbound Attacker Signals</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-0.5 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 inline-block" />
            <span>Active eBPF Redirection Arcs</span>
          </div>
        </div>

        {/* Interactive Node Inspector Drawer / Popover */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-[#09111e]/95 backdrop-blur-md border border-emerald-500/30 rounded-lg p-3 text-xs shadow-xl animate-fadeIn">
            <div className="flex items-start justify-between gap-2 border-b border-white/[0.08] pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white truncate">{selectedNode.name}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-[11px] px-1 rounded hover:bg-white/[0.1]"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className={selectedNode.type === 'decoy' ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                  {selectedNode.type === 'decoy' ? 'Deception Sandbox' : 'Threat Origin'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IP:</span>
                <span className="text-slate-200 font-mono">{selectedNode.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-300">{selectedNode.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cluster:</span>
                <span className="text-slate-300 truncate max-w-[150px]">{selectedNode.asnOrPod}</span>
              </div>
              {selectedNode.type === 'decoy' ? (
                <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Zero Prod Exposure
                  </span>
                  <span className="font-semibold">ARMED</span>
                </div>
              ) : (
                <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-amber-400">
                  <span className="flex items-center gap-1">
                    <Info className="w-3 h-3" /> Threat Level
                  </span>
                  <span className="font-semibold">{selectedNode.threatLevel || 'High'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Decoy Fast-Focus Bar (bottom overlay) */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 flex-wrap pointer-events-auto">
          {CYBER_LOCATIONS.filter((l) => l.type === 'decoy')
            .slice(0, 4)
            .map((decoy) => (
              <button
                key={decoy.id}
                onClick={() => focusLocation(decoy)}
                className={`px-2 py-0.5 rounded text-[9px] border transition-all cursor-pointer ${
                  selectedNode?.id === decoy.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-[#0b1322]/80 border-white/[0.08] text-slate-400 hover:text-white hover:border-emerald-500/40'
                }`}
              >
                {decoy.country.split(' ')[0]}
              </button>
            ))}
        </div>
      </div>

      {/* Terminal Status Bar (Subtle Bottom HUD) */}
      <div className="bg-[#0b1019] px-3 sm:px-4 py-2 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-slate-400 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Trapped Sessions:</span>
            <strong className="text-white font-semibold">
              {trappedAttacksCount.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400">
          <Zap className="w-3 h-3 shrink-0" />
          <span className="text-slate-300">Mesh Sync:</span>
          <strong className="font-semibold">&lt; 0.12ms</strong>
        </div>
      </div>
    </div>
  );
};
