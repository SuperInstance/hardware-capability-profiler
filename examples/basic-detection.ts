/**
 * Basic Hardware Detection Example
 *
 * This example demonstrates basic hardware detection and profiling.
 */

import { getHardwareInfo } from '../src';

async function basicDetection() {
  console.log('=== Basic Hardware Detection ===\n');

  // Detect hardware with default options
  const result = await getHardwareInfo();

  if (!result.success) {
    console.error('Detection failed:', result.error);
    return;
  }

  const { profile, detectionTime } = result;

  // Display basic information
  console.log('📊 Detection Results:');
  console.log(`   Detection Time: ${detectionTime.toFixed(2)}ms`);
  console.log(`   Timestamp: ${new Date(profile.timestamp).toISOString()}`);
  console.log('');

  // CPU Information
  console.log('🖥️  CPU:');
  console.log(`   Cores: ${profile.cpu.cores}`);
  console.log(`   Architecture: ${profile.cpu.architecture || 'Unknown'}`);
  console.log(`   SIMD: ${profile.cpu.simd.supported ? '✅' : '❌'}`);
  console.log(`   WebAssembly: ${profile.cpu.wasm.supported ? '✅' : '❌'}`);
  if (profile.cpu.wasm.supported) {
    console.log(`   - SIMD: ${profile.cpu.wasm.simd ? '✅' : '❌'}`);
    console.log(`   - Threads: ${profile.cpu.wasm.threads ? '✅' : '❌'}`);
    console.log(`   - Bulk Memory: ${profile.cpu.wasm.bulkMemory ? '✅' : '❌'}`);
  }
  console.log('');

  // GPU Information
  console.log('🎮 GPU:');
  console.log(`   Available: ${profile.gpu.available ? '✅' : '❌'}`);
  if (profile.gpu.available) {
    console.log(`   Vendor: ${profile.gpu.vendor || 'Unknown'}`);
    console.log(`   Renderer: ${profile.gpu.renderer || 'Unknown'}`);
    console.log(`   VRAM: ${profile.gpu.vramMB ? `${(profile.gpu.vramMB / 1024).toFixed(1)} GB` : 'Unknown'}`);
    console.log(`   WebGPU: ${profile.gpu.webgpu.supported ? '✅' : '❌'}`);
    console.log(`   WebGL: ${profile.gpu.webgl.supported ? `✅ (v${profile.gpu.webgl.version})` : '❌'}`);
  }
  console.log('');

  // Memory Information
  console.log('💾 Memory:');
  console.log(`   Total RAM: ${profile.memory.totalGB ? `${profile.memory.totalGB} GB` : 'Unknown'}`);
  console.log(`   Memory API: ${profile.memory.hasMemoryAPI ? '✅' : '❌'}`);
  if (profile.memory.jsHeap) {
    const heapMB = profile.memory.jsHeap.used / 1024 / 1024;
    const heapLimitMB = profile.memory.jsHeap.limit / 1024 / 1024;
    console.log(`   JS Heap: ${heapMB.toFixed(1)} MB / ${heapLimitMB.toFixed(1)} MB`);
  }
  console.log('');

  // Network Information
  console.log('🌐 Network:');
  console.log(`   Online: ${profile.network.online ? '✅' : '❌'}`);
  console.log(`   Network API: ${profile.network.hasNetworkAPI ? '✅' : '❌'}`);
  if (profile.network.hasNetworkAPI) {
    console.log(`   Type: ${profile.network.effectiveType || 'Unknown'}`);
    console.log(`   Downlink: ${profile.network.downlinkMbps ? `${profile.network.downlinkMbps} Mbps` : 'Unknown'}`);
    console.log(`   RTT: ${profile.network.rtt ? `${profile.network.rtt} ms` : 'Unknown'}`);
  }
  console.log('');

  // Display Information
  console.log('🖥️  Display:');
  console.log(`   Resolution: ${profile.display.width}x${profile.display.height}`);
  console.log(`   Pixel Ratio: ${profile.display.pixelRatio}x`);
  console.log(`   Color Depth: ${profile.display.colorDepth} bit`);
  console.log(`   Orientation: ${profile.display.orientation || 'Unknown'}`);
  console.log('');

  // Browser Information
  console.log('🌍 Browser:');
  console.log(`   Browser: ${profile.browser.browser}`);
  console.log(`   Version: ${profile.browser.version || 'Unknown'}`);
  console.log(`   OS: ${profile.browser.os}`);
  console.log(`   Platform: ${profile.browser.platform}`);
  console.log(`   Touch Support: ${profile.browser.touchSupport ? '✅' : '❌'}`);
  console.log('');

  // Performance Score
  console.log('⚡ Performance:');
  console.log(`   Score: ${profile.performanceScore}/100`);
  console.log(`   Class: ${profile.performanceClass.toUpperCase()}`);
  console.log('');

  // Feature Support
  console.log('✨ Features:');
  const featureList = [
    { name: 'Web Workers', key: 'webWorkers' },
    { name: 'Service Worker', key: 'serviceWorker' },
    { name: 'WebRTC', key: 'webrtc' },
    { name: 'WebAssembly', key: 'webassembly' },
    { name: 'WebSockets', key: 'websockets' },
    { name: 'Geolocation', key: 'geolocation' },
    { name: 'Notifications', key: 'notifications' },
    { name: 'Fullscreen', key: 'fullscreen' },
    { name: 'Picture-in-Picture', key: 'pip' },
    { name: 'Web Bluetooth', key: 'webBluetooth' },
    { name: 'Web USB', key: 'webusb' },
    { name: 'File System Access', key: 'fileSystemAccess' },
  ];

  featureList.forEach(({ name, key }) => {
    const supported = profile.features[key];
    console.log(`   ${name}: ${supported ? '✅' : '❌'}`);
  });

  console.log('\n=== End of Detection ===');
}

// Run the example
basicDetection().catch(console.error);
