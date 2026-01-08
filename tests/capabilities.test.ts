/**
 * Capability Evaluation Tests
 *
 * Tests for hardware capability evaluation and feature recommendations
 */

import { describe, it, expect } from 'vitest';
import { evaluateCapabilities, getFeaturesByCategory, getOptimizedFeatureSet } from '../src/capabilities';
import { calculateJEPAScore } from '../src/scoring';
import type { HardwareProfile } from '../src/types';

describe('Capability Evaluation', () => {
  const createMockProfile = (overrides: Partial<HardwareProfile> = {}): HardwareProfile => ({
    timestamp: Date.now(),
    cpu: {
      cores: 8,
      concurrency: 8,
      simd: { supported: true, type: 'wasm' },
      wasm: {
        supported: true,
        simd: true,
        threads: true,
        bulkMemory: true,
        exceptions: true,
      },
    },
    gpu: {
      available: true,
      webgpu: { supported: true },
      webgl: { supported: true, version: 2 },
      renderer: 'NVIDIA RTX 4050',
      vramMB: 6144,
    },
    memory: {
      totalGB: 16,
      hasMemoryAPI: true,
    },
    storage: {
      indexedDB: { supported: true, available: true },
    },
    network: {
      online: true,
      hasNetworkAPI: true,
      effectiveType: '4g',
      downlinkMbps: 100,
    },
    display: {
      width: 1920,
      height: 1080,
      pixelRatio: 1,
      colorDepth: 24,
    },
    browser: {
      userAgent: 'Mozilla/5.0',
      browser: 'Chrome',
      version: '120',
      os: 'Windows',
      platform: 'Win32',
      touchSupport: false,
    },
    features: {
      webWorkers: true,
      serviceWorker: true,
      webrtc: true,
      webassembly: true,
      websockets: true,
      geolocation: true,
      notifications: true,
      fullscreen: true,
      pip: true,
      webBluetooth: false,
      webusb: false,
      fileSystemAccess: true,
    },
    performanceScore: 70,
    performanceClass: 'high',
    ...overrides,
  });

  describe('evaluateCapabilities', () => {
    it('should evaluate capabilities for high-end hardware', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);

      expect(assessment.score.score).toBeGreaterThan(50);
      expect(assessment.canUseLocalAI).toBe(true);
      expect(assessment.canUseJEPA).toBe(true);
      expect(assessment.tierDescription).toBeDefined();
    });

    it('should evaluate capabilities for low-end hardware', () => {
      const profile = createMockProfile({
        cpu: { cores: 2, concurrency: 2, simd: { supported: false }, wasm: { supported: true, simd: false, threads: false, bulkMemory: false, exceptions: false } },
        gpu: { available: false, webgpu: { supported: false }, webgl: { supported: false, version: 0 } },
        memory: { totalGB: 4, hasMemoryAPI: true },
        performanceScore: 20,
        performanceClass: 'low',
      });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.score.score).toBeLessThan(40);
      expect(assessment.canUseLocalAI).toBe(false);
      expect(assessment.canUseJEPA).toBe(false);
    });

    it('should provide recommended configuration', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);

      expect(assessment.recommendedConfiguration).toBeDefined();
      expect(assessment.recommendedConfiguration.aiProvider).toMatch(/^(local|api|hybrid)$/);
      expect(assessment.recommendedConfiguration.transcriptionModel).toBeDefined();
      expect(assessment.recommendedConfiguration.maxBatchSize).toBeGreaterThan(0);
    });

    it('should detect local AI capability', () => {
      const profile = createMockProfile({ performanceScore: 50 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.canUseLocalAI).toBe(true);
    });

    it('should detect JEPA capability', () => {
      const profile = createMockProfile({ performanceScore: 50 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.canUseJEPA).toBe(true);
    });

    it('should detect real-time transcription capability', () => {
      const profile = createMockProfile({ performanceScore: 60 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.canUseRealtimeTranscription).toBeDefined();
      expect(typeof assessment.canUseRealtimeTranscription).toBe('boolean');
    });

    it('should generate feature flags', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);

      expect(assessment.featureFlags).toBeDefined();
      expect(typeof assessment.featureFlags).toBe('object');
      expect(Object.keys(assessment.featureFlags).length).toBeGreaterThan(0);
    });
  });

  describe('Feature Availability', () => {
    it('should list available features', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);

      expect(assessment.features).toBeDefined();
      expect(Array.isArray(assessment.features)).toBe(true);
      expect(assessment.features.length).toBeGreaterThan(0);
    });

    it('should mark AI features as available for high-end hardware', () => {
      const profile = createMockProfile({ performanceScore: 70 });
      const assessment = evaluateCapabilities(profile);
      const aiFeatures = assessment.features.filter(f => f.id.startsWith('ai.'));

      expect(aiFeatures.length).toBeGreaterThan(0);
      expect(aiFeatures.some(f => f.available)).toBe(true);
    });

    it('should mark JEPA features as unavailable for low-end hardware', () => {
      const profile = createMockProfile({
        performanceScore: 20,
        gpu: { available: false, webgpu: { supported: false }, webgl: { supported: false, version: 0 } },
      });
      const assessment = evaluateCapabilities(profile);
      const jepaFeatures = assessment.features.filter(f => f.id.startsWith('jepa.'));

      expect(jepaFeatures.every(f => !f.available)).toBe(true);
    });

    it('should provide unavailability reasons', () => {
      const profile = createMockProfile({ performanceScore: 20 });
      const assessment = evaluateCapabilities(profile);
      const unavailableFeatures = assessment.features.filter(f => !f.available);

      expect(unavailableFeatures.length).toBeGreaterThan(0);
      unavailableFeatures.forEach(feature => {
        expect(feature.reason).toBeDefined();
        expect(typeof feature.reason).toBe('string');
      });
    });

    it('should estimate performance impact', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);

      assessment.features.forEach(feature => {
        expect(feature.performanceImpact).toBeGreaterThanOrEqual(0);
        expect(feature.performanceImpact).toBeLessThanOrEqual(100);
      });
    });

    it('should classify expected performance', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);

      assessment.features.forEach(feature => {
        if (feature.available) {
          expect(feature.expectedPerformance).toMatch(/^(minimal|basic|good|excellent)$/);
        }
      });
    });
  });

  describe('Feature Categories', () => {
    it('should get AI features', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);
      const aiFeatures = getFeaturesByCategory(assessment, 'ai');

      expect(aiFeatures.length).toBeGreaterThan(0);
      aiFeatures.forEach(feature => {
        expect(feature.id).toMatch(/^ai\./);
      });
    });

    it('should get JEPA features', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);
      const jepaFeatures = getFeaturesByCategory(assessment, 'jepa');

      expect(jepaFeatures.length).toBeGreaterThan(0);
      jepaFeatures.forEach(feature => {
        expect(feature.id).toMatch(/^jepa\./);
      });
    });

    it('should get knowledge features', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);
      const knowledgeFeatures = getFeaturesByCategory(assessment, 'knowledge');

      expect(knowledgeFeatures.length).toBeGreaterThan(0);
      knowledgeFeatures.forEach(feature => {
        expect(feature.id).toMatch(/^knowledge\./);
      });
    });

    it('should get media features', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);
      const mediaFeatures = getFeaturesByCategory(assessment, 'media');

      expect(mediaFeatures.length).toBeGreaterThan(0);
      mediaFeatures.forEach(feature => {
        expect(feature.id).toMatch(/^media\./);
      });
    });

    it('should get UI features', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);
      const uiFeatures = getFeaturesByCategory(assessment, 'ui');

      expect(uiFeatures.length).toBeGreaterThan(0);
      uiFeatures.forEach(feature => {
        expect(feature.id).toMatch(/^ui\./);
      });
    });

    it('should get advanced features', () => {
      const profile = createMockProfile();
      const assessment = evaluateCapabilities(profile);
      const advancedFeatures = getFeaturesByCategory(assessment, 'advanced');

      expect(advancedFeatures.length).toBeGreaterThan(0);
      advancedFeatures.forEach(feature => {
        expect(feature.id).toMatch(/^advanced\./);
      });
    });
  });

  describe('Feature Optimization', () => {
    it('should get features for minimal performance', () => {
      const profile = createMockProfile({ performanceScore: 80 });
      const assessment = evaluateCapabilities(profile);
      const features = getOptimizedFeatureSet(assessment, 'minimal');

      expect(Array.isArray(features)).toBe(true);
      features.forEach(featureId => {
        expect(typeof featureId).toBe('string');
      });
    });

    it('should get features for basic performance', () => {
      const profile = createMockProfile({ performanceScore: 70 });
      const assessment = evaluateCapabilities(profile);
      const features = getOptimizedFeatureSet(assessment, 'basic');

      expect(Array.isArray(features)).toBe(true);
    });

    it('should get features for good performance', () => {
      const profile = createMockProfile({ performanceScore: 70 });
      const assessment = evaluateCapabilities(profile);
      const features = getOptimizedFeatureSet(assessment, 'good');

      expect(Array.isArray(features)).toBe(true);
    });

    it('should get features for excellent performance', () => {
      const profile = createMockProfile({ performanceScore: 90 });
      const assessment = evaluateCapabilities(profile);
      const features = getOptimizedFeatureSet(assessment, 'excellent');

      expect(Array.isArray(features)).toBe(true);
    });

    it('should filter unavailable features from optimized set', () => {
      const profile = createMockProfile({ performanceScore: 30 });
      const assessment = evaluateCapabilities(profile);
      const features = getOptimizedFeatureSet(assessment, 'excellent');

      features.forEach(featureId => {
        const feature = assessment.features.find(f => f.id === featureId);
        expect(feature?.available).toBe(true);
      });
    });
  });

  describe('Configuration Recommendations', () => {
    it('should recommend local AI for high-end hardware', () => {
      const profile = createMockProfile({ performanceScore: 70 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.recommendedConfiguration.aiProvider).toBe('local');
    });

    it('should recommend API for low-end hardware', () => {
      const profile = createMockProfile({ performanceScore: 20 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.recommendedConfiguration.aiProvider).toBe('api');
    });

    it('should recommend hybrid for mid-range hardware', () => {
      const profile = createMockProfile({ performanceScore: 40 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.recommendedConfiguration.aiProvider).toBe('hybrid');
    });

    it('should recommend appropriate transcription model', () => {
      const profile = createMockProfile({ performanceScore: 70 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.recommendedConfiguration.transcriptionModel).toBeDefined();
      expect(['tiny', 'large', 'xl', 'api-only']).toContain(
        assessment.recommendedConfiguration.transcriptionModel
      );
    });

    it('should recommend caching for capable hardware', () => {
      const profile = createMockProfile({ performanceScore: 50 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.recommendedConfiguration.enableCaching).toBe(true);
    });

    it('should recommend offline mode for basic hardware', () => {
      const profile = createMockProfile({ performanceScore: 30 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.recommendedConfiguration.enableOfflineMode).toBe(true);
    });

    it('should set appropriate batch size', () => {
      const profile = createMockProfile({ performanceScore: 70 });
      const assessment = evaluateCapabilities(profile);

      expect(assessment.recommendedConfiguration.maxBatchSize).toBeGreaterThan(0);
      expect(assessment.recommendedConfiguration.maxBatchSize).toBeLessThanOrEqual(32);
    });
  });
});
