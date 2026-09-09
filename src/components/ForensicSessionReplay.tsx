import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Shield,
  AlertTriangle,
  FileCode,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight,
  Hash,
} from 'lucide-react';
import { FORENSIC_SESSIONS, ForensicSession } from '../data/deceptionSuiteData';

export const ForensicSessionReplay: React.FC = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(FORENSIC_SESSIONS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  const activeSession: ForensicSession =
    FORENSIC_SESSIONS.find((s) => s.id === selectedSessionId) || FORENSIC_SESSIONS[0];

  // Reset steps when session changes
  useEffect(() => {
    setCurrentStepIndex(1);
    setIsPlaying(false);
  }, [selectedSessionId]);

  // Auto-play timer through attacker commands
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= activeSession.keystrokes.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [isPlaying, activeSession.keystrokes.length]);

  // Scroll to bottom of terminal when new keystroke appears
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [currentStepIndex]);

  const visibleKeystrokes = activeSession.keystrokes.slice(0, currentStepIndex);

  return (
    <section id="forensic-replay" className="py-12 sm:py-16 md:py-20 bg-[#080d16] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium mb-2">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Ground-Truth Attacker Observability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Interactive Decoy Session Replay &amp; Forensics
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              When adversaries are quietly diverted into our honeypot sandbox, every keystroke, dropped binary, and C2 communication is recorded with zero risk to production.
            </p>
          </div>

          {/* Session Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {FORENSIC_SESSIONS.map((sess) => (
              <button
                key={sess.id}
                onClick={() => setSelectedSessionId(sess.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer border ${
                  sess.id === selectedSessionId
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-[#111726] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.2]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${sess.id === selectedSessionId ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span>{sess.sessionCode.split('-')[2]}</span>
                  <span className="text-[10px] text-slate-500">({sess.serviceTarget.split(' ')[0]})</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Main Forensics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono">
          
          {/* Left Column (7 cols): Interactive Sandbox Replay Terminal */}
          <div className="lg:col-span-7 flex flex-col bg-[#070b12] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden">
            
            {/* Terminal Top Control Bar */}
            <div className="bg-[#0d131f] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between select-none gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-200 font-semibold truncate">
                  sandbox-replay::{activeSession.decoyContainer}
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  (tty_recorder: v2.4)
                </span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-xs text-slate-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause replay' : 'Auto-play keystrokes'}
                >
                  {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  <span className="text-[10px] font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={() => setCurrentStepIndex((i) => Math.min(activeSession.keystrokes.length, i + 1))}
                  disabled={currentStepIndex >= activeSession.keystrokes.length}
                  className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Step forward"
                >
                  <SkipForward className="w-3 h-3" />
                </button>

                <button
                  onClick={() => {
                    setCurrentStepIndex(1);
                    setIsPlaying(false);
                  }}
                  className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 transition-colors cursor-pointer"
                  title="Rewind to start"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalScrollRef}
              className="flex-1 min-h-[360px] max-h-[460px] p-4 overflow-y-auto bg-[#05080f] text-xs space-y-4 scroll-smooth border-b border-white/[0.06]"
              style={{
                backgroundImage: 'radial-gradient(#10b981 0.75px, transparent 0.75px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Session Banner */}
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-semibold">[TRINETRA IN-KERNEL HONEYPOT SPAWNED]</span>
                  <span className="text-emerald-400">PID: #28419 (ephemeral tmpfs)</span>
                </div>
                <div>Attacker IP: <span className="text-slate-200">{activeSession.adversaryIp}</span> &bull; Target: <span className="text-slate-200">{activeSession.serviceTarget}</span></div>
                <div>Simulated Environment: <span className="text-slate-300 font-medium">{activeSession.decoyContainer}</span></div>
              </div>

              {/* Keystrokes Stream */}
              {visibleKeystrokes.map((step, idx) => (
                <div key={idx} className="space-y-1 animate-fadeIn">
                  {/* Command Row */}
                  <div className="flex items-baseline gap-2 text-slate-200">
                    <span className="text-slate-500 select-none text-[10px]">[{step.timeOffset}]</span>
                    <span className="text-emerald-400 font-bold select-none">&gt;</span>
                    <span className="font-semibold text-white break-all">{step.command}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 ml-auto shrink-0 hidden sm:inline">
                      {step.ttp}
                    </span>
                  </div>

                  {/* Synthetic Decoy Output */}
                  <div className="pl-6 text-slate-300 text-[11px] whitespace-pre-wrap font-sans bg-white/[0.015] p-2 rounded border-l-2 border-cyan-500/40 leading-relaxed">
                    {step.output}
                  </div>
                </div>
              ))}

              {/* Cursor indicator */}
              <div className="flex items-center gap-2 pl-6 pt-1 text-slate-500">
                <span className="text-[10px]">
                  {currentStepIndex >= activeSession.keystrokes.length
                    ? '[Session Completed — All artifacts extracted and mapped to SIEM]'
                    : `Step ${currentStepIndex} of ${activeSession.keystrokes.length} executed`}
                </span>
                <span className="w-1.5 h-3 bg-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Timeline Scrubber Bar */}
            <div className="bg-[#0a0f19] px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span>Timeline Scrubber:</span>
                <span className="text-cyan-400 font-semibold">
                  {currentStepIndex}/{activeSession.keystrokes.length} events
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-semibold">{activeSession.status}</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Extracted Artifacts & Threat Metadata */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Session Metadata Card */}
            <div className="bg-[#111726] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Session Overview</span>
                  <h3 className="text-sm font-bold text-white">{activeSession.sessionCode}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Risk Score</span>
                  <span className="text-base font-bold text-rose-400">{activeSession.riskScore}/100</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Adversary Origin:</span>
                  <span className="text-slate-200 truncate max-w-[200px]">{activeSession.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Network / ASN:</span>
                  <span className="text-slate-300">{activeSession.asn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration Trapped:</span>
                  <span className="text-emerald-400 font-semibold">{activeSession.duration}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/[0.06]">
                  <span className="text-slate-400">MITRE Tags:</span>
                  <div className="flex items-center gap-1 flex-wrap justify-end">
                    {activeSession.mitreTechniques.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/25 text-[10px] text-purple-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Artifacts Inspector Card */}
            <div className="flex-1 bg-[#111726] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col">
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/[0.08] text-xs font-semibold text-white">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Extracted Forensic Artifacts &amp; Honey-Tokens</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[260px]">
                {activeSession.capturedArtifacts.map((art, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#090e18] border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-cyan-400 uppercase tracking-wider">{art.type}</span>
                      <span className="text-slate-500">Extracted in-memory</span>
                    </div>
                    <div className="font-mono text-slate-200 text-[11px] break-all select-all bg-black/40 p-1.5 rounded border border-white/[0.04]">
                      {art.value}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {art.details}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-emerald-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Production Integrity Verified
                </span>
                <span className="text-slate-400">Zero Host Exposure</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
