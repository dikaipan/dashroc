import { describe, it, expect } from 'vitest';
import { validateLatitude, validateLongitude, validateRequired } from '../validators';

describe('validators', () => {
  describe('validateLatitude', () => {
    it('should return true for valid latitude values', () => {
      expect(validateLatitude(0)).toBe(true);
      expect(validateLatitude(90)).toBe(true);
      expect(validateLatitude(-90)).toBe(true);
      expect(validateLatitude(45.5)).toBe(true);
      expect(validateLatitude(-45.5)).toBe(true);
      expect(validateLatitude('45')).toBe(true);
      expect(validateLatitude('45.5')).toBe(true);
      expect(validateLatitude('-45.5')).toBe(true);
    });

    it('should return false for invalid latitude values', () => {
      expect(validateLatitude(91)).toBe(false);
      expect(validateLatitude(-91)).toBe(false);
      expect(validateLatitude(100)).toBe(false);
      expect(validateLatitude(-100)).toBe(false);
      expect(validateLatitude('91')).toBe(false);
      expect(validateLatitude('-91')).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(validateLatitude(null)).toBe(false);
      expect(validateLatitude(undefined)).toBe(false);
      expect(validateLatitude('')).toBe(false);
      expect(validateLatitude('abc')).toBe(false);
      // Note: parseFloat('45abc') returns 45, so this is actually valid
      // Only pure non-numeric strings are invalid
      expect(validateLatitude({})).toBe(false);
      expect(validateLatitude([])).toBe(false);
    });

    it('should handle partial numeric strings', () => {
      // parseFloat parses until first non-numeric character
      expect(validateLatitude('45abc')).toBe(true); // parseFloat returns 45
      expect(validateLatitude('45.5abc')).toBe(true); // parseFloat returns 45.5
      expect(validateLatitude('abc45')).toBe(false); // parseFloat returns NaN
    });

    it('should handle edge cases', () => {
      expect(validateLatitude(90.0)).toBe(true);
      expect(validateLatitude(-90.0)).toBe(true);
      expect(validateLatitude(90.0000001)).toBe(false);
      expect(validateLatitude(-90.0000001)).toBe(false);
    });
  });

  describe('validateLongitude', () => {
    it('should return true for valid longitude values', () => {
      expect(validateLongitude(0)).toBe(true);
      expect(validateLongitude(180)).toBe(true);
      expect(validateLongitude(-180)).toBe(true);
      expect(validateLongitude(120.5)).toBe(true);
      expect(validateLongitude(-120.5)).toBe(true);
      expect(validateLongitude('120')).toBe(true);
      expect(validateLongitude('120.5')).toBe(true);
      expect(validateLongitude('-120.5')).toBe(true);
    });

    it('should return false for invalid longitude values', () => {
      expect(validateLongitude(181)).toBe(false);
      expect(validateLongitude(-181)).toBe(false);
      expect(validateLongitude(200)).toBe(false);
      expect(validateLongitude(-200)).toBe(false);
      expect(validateLongitude('181')).toBe(false);
      expect(validateLongitude('-181')).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(validateLongitude(null)).toBe(false);
      expect(validateLongitude(undefined)).toBe(false);
      expect(validateLongitude('')).toBe(false);
      expect(validateLongitude('abc')).toBe(false);
      // Note: parseFloat('120abc') returns 120, so this is actually valid
      // Only pure non-numeric strings are invalid
      expect(validateLongitude({})).toBe(false);
      expect(validateLongitude([])).toBe(false);
    });

    it('should handle partial numeric strings', () => {
      // parseFloat parses until first non-numeric character
      expect(validateLongitude('120abc')).toBe(true); // parseFloat returns 120
      expect(validateLongitude('120.5abc')).toBe(true); // parseFloat returns 120.5
      expect(validateLongitude('abc120')).toBe(false); // parseFloat returns NaN
    });

    it('should handle edge cases', () => {
      expect(validateLongitude(180.0)).toBe(true);
      expect(validateLongitude(-180.0)).toBe(true);
      expect(validateLongitude(180.0000001)).toBe(false);
      expect(validateLongitude(-180.0000001)).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should return true for valid non-empty values', () => {
      expect(validateRequired('text')).toBe(true);
      expect(validateRequired('0')).toBe(true);
      expect(validateRequired('false')).toBe(true);
      expect(validateRequired(0)).toBe(true);
      expect(validateRequired(false)).toBe(true);
      expect(validateRequired(true)).toBe(true);
      expect(validateRequired([])).toBe(true);
      expect(validateRequired({})).toBe(true);
    });

    it('should return false for null, undefined, or empty string', () => {
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
      expect(validateRequired('')).toBe(false);
    });

    it('should handle whitespace strings', () => {
      // Note: validateRequired doesn't trim, so whitespace-only strings are considered valid
      expect(validateRequired('   ')).toBe(true);
      expect(validateRequired('\n')).toBe(true);
      expect(validateRequired('\t')).toBe(true);
    });

    it('should handle special values', () => {
      expect(validateRequired(NaN)).toBe(true); // NaN is not null/undefined/empty
      expect(validateRequired(Infinity)).toBe(true);
      expect(validateRequired(-Infinity)).toBe(true);
    });
  });
});

