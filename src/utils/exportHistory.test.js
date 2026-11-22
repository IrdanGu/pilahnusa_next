import { describe, expect, it } from 'vitest';
import { exportHistoryAsCSV, exportHistoryAsJSON } from './exportHistory';

const readBlob = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = reject;
  reader.readAsText(blob);
});

describe('history export', () => {
  it('returns JSON without base64 blobs', async () => {
    const blob = exportHistoryAsJSON([{ id:'1', imageBase64:'SECRET', result:{ name:'Botol' } }]);
    expect(await readBlob(blob)).not.toContain('SECRET');
  });

  it('returns UTF-8 CSV with escaped values', async () => {
    const blob = exportHistoryAsCSV([{ id:'1', result:{ name:'Botol, "Besar"', category:'Anorganik' } }]);
    const text = await readBlob(blob);
    expect(text).toContain('Botol, ""Besar""');
  });
});
