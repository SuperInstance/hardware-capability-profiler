# Architecture Documentation

## System Overview

Hardware Capability Profiler is designed as a modular, framework-agnostic library for comprehensive browser hardware detection and capability assessment.

## Core Principles

1. **Framework Agnostic**: Works with any frontend framework or vanilla JavaScript
2. **Privacy Respecting**: Only uses public browser APIs, no fingerprinting
3. **Graceful Degradation**: Provides safe defaults when APIs are unavailable
4. **Performance First**: Caching, lazy detection, and parallel operations
5. **Type Safety**: Comprehensive TypeScript definitions

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  (Your app uses the library via public API)             │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Public API Layer                      │
│  - Convenience functions                                 │
│  - Main exports (index.ts)                              │
│  - Type definitions                                      │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Detector    │  │   Scoring    │  │ Capability   │
│   Layer      │  │   Layer      │  │   Layer      │
│              │  │              │  │              │
│ - Hardware   │  │ - JEPA       │  │ - Feature    │
│   detection  │  │   scoring    │  │   eval       │
│ - CPU/GPU/   │  │ - Tier       │  │ - Feature    │
│   Memory     │  │   class      │  │   flags      │
└──────────────┘  └──────────────┘  └──────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
                ┌──────────────────────┐
                │    Type Definitions  │
                │    (types.ts)        │
                └──────────────────────┘
```

## Module Descriptions

### 1. Detector Layer (`detector.ts`)

**Purpose**: Core hardware detection and profiling

**Key Components**:
- `HardwareDetector` class: Main detector with caching
- CPU detection (cores, SIMD, WebAssembly)
- GPU detection (WebGPU, WebGL2, VRAM estimation)
- Memory detection (RAM, JS heap)
- Storage detection (IndexedDB, quota)
- Network detection (connection type, speed)
- Display detection (resolution, pixel ratio)
- Browser detection (UA, platform, touch)
- Feature detection (Web Workers, WebRTC, etc.)

**Design Patterns**:
- Singleton pattern for global detector instance
- Caching for performance optimization
- Parallel detection with Promise.all()
- Graceful fallbacks for missing APIs

**Performance Characteristics**:
- First detection: 50-150ms (varies by options)
- Cached detection: <1ms
- Fast mode (no GPU details): 20-50ms

### 2. Scoring Layer (`scoring.ts`)

**Purpose**: Hardware scoring and tier classification

**Key Components**:
- `calculateJEPAScore()`: JEPA-specific scoring (0-100)
- GPU capability assessment (tensor cores, VRAM)
- CPU score calculation (cores, SIMD, threads)
- RAM score calculation
- Storage score calculation
- JEPA capability assessment (Tiny/Large/XL models)
- Hardware tier classification
- Upgrade recommendations

**Scoring Algorithm**:

```
JEPA Score = GPU (up to 40) + RAM (up to 30) + CPU (up to 20) + Storage (up to 10)

GPU Score:
- Base: compute capability (0-100) * 0.4
- VRAM: VRAM in GB * 4
- Tensor cores: +10 if present

RAM Score:
- Scale: 4GB = 0 points, 32GB = 30 points
- Formula: ((totalGB - 4) / 28) * 30

CPU Score:
- Cores: (cores / 8) * 10 (max 10)
- SIMD: +5 if WASM SIMD, +3 if native
- Threads: +5 if WebAssembly threads

Storage Score:
- IndexedDB: +5 if available
- Quota health: +5 if <50% used, +3 if <80%
```

**Tier Classification**:
- Low-end (0-20): No GPU, <8GB RAM
- Mid-range (20-50): RTX 4050, 8-16GB RAM
- High-end (50-80): RTX 4070, 16GB+ RAM
- Extreme (80-100): RTX 5090, 32GB+ RAM

### 3. Capability Layer (`capabilities.ts`)

**Purpose**: Feature evaluation and recommendations

**Key Components**:
- `evaluateCapabilities()`: Complete capability assessment
- Feature definitions with requirements
- Feature availability evaluation
- Feature flag generation
- Configuration recommendations

**Feature Categories**:
- AI Features (local models, streaming, parallel processing)
- JEPA Features (transcription, multimodal)
- Knowledge Features (vector search, embeddings cache)
- Media Features (image analysis, transcription)
- UI Features (virtual scrolling, animations)
- Advanced Features (offline mode, background sync)

**Recommendation Engine**:

```typescript
// AI Provider Selection
if (score >= 50) {
  aiProvider = 'local';      // Use local models
} else if (score >= 30) {
  aiProvider = 'hybrid';     // Mix local + API
} else {
  aiProvider = 'api';        // API only
}

