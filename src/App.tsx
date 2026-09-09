/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, BookOpen } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ThreatGlobe } from './components/ThreatGlobe';
import { TrafficTerminal } from './components/TrafficTerminal';
import { ForensicSessionReplay } from './components/ForensicSessionReplay';
import { MitreDeceptionMatrix } from './components/MitreDeceptionMatrix';
import { DecoyOrchestrator } from './components/DecoyOrchestrator';
import { KernelBenchmarkCalculator } from './components/KernelBenchmarkCalculator';
import { IocExportCenter } from './components/IocExportCenter';
import { ParadigmShift } from './components/ParadigmShift';
import { EnterpriseSecurity } from './components/EnterpriseSecurity';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';
import { DocsModal } from './components/DocsModal';

export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [docsInitialTab, setDocsInitialTab] = useState<'whitepaper' | 'api' | 'compliance'>('whitepaper');

  const handleOpenDocs = (tab: 'whitepaper' | 'api' | 'compliance' = 'whitepaper') => {
    setDocsInitialTab(tab);
    setDocsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-emerald-500/25 selection:text-emerald-300 font-sans">
      {/* Clean Navbar */}
      <Header
        onRequestDemo={() => setDemoModalOpen(true)}
        onOpenDocs={() => handleOpenDocs('whitepaper')}
      />

      {/* Main Page Content */}
      <main>
        {/* 1. Hero & Interactive Simulator */}
        <Hero
          onBookDemo={() => setDemoModalOpen(true)}
          onViewArchitecture={() => handleOpenDocs('whitepaper')}
        />

        {/* Real-Time Cyber Telemetry: 3D Threat Globe & Kernel Splicing Terminal */}
        <section id="telemetry-suite" className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* 3D Wireframe Interactive Threat Globe */}
            <div className="lg:col-span-6 flex flex-col h-full">
              <ThreatGlobe />
            </div>

            {/* Live Kernel Decoy Splicing Terminal */}
            <div className="lg:col-span-6 flex flex-col h-full">
              <TrafficTerminal className="w-full h-full flex flex-col" />
            </div>
          </div>
        </section>

        {/* 2. Interactive Decoy Session Replay & Forensics */}
        <ForensicSessionReplay />

        {/* 3. MITRE ATT&CK Deception Matrix */}
        <MitreDeceptionMatrix />

        {/* 4. Decoy Fleet Orchestrator & Canary Builder */}
        <DecoyOrchestrator />

        {/* 5. In-Kernel eBPF Performance Benchmark Calculator */}
        <KernelBenchmarkCalculator />

        {/* 6. Ground-Truth IOC Feed & SIEM Exporter */}
        <IocExportCenter />

        {/* 7. Traditional Blocking vs Active Deception & 3 Simple Steps */}
        <ParadigmShift />

        {/* 8. Safety Guarantees & Production Isolation */}
        <EnterpriseSecurity />

        {/* 4. Simple Call-to-Action Section */}
        <section className="py-16 sm:py-20 bg-[#0B0F19] border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-[#111726] rounded-2xl p-8 sm:p-12 border border-white/[0.08] shadow-lg relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Turn your cyber perimeter from a target into a sensor
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                See how TRINETRA X protects your real servers while extracting ground-truth intelligence from active attackers.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Request Live Sandbox Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDocs('whitepaper')}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Read Technical Brief</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <Footer
        onOpenDocs={handleOpenDocs}
        onRequestDemo={() => setDemoModalOpen(true)}
      />

      {/* Accessible Modals for on-demand details */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      <DocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
        initialTab={docsInitialTab}
      />
    </div>
  );
}
