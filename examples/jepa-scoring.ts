/**
 * JEPA Scoring Example
 *
 * This example demonstrates JEPA (Joint Embedding Predictive Architecture)
 * hardware scoring and capability assessment.
 */

import { getHardwareInfo, calculateJEPAScore, getJEPARequirements } from '../src';

async function jepaScoring() {
  console.log('=== JEPA Hardware Scoring ===\n');

  // Detect hardware
  const result = await getHardwareInfo();

  if (!result.success) {
    console.error('Detection failed:', result.error);
    return;
  }

  const { profile } = result;

  // Calculate JEPA score
  const scoreResult = calculateJEPAScore(profile);

  console.log('📊 JEPA Score Results:\n');

  // Overall Score
  console.log(`Overall Score: ${scoreResult.score}/100`);
  console.log(`Hardware Tier: ${scoreResult.tier.toUpperCase()}`);
  console.log('');

  // Score Breakdown
  console.log('Score Breakdown:');
  console.log(`   GPU: ${scoreResult.breakdown.gpu}/40`);
  console.log(`   RAM: ${scoreResult.breakdown.ram}/30`);
  console.log(`   CPU: ${scoreResult.breakdown.cpu}/20`);
  console.log(`   Storage: ${scoreResult.breakdown.storage}/10`);
  console.log('');

  // JEPA Capabilities
  console.log('JEPA Capabilities:\n');

  const { jepa } = scoreResult;

  console.log('Model Support:');
  console.log(`   Tiny-JEPA: ${jepa.tinyJEPA ? '✅ Supported' : '❌ Not supported'}`);
  console.log(`   JEPA-Large: ${jepa.largeJEPA ? '✅ Supported' : '❌ Not supported'}`);
  console.log(`   JEPA-XL: ${jepa.xlJEPA ? '✅ Supported' : '❌ Not supported'}`);
  console.log('');

  console.log('Feature Support:');
  console.log(`   Multimodal JEPA: ${jepa.multimodalJEPA ? '✅' : '❌'}`);
  console.log(`   Real-time Transcription: ${jepa.realtimeTranscription ? '✅' : '❌'}`);
  console.log(`   Multi-model Execution: ${jepa.multiModel ? '✅' : '❌'}`);
  console.log('');

  console.log('Performance:');
  console.log(`   Level: ${jepa.performanceLevel.toUpperCase()}`);
  console.log(`   Recommended Batch Size: ${jepa.recommendedBatchSize}`);
  console.log('');

  // JEPA Requirements
  console.log('JEPA Feature Requirements:\n');

  const requirements = getJEPARequirements();

  Object.entries(requirements).forEach(([feature, req]) => {
    const meetsRequirement = scoreResult.score >= req.minScore;
    const status = meetsRequirement ? '✅' : '❌';
    console.log(`${status} ${feature}`);
    console.log(`   Minimum Score: ${req.minScore}/100`);
    console.log(`   Your Score: ${scoreResult.score}/100`);
    console.log(`   ${req.description}`);
    console.log('');
  });

  // Recommendations
  if (scoreResult.recommendations.length > 0) {
    console.log('Recommendations:\n');
    scoreResult.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.log('');
  }

  // Use Case Scenarios
  console.log('Use Case Scenarios:\n');

  if (jepa.tinyJEPA) {
    console.log('✅ Basic Transcription:');
    console.log('   Your system can run Tiny-JEPA models for basic transcription.');
    console.log('   Recommended for: Voice memos, meeting notes, basic dictation');
    console.log('');
  }

  if (jepa.largeJEPA) {
    console.log('✅ Advanced Transcription:');
    console.log('   Your system can run JEPA-Large models for high-accuracy transcription.');
    console.log('   Recommended for: Professional transcription, complex audio, multiple speakers');
    console.log('');
  }

  if (jepa.xlJEPA) {
    console.log('✅ Enterprise Transcription:');
    console.log('   Your system can run JEPA-XL models for maximum accuracy.');
    console.log('   Recommended for: 24/7 transcription, broadcast media, archives');
    console.log('');
  }

  if (jepa.multimodalJEPA) {
    console.log('✅ Multimodal Analysis:');
    console.log('   Your system can process video + audio simultaneously.');
    console.log('   Recommended for: Video transcription, audio-visual analysis');
    console.log('');
  }

  if (jepa.realtimeTranscription) {
    console.log('✅ Real-time Transcription:');
    console.log('   Your system can transcribe audio in real-time.');
    console.log('   Recommended for: Live captions, meetings, streaming');
    console.log('');
  }

  if (jepa.multiModel) {
    console.log('✅ Multi-model Execution:');
    console.log('   Your system can run multiple JEPA models simultaneously.');
    console.log('   Recommended for: Parallel processing, multiple audio streams');
    console.log('');
  }

  // Hardware Summary
  console.log('Hardware Summary:');
  console.log(`   GPU: ${profile.gpu.renderer || 'Unknown'}`);
  console.log(`   VRAM: ${profile.gpu.vramMB ? `${(profile.gpu.vramMB / 1024).toFixed(1)} GB` : 'Unknown'}`);
  console.log(`   RAM: ${profile.memory.totalGB ? `${profile.memory.totalGB} GB` : 'Unknown'}`);
  console.log(`   CPU Cores: ${profile.cpu.cores}`);
  console.log('');

  console.log('=== End of JEPA Scoring ===');
}

// Run the example
jepaScoring().catch(console.error);
