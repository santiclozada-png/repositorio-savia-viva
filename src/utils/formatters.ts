export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
};

export const amountToWordsCOP = (amount: number): string => {
  if (!amount || amount === 0) return 'CERO PESOS M/CTE';
  
  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas1 = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  function convertGroup(n: number): string {
    let output = '';
    if (n === 100) return 'CIEN';
    if (n >= 100) {
      output += centenas[Math.floor(n / 100)] + ' ';
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      output += decenas1[n - 10] + ' ';
    } else if (n >= 20) {
      const d = Math.floor(n / 10);
      const u = n % 10;
      if (d === 2 && u > 0) {
        output += 'VEINTI' + unidades[u] + ' ';
      } else {
        output += decenas[d] + (u > 0 ? ' Y ' + unidades[u] : '') + ' ';
      }
    } else if (n > 0) {
      output += unidades[n] + ' ';
    }
    return output.trim();
  }

  const millions = Math.floor(amount / 1000000);
  const thousands = Math.floor((amount % 1000000) / 1000);
  const remainder = Math.floor(amount % 1000);

  let result = '';
  if (millions > 0) {
    if (millions === 1) result += 'UN MILLON ';
    else result += convertGroup(millions) + ' MILLONES ';
  }
  if (thousands > 0) {
    if (thousands === 1) result += 'MIL ';
    else result += convertGroup(thousands) + ' MIL ';
  }
  if (remainder > 0) {
    result += convertGroup(remainder) + ' ';
  }

  return (result.trim() + ' PESOS M/CTE').toUpperCase();
};

export const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || !rows.length) return;
  const separator = ';';
  const keys = Object.keys(rows[0]);
  
  const csvContent =
    '\uFEFF' + // UTF-8 BOM so Excel opens accented characters like ñ and tildes properly
    keys.join(separator) +
    '\n' +
    rows
      .map((row) =>
        keys
          .map((k) => {
            let val = row[k] === null || row[k] === undefined ? '' : row[k];
            if (typeof val === 'string') {
              val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(separator)
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
