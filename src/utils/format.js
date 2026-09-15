export function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const MATERIAL_TYPE_LABEL = {
  pdf: 'PDF',
  video: 'Video',
  youtube: 'YouTube',
  md: 'Assignment',
}

export function materialTypeLabel(type) {
  return MATERIAL_TYPE_LABEL[type] || type
}

const MATERIAL_TYPE_ICON = {
  pdf: '📄',
  video: '🎬',
  youtube: '▶️',
  md: '📝',
}

export function materialTypeIcon(type) {
  return MATERIAL_TYPE_ICON[type] || '📎'
}

export function youTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let videoId = ''
    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace('/', '')
    } else {
      videoId = parsed.searchParams.get('v') || ''
    }
    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return url
  }
}
