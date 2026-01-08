# API Reference

Complete API reference for Hardware Capability Profiler.

## Table of Contents

- [Classes](#classes)
  - [HardwareDetector](#hardwaredetector)
- [Functions](#functions)
  - [getHardwareInfo](#gethardwareinfo)
  - [getPerformanceScore](#getperformancescore)
  - [detectCapabilities](#detectcapabilities)
  - [clearHardwareCache](#clearhardwarecache)
  - [getDetector](#getdetector)
  - [calculateJEPAScore](#calculatejepascore)
  - [getJEPARequirements](#getjeparequirements)
  - [evaluateCapabilities](#evaluatecapabilities)
  - [getFeaturesByCategory](#getfeaturesbycategory)
  - [getOptimizedFeatureSet](#getoptimizedfeatureset)
- [Type Definitions](#type-definitions)
  - [HardwareProfile](#hardwareprofile)
  - [CPUInfo](#cpuinfo)
  - [GPUInfo](#gpuinfo)
  - [MemoryInfo](#memoryinfo)
  - [StorageInfo](#storageinfo)
  - [NetworkInfo](#networkinfo)
  - [DisplayInfo](#displayinfo)
  - [BrowserInfo](#browserinfo)
  - [FeatureSupport](#featuresupport)
  - [DetectionOptions](#detectionoptions)
  - [DetectionResult](#detectionresult)
  - [HardwareScoreResult](#hardwareresult)
  - [CapabilityAssessment](#capabilityassessment)

---

## Classes

### HardwareDetector

Main detector class for hardware profiling. Use the convenience functions instead of instantiating this class directly, unless you need multiple detector instances.

```typescript
class HardwareDetector {
  constructor()

  async getHardwareInfo(options?: DetectionOptions, useCache?: boolean): Promise<DetectionResult>
  async getPerformanceScore(): Promise<number>
  async detectCapabilities(): Promise<FeatureSupport>
  clearCache(): void
}
```

#### Constructor

```typescript
constructor()
```

Creates a new HardwareDetector instance with its own cache.

#### Methods

##### getHardwareInfo

```typescript
async getHardwareInfo(options?: DetectionOptions, useCache?: boolean): Promise<DetectionResult>
```

Get complete hardware profile with all detected information.

**Parameters:**
- `options` (optional): Detection options
  - `detailedGPU`: Enable detailed GPU detection (slower)
  - `checkQuota`: Check storage quota (slower)
  - `detectWebGL`: Detect WebGL capabilities (recommended)
  - `timeout`: Detection timeout in ms (default: 5000)
- `useCache` (optional): Whether to use cached profile (default: true)

**Returns:** `Promise<DetectionResult>`

**Example:**
```typescript
const detector = new HardwareDetector();
const result = await detector.getHardwareInfo({
  detailedGPU: true,
  checkQuota: true,
  detectWebGL: true,
});

if (result.success) {
  console.log(result.profile);
}
```

##### getPerformanceScore

```typescript
async getPerformanceScore(): Promise<number>
```

Get only the performance score (faster than full detection).

**Returns:** `Promise<number>` - Performance score from 0-100

**Example:**
```typescript
const detector = new HardwareDetector();
const score = await detector.getPerformanceScore();
console.log(`Performance: ${score}/100`);
```

##### detectCapabilities

```typescript
async detectCapabilities(): Promise<FeatureSupport>
```

Get feature support matrix only.

**Returns:** `Promise<FeatureSupport>`

**Example:**
```typescript
const detector = new HardwareDetector();
const features = await detector.detectCapabilities();
console.log(features.webWorkers); // true/false
```

##### clearCache

```typescript
clearCache(): void
```

Clear cached hardware profile. Call this if hardware changed (e.g., external GPU connected).

**Example:**
```typescript
const detector = new HardwareDetector();
detector.clearCache();
```

---

## Functions

### getHardwareInfo

```typescript
function getHardwareInfo(options?: DetectionOptions): Promise<DetectionResult>
```

Get complete hardware profile using the global detector instance.

**Parameters:**
- `options` (optional): Detection options (see DetectionOptions)

**Returns:** `Promise<DetectionResult>`

**Example:**
```typescript
import { getHardwareInfo } from '@superinstance/hardware-capability-profiler';

const result = await getHardwareInfo();
if (result.success) {
  const { profile } = result;
  console.log(`Score: ${profile.performanceScore}`);
}
```

---

### getPerformanceScore

```typescript
function getPerformanceScore(): Promise<number>
```

Get performance score using the global detector instance.

**Returns:** `Promise<number>` - Performance score from 0-100

**Example:**
```typescript
import { getPerformanceScore } from '@superinstance/hardware-capability-profiler';

const score = await getPerformanceScore();
if (score >= 80) {
  // Enable premium features
}
```

---

### detectCapabilities

```typescript
function detectCapabilities(): Promise<FeatureSupport>
```

Get feature support matrix using the global detector instance.

**Returns:** `Promise<FeatureSupport>`

**Example:**
```typescript
import { detectCapabilities } from '@superinstance/hardware-capability-profiler';

const features = await detectCapabilities();
if (features.webWorkers) {
  // Use Web Workers
}
```

---

### clearHardwareCache

```typescript
function clearHardwareCache(): void
```

Clear cached hardware profile in the global detector instance.

**Example:**
```typescript
import { clearHardwareCache } from '@superinstance/hardware-capability-profiler';

clearHardwareCache();
```

---

### getDetector

```typescript
function getDetector(): HardwareDetector
```

Get the global detector instance for advanced usage.

**Returns:** `HardwareDetector`

**Example:**
```typescript
import { getDetector } from '@superinstance/hardware-capability-profiler';

const detector = getDetector();
detector.clearCache();
```

---

### calculateJEPAScore

```typescript
function calculateJEPAScore(profile: HardwareProfile): HardwareScoreResult
```

Calculate JEPA-specific hardware score and capabilities.

**Parameters:**
- `profile`: Hardware profile to score

**Returns:** `HardwareScoreResult`

**Example:**
```typescript
import { getHardwareInfo, calculateJEPAScore } from '@superinstance/hardware-capability-profiler';

const { profile } = await getHardwareInfo();
const score = calculateJEPAScore(profile);

console.log(`JEPA Score: ${score.score}/100`);
console.log(`Tier: ${score.tier}`);
console.log(`Tiny-JEPA: ${score.jepa.tinyJEPA ? '✅' : '❌'}`);
```

---

### getJEPARequirements

```typescript
function getJEPARequirements(): Record<string, { minScore: number; description: string }>
```

Get minimum hardware requirements for each JEPA feature.

**Returns:** Record mapping feature names to requirements

**Example:**
```typescript
import { getJEPARequirements } from '@superinstance/hardware-capability-profiler';

const requirements = getJEPARequirements();
console.log(requirements.tiny_jepa);
// { minScore: 30, description: 'Tiny-JEPA transcription (minimum: RTX 4050, 8GB RAM)' }
```

---

### evaluateCapabilities

```typescript
function evaluateCapabilities(profile: HardwareProfile): CapabilityAssessment
```

Evaluate complete hardware capabilities and provide recommendations.

**Parameters:**
- `profile`: Hardware profile to evaluate

**Returns:** `CapabilityAssessment`

**Example:**
```typescript
import { getHardwareInfo, evaluateCapabilities } from '@superinstance/hardware-capability-profiler';

const { profile } = await getHardwareInfo();
const assessment = evaluateCapabilities(profile);

if (assessment.canUseLocalAI) {
  console.log('✅ Can use local AI models');
}

const config = assessment.recommendedConfiguration;
console.log(`AI Provider: ${config.aiProvider}`);
console.log(`Model: ${config.transcriptionModel}`);
```

---

### getFeaturesByCategory

```typescript
function getFeaturesByCategory(assessment: CapabilityAssessment, category: string): FeatureAvailability[]
```

Get features by category from capability assessment.

**Parameters:**
- `assessment`: Capability assessment
- `category`: Feature category ('ai', 'jepa', 'knowledge', 'media', 'ui', 'advanced')

**Returns:** Array of feature availability

**Example:**
```typescript
import { getHardwareInfo, evaluateCapabilities, getFeaturesByCategory } from '@superinstance/hardware-capability-profiler';

const { profile } = await getHardwareInfo();
const assessment = evaluateCapabilities(profile);
const aiFeatures = getFeaturesByCategory(assessment, 'ai');

aiFeatures.forEach(feature => {
  console.log(`${feature.name}: ${feature.available ? '✅' : '❌'}`);
});
```

---

### getOptimizedFeatureSet

```typescript
function getOptimizedFeatureSet(assessment: CapabilityAssessment, targetPerformance: PerformanceLevel): string[]
```

Get performance-optimized feature set.

**Parameters:**
- `assessment`: Capability assessment
- `targetPerformance`: Target performance level ('minimal', 'basic', 'good', 'excellent')

**Returns:** Array of feature IDs to enable

**Example:**
```typescript
import { getHardwareInfo, evaluateCapabilities, getOptimizedFeatureSet } from '@superinstance/hardware-capability-profiler';

const { profile } = await getHardwareInfo();
const assessment = evaluateCapabilities(profile);
const features = getOptimizedFeatureSet(assessment, 'good');

features.forEach(featureId => {
  enableFeature(featureId);
});
```

---

## Type Definitions

### HardwareProfile

Complete hardware profile with all detected information.

```typescript
interface HardwareProfile {
  timestamp: number;
  cpu: CPUInfo;
  gpu: GPUInfo;
  memory: MemoryInfo;
  storage: StorageInfo;
  network: NetworkInfo;
  display: DisplayInfo;
  browser: BrowserInfo;
  features: FeatureSupport;
  performanceScore: number;
  performanceClass: PerformanceClass;
}
```

---

### CPUInfo

CPU information and capabilities.

```typescript
interface CPUInfo {
  cores: number;
  concurrency: number;
  architecture?: string;
  simd: {
    supported: boolean;
    type?: 'wasm' | 'native';
  };
  wasm: {
    supported: boolean;
    simd: boolean;
    threads: boolean;
    bulkMemory: boolean;
    exceptions: boolean;
  };
}
```

---

### GPUInfo

GPU information and capabilities.

```typescript
interface GPUInfo {
  available: boolean;
  vendor?: string;
  renderer?: string;
  vramMB?: number;
  webgpu: {
    supported: boolean;
    adapter?: string;
  };
  webgl: {
    supported: boolean;
    version: 1 | 2 | 0;
    maxTextureSize?: number;
    maxRenderBufferSize?: number;
    vendor?: string;
    renderer?: string;
  };
}
```

---

### MemoryInfo

Memory information.

```typescript
interface MemoryInfo {
  totalGB?: number;
  hasMemoryAPI: boolean;
  jsHeap?: {
    limit: number;
    used: number;
    total: number;
  };
}
```

---

### StorageInfo

Storage information.

```typescript
interface StorageInfo {
  indexedDB: {
    supported: boolean;
    available: boolean;
  };
  quota?: {
    usage: number;
    quota: number;
    usagePercentage: number;
  };
  storageType?: 'persistent' | 'session' | 'unknown';
}
```

---

### NetworkInfo

Network information.

```typescript
interface NetworkInfo {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlinkMbps?: number;
  rtt?: number;
  saveData?: boolean;
  hasNetworkAPI: boolean;
  online: boolean;
}
```

---

### DisplayInfo

Display and viewport information.

```typescript
interface DisplayInfo {
  width: number;
  height: number;
  pixelRatio: number;
  colorDepth: number;
  orientation?: 'portrait' | 'landscape';
}
```

---

### BrowserInfo

Browser and platform information.

```typescript
interface BrowserInfo {
  userAgent: string;
  browser: string;
  version?: string;
  os: string;
  platform: string;
  touchSupport: boolean;
}
```

---

### FeatureSupport

Feature support matrix.

```typescript
interface FeatureSupport {
  webWorkers: boolean;
  serviceWorker: boolean;
  webrtc: boolean;
  webassembly: boolean;
  websockets: boolean;
  geolocation: boolean;
  notifications: boolean;
  fullscreen: boolean;
  pip: boolean;
  webBluetooth: boolean;
  webusb: boolean;
  fileSystemAccess: boolean;
}
```

---

### DetectionOptions

Detection options.

```typescript
interface DetectionOptions {
  detailedGPU?: boolean;
  checkQuota?: boolean;
  detectWebGL?: boolean;
  timeout?: number;
}
```

---

### DetectionResult

Detection result.

```typescript
interface DetectionResult {
  success: boolean;
  profile?: HardwareProfile;
  error?: string;
  detectionTime: number;
}
```

---

### HardwareScoreResult

JEPA hardware score result.

```typescript
interface HardwareScoreResult {
  score: number;
  tier: HardwareTier;
  jepa: JEPACapabilities;
  breakdown: {
    gpu: number;
    ram: number;
    cpu: number;
    storage: number;
  };
  recommendations: string[];
}
```

---

### CapabilityAssessment

Complete capability assessment.

```typescript
interface CapabilityAssessment {
  score: HardwareScoreResult;
  features: FeatureAvailability[];
  featureFlags: Record<string, boolean>;
  tierDescription: string;
  canUseLocalAI: boolean;
  canUseJEPA: boolean;
  canUseRealtimeTranscription: boolean;
  recommendedConfiguration: {
    aiProvider: 'local' | 'api' | 'hybrid';
    transcriptionModel: 'tiny' | 'large' | 'xl' | 'api-only';
    maxBatchSize: number;
    enableCaching: boolean;
    enableOfflineMode: boolean;
  };
}
```

---

### FeatureAvailability

Feature availability information.

```typescript
interface FeatureAvailability {
  id: string;
  name: string;
  available: boolean;
  reason?: string;
  performanceImpact: number;
  expectedPerformance: 'minimal' | 'basic' | 'good' | 'excellent';
}
```

---

## Enums

### HardwareTier

Hardware tier classification.

```typescript
type HardwareTier = 'low-end' | 'mid-range' | 'high-end' | 'extreme';
```

### PerformanceClass

Performance classification.

```typescript
type PerformanceClass = 'low' | 'medium' | 'high' | 'premium';
```

---

## Usage Examples

### Complete Detection and Evaluation

```typescript
import {
  getHardwareInfo,
  evaluateCapabilities,
  calculateJEPAScore
} from '@superinstance/hardware-capability-profiler';

// Detect hardware
const { profile } = await getHardwareInfo();

// Calculate JEPA score
const jepaScore = calculateJEPAScore(profile);
console.log(`JEPA Score: ${jepaScore.score}/100`);

// Evaluate capabilities
const assessment = evaluateCapabilities(profile);

// Get recommendations
const config = assessment.recommendedConfiguration;
console.log(`AI Provider: ${config.aiProvider}`);
console.log(`Model: ${config.transcriptionModel}`);

// Check features
const aiFeatures = assessment.features.filter(f => f.id.startsWith('ai.'));
aiFeatures.forEach(f => {
  console.log(`${f.name}: ${f.available ? '✅' : '❌'}`);
});
```

### Conditional Feature Enablement

```typescript
import { getPerformanceScore, detectCapabilities } from '@superinstance/hardware-capability-profiler';

const score = await getPerformanceScore();
const features = await detectCapabilities();

// Enable features based on hardware
const featureFlags = {
  localAI: score >= 50,
  webWorkers: features.webWorkers,
  webgpu: features.webassembly, // Assuming WebGPU check
  animations: score >= 60,
  virtualScrolling: score >= 40,
};

// Apply feature flags
Object.entries(featureFlags).forEach(([flag, enabled]) => {
  if (enabled) {
    console.log(`Enabling ${flag}`);
  }
});
```

---

For architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).
