// Simple smoke test for config module
// Note: Full testing requires setting env vars before importing the module

describe('Config', () => {
  it('should export loadConfig function', async () => {
    const module = await import('../index.js');
    expect(typeof module.loadConfig).toBe('function');
  });

  it('should export Config interface', async () => {
    const module = await import('../index.js');
    expect(module).toHaveProperty('loadConfig');
    expect(module).toHaveProperty('config');
  });
});
