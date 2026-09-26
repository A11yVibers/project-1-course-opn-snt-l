// Small, dependency-free Markdown-to-HTML renderer covering the subset of
// syntax used in course assignment files: headings, bold/italic, links,
// unordered/ordered lists, tables, and paragraphs.
function inline(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
}

export function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const html = []
  let i = 0
  let listBuffer = null // { type: 'ul'|'ol', items: [] }

  const flushList = () => {
    if (!listBuffer) return
    const tag = listBuffer.type
    html.push(`<${tag}>${listBuffer.items.map((item) => `<li>${inline(item)}</li>`).join('')}</${tag}>`)
    listBuffer = null
  }

  while (i < lines.length) {
    const line = lines[i]

    if (/^\s*$/.test(line)) { flushList(); i += 1; continue }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      flushList()
      const level = heading[1].length
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      i += 1; continue
    }

    if (/^\s*\|.*\|\s*$/.test(line) && lines[i + 1] && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      flushList()
      const parseCells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())
      const headerCells = parseCells(line)
      i += 2
      const bodyRows = []
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { bodyRows.push(parseCells(lines[i])); i += 1 }
      html.push('<table><thead><tr>' + headerCells.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>' +
        bodyRows.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
        '</tbody></table>')
      continue
    }

    const ordered = line.match(/^\s*\d+\.\s+(.*)$/)
    if (ordered) {
      if (!listBuffer || listBuffer.type !== 'ol') { flushList(); listBuffer = { type: 'ol', items: [] } }
      listBuffer.items.push(ordered[1])
      i += 1; continue
    }

    const unordered = line.match(/^\s*[-*]\s+(.*)$/)
    if (unordered) {
      if (!listBuffer || listBuffer.type !== 'ul') { flushList(); listBuffer = { type: 'ul', items: [] } }
      listBuffer.items.push(unordered[1])
      i += 1; continue
    }

    flushList()
    html.push(`<p>${inline(line)}</p>`)
    i += 1
  }
  flushList()
  return html.join('\n')
}
