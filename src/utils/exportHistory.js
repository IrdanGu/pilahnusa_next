const escapeCsv = (value) => {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const historyRows = (history = []) => (history || []).map((item) => ({
  id: item.id || '',
  name: item.result?.name || '',
  category: item.result?.category || '',
  timestamp: item.timestamp || '',
  confidence: item.result?.confidence ?? '',
  imagePresent: item.imageBase64 ? 'true' : 'false',
}));

export const exportHistoryAsJSON = (history = []) => {
  const safeHistory = (history || []).map(({ imageBase64, ...item }) => item);
  const blob = new Blob([JSON.stringify(safeHistory, null, 2)], { type: 'application/json;charset=utf-8' });
  return blob;
};

export const exportHistoryAsCSV = (history = []) => {
  const rows = historyRows(history);
  const header = ['id','name','category','timestamp','confidence','imagePresent'];
  const lines = [header.map(escapeCsv).join(','), ...rows.map((row) => header.map((key) => escapeCsv(row[key])).join(','))];
  const blob = new Blob(['\uFEFF', lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  return blob;
};
