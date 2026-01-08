# Hardware Capability Profiler

> Comprehensive browser hardware profiling for AI-powered applications

[![npm version](https://badge.fury.io/js/%40superinstance%2Fhardware-capability-profiler.svg)](https://www.npmjs.com/package/@superinstance/hardware-capability-profiler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

**Hardware Capability Profiler** is a production-ready TypeScript library for comprehensive browser hardware detection and capability assessment. Perfect for applications that need to adapt their behavior based on available hardware, especially AI-powered applications using local models, WebGPU, or advanced browser features.

## ✨ Features

- **GPU Detection**: WebGPU, WebGL2, VRAM estimation, vendor/renderer identification
- **CPU Detection**: Core count, architecture, SIMD, WebAssembly support
- **Memory Detection**: RAM, JS heap, device memory API
- **Storage Detection**: IndexedDB, storage quota, persistence type
- **Network Detection**: Connection type, speed, RTT, data saver mode
- **Display Detection**: Resolution, pixel ratio, color depth, orientation
- **Browser Detection**: Browser name, version, OS, platform, touch support
- **Feature Detection**: 12+ web platform APIs (Web Workers, WebRTC, etc.)
- **JEPA Scoring**: Specialized scoring (0-100) for AI workload capability
- **Performance Classification**: 4-tier system (low-end, mid-range, high-end, extreme)
- **Capability Evaluation**: Feature availability recommendations
- **Zero Dependencies**: Completely standalone, no framework coupling

## 🚀 Quick Start

### Installation

```bash
npm install @superinstance/hardware-capability-profiler
```

### Basic Usage

```typescript
import { HardwareProfiler } from '@superinstance/hardware-capability-profiler';

// Create profiler instance
const profiler = new HardwareProfiler();

// Detect hardware capabilities
const profile = await profiler.detect();

console.log(`Performance Score: ${profile.performanceScore}/100`);
console.log(`CPU Cores: ${profile.cpu.cores}`);
console.log(`GPU: ${profile.gpu.renderer}`);
console.log(`RAM: ${profile.memory.totalGB}GB`);

// Adaptive behavior based on performance
if (profile.performanceClass === 'premium') {
  // Enable all features including local AI models
} else if (profile.performanceClass === 'low') {
  // Use lightweight alternatives and API-based AI
}
```

### JEPA Scoring

```typescript
import { calculateJEPAScore } from '@superinstance/hardware-capability-profiler';

const score = calculateJEPAScore(profile);

console.log(`JEPA Score: ${score.score}/100`);
console.log(`Tier: ${score.tier}`);
console.log(`Tiny-JEPA: ${score.jepa.tinyJEPA ? '✅' : '❌'}`);
console.log(`JEPA-Large: ${score.jepa.largeJEPA ? '✅' : '❌'}`);
console.log(`Real-time Transcription: ${score.jepa.realtimeTranscription ? '✅' : '❌'}`);

// View recommendations
score.recommendations.forEach(rec => console.log(`• ${rec}`));
```

### Capability Evaluation

```typescript
import { evaluateCapabilities } from '@superinstance/hardware-capability-profiler';

const assessment = evaluateCapabilities(profile);

// Check if local AI is viable
if (assessment.canUseLocalAI) {
  console.log('✅ Can use local AI models');
}

// Get recommended configuration
const config = assessment.recommendedConfiguration;
console.log(`AI Provider: ${config.aiProvider}`);
console.log(`Transcription Model: ${config.transcriptionModel}`);
console.log(`Max Batch Size: ${config.maxBatchSize}`);

// Check specific features
const aiFeatures = assessment.features.filter(f => f.id.startsWith('ai.'));
aiFeatures.forEach(feature => {
  if (feature.available) {
    console.log(`✅ ${feature.name} (${feature.expectedPerformance} performance)`);
  } else {
    console.log(`❌ ${feature.name}: ${feature.reason}`);
  }
});
```

## 📊 JEPA Scoring System

The JEPA (Joint Embedding Predictive Architecture) scoring system evaluates hardware specifically for AI workloads:

### Score Breakdown

- **GPU (up to 40 points)**: Tensor cores, VRAM, compute capability
- **RAM (up to 30 points)**: Total memory, available memory
- **CPU (up to 20 points)**: Cores, SIMD, threads
- **Storage (up to 10 points)**: Speed, available space

### Hardware Tiers

| Tier | Score Range | Typical Hardware | JEPA Capabilities |
|------|-------------|------------------|-------------------|
| **Low-end** | 0-20 | Integrated GPU, <8GB RAM | API streaming only |
| **Mid-range** | 20-50 | RTX 4050, 8-16GB RAM | Tiny-JEPA, basic transcription |
| **High-end** | 50-80 | RTX 4070, 16GB+ RAM | JEPA-Large, multimodal |
| **Extreme** | 80-100 | RTX 5090, 32GB+ RAM | JEPA-XL, multi-model |

### JEPA Requirements

- **Tiny-JEPA**: Score 30+, 4GB+ VRAM, 8GB+ RAM
- **JEPA-Large**: Score 50+, 8GB+ VRAM, 16GB+ RAM
- **JEPA-XL**: Score 80+, 16GB+ VRAM, 32GB+ RAM
- **Real-time Transcription**: Score 40+, 6GB+ VRAM
- **Multimodal**: Score 60+, Tensor cores required

## 🎯 Use Cases

### 1. Adaptive AI Model Selection

```typescript
import { getPerformanceScore } from '@superinstance/hardware-capability-profiler';

const score = await getPerformanceScore();

let aiModel: string;
if (score >= 80) {
  aiModel = 'gpt-4-turbo';      // Premium
} else if (score >= 60) {
  aiModel = 'gpt-4';             // High
} else if (score >= 40) {
  aiModel = 'gpt-3.5-turbo';     // Medium
} else {
  aiModel = 'gpt-3.5-turbo-16k'; // Low
}
```

### 2. Feature Flag Optimization

```typescript
import { evaluateCapabilities } from '@superinstance/hardware-capability-profiler';

const assessment = evaluateCapabilities(profile);

// Use feature flags to enable/disable features
const featureFlags = assessment.featureFlags;

if (featureFlags['ai.local_models']) {
  enableLocalAI();
}
if (featureFlags['ui.virtual_scrolling']) {
  enableVirtualScrolling();
}
if (featureFlags['media.image_analysis']) {
  enableImageAnalysis();
}
```

### 3. Platform-Specific Optimizations

```typescript
import { getHardwareInfo } from '@superinstance/hardware-capability-profiler';

const { profile } = await getHardwareInfo();

if (profile.browser.os === 'macOS') {
  // Enable Metal optimizations
  if (profile.gpu.renderer?.includes('Apple M')) {
    enableMetalPerformanceShaders();
  }
} else if (profile.browser.os === 'Windows') {
  // Enable DirectML or CUDA
  if (profile.gpu.renderer?.includes('NVIDIA')) {
    enableCUDA();
  }
}
```

## 📖 API Reference

### Classes

#### `HardwareDetector`

Main detector class for hardware profiling.

**Methods:**

- `getHardwareInfo(options?: DetectionOptions, useCache?: boolean): Promise<DetectionResult>`
- `getPerformanceScore(): Promise<number>`
- `detectCapabilities(): Promise<FeatureSupport>`
- `clearCache(): void`

### Convenience Functions

- `getHardwareInfo(options?: DetectionOptions): Promise<DetectionResult>`
- `getPerformanceScore(): Promise<number>`
- `detectCapabilities(): Promise<FeatureSupport>`
- `clearHardwareCache(): void`
- `getDetector(): HardwareDetector`

### Scoring Functions

- `calculateJEPAScore(profile: HardwareProfile): HardwareScoreResult`
- `getJEPARequirements(): Record<string, { minScore: number; description: string }>`

### Capability Functions

- `evaluateCapabilities(profile: HardwareProfile): CapabilityAssessment`
- `getFeaturesByCategory(assessment: CapabilityAssessment, category: string): FeatureAvailability[]`
- `getOptimizedFeatureSet(assessment: CapabilityAssessment, targetPerformance: PerformanceLevel): string[]`

### Type Definitions

See `docs/API.md` for complete type definitions.

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CPU Cores | ✅ | ✅ | ✅ | ✅ |
| Device Memory | ✅ (Android) | ❌ | ❌ | ✅ |
| WebGL 1.0 | ✅ | ✅ | ✅ | ✅ |
| WebGL 2.0 | ✅ | ✅ | ✅ | ✅ |
| WebGPU | ✅ (113+) | ⚠️ (preview) | ⚠️ (preview) | ✅ |
| Network Info | ✅ (Android) | ❌ | ❌ | ✅ |
| Storage API | ✅ | ⚠️ | ⚠️ | ✅ |

## 🔧 Configuration

### Detection Options

```typescript
interface DetectionOptions {
  detailedGPU?: boolean;   // Enable detailed GPU detection (slower)
  checkQuota?: boolean;    // Check storage quota (slower)
  detectWebGL?: boolean;   // Detect WebGL capabilities (recommended)
  timeout?: number;        // Timeout in ms (default: 5000)
}
```

### Example Configuration

```typescript
const result = await getHardwareInfo({
  detailedGPU: true,   // Get detailed GPU info
  checkQuota: true,    // Check storage quota
  detectWebGL: true,   // Detect WebGL
  timeout: 10000,      // 10 second timeout
});
```

## 📝 Examples

See the `examples/` directory for complete working examples:

- **Basic Detection** - Simple hardware detection
- **JEPA Scoring** - Calculate JEPA capability scores
- **Feature Detection** - Check specific capabilities
- **Platform Optimization** - Platform-specific code paths

## 🏗️ Architecture

Hardware Capability Profiler uses a modular architecture:

1. **Detector Layer**: Hardware detection and profiling
2. **Scoring Layer**: Performance scoring and tier classification
3. **Capability Layer**: Feature evaluation and recommendations
4. **Type Layer**: Comprehensive TypeScript definitions

See `docs/ARCHITECTURE.md` for detailed architecture documentation.

## ⚡ Performance

- **First Detection**: ~50-150ms
- **Cached Detection**: <1ms
- **Fast Mode**: ~20-50ms (without GPU/WebGL details)
- **Memory Overhead**: <5KB for cached profile

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check
```

## 🤝 Contributing

Contributions are welcome! Please see `CONTRIBUTING.md` for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [GitHub Repository](https://github.com/SuperInstance/hardware-capability-profiler)
- [API Documentation](docs/API.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [NPM Package](https://www.npmjs.com/package/@superinstance/hardware-capability-profiler)

## 🙏 Acknowledgments

Built as part of the [PersonalLog](https://github.com/SuperInstance/PersonalLog) project, extracted as an independent tool for the community.

---

**Made with ❤️ by SuperInstance**
