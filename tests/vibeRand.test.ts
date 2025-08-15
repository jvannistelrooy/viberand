import { initVibeRand } from '../src';
import request from 'sync-request';

jest.mock('sync-request');

const mockRequest = request as unknown as jest.Mock;

describe('vibeRand', () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  function mockResponse(text: string) {
    return {
      getBody: () => Buffer.from(JSON.stringify({ output: [{ content: [{ text }] }] }))
    } as any;
  }

  it('returns integer when API responds correctly', () => {
    mockRequest.mockReturnValue(mockResponse('5'));
    const vibeRand = initVibeRand('test-key');
    const result = vibeRand(1, 10);
    expect(result).toBe(5);
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it('retries once when API returns non-integer', () => {
    mockRequest
      .mockReturnValueOnce(mockResponse('oops'))
      .mockReturnValueOnce(mockResponse('3'));
    const vibeRand = initVibeRand('test-key');
    const result = vibeRand(1, 10);
    expect(result).toBe(3);
    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  it('throws error when API returns out-of-range twice', () => {
    mockRequest.mockReturnValue(mockResponse('20'));
    const vibeRand = initVibeRand('test-key');
    expect(() => vibeRand(1, 10)).toThrow('out of range');
    expect(mockRequest).toHaveBeenCalledTimes(2);
  });
});

