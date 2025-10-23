// Simple smoke test for config module
// Note: Full testing requires setting env vars before importing the module

describe('Config', () => {
  it('should export loadConfig function', () => {
    // This test verifies the module structure without triggering config loading
    expect(typeof require('../index.js').loadConfig).toBe('function');
  });

  it('should export Config interface', () => {
    const module = require('../index.js');
    expect(module).toHaveProperty('loadConfig');
    expect(module).toHaveProperty('config');
  });
});
