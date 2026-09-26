import { useEffect, useState } from 'react'
import { renderMarkdown } from '../lib/markdown.js'
import { MATERIAL_TYPE_LABELS } from '../data.js'

function getYouTubeEmbedUrl(url) {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  const longMatch = url.match(/[?&]v=([^&]+)/)
  const id = shortMatch?.[1] || longMatch?.[1]
  return id ? `https://www.youtube.com/embed/${id}` : url
}

function MarkdownDocument({ url }) {
  const [text, setText] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setText(null)
    setError(null)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load document')
        return res.text()
      })
      .then((content) => { if (!cancelled) setText(content) })
      .catch((err) => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [url])

  if (error) return <div className="material-error">Could not load this document.</div>
  if (text === null) return <div className="material-loading">Loading document…</div>
  return (
    <div className="markdown-view" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
  )
}

export default function MaterialViewer({ course, material }) {
  if (!material) {
    return (
      <div className="viewer-default">
        <img className="viewer-course-image" src={course.image_url} alt={course.name} />
        <div className="viewer-default-caption">
          <h2>{course.name}</h2>
          <p>Select any item from the syllabus to view lecture slides, readings, videos, and assignments here.</p>
        </div>
      </div>
    )
  }

  const typeLabel = MATERIAL_TYPE_LABELS[material.material_type] || 'Material'

  return (
    <div className="viewer-material">
      <div className="viewer-material-header">
        <span className="viewer-material-badge">{typeLabel}</span>
        <h2>{material.material_title}</h2>
      </div>
      <div className="viewer-material-body">
        {material.material_type === 'pdf' && (
          <iframe className="viewer-frame" title={material.material_title} src={material.url} />
        )}
        {material.material_type === 'video' && (
          <video className="viewer-video" src={material.url} controls />
        )}
        {material.material_type === 'youtube' && (
          <iframe
            className="viewer-frame"
            title={material.material_title}
            src={getYouTubeEmbedUrl(material.url)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {material.material_type === 'md' && <MarkdownDocument url={material.url} />}
        {!['pdf', 'video', 'youtube', 'md'].includes(material.material_type) && (
          <div className="viewer-fallback">
            <p>This material type isn't previewable yet.</p>
            <a href={material.url} target="_blank" rel="noreferrer">Open material in a new tab</a>
          </div>
        )}
      </div>
    </div>
  )
}
