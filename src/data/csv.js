// Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas,
// escaped quotes ("") and multi-line quoted values.
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      pushField()
    } else if (char === '\r') {
      // ignore, handled by \n
    } else if (char === '\n') {
      pushRow()
    } else {
      field += char
    }
  }

  // final field/row if file doesn't end with newline
  if (field.length > 0 || row.length > 0) {
    pushRow()
  }

  const header = rows.shift()
  return rows
    .filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''))
    .map((r) => {
      const obj = {}
      header.forEach((key, idx) => {
        obj[key] = r[idx] ?? ''
      })
      return obj
    })
}
