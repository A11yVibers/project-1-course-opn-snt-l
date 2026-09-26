// Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas,
// embedded newlines, and escaped double quotes ("").
export function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0
  const n = text.length

  const pushField = () => { row.push(field); field = '' }
  const pushRow = () => { pushField(); rows.push(row); row = [] }

  while (i < n) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue }
        inQuotes = false; i += 1; continue
      }
      field += char; i += 1; continue
    }
    if (char === '"') { inQuotes = true; i += 1; continue }
    if (char === ',') { pushField(); i += 1; continue }
    if (char === '\r') { i += 1; continue }
    if (char === '\n') { pushRow(); i += 1; continue }
    field += char; i += 1
  }
  if (field.length > 0 || row.length > 0) pushRow()

  const filtered = rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''))
  const [header, ...body] = filtered
  return body.map((cells) => {
    const record = {}
    header.forEach((key, idx) => { record[key] = cells[idx] ?? '' })
    return record
  })
}
