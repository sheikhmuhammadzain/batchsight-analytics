import { endpointMethods } from '@/services/api';

// Verification function to test all endpoints
export async function verifyAllEndpoints() {
  console.log('🔍 Verifying all Batch Processing API endpoints...\n');

  const results = {
    passed: 0,
    failed: 0,
    total: Object.keys(endpointMethods).length
  };

  for (const [endpointName, method] of Object.entries(endpointMethods)) {
    try {
      console.log(`Testing endpoint: ${endpointName}...`);
      const data = await method();

      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        console.log(`✅ ${endpointName}: SUCCESS`);
        results.passed++;
      } else {
        console.log(`⚠️  ${endpointName}: EMPTY DATA`);
        results.failed++;
      }
    } catch (error) {
      console.log(`❌ ${endpointName}: FAILED - ${error}`);
      results.failed++;
    }
  }

  console.log(`\n📊 Verification Results:`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total: ${results.total}`);
  console.log(`🎯 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  return results;
}

// List of all expected endpoints from the OpenAPI spec
export const expectedEndpoints = [
  'GET /',
  'GET /processing-days-histogram',
  'GET /delay-share',
  'GET /monthly-average-delay',
  'GET /line-average-delay',
  'GET /line-monthly-average-delay',
  'GET /delayed-batches-by-line',
  'GET /delayed-vs-total-batches',
  'GET /top-delay-formulas',
  'GET /line-scrap-factor',
  'GET /monthly-delay-rate',
  'GET /delay-reasons-by-line',
  'GET /delay-reasons-top10'
];

export function logEndpointStatus() {
  console.log('📋 Batch Processing API Endpoints Status:');
  console.log('='.repeat(50));

  expectedEndpoints.forEach(endpoint => {
    const methodName = endpoint.split('/').pop()?.replace(/-/g, '') || '';
    const isImplemented = Object.keys(endpointMethods).includes(methodName);
    console.log(`${isImplemented ? '✅' : '❌'} ${endpoint}`);
  });

  console.log('='.repeat(50));
  console.log(`Total Expected: ${expectedEndpoints.length}`);
  console.log(`Implemented: ${Object.keys(endpointMethods).length}`);
}
