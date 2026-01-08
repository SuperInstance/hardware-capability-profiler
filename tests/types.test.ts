/**
 * Type Definition Tests
 *
 * Verify type definitions are correct and comprehensive
 */

import { describe, it, expect } from 'vitest';
import type {
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
  DetectionResult,
  HardwareTier,
  JEPACapabilities,
  HardwareScoreResult,
  FeatureAvailability,
  CapabilityAssessment,
} from '../src/types';

describe('Type Definitions', () => {
  describe('CPUInfo', () => {
    it('should accept valid CPU info', () => {
      const cpu: CPUInfo = {
        cores: 8,
        concurrency: 8,
        architecture: 'x86_64',
        simd: { supported: true, type: 'wasm' },
        wasm: {
          supported: true,
          simd: true,
          threads: true,
          bulkMemory: true,
          exceptions: true,
        },
      };

      expect(cpu.cores).toBe(8);
      expect(cpu.simd.supported).toBe(true);
    });

    it('should allow optional architecture', () => {
      const cpu: CPUInfo = {
        cores: 4,
        concurrency: 4,
        simd: { supported: false },
        wasm: {
          supported: true,
          simd: false,
          threads: false,
          bulkMemory: false,
          exceptions: false,
        },
      };

      expect(cpu.architecture).toBeUndefined();
    });
  });

  describe('GPUInfo', () => {
    it('should accept valid GPU info with WebGPU', () => {
      const gpu: GPUInfo = {
        available: true,
        vendor: 'NVIDIA',
        renderer: 'RTX 4050',
        vramMB: 6144,
        webgpu: { supported: true, adapter: 'NVIDIA' },
        webgl: { supported: true, version: 2 },
      };

      expect(gpu.webgpu.supported).toBe(true);
      expect(gpu.webgl.version).toBe(2);
    });

    it('should accept valid GPU info with WebGL only', () => {
      const gpu: GPUInfo = {
        available: true,
        webgpu: { supported: false },
        webgl: { supported: true, version: 1 },
      };

      expect(gpu.webgl.supported).toBe(true);
    });

    it('should allow optional vendor and renderer', () => {
      const gpu: GPUInfo = {
        available: false,
        webgpu: { supported: false },
        webgl: { supported: false, version: 0 },
      };

      expect(gpu.vendor).toBeUndefined();
      expect(gpu.renderer).toBeUndefined();
    });
  });

  describe('MemoryInfo', () => {
    it('should accept valid memory info', () => {
      const memory: MemoryInfo = {
        totalGB: 16,
        hasMemoryAPI: true,
        jsHeap: {
          limit: 2000000000,
          used: 1000000000,
          total: 1500000000,
        },
      };

      expect(memory.totalGB).toBe(16);
      expect(memory.hasMemoryAPI).toBe(true);
    });

    it('should allow optional fields', () => {
      const memory: MemoryInfo = {
        hasMemoryAPI: false,
      };

      expect(memory.totalGB).toBeUndefined();
      expect(memory.jsHeap).toBeUndefined();
    });
  });

  describe('StorageInfo', () => {
    it('should accept valid storage info with quota', () => {
      const storage: StorageInfo = {
        indexedDB: { supported: true, available: true },
        quota: {
          usage: 1000000000,
          quota: 10000000000,
          usagePercentage: 10,
        },
        storageType: 'persistent',
      };

      expect(storage.indexedDB.available).toBe(true);
      expect(storage.quota.usagePercentage).toBe(10);
    });

    it('should allow optional quota', () => {
      const storage: StorageInfo = {
        indexedDB: { supported: true, available: true },
      };

      expect(storage.quota).toBeUndefined();
      expect(storage.storageType).toBeUndefined();
    });
  });

  describe('NetworkInfo', () => {
    it('should accept valid network info', () => {
      const network: NetworkInfo = {
        effectiveType: '4g',
        downlinkMbps: 100,
        rtt: 50,
        saveData: false,
        hasNetworkAPI: true,
        online: true,
      };

      expect(network.effectiveType).toBe('4g');
      expect(network.hasNetworkAPI).toBe(true);
    });

    it('should allow optional fields', () => {
      const network: NetworkInfo = {
        hasNetworkAPI: false,
        online: true,
      };

      expect(network.effectiveType).toBeUndefined();
      expect(network.downlinkMbps).toBeUndefined();
    });
  });

  describe('DisplayInfo', () => {
    it('should accept valid display info', () => {
      const display: DisplayInfo = {
        width: 1920,
        height: 1080,
        pixelRatio: 1,
        colorDepth: 24,
        orientation: 'landscape',
      };

      expect(display.width).toBe(1920);
      expect(display.orientation).toBe('landscape');
    });

    it('should allow optional orientation', () => {
      const display: DisplayInfo = {
        width: 1920,
        height: 1080,
        pixelRatio: 1,
        colorDepth: 24,
      };

      expect(display.orientation).toBeUndefined();
    });
  });

  describe('BrowserInfo', () => {
    it('should accept valid browser info', () => {
      const browser: BrowserInfo = {
        userAgent: 'Mozilla/5.0',
        browser: 'Chrome',
        version: '120',
        os: 'Windows',
        platform: 'Win32',
        touchSupport: false,
      };

      expect(browser.browser).toBe('Chrome');
      expect(browser.version).toBe('120');
    });

    it('should allow optional version', () => {
      const browser: BrowserInfo = {
        userAgent: 'Unknown',
        browser: 'Unknown',
        os: 'Unknown',
        platform: 'Unknown',
        touchSupport: false,
      };

      expect(browser.version).toBeUndefined();
    });
  });

  describe('FeatureSupport', () => {
    it('should accept valid feature support', () => {
      const features: FeatureSupport = {
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
      };

      expect(features.webWorkers).toBe(true);
      expect(features.webBluetooth).toBe(false);
    });
  });

  describe('PerformanceClass', () => {
    it('should accept valid performance classes', () => {
      const classes: PerformanceClass[] = ['low', 'medium', 'high', 'premium'];

      classes.forEach(perfClass => {
        expect(['low', 'medium', 'high', 'premium']).toContain(perfClass);
      });
    });
  });

  describe('HardwareProfile', () => {
    it('should accept valid hardware profile', () => {
      const profile: HardwareProfile = {
        timestamp: Date.now(),
        cpu: {
          cores: 8,
          concurrency: 8,
          simd: { supported: true },
          wasm: { supported: true, simd: true, threads: true, bulkMemory: true, exceptions: true },
        },
        gpu: {
          available: true,
          webgpu: { supported: true },
          webgl: { supported: true, version: 2 },
        },
        memory: { hasMemoryAPI: true },
        storage: { indexedDB: { supported: true, available: true } },
        network: { hasNetworkAPI: false, online: true },
        display: { width: 1920, height: 1080, pixelRatio: 1, colorDepth: 24 },
        browser: {
          userAgent: 'Test',
          browser: 'Chrome',
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
        performanceScore: 75,
        performanceClass: 'high',
      };

      expect(profile.performanceScore).toBe(75);
      expect(profile.performanceClass).toBe('high');
    });
  });

  describe('PerformanceScoreBreakdown', () => {
    it('should accept valid score breakdown', () => {
      const breakdown: PerformanceScoreBreakdown = {
        cpu: 80,
        gpu: 70,
        memory: 60,
        network: 90,
        overall: 75,
      };

      expect(breakdown.cpu).toBe(80);
      expect(breakdown.overall).toBe(75);
    });
  });

  describe('DetectionOptions', () => {
    it('should accept valid detection options', () => {
      const options: DetectionOptions = {
        detailedGPU: true,
        checkQuota: true,
        detectWebGL: true,
        timeout: 5000,
      };

      expect(options.detailedGPU).toBe(true);
      expect(options.timeout).toBe(5000);
    });

    it('should accept empty options', () => {
      const options: DetectionOptions = {};

      expect(options.detailedGPU).toBeUndefined();
    });
  });

  describe('DetectionResult', () => {
    it('should accept successful detection result', () => {
      const result: DetectionResult = {
        success: true,
        profile: {
          timestamp: Date.now(),
          cpu: {
            cores: 8,
            concurrency: 8,
            simd: { supported: true },
            wasm: { supported: true, simd: true, threads: true, bulkMemory: true, exceptions: true },
          },
          gpu: {
            available: true,
            webgpu: { supported: true },
            webgl: { supported: true, version: 2 },
          },
          memory: { hasMemoryAPI: true },
          storage: { indexedDB: { supported: true, available: true } },
          network: { hasNetworkAPI: false, online: true },
          display: { width: 1920, height: 1080, pixelRatio: 1, colorDepth: 24 },
          browser: {
            userAgent: 'Test',
            browser: 'Chrome',
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
          performanceScore: 75,
          performanceClass: 'high',
        },
        detectionTime: 150,
      };

      expect(result.success).toBe(true);
      expect(result.profile).toBeDefined();
    });

    it('should accept failed detection result', () => {
      const result: DetectionResult = {
        success: false,
        error: 'Detection failed',
        detectionTime: 50,
      };

      expect(result.success).toBe(false);
      expect(result.error).toBe('Detection failed');
      expect(result.profile).toBeUndefined();
    });
  });

  describe('HardwareTier', () => {
    it('should accept valid hardware tiers', () => {
      const tiers: HardwareTier[] = ['low-end', 'mid-range', 'high-end', 'extreme'];

      tiers.forEach(tier => {
        expect(['low-end', 'mid-range', 'high-end', 'extreme']).toContain(tier);
      });
    });
  });

  describe('JEPACapabilities', () => {
    it('should accept valid JEPA capabilities', () => {
      const jepa: JEPACapabilities = {
        tinyJEPA: true,
        largeJEPA: true,
        xlJEPA: false,
        multimodalJEPA: true,
        realtimeTranscription: true,
        multiModel: false,
        recommendedBatchSize: 8,
        performanceLevel: 'good',
      };

      expect(jepa.tinyJEPA).toBe(true);
      expect(jepa.performanceLevel).toBe('good');
    });
  });

  describe('HardwareScoreResult', () => {
    it('should accept valid score result', () => {
      const result: HardwareScoreResult = {
        score: 65,
        tier: 'high-end',
        jepa: {
          tinyJEPA: true,
          largeJEPA: true,
          xlJEPA: false,
          multimodalJEPA: false,
          realtimeTranscription: true,
          multiModel: false,
          recommendedBatchSize: 4,
          performanceLevel: 'basic',
        },
        breakdown: {
          gpu: 30,
          ram: 20,
          cpu: 10,
          storage: 5,
        },
        recommendations: ['Good system'],
      };

      expect(result.score).toBe(65);
      expect(result.tier).toBe('high-end');
      expect(result.recommendations).toHaveLength(1);
    });
  });

  describe('FeatureAvailability', () => {
    it('should accept valid feature availability', () => {
      const feature: FeatureAvailability = {
        id: 'test.feature',
        name: 'Test Feature',
        available: true,
        performanceImpact: 50,
        expectedPerformance: 'good',
      };

      expect(feature.available).toBe(true);
      expect(feature.expectedPerformance).toBe('good');
    });

    it('should allow optional reason for unavailable features', () => {
      const feature: FeatureAvailability = {
        id: 'test.feature',
        name: 'Test Feature',
        available: false,
        reason: 'Not supported',
        performanceImpact: 0,
        expectedPerformance: 'minimal',
      };

      expect(feature.reason).toBe('Not supported');
    });
  });

  describe('CapabilityAssessment', () => {
    it('should accept valid capability assessment', () => {
      const assessment: CapabilityAssessment = {
        score: {
          score: 70,
          tier: 'high-end',
          jepa: {
            tinyJEPA: true,
            largeJEPA: true,
            xlJEPA: false,
            multimodalJEPA: true,
            realtimeTranscription: true,
            multiModel: false,
            recommendedBatchSize: 8,
            performanceLevel: 'good',
          },
          breakdown: { gpu: 30, ram: 20, cpu: 15, storage: 5 },
          recommendations: [],
        },
        features: [],
        featureFlags: {},
        tierDescription: 'Good hardware',
        canUseLocalAI: true,
        canUseJEPA: true,
        canUseRealtimeTranscription: true,
        recommendedConfiguration: {
          aiProvider: 'local',
          transcriptionModel: 'large',
          maxBatchSize: 8,
          enableCaching: true,
          enableOfflineMode: true,
        },
      };

      expect(assessment.canUseLocalAI).toBe(true);
      expect(assessment.recommendedConfiguration.aiProvider).toBe('local');
    });
  });
});
