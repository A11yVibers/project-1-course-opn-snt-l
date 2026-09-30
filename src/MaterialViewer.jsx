import { useMemo } from 'react'
import { marked } from 'marked'

function youtubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    let id = ''
    if (u.hostname.includes('youtu.be')) {
      id = u.pathname.replace('/', '')
    } else {
      id = u.searchParams.get('v') || ''
    }
    return id ? `https://www.youtube.com/embed/${id}` : url
  } catch {
    return url
  }
}

export default function MaterialViewer({ material, fallbackImage, courseName, onClose }) {
  const html = useMemo(() => {
    if (material?.material_type === 'md' && material.raw) {
      return marked.parse(material.raw)
    }
    return null
  }, [material])

  if (!material) {
    return (
      <div className="material-viewer material-viewer--image">
        <img src={fallbackImage} alt={courseName} />
        <div className="material-viewer__hint">
          Select a class material from the syllabus to view it here.
        </div>
      </div>
    )
  }

  return (
    <div className="material-viewer">
      <div className="material-viewer__bar">
        <span className="material-viewer__title">{material.material_title}</span>
        <button className="material-viewer__close" onClick={onClose} title="Back to course image">
          ✕
        </button>
      </div>
      <div className="material-viewer__body">
        {material.material_type === 'pdf' && material.url && (
          <iframe title={material.material_title} src={material.url} className="material-viewer__frame" />
        )}
        {material.material_type === 'video' && material.url && (
          <video controls src={material.url} className="material-viewer__video" />
        )}
        {material.material_type === 'youtube' && (
          <iframe
            title={material.material_title}
            src={youtubeEmbedUrl(material.url)}
            className="material-viewer__frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {material.material_type === 'md' && html && (
          <div className="material-viewer__markdown" dangerouslySetInnerHTML={{ __html: html }} />
        )}
        {!material.url && material.material_type !== 'md' && (
          <div className="material-viewer__missing">Material file not found.</div>
        )}
      </div>
    </div>
  )
}
