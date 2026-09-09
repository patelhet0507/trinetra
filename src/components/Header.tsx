import React, { useState, useEffect } from 'react';
import {
  Shield,
  Menu,
  X,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  onRequestDemo: () => void;
  onOpenDocs: () => void;
  onLaunchSandbox?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRequestDemo, onOpenDocs, onLaunchSandbox }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Telemetry', href: '#telemetry-suite' },
    { name: 'Forensics', href: '#forensic-replay' },
    { name: 'MITRE Matrix', href: '#mitre-matrix' },
    { name: 'Canary Builder', href: '#decoy-orchestrator' },
    { name: 'eBPF Benchmarks', href: '#kernel-benchmark' },
    { name: 'IOC Feed', href: '#ioc-export' },
  ];

  return (
    <header
      id="top-nav"
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0B0F19]/95 backdrop-blur-md border-b border-white/[0.08] shadow-sm'
          : 'bg-[#0B0F19] border-b border-white/[0.05]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Clean Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            id="brand-logo"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-lg text-white tracking-tight">
                TRINETRA <span className="text-emerald-400 font-bold">X</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Active Deception
              </span>
            </div>
          </a>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={onOpenDocs}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              id="nav-link-docs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs</span>
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onRequestDemo}
              id="nav-cta-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer font-medium"
            >
              <span>Request Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onRequestDemo}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-md cursor-pointer"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800/60 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F19] border-b border-white/[0.08] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-md"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDocs();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-white flex items-center justify-between cursor-pointer"
          >
            <span>Technical Documentation</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestDemo();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg cursor-pointer"
            >
              Request Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
