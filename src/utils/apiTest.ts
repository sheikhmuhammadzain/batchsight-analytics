import { endpointMethods } from '@/services/api';

// Test function to verify all API endpoints are working
export async function testAllEndpoints() {
  console.log('🧪 Testing all Batch Processing API endpoints...\n');

  const results = {
    total: Object.keys(endpointMethods).length,
    working: 0,
    failed: 0,
    details: [] as Array<{endpoint: string, status: 'working' | 'failed', error?: string}>
  };

  for (const [endpointName, method] of Object.entries(endpointMethods)) {
    try {
      console.log(`Testing ${endpointName}...`);
      const startTime = Date.now();
      const data = await method();
      const endTime = Date.now();

      console.log(`✅ ${endpointName}: SUCCESS (${endTime - startTime}ms)`);

      results.working++;
      results.details.push({
        endpoint: endpointName,
        status: 'working'
      });
    } catch (error) {
      console.log(`❌ ${endpointName}: FAILED - ${error}`);

      results.failed++;
      results.details.push({
        endpoint: endpointName,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(50));
  console.log(`Total Endpoints: ${results.total}`);
  console.log(`✅ Working: ${results.working}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.working / results.total) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n🔍 Failed Endpoints:');
    results.details
      .filter(d => d.status === 'failed')
      .forEach(d => {
        console.log(`  - ${d.endpoint}: ${d.error}`);
      });
  }

  return results;
}

// Quick test for a specific endpoint
export async function testEndpoint(endpointName: keyof typeof endpointMethods) {
  try {
    const method = endpointMethods[endpointName];
    const startTime = Date.now();
    const data = await method();
    const endTime = Date.now();

    console.log(`✅ ${endpointName}: SUCCESS (${endTime - startTime}ms)`);
    console.log('Sample data:', JSON.stringify(data, null, 2).slice(0, 500) + '...');

    return { success: true, data, responseTime: endTime - startTime };
  } catch (error) {
    console.log(`❌ ${endpointName}: FAILED - ${error}`);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Test the Line Average Delay endpoint specifically
export async function testLineAverageDelayEndpoint() {
  console.log('🧪 Testing Line Average Delay endpoint...');
  return await testEndpoint('lineAverageDelay');
}

// Test the Line Monthly Average Delay endpoint specifically
export async function testLineMonthlyAverageDelayEndpoint() {
  console.log('🧪 Testing Line Monthly Average Delay endpoint...');
  return await testEndpoint('lineMonthlyAverageDelay');
}

// Test the Delayed Batches By Line endpoint specifically
export async function testDelayedBatchesByLineEndpoint() {
  console.log('🧪 Testing Delayed Batches By Line endpoint...');
  return await testEndpoint('delayedBatchesByLine');
}

// Test the Top Delay Formulas endpoint specifically
export async function testTopDelayFormulasEndpoint() {
  console.log('🧪 Testing Top Delay Formulas endpoint...');
  return await testEndpoint('topDelayFormulas');
}

// Test the Line Scrap Factor endpoint specifically
export async function testLineScrapFactorEndpoint() {
  console.log('🧪 Testing Line Scrap Factor endpoint...');
  return await testEndpoint('lineScrapFactor');
}

// Test the Monthly Delay Rate endpoint specifically
export async function testMonthlyDelayRateEndpoint() {
  console.log('🧪 Testing Monthly Delay Rate endpoint...');
  return await testEndpoint('monthlyDelayRate');
}

// Test the Delay Reasons By Line endpoint specifically
export async function testDelayReasonsByLineEndpoint() {
  console.log('🧪 Testing Delay Reasons By Line endpoint...');
  return await testEndpoint('delayReasonsByLine');
}

// Test the Top Delay Reasons endpoint specifically
export async function testTopDelayReasonsEndpoint() {
  console.log('🧪 Testing Top Delay Reasons endpoint...');
  return await testEndpoint('topDelayReasons');
}
