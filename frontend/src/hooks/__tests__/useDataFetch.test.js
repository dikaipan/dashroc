import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDataFetch } from '../useDataFetch';

// Mock fetch globally
global.fetch = vi.fn();

describe('useDataFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch data on mount with autoFetch enabled', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: true })
    );

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(global.fetch).toHaveBeenCalledWith('/api/test');
  });

  it('should not fetch data on mount with autoFetch disabled', () => {
    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: false })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.data).toEqual([]);
  });

  it('should handle HTTP errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('HTTP error! status: 404');
    expect(result.current.data).toEqual([]);
  });

  it('should apply parser function to data', async () => {
    const mockData = { rows: [{ id: 1, name: 'Test' }], total: 1 };
    const parser = vi.fn((data) => data.rows);
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: true, parser })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(parser).toHaveBeenCalledWith(mockData);
    expect(result.current.data).toEqual(mockData.rows);
  });

  it('should return refetch function', () => {
    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: false })
    );

    expect(typeof result.current.refetch).toBe('function');
  });

  it('should refetch data when refetch is called', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: false })
    );

    // Initial state
    expect(result.current.loading).toBe(false);

    // Call refetch (this is async, so loading state might change immediately)
    const refetchPromise = result.current.refetch();

    // Wait for completion
    await refetchPromise;

    // After refetch completes
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should listen for custom events when eventName is provided', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useDataFetch('/api/test', {
        autoFetch: false,
        eventName: 'dataChanged',
      })
    );

    // Should add event listener
    expect(addEventListenerSpy).toHaveBeenCalledWith('dataChanged', expect.any(Function));

    // Dispatch event
    window.dispatchEvent(new Event('dataChanged'));

    // Wait for fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    }, { timeout: 1000 });

    // Unmount should remove event listener
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('dataChanged', expect.any(Function));
  });

  it('should refetch data when custom event is dispatched', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    renderHook(() =>
      useDataFetch('/api/test', {
        autoFetch: false,
        eventName: 'refreshData',
      })
    );

    // Dispatch event
    window.dispatchEvent(new Event('refreshData'));

    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/test');
    }, { timeout: 1000 });
  });

  it('should handle multiple refetches correctly', async () => {
    const mockData1 = [{ id: 1, name: 'Test 1' }];
    const mockData2 = [{ id: 2, name: 'Test 2' }];
    
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
      });

    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: false })
    );

    // First refetch
    result.current.refetch();
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });

    // Second refetch
    result.current.refetch();
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should reset error on refetch', async () => {
    // First fetch fails
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: true })
    );

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });

    // Second fetch succeeds
    const mockData = [{ id: 1, name: 'Test' }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBe(null);
      expect(result.current.data).toEqual(mockData);
    });
  });

  it('should use default options when not provided', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useDataFetch('/api/test')
    );

    // Should autoFetch by default
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });
  });

  it('should handle JSON parsing errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    const { result } = renderHook(() =>
      useDataFetch('/api/test', { autoFetch: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Invalid JSON');
  });
});