// Transcription Model Selection
if (jepa.xlJEPA) {
  model = 'xl';
} else if (jepa.largeJEPA) {
  model = 'large';
} else if (jepa.tinyJEPA) {
  model = 'tiny';
} else {
  model = 'api-only';
}
```

### 4. Type Layer (`types.ts`)

**Purpose**: Comprehensive TypeScript definitions

**Key Types**:
- `HardwareProfile`: Complete hardware profile
- `CPUInfo`, `GPUInfo`, `MemoryInfo`, `StorageInfo`, `NetworkInfo`
- `DisplayInfo`, `BrowserInfo`, `FeatureSupport`
- `PerformanceClass`, `PerformanceScoreBreakdown`
- `DetectionOptions`, `DetectionResult`
- `HardwareTier`, `JEPACapabilities`, `HardwareScoreResult`
- `FeatureAvailability`, `CapabilityAssessment`

## Detection Methods

### CPU Detection

**Method 1: hardwareConcurrency API**
```typescript
const cores = navigator.hardwareConcurrency || 4;
```

**Method 2: User Agent Parsing**
```typescript
// Detect architecture from UA
if (ua.includes('x86_64')) return 'x86_64';
if (ua.includes('arm')) return 'arm';
```

**Method 3: WebAssembly Feature Detection**
```typescript
// Test SIMD support
const simdModule = new Uint8Array([...]);
const hasSIMD = WebAssembly.validate(simdModule);
```

**Limitations**:
- `hardwareConcurrency` is approximate (logical cores)
- No direct way to detect physical cores
- Architecture detection via UA is unreliable

### GPU Detection

**Method 1: WebGPU API**
```typescript
const adapter = await navigator.gpu.requestAdapter();
if (adapter) {
  // WebGPU supported
  const adapterInfo = await adapter.requestAdapterInfo();
}
```

**Method 2: WebGL Debug Info**
```typescript
const gl = canvas.getContext('webgl2');
const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
```

**Method 3: VRAM Estimation**
```typescript
// Heuristic-based VRAM estimation
if (renderer.includes('RTX 40')) return 12288; // 12GB
if (renderer.includes('Apple M1')) return 7168; // Unified memory
```

**Limitations**:
- No direct VRAM API (fingerprinting protection)
- WebGL debug info may be blocked in some browsers
- VRAM estimation is ~60-70% accurate

### Memory Detection

**Method 1: deviceMemory API (Chrome-only)**
```typescript
const ramGB = navigator.deviceMemory; // 2, 4, 8 (rounded)
```

**Method 2: performance.memory (Chrome-only)**
```typescript
const jsHeap = performance.memory;
// jsHeapSizeLimit, usedJSHeapSize, totalJSHeapSize
```

**Limitations**:
- `deviceMemory` only on Android Chrome
- Values are rounded (2, 4, 8 GB) for privacy
- Desktop access blocked for fingerprinting protection

### Network Detection

**Method 1: Network Information API**
```typescript
const conn = navigator.connection;
const effectiveType = conn.effectiveType; // '4g', '3g', '2g'
const downlink = conn.downlink; // Mbps
const rtt = conn.rtt; // Round-trip time in ms
```

**Limitations**:
- Only available on mobile Chrome/Edge
- Desktop users get no network info
- Values are estimates, not real-time measurements

## Performance Optimization

### Caching Strategy

```typescript
// Singleton pattern with caching
class HardwareDetector {
  private cache: HardwareProfile | null = null;

  async getHardwareInfo(options, useCache = true) {
    if (useCache && this.cache) {
      return { success: true, profile: this.cache, detectionTime: 0 };
    }
    // ... perform detection
    this.cache = profile;
  }
}
```

### Parallel Detection

```typescript
// Run all detections in parallel
const [cpu, gpu, memory, storage, network, display, browser, features] =
  await Promise.all([
    this.detectCPU(),
    this.detectGPU(),
    this.detectMemory(),
    this.detectStorage(),
    this.detectNetwork(),
    this.detectDisplay(),
    this.detectBrowser(),
    this.detectFeatures(),
  ]);
