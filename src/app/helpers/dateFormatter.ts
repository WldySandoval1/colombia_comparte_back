/**
 * Formatea una fecha al formato: "16 de Mayo de 2026"
 * @param date - Fecha a formatear (Date, string, o null)
 * @returns string formateado o el valor original si no es una fecha válida
 */
export function formatDate(date: any): any {
  if (!date) return date;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return date;
    }

    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const dia = dateObj.getDate();
    const mes = meses[dateObj.getMonth()];
    const año = dateObj.getFullYear();

    return `${dia} de ${mes} de ${año}`;
  } catch (error) {
    return date;
  }
}

/**
 * Recorre recursivamente un objeto y formatea todas las fechas
 * Solo procesa como fecha los campos cuyo nombre contiene palabras clave de fecha
 * @param obj - Objeto a procesar
 * @returns Objeto con fechas formateadas
 */
export function formatDatesInObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  // Si es Date, siempre formatea
  if (obj instanceof Date) {
    return formatDate(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => formatDatesInObject(item));
  }

  if (typeof obj === "object") {
    const formatted: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Solo formatear como fecha si:
        // 1. El campo es una Date instance, O
        // 2. El nombre del campo sugiere que es una fecha Y el valor es un string ISO válido
        if (obj[key] instanceof Date) {
          formatted[key] = formatDate(obj[key]);
        } else if (
          isDateField(key) &&
          typeof obj[key] === "string" &&
          isValidDateString(obj[key])
        ) {
          formatted[key] = formatDate(obj[key]);
        } else {
          formatted[key] = formatDatesInObject(obj[key]);
        }
      }
    }
    return formatted;
  }

  return obj;
}

/**
 * Verifica si un nombre de campo es típicamente un campo de fecha
 */
function isDateField(fieldName: string): boolean {
  const dateFieldPatterns = [
    "date",
    "fecha",
    "creacion",
    "created",
    "updated",
    "modificado",
    "actualizado",
    "deletedat",
  ];
  const lowerField = fieldName.toLowerCase();
  return dateFieldPatterns.some((pattern) => lowerField.includes(pattern));
}

/**
 * Verifica si un string parece una fecha ISO válida
 */
function isValidDateString(str: string): boolean {
  // Patrón ISO: YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss o YYYY-MM-DDTHH:mm:ss.sssZ
  const isoPattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  if (!isoPattern.test(str)) return false;

  const date = new Date(str);
  return date instanceof Date && !isNaN(date.getTime());
}
