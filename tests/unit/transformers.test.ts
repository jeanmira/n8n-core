/**
 * Unit tests for transformers
 */

import {
  normalizeString,
  formatCPF,
  formatCNPJ,
  formatPhoneBR,
  formatCurrencyBRL,
  formatDateBR,
  objectToQueryString,
  deepClone,
  removeEmpty,
} from '../../custom-nodes/src/utils/transformers';

describe('Transformers', () => {
  describe('normalizeString', () => {
    it('should normalize string', () => {
      expect(normalizeString('Café')).toBe('cafe');
      expect(normalizeString('São Paulo')).toBe('sao paulo');
    });
  });

  describe('formatCPF', () => {
    it('should format CPF', () => {
      expect(formatCPF('11144477735')).toBe('111.444.777-35');
    });
  });

  describe('formatCNPJ', () => {
    it('should format CNPJ', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    });
  });

  describe('formatPhoneBR', () => {
    it('should format Brazilian phone', () => {
      expect(formatPhoneBR('11999999999')).toBe('(11) 99999-9999');
      expect(formatPhoneBR('1133333333')).toBe('(11) 3333-3333');
    });
  });

  describe('formatCurrencyBRL', () => {
    it('should format currency', () => {
      const formatted = formatCurrencyBRL(1234.56);
      expect(formatted).toContain('1.234,56');
    });
  });

  describe('formatDateBR', () => {
    it('should format date', () => {
      const date = new Date('2025-10-30');
      const formatted = formatDateBR(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('objectToQueryString', () => {
    it('should convert object to query string', () => {
      const obj = { name: 'John', age: 30 };
      expect(objectToQueryString(obj)).toBe('name=John&age=30');
    });

    it('should skip null/undefined values', () => {
      const obj = { name: 'John', age: null, city: undefined };
      expect(objectToQueryString(obj)).toBe('name=John');
    });
  });

  describe('deepClone', () => {
    it('should deep clone object', () => {
      const obj = { name: 'John', address: { city: 'SP' } };
      const cloned = deepClone(obj);
      cloned.address.city = 'RJ';
      expect(obj.address.city).toBe('SP');
    });
  });

  describe('removeEmpty', () => {
    it('should remove empty properties', () => {
      const obj = { name: 'John', age: null, city: '', active: true };
      const result = removeEmpty(obj);
      expect(result).toEqual({ name: 'John', active: true });
    });
  });
});