```

### Lazy Detection

```typescript
// Fast mode: skip expensive operations
const fast = await getHardwareInfo({
  detailedGPU: false,  // Skip detailed GPU detection
  checkQuota: false,   // Skip storage quota check
  detectWebGL: false,  // Skip WebGL detection
});

// Full detection when needed
const full = await getHardwareInfo({
  detailedGPU: true,
  checkQuota: true,
  detectWebGL: true,
});
```

## Browser Compatibility

### Chrome/Edge (Chromium)

- ✅ Full support
- ✅ deviceMemory API (Android)
- ✅ Network Information API (Android)
- ✅ WebGPU (version 113+)
- ✅ performance.memory API

### Firefox

- ✅ Good support
- ❌ No deviceMemory API
- ❌ No Network Information API
- ⚠️ WebGPU (preview/flag)
- ❌ No performance.memory API

### Safari

- ✅ Basic support
- ❌ No deviceMemory API
- ❌ No Network Information API
- ⚠️ WebGPU (preview/flag)
- ❌ No performance.memory API

## Privacy Considerations

1. **No Fingerprinting**: Library doesn't uniquely identify users
2. **Rounded Values**: Memory values are rounded by browser
3. **No Persistent Storage**: Detection results cached in memory only
4. **No External Requests**: All detection is local
5. **User Agent Truncation**: UA string truncated to 200 chars

## Error Handling

### Graceful Degradation

```typescript
// Always provide safe defaults
if (typeof navigator === 'undefined') {
  return {
    userAgent: 'Unknown',
    browser: 'Unknown',
    os: 'Unknown',
    // ... safe defaults
  };
}
```

### Error Recovery

```typescript
try {
  const adapter = await navigator.gpu.requestAdapter();
  // ... use adapter
} catch {
  // WebGPU not supported, fall back to WebGL
}
```

## Extension Points

### Adding New Features

```typescript
// 1. Add feature definition
const FEATURE_DEFINITIONS = [
  {
    id: 'my.new_feature',
    name: 'My New Feature',
    category: 'custom',
    minTier: 'mid-range',
    minScore: 40,
    requirements: { minRAM: 8 },
    performanceImpact: 30,
  },
  // ... existing features
];
```

### Custom Scoring

```typescript
// Extend scoring with custom algorithm
export function calculateCustomScore(profile: HardwareProfile): number {
  const cpuScore = profile.cpu.cores * 5;
  const gpuScore = profile.gpu.webgpu.supported ? 50 : 0;
  return Math.min(100, cpuScore + gpuScore);
}
```

## Testing Strategy

### Unit Tests

- Test individual detection methods
- Test scoring algorithm with mock data
- Test feature evaluation logic
- Test type definitions

### Integration Tests

- Test complete detection flow
- Test cross-browser compatibility
- Test performance characteristics
- Test caching behavior

### Manual Testing

- Test on different devices (mobile, desktop)
- Test on different browsers (Chrome, Firefox, Safari)
- Test on different OS (Windows, macOS, Linux, Android, iOS)

## Future Enhancements

1. **WebGPU Adapters**: Support multiple GPU adapters
2. **Battery Detection**: Add battery API detection
3. **Media Capabilities**: Detect encoding/decoding support
4. **Sensors**: Detect accelerometer, gyroscope, etc.
5. **Bluetooth Devices**: Detect connected Bluetooth devices
6. **USB Devices**: Detect connected USB devices
7. **Performance Monitoring**: Real-time performance monitoring
8. **A/B Testing**: Feature flag testing based on hardware

## Contributing

When contributing to Hardware Capability Profiler:

1. **Type Safety**: All code must be fully typed
2. **Test Coverage**: Add tests for new features
3. **Documentation**: Update docs and types
4. **Performance**: Benchmark performance impact
5. **Compatibility**: Test on multiple browsers
6. **Privacy**: Respect user privacy restrictions

---

For API documentation, see [API.md](API.md).
