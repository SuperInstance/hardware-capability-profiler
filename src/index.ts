/**
 * Hardware Capability Profiler
 *
 * Comprehensive browser hardware profiling for AI-powered applications
 *
 * @example
 * ```typescript
 * import { HardwareProfiler } from '@superinstance/hardware-capability-profiler';
 *
 * const profiler = new HardwareProfiler();
 * const profile = await profiler.detect();
 * console.log(`Performance Score: ${profile.performanceScore}/100`);
 * ```
 */

// Main detector functionality
export {
  HardwareDetector,
  getHardwareInfo,
  getPerformanceScore,
  detectCapabilities,
  clearHardwareCache,
  getDetector
} from './detector';

// JEPA scoring and capabilities
export {
  calculateJEPAScore,
  getJEPARequirements,
} from './scoring';

export type {
  HardwareTier,
  JEPACapabilities,
  HardwareScoreResult,
} from './scoring';

// Capability evaluation
export {
  evaluateCapabilities,
  getFeaturesByCategory,
  getOptimizedFeatureSet,
} from './capabilities';

export type {
  FeatureAvailability,
  CapabilityAssessment,
} from './capabilities';

// TypeScript types
export type {
  CPUInfo,
  GPUInfo,
  MemoryInfo,
  StorageInfo,
  NetworkInfo,
  DisplayInfo,
  BrowserInfo,
  FeatureSupport,
  PerformanceClass,
  HardwareProfile,
  PerformanceScoreBreakdown,
  DetectionOptions,
  DetectionResult
} from './types';
