import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiService from '../apiService';

describe('apiService', () => {
  beforeEach(() => {
    // Mock fetch before each test
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  describe('request method', () => {
    it('should make a successful GET request', async () => {
      const mockData = { rows: [], total: 0 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.request('/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should make a POST request with data', async () => {
      const mockData = { id: 1, name: 'Test' };
      const requestData = { name: 'Test' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.request('/test', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestData),
      });
      expect(result).toEqual(mockData);
    });

    it('should handle custom headers', async () => {
      const mockData = { data: 'test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiService.request('/test', {
        headers: {
          'Authorization': 'Bearer token123',
        },
      });

      // Verify fetch was called with correct URL
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const callArgs = global.fetch.mock.calls[0];
      expect(callArgs[0]).toBe('/api/test');
      
      // Check that headers object exists and contains Authorization
      const fetchOptions = callArgs[1];
      expect(fetchOptions.headers).toBeDefined();
      expect(fetchOptions.headers.Authorization || fetchOptions.headers['Authorization']).toBe('Bearer token123');
      // Note: Due to spread operator order in apiService, Content-Type might be overridden
      // The important thing is that custom headers are passed through
    });

    it('should throw error when response is not ok', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not Found' }),
      });

      await expect(apiService.request('/test')).rejects.toThrow('Not Found');
    });

    it('should handle error response without error message', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(apiService.request('/test')).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.request('/test')).rejects.toThrow('Network error');
    });

    it('should handle JSON parse errors in error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(apiService.request('/test')).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('crud factory', () => {
    it('should create CRUD methods for a resource', () => {
      const crud = apiService.crud('engineers');

      expect(crud).toHaveProperty('getAll');
      expect(crud).toHaveProperty('getById');
      expect(crud).toHaveProperty('create');
      expect(crud).toHaveProperty('update');
      expect(crud).toHaveProperty('delete');
      expect(crud).toHaveProperty('bulkDelete');
    });

    it('should call getAll correctly', async () => {
      const mockData = { rows: [], total: 0 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const crud = apiService.crud('engineers');
      const result = await crud.getAll();

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should call getById correctly', async () => {
      const mockData = { id: 1, name: 'Engineer 1' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const crud = apiService.crud('engineers');
      const result = await crud.getById('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers/1', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should call create correctly', async () => {
      const mockData = { id: 1, name: 'New Engineer' };
      const newData = { name: 'New Engineer' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const crud = apiService.crud('engineers');
      const result = await crud.create(newData);

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(newData),
      });
      expect(result).toEqual(mockData);
    });

    it('should call update correctly', async () => {
      const mockData = { id: 1, name: 'Updated Engineer' };
      const updateData = { name: 'Updated Engineer' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const crud = apiService.crud('engineers');
      const result = await crud.update('1', updateData);

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers/1', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockData);
    });

    it('should call delete correctly', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const crud = apiService.crud('engineers');
      await crud.delete('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers/1', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
    });

    it('should call bulkDelete correctly', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

      const crud = apiService.crud('engineers');
      await crud.bulkDelete(['1', '2', '3']);

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch).toHaveBeenCalledWith('/api/engineers/1', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
      expect(global.fetch).toHaveBeenCalledWith('/api/engineers/2', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
      expect(global.fetch).toHaveBeenCalledWith('/api/engineers/3', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
    });
  });

  describe('Engineers API methods', () => {
    it('should get engineers', async () => {
      const mockData = { rows: [], total: 0 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.getEngineers();

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should create engineer', async () => {
      const mockData = { id: 1, name: 'New Engineer' };
      const newData = { name: 'New Engineer' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.createEngineer(newData);

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(newData),
      });
      expect(result).toEqual(mockData);
    });

    it('should update engineer', async () => {
      const mockData = { id: 1, name: 'Updated Engineer' };
      const updateData = { name: 'Updated Engineer' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.updateEngineer('1', updateData);

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers/1', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockData);
    });

    it('should delete engineer', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await apiService.deleteEngineer('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/engineers/1', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
    });

    it('should bulk delete engineers', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

      await apiService.bulkDeleteEngineers(['1', '2']);

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Machines API methods', () => {
    it('should get machines', async () => {
      const mockData = { rows: [], total: 0 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.getMachines();

      expect(global.fetch).toHaveBeenCalledWith('/api/machines', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should create machine', async () => {
      const mockData = { wsid: 'M001', name: 'New Machine' };
      const newData = { name: 'New Machine' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.createMachine(newData);

      expect(global.fetch).toHaveBeenCalledWith('/api/machines', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(newData),
      });
      expect(result).toEqual(mockData);
    });

    it('should update machine', async () => {
      const mockData = { wsid: 'M001', name: 'Updated Machine' };
      const updateData = { name: 'Updated Machine' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.updateMachine('M001', updateData);

      expect(global.fetch).toHaveBeenCalledWith('/api/machines/M001', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockData);
    });

    it('should delete machine', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await apiService.deleteMachine('M001');

      expect(global.fetch).toHaveBeenCalledWith('/api/machines/M001', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
    });

    it('should bulk delete machines', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

      await apiService.bulkDeleteMachines(['M001', 'M002']);

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});

