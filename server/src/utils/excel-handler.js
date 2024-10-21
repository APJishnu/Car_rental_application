import * as XLSX from 'xlsx';

async function getExcelBuffer(createReadStream) {
  const stream = createReadStream();
  
  const buffer = await new Promise((resolve, reject) => {
    const data = [];
    stream.on('data', (chunk) => data.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(data)));
    stream.on('error', reject);
  });

  return buffer;
}

async function parseExcel(buffer) {
  const workbook = XLSX.read(buffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  return jsonData;
}

// Export the functions as a default export
export default {
  getExcelBuffer,
  parseExcel,
};
