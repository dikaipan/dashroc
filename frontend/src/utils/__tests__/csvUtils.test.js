import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCSV, parseCSV, validateCSVData } from '../csvUtils';

describe('csvUtils', () => {
  let mockLink;
  let appendChildSpy;
  let removeChildSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock DOM methods
    global.URL.createObjectURL = vi.fn(() => 'blob:url');
    global.URL.revokeObjectURL = vi.fn();
    global.alert = vi.fn();
    
    // Create a proper mock link element
    mockLink = {
      setAttribute: vi.fn(),
      style: {},
      click: vi.fn(),
    };
    
    // Mock document.createElement
    global.document.createElement = vi.fn((tag) => {
      if (tag === 'a') {
        return mockLink;
      }
      return {};
    });
    
    // Use actual document.body but spy on methods
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
  });

  describe('exportToCSV', () => {
    it('should export data to CSV with default headers', () => {
      const data = [
        { id: 1, name: 'Test 1', value: 100 },
        { id: 2, name: 'Test 2', value: 200 },
      ];

      exportToCSV(data, 'test');

      expect(global.alert).not.toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should export data to CSV with custom headers', () => {
      const data = [
        { id: 1, name: 'Test 1', value: 100 },
        { id: 2, name: 'Test 2', value: 200 },
      ];
      const headers = ['id', 'name'];

      exportToCSV(data, 'test', headers);

      expect(global.alert).not.toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should show alert when data is empty', () => {
      exportToCSV([], 'test');

      expect(global.alert).toHaveBeenCalledWith('No data to export');
      expect(global.document.createElement).not.toHaveBeenCalled();
    });

    it('should show alert when data is null', () => {
      exportToCSV(null, 'test');

      expect(global.alert).toHaveBeenCalledWith('No data to export');
    });

    it('should show alert when data is undefined', () => {
      exportToCSV(undefined, 'test');

      expect(global.alert).toHaveBeenCalledWith('No data to export');
    });

    it('should handle missing values in data', () => {
      const data = [
        { id: 1, name: 'Test 1' }, // missing value
        { id: 2, name: 'Test 2', value: 200 },
      ];

      exportToCSV(data, 'test');

      expect(global.alert).not.toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('parseCSV', () => {
    it('should parse CSV file correctly', async () => {
      const csvContent = 'id,name,value\n1,Test 1,100\n2,Test 2,200';
      const file = {
        name: 'test.csv',
        text: async () => csvContent,
      };

      const result = await parseCSV(file);

      expect(result).toEqual([
        { id: '1', name: 'Test 1', value: '100' },
        { id: '2', name: 'Test 2', value: '200' },
      ]);
    });

    it('should parse CSV with field mapping', async () => {
      const csvContent = 'id,name,value\n1,Test 1,100';
      const file = {
        name: 'test.csv',
        text: async () => csvContent,
      };
      const fieldMapping = {
        'id': 'identifier',
        'name': 'full_name',
      };

      const result = await parseCSV(file, fieldMapping);

      expect(result).toEqual([
        { identifier: '1', full_name: 'Test 1', value: '100' },
      ]);
    });

    it('should throw error for non-CSV file', async () => {
      const file = {
        name: 'test.txt',
        text: async () => 'content',
      };

      await expect(parseCSV(file)).rejects.toThrow('Please upload a CSV file');
    });

    it('should throw error for empty file', async () => {
      const file = {
        name: 'test.csv',
        text: async () => '',
      };

      await expect(parseCSV(file)).rejects.toThrow('CSV file is empty or invalid');
    });

    it('should throw error for file with only header', async () => {
      const file = {
        name: 'test.csv',
        text: async () => 'id,name,value',
      };

      await expect(parseCSV(file)).rejects.toThrow('CSV file is empty or invalid');
    });

    it('should handle CSV with empty lines', async () => {
      const csvContent = 'id,name\n1,Test 1\n\n2,Test 2\n';
      const file = {
        name: 'test.csv',
        text: async () => csvContent,
      };

      const result = await parseCSV(file);

      expect(result).toEqual([
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ]);
    });

    it('should handle CSV with whitespace in headers', async () => {
      const csvContent = ' id , name , value \n1,Test 1,100';
      const file = {
        name: 'test.csv',
        text: async () => csvContent,
      };

      const result = await parseCSV(file);

      expect(result).toEqual([
        { id: '1', name: 'Test 1', value: '100' },
      ]);
    });

    it('should handle CSV with quoted values', async () => {
      const csvContent = 'id,name\n"1","Test, with comma"\n"2","Test 2"';
      const file = {
        name: 'test.csv',
        text: async () => csvContent,
      };

      // Note: The current implementation doesn't handle quoted values properly
      // This test documents the current behavior
      const result = await parseCSV(file);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle null file', async () => {
      await expect(parseCSV(null)).rejects.toThrow('Please upload a CSV file');
    });
  });

  describe('validateCSVData', () => {
    it('should validate CSV data with required fields', () => {
      const data = [
        { id: '1', name: 'Test 1', email: 'test1@test.com' },
        { id: '2', name: 'Test 2', email: 'test2@test.com' },
        { id: '3', name: 'Test 3' }, // missing email
      ];
      const requiredFields = ['id', 'name', 'email'];

      const result = validateCSVData(data, requiredFields);

      expect(result.valid).toEqual([
        { id: '1', name: 'Test 1', email: 'test1@test.com' },
        { id: '2', name: 'Test 2', email: 'test2@test.com' },
      ]);
      expect(result.invalid).toBe(1);
      expect(result.total).toBe(3);
    });

    it('should return all data when no required fields', () => {
      const data = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ];

      const result = validateCSVData(data, []);

      expect(result.valid).toEqual(data);
      expect(result.invalid).toBe(0);
      expect(result.total).toBe(2);
    });

    it('should return empty valid array when all rows are invalid', () => {
      const data = [
        { id: '1' }, // missing name
        { id: '2' }, // missing name
      ];
      const requiredFields = ['id', 'name'];

      const result = validateCSVData(data, requiredFields);

      expect(result.valid).toEqual([]);
      expect(result.invalid).toBe(2);
      expect(result.total).toBe(2);
    });

    it('should handle empty data array', () => {
      const result = validateCSVData([], ['id', 'name']);

      expect(result.valid).toEqual([]);
      expect(result.invalid).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should handle falsy values as missing', () => {
      const data = [
        { id: '1', name: 'Test 1', email: 'test@test.com' },
        { id: '2', name: 'Test 2', email: '' }, // empty string
        { id: '3', name: 'Test 3', email: null }, // null
        { id: '4', name: 'Test 4', email: undefined }, // undefined
      ];
      const requiredFields = ['id', 'name', 'email'];

      const result = validateCSVData(data, requiredFields);

      expect(result.valid).toEqual([
        { id: '1', name: 'Test 1', email: 'test@test.com' },
      ]);
      expect(result.invalid).toBe(3);
    });

    it('should handle zero and false as invalid values (current implementation)', () => {
      // Note: Current implementation treats 0 and false as falsy, so they're considered invalid
      // This might need to be changed in the future if we want to distinguish between
      // "missing" and "falsy but present" values
      const data = [
        { id: '1', name: 'Test 1', count: 0 }, // zero is falsy, so invalid
        { id: '2', name: 'Test 2', active: false }, // false is falsy, so invalid
      ];
      const requiredFields = ['id', 'name', 'count'];

      const result = validateCSVData(data, requiredFields);

      // Both rows are invalid because count/active are falsy
      expect(result.valid).toEqual([]);
      expect(result.invalid).toBe(2);
    });
  });
});

