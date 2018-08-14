/**
 * Copyright © 2018 Seth Livingston.
 * License: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * Converts a Date to a GDS-friendly YYYYMMDDHH string.
 *
 * @param date - date to convert
 */
function dateToYMDH(date: Date): string {
  logEntry("dateToYMDH", date);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  const h = date.getUTCHours();

  const ymdh = "" + y + m + d + h;

  logExit("dateToYMDH", ymdh);
  return ymdh;
}

/**
 * Converts a Date to a GDS-friendly YYYYMMDD string.
 *
 * @param date - date to convert
 */
function dateToYMD(date: Date): string {
  logEntry("dateToYMD", date);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const ymd = "" + y + m + d;

  logExit("dateToYMD", ymd);
  return ymd;
}

/**
 * Converts a Date to a GDS-friendly YYYYMM string.
 *
 * @param date - date to convert
 */
function dateToYM(date: Date): string {
  logEntry("dateToYM", date);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();

  const ym = "" + y + m;

  logExit("dateToYMD", ym);
  return ym;
}

/**
 * Left pads a number.
 *
 * See https://stackoverflow.com/a/10073788/521662.
 *
 * @param num - the number to pad
 * @param width - desired width
 * @param char - pad character, defaults to "0"
 */
function pad(numToPad: number, width: number, padChar: string): string {
  const char = padChar || "0";
  let num = numToPad + "";
  while (num.length < width) {
    num = "" + char + num;
  }

  return num;
}

/**
 * Extracts a subset of the SCHEMA array based on the requested field names.
 *
 * @param requestedFields - list of request fields via the 'name' property
 * @param schema - schema array will all fields
 */
function requestedFieldsToSchema(
  requestedFields: RequestedField[],
  schema: SchemaField[]
) {
  logEntry("requestedFieldsToSchema", requestedFields, schema);

  var subset = [];
  for (let i = 0; i < requestedFields.length; i++) {
    const field = requestedFields[i];
    for (let j = 0; j < schema.length; j++) {
      if (field.name === schema[j].name) {
        subset.push(schema[j]);
        break;
      }
    }
  }

  logExit("requestedFieldsToSchema", subset);
  return subset;
}
