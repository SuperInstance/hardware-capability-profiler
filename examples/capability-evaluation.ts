/**
 * Capability Evaluation Example
 *
 * This example demonstrates comprehensive capability evaluation and
 * feature recommendations for AI-powered applications.
 */

import { getHardwareInfo, evaluateCapabilities, getFeaturesByCategory } from '../src';

async function capabilityEvaluation() {
  console.log('=== Capability Evaluation ===\n');

  // Detect hardware
  const result = await getHardwareInfo();

  if (!result.success) {
    console.error('Detection failed:', result.error);
    return;
  }

  const { profile } = result;

  // Evaluate capabilities
  const assessment = evaluateCapabilities(profile);

  // Overall Assessment
  console.log('Overall Assessment:\n');
  console.log(`Hardware Score: ${assessment.score.score}/100`);
  console.log(`Hardware Tier: ${assessment.score.tier.toUpperCase()}`);
  console.log('');
  console.log(assessment.tierDescription);
  console.log('');

  // Key Capabilities
  console.log('Key Capabilities:\n');
  console.log(`Local AI: ${assessment.canUseLocalAI ? '✅' : '❌'}`);
  console.log(`JEPA Transcription: ${assessment.canUseJEPA ? '✅' : '❌'}`);
  console.log(`Real-time Transcription: ${assessment.canUseRealtimeTranscription ? '✅' : '❌'}`);
  console.log('');

  // Recommended Configuration
  console.log('Recommended Configuration:\n');

  const config = assessment.recommendedConfiguration;

  console.log('AI Provider:');
  switch (config.aiProvider) {
    case 'local':
      console.log('   Strategy: Use local AI models exclusively');
      console.log('   Reasoning: Your hardware is powerful enough to run models locally');
      break;
    case 'hybrid':
      console.log('   Strategy: Use hybrid approach (local + API)');
      console.log('   Reasoning: Your hardware can handle some local processing');
      break;
    case 'api':
      console.log('   Strategy: Use API-based AI exclusively');
      console.log('   Reasoning: Your hardware is not suitable for local AI');
      break;
  }
  console.log('');

  console.log('Transcription Model:');
  switch (config.transcriptionModel) {
    case 'xl':
      console.log('   Model: JEPA-XL');
      console.log('   Use case: Enterprise-grade transcription, maximum accuracy');
      break;
    case 'large':
      console.log('   Model: JEPA-Large');
      console.log('   Use case: Professional transcription, high accuracy');
      break;
    case 'tiny':
      console.log('   Model: Tiny-JEPA');
      console.log('   Use case: Basic transcription, fast processing');
      break;
    case 'api-only':
      console.log('   Model: API-based transcription');
      console.log('   Use case: Cloud-based transcription service');
      break;
  }
  console.log('');

  console.log('Performance Settings:');
  console.log(`   Max Batch Size: ${config.maxBatchSize}`);
  console.log(`   Enable Caching: ${config.enableCaching ? '✅' : '❌'}`);
  console.log(`   Enable Offline Mode: ${config.enableOfflineMode ? '✅' : '❌'}`);
  console.log('');

  // Feature Availability by Category
  const categories = [
    { name: 'AI Features', id: 'ai' },
    { name: 'JEPA Features', id: 'jepa' },
    { name: 'Knowledge Features', id: 'knowledge' },
    { name: 'Media Features', id: 'media' },
    { name: 'UI Features', id: 'ui' },
    { name: 'Advanced Features', id: 'advanced' },
  ];

  categories.forEach(({ name, id }) => {
    const features = getFeaturesByCategory(assessment, id);

    if (features.length === 0) return;

    console.log(`${name}:\n`);

    features.forEach(feature => {
      const status = feature.available ? '✅' : '❌';
      const impact = '⚡'.repeat(Math.ceil(feature.performanceImpact / 20));

      console.log(`${status} ${feature.name}`);
      console.log(`   ${impact} Performance Impact: ${feature.performanceImpact}/100`);

      if (feature.available) {
        console.log(`   Expected Performance: ${feature.expectedPerformance.toUpperCase()}`);
      } else {
        console.log(`   Reason: ${feature.reason}`);
      }

      console.log('');
    });
  });

  // Feature Flags
  console.log('Feature Flags:\n');

  const enabledFeatures = Object.entries(assessment.featureFlags)
    .filter(([_, enabled]) => enabled)
    .map(([featureId]) => featureId);

  const disabledFeatures = Object.entries(assessment.featureFlags)
    .filter(([_, enabled]) => !enabled)
    .map(([featureId]) => featureId);

  console.log(`Enabled (${enabledFeatures.length}):`);
  if (enabledFeatures.length > 0) {
    enabledFeatures.forEach(featureId => {
      const feature = assessment.features.find(f => f.id === featureId);
      console.log(`   ✅ ${feature?.name || featureId}`);
    });
  } else {
    console.log('   No features enabled');
  }
  console.log('');

  console.log(`Disabled (${disabledFeatures.length}):`);
  if (disabledFeatures.length > 0) {
    disabledFeatures.forEach(featureId => {
      const feature = assessment.features.find(f => f.id === featureId);
      console.log(`   ❌ ${feature?.name || featureId}: ${feature?.reason || 'Not available'}`);
    });
  } else {
    console.log('   All features enabled');
  }
  console.log('');

  // Upgrade Recommendations
  if (assessment.score.recommendations.length > 0) {
    console.log('Upgrade Recommendations:\n');
    assessment.score.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.log('');
  }

  // Implementation Guide
  console.log('Implementation Guide:\n');

  if (assessment.canUseLocalAI) {
    console.log('To enable local AI:');
    console.log('1. Install @superinstance/hardware-capability-profiler');
    console.log('2. Check capability before loading models:');
    console.log('```typescript');
    console.log('const { canUseLocalAI } = await evaluateCapabilities(profile);');
    console.log('if (canUseLocalAI) {');
    console.log('  // Load local AI models');
    console.log('} else {');
    console.log('  // Use API-based AI');
    console.log('}');
    console.log('```');
    console.log('');
  }

  if (assessment.canUseJEPA) {
    console.log('To enable JEPA transcription:');
    console.log('1. Calculate JEPA score to determine model size:');
    console.log('```typescript');
    console.log('const { jepa } = calculateJEPAScore(profile);');
    console.log('');
    console.log('if (jepa.xlJEPA) {');
    console.log('  // Use JEPA-XL model');
    console.log('} else if (jepa.largeJEPA) {');
    console.log('  // Use JEPA-Large model');
    console.log('} else if (jepa.tinyJEPA) {');
    console.log('  // Use Tiny-JEPA model');
    console.log('} else {');
    console.log('  // Use API-based transcription');
    console.log('}');
    console.log('```');
    console.log('');
  }

  console.log('=== End of Capability Evaluation ===');
}

// Run the example
capabilityEvaluation().catch(console.error);
