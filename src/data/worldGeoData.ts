// Lightweight GeoJSON representing simplified continental landmasses for high-performance SVG/Canvas rendering
export interface GeoFeature {
  type: 'Feature';
  properties: { name: string };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export interface CyberLocation {
  id: string;
  name: string;
  country: string;
  type: 'attacker' | 'decoy';
  coordinates: [number, number]; // [lon, lat]
  ip: string;
  asnOrPod: string;
  threatLevel?: 'Critical' | 'High' | 'Medium';
}

export interface LiveThreatAttack {
  id: string;
  timestamp: string;
  source: CyberLocation;
  target: CyberLocation;
  vector: string;
  mitreTtp: string;
  payloadSnippet: string;
  severity: 'Critical' | 'High' | 'Medium';
  status: 'Inbound Socket' | 'Silent Reroute' | 'Decoy Trapped' | 'Canary Tripped';
  progress: number; // 0 to 1 along the arc
}

export const CYBER_LOCATIONS: CyberLocation[] = [
  // TRINETRA X Decoy Pods
  {
    id: 'decoy-useast',
    name: 'US-East Ashburn Decoy Mesh',
    country: 'United States',
    type: 'decoy',
    coordinates: [-77.4874, 39.0438],
    ip: '10.99.0.42:2222',
    asnOrPod: 'Pod-42 / EKS Bastion',
  },
  {
    id: 'decoy-eucentral',
    name: 'EU-Central Frankfurt Decoy Pod',
    country: 'Germany',
    type: 'decoy',
    coordinates: [8.6821, 50.1109],
    ip: '10.99.18.10:9000',
    asnOrPod: 'Pod-18 / Kube-Mesh',
  },
  {
    id: 'decoy-apeast',
    name: 'AP-East Tokyo Decoy Pod',
    country: 'Japan',
    type: 'decoy',
    coordinates: [139.6917, 35.6895],
    ip: '10.99.09.88:8080',
    asnOrPod: 'Pod-09 / Spring Decoy',
  },
  {
    id: 'decoy-uksouth',
    name: 'UK-South London Decoy Pod',
    country: 'United Kingdom',
    type: 'decoy',
    coordinates: [-0.1278, 51.5074],
    ip: '10.99.04.14:445',
    asnOrPod: 'Pod-04 / AD Domain Decoy',
  },
  {
    id: 'decoy-apsouth',
    name: 'AP-South Mumbai Decoy Mesh',
    country: 'India',
    type: 'decoy',
    coordinates: [72.8777, 19.076],
    ip: '10.99.23.15:22',
    asnOrPod: 'Pod-23 / BareMetal Bastion',
  },
  {
    id: 'decoy-uswest',
    name: 'US-West Oregon Decoy Pod',
    country: 'United States',
    type: 'decoy',
    coordinates: [-121.3153, 44.0582],
    ip: '10.99.07.50:3389',
    asnOrPod: 'Pod-07 / RDP Decoy',
  },

  // Simulated Attacker Origins
  {
    id: 'att-amsterdam',
    name: 'Tor Exit Node Relay',
    country: 'Netherlands',
    type: 'attacker',
    coordinates: [4.9041, 52.3676],
    ip: '185.220.101.42',
    asnOrPod: 'AS60729 Tor Mesh',
    threatLevel: 'Critical',
  },
  {
    id: 'att-stpete',
    name: 'Bulletproof Host Network',
    country: 'Russia',
    type: 'attacker',
    coordinates: [30.3351, 59.9343],
    ip: '91.240.118.17',
    asnOrPod: 'AS44050 Bulletproof',
    threatLevel: 'Critical',
  },
  {
    id: 'att-shenzhen',
    name: 'Mirai Variant C2 Scanner',
    country: 'China',
    type: 'attacker',
    coordinates: [114.0579, 22.5431],
    ip: '112.96.42.19',
    asnOrPod: 'AS4134 Chinanet',
    threatLevel: 'High',
  },
  {
    id: 'att-sofia',
    name: 'Compromised VPN Concentrator',
    country: 'Bulgaria',
    type: 'attacker',
    coordinates: [23.3219, 42.6977],
    ip: '45.154.255.89',
    asnOrPod: 'AS20860 Neterra',
    threatLevel: 'High',
  },
  {
    id: 'att-saopaulo',
    name: 'Credential Stuffing Botfarm',
    country: 'Brazil',
    type: 'attacker',
    coordinates: [-46.6333, -23.5505],
    ip: '177.129.50.21',
    asnOrPod: 'AS28573 Claro',
    threatLevel: 'Medium',
  },
  {
    id: 'att-tehran',
    name: 'Reconnaissance Port Scanner',
    country: 'Iran',
    type: 'attacker',
    coordinates: [51.389, 35.6892],
    ip: '5.200.14.88',
    asnOrPod: 'AS58224 TIC Host',
    threatLevel: 'High',
  },
  {
    id: 'att-singapore',
    name: 'Cloud Egress Proxy Pivot',
    country: 'Singapore',
    type: 'attacker',
    coordinates: [103.8198, 1.3521],
    ip: '128.199.202.10',
    asnOrPod: 'AS14061 DigitalOcean',
    threatLevel: 'Medium',
  },
];

// Simplified geographic continent outlines
export const WORLD_GEO_DATA: GeoFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // North America
    {
      type: 'Feature',
      properties: { name: 'North America' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-168, 65], [-160, 71], [-130, 70], [-95, 70], [-80, 62],
            [-60, 48], [-65, 43], [-75, 35], [-80, 25], [-97, 26],
            [-90, 20], [-83, 10], [-77, 8], [-80, 15], [-95, 17],
            [-105, 20], [-115, 30], [-124, 40], [-124, 48], [-135, 57],
            [-165, 60], [-168, 65],
          ],
        ],
      },
    },
    // South America
    {
      type: 'Feature',
      properties: { name: 'South America' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77, 8], [-60, 8], [-50, 0], [-35, -5], [-35, -12],
            [-40, -22], [-50, -30], [-60, -38], [-68, -55], [-75, -50],
            [-72, -35], [-70, -20], [-80, -5], [-77, 8],
          ],
        ],
      },
    },
    // Europe
    {
      type: 'Feature',
      properties: { name: 'Europe' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-10, 36], [-8, 43], [-1, 45], [-5, 48], [2, 51],
            [5, 54], [5, 60], [15, 60], [25, 71], [35, 68],
            [40, 55], [30, 45], [25, 40], [22, 38], [15, 38],
            [10, 44], [0, 40], [-5, 36], [-10, 36],
          ],
        ],
      },
    },
    // Africa
    {
      type: 'Feature',
      properties: { name: 'Africa' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-17, 30], [-13, 20], [-15, 12], [0, 5], [10, 5],
            [12, -5], [18, -34], [28, -34], [35, -20], [42, -10],
            [50, 10], [43, 12], [32, 30], [25, 32], [10, 36],
            [-5, 36], [-17, 30],
          ],
        ],
      },
    },
    // Asia
    {
      type: 'Feature',
      properties: { name: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [40, 55], [60, 60], [80, 73], [110, 75], [140, 72],
            [170, 65], [160, 50], [140, 40], [130, 32], [120, 22],
            [108, 10], [100, 2], [95, 10], [80, 13], [70, 22],
            [60, 25], [50, 26], [45, 13], [35, 30], [35, 40],
            [40, 55],
          ],
        ],
      },
    },
    // Australia & Oceania
    {
      type: 'Feature',
      properties: { name: 'Australia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114, -22], [120, -35], [135, -35], [145, -38], [152, -28],
            [145, -15], [135, -12], [125, -15], [114, -22],
          ],
        ],
      },
    },
    // UK & Ireland
    {
      type: 'Feature',
      properties: { name: 'British Isles' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5, 50], [1, 51], [0, 55], [-3, 58], [-6, 56],
            [-5, 52], [-5, 50],
          ],
        ],
      },
    },
    // Japan
    {
      type: 'Feature',
      properties: { name: 'Japan' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130, 31], [135, 34], [141, 41], [144, 44], [140, 42],
            [136, 36], [130, 31],
          ],
        ],
      },
    },
  ],
};
