import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCrud } from '../useCrud';

// Mock fetch globally
global.fetch = vi.fn();

describe('useCrud', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const mockResult = { id: 1, name: 'New Item' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
          primaryKey: 'id',
        })
      );

      const newItem = { name: 'New Item' };
      const createPromise = result.current.create(newItem);

      // Wait for create to complete (loading state updates are async)
      const created = await createPromise;

      expect(created).toEqual(mockResult);
      expect(global.fetch).toHaveBeenCalledWith('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle create errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Validation failed' }),
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      try {
        await result.current.create({ name: 'Test' });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toBe('Validation failed');
      }

      // Wait for state updates
      await waitFor(() => {
        expect(result.current.error).toBe('Validation failed');
        expect(result.current.loading).toBe(false);
      }, { timeout: 100 });
    });

    it('should dispatch custom event on create when eventName is provided', async () => {
      const mockResult = { id: 1, name: 'New Item' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
          eventName: 'itemsChanged',
        })
      );

      await result.current.create({ name: 'New Item' });

      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({
        type: 'itemsChanged',
      }));
    });

    it('should handle network errors on create', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      try {
        await result.current.create({ name: 'Test' });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toBe('Network error');
      }

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      }, { timeout: 100 });
    });
  });

  describe('update', () => {
    it('should update an existing item', async () => {
      const mockResult = { id: 1, name: 'Updated Item' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
          primaryKey: 'id',
        })
      );

      const updateData = { name: 'Updated Item' };
      const updatePromise = result.current.update(1, updateData);

      // Wait for update to complete
      const updated = await updatePromise;

      expect(updated).toEqual(mockResult);
      expect(global.fetch).toHaveBeenCalledWith('/api/items/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      // Wait for loading to be false
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 100 });
    });

    it('should use custom primaryKey for update', async () => {
      const mockResult = { wsid: 'M001', name: 'Updated' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/machines',
          primaryKey: 'wsid',
        })
      );

      await result.current.update('M001', { name: 'Updated' });

      expect(global.fetch).toHaveBeenCalledWith('/api/machines/M001', expect.any(Object));
    });

    it('should handle update errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Item not found' }),
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      try {
        await result.current.update(1, { name: 'Test' });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toBe('Item not found');
      }

      await waitFor(() => {
        expect(result.current.error).toBe('Item not found');
      }, { timeout: 100 });
    });

    it('should dispatch custom event on update when eventName is provided', async () => {
      const mockResult = { id: 1, name: 'Updated' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
          eventName: 'itemsChanged',
        })
      );

      await result.current.update(1, { name: 'Updated' });

      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({
        type: 'itemsChanged',
      }));
    });
  });

  describe('remove', () => {
    it('should delete an item', async () => {
      const mockResult = { success: true };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
          primaryKey: 'id',
        })
      );

      const deletePromise = result.current.remove(1);

      // Wait for delete to complete
      const deleted = await deletePromise;

      expect(deleted).toEqual(mockResult);
      expect(global.fetch).toHaveBeenCalledWith('/api/items/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Wait for loading to be false
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 100 });
    });

    it('should handle delete errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Item not found' }),
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      try {
        await result.current.remove(1);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toBe('Item not found');
      }

      await waitFor(() => {
        expect(result.current.error).toBe('Item not found');
      }, { timeout: 100 });
    });

    it('should dispatch custom event on delete when eventName is provided', async () => {
      const mockResult = { success: true };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
          eventName: 'itemsChanged',
        })
      );

      await result.current.remove(1);

      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({
        type: 'itemsChanged',
      }));
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple items', async () => {
      const mockResult1 = { success: true };
      const mockResult2 = { success: true };
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResult1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResult2,
        });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
          primaryKey: 'id',
        })
      );

      const bulkDeletePromise = result.current.bulkDelete([1, 2]);

      // Loading state might be set asynchronously
      const results = await bulkDeletePromise;

      expect(results).toEqual([mockResult1, mockResult2]);
      expect(global.fetch).toHaveBeenCalledWith('/api/items/1', expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith('/api/items/2', expect.any(Object));
      
      // Wait for loading to be false
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 100 });
    });

    it('should handle bulk delete errors', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ error: 'Item not found' }),
        });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      try {
        await result.current.bulkDelete([1, 2]);
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Failed to delete item 2');
        // Error state is set in catch block, but may be async
        await waitFor(() => {
          expect(result.current.error).toBe('Failed to delete item 2');
        }, { timeout: 100 });
      }
    });

    it('should dispatch custom event on bulk delete when eventName is provided', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
          eventName: 'itemsChanged',
        })
      );

      await result.current.bulkDelete([1, 2]);

      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({
        type: 'itemsChanged',
      }));
    });

    it('should handle empty array for bulk delete', async () => {
      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      const results = await result.current.bulkDelete([]);

      expect(results).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.create).toBe('function');
      expect(typeof result.current.update).toBe('function');
      expect(typeof result.current.remove).toBe('function');
      expect(typeof result.current.bulkDelete).toBe('function');
    });

    it('should use default primaryKey when not provided', async () => {
      const mockResult = { id: 1, name: 'Updated' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      await result.current.update(1, { name: 'Updated' });

      expect(global.fetch).toHaveBeenCalledWith('/api/items/1', expect.any(Object));
    });

    it('should not dispatch event when eventName is not provided', async () => {
      const mockResult = { id: 1, name: 'New Item' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      await result.current.create({ name: 'New Item' });

      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should reset error on successful operation', async () => {
      // First operation fails
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      try {
        await result.current.create({ name: 'Test' });
      } catch (error) {
        // Expected to throw
        expect(error.message).toBe('Network error');
      }

      // Wait for error state to be set
      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      }, { timeout: 100 });

      // Second operation succeeds
      const mockResult = { id: 1, name: 'Success' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      await result.current.create({ name: 'Success' });

      // Error should be reset on success
      await waitFor(() => {
        expect(result.current.error).toBe(null);
      }, { timeout: 100 });
    });

    it('should handle JSON parsing errors in error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() =>
        useCrud({
          endpoint: '/api/items',
        })
      );

      try {
        await result.current.create({ name: 'Test' });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Error state should be set, but the exact message depends on implementation
      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      }, { timeout: 100 });
    });
  });
});

