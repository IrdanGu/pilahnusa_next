import { describe, expect, it } from 'vitest';
import { validateImageFile } from './imageUtils';

describe('image utilities', () => {
  it('accepts supported images', () => {
    expect(validateImageFile({ type:'image/jpeg', size:1000 })).toEqual({ valid:true, error:null });
  });

  it('rejects SVG and oversized files', () => {
    expect(validateImageFile({ type:'image/svg+xml', size:1000 }).valid).toBe(false);
    expect(validateImageFile({ type:'image/png', size:11 * 1024 * 1024 }).valid).toBe(false);
  });
});
