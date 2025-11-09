import { describe, it, expect } from 'vitest';
import { normalizeText, toTitleCase, normalizeAreaGroup, parseExperience, truncate } from '../textUtils';

describe('textUtils', () => {
  describe('normalizeText', () => {
    it('should normalize text to lowercase and trim', () => {
      expect(normalizeText('  HELLO WORLD  ')).toBe('hello world');
      expect(normalizeText('Test   Multiple   Spaces')).toBe('test multiple spaces');
    });

    it('should handle empty strings', () => {
      expect(normalizeText('')).toBe('');
      expect(normalizeText(null)).toBe('');
      expect(normalizeText(undefined)).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('should convert text to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
      expect(toTitleCase('hELLo wOrLd')).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      expect(toTitleCase('')).toBe('');
      expect(toTitleCase(null)).toBe('');
    });
  });

  describe('normalizeAreaGroup', () => {
    it('should normalize area group names', () => {
      expect(normalizeAreaGroup('Surabaya 1')).toBe('Surabaya');
      expect(normalizeAreaGroup('Jakarta - 2')).toBe('Jakarta');
      expect(normalizeAreaGroup('Bandung Area')).toBe('Bandung');
      expect(normalizeAreaGroup('Medan Kota')).toBe('Medan');
    });

    it('should handle roman numerals', () => {
      expect(normalizeAreaGroup('Jakarta I')).toBe('Jakarta');
      expect(normalizeAreaGroup('Jakarta II')).toBe('Jakarta');
      expect(normalizeAreaGroup('Jakarta III')).toBe('Jakarta');
    });

    it('should handle empty or null values', () => {
      expect(normalizeAreaGroup('')).toBe('Unknown');
      expect(normalizeAreaGroup(null)).toBe('Unknown');
      expect(normalizeAreaGroup(undefined)).toBe('Unknown');
    });
  });

  describe('parseExperience', () => {
    it('should parse experience string to number', () => {
      expect(parseExperience('5 Tahun')).toBe(5);
      expect(parseExperience('3 Tahun 6 Bulan')).toBeCloseTo(3.5);
      expect(parseExperience('10 Bulan')).toBeCloseTo(0.833, 2);
    });

    it('should handle empty strings', () => {
      expect(parseExperience('')).toBe(0);
      expect(parseExperience(null)).toBe(0);
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      expect(truncate('Short text', 20)).toBe('Short text');
    });

    it('should handle empty strings', () => {
      expect(truncate('', 20)).toBe('');
      expect(truncate(null, 20)).toBe('');
    });
  });
});

