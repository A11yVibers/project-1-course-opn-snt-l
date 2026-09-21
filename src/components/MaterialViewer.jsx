import { marked } from 'marked'

const MATERIAL_ICONS = {
  pdf: '📄',
  video: '🎬',
  youtube: '▶️',
  md: '📝',
  image: '🖼️',
}

export function materialIcon(material) {
  if (material.isYoutube) return MATERIAL_ICONS.youtube
  return MATERIAL_ICONS[material.type] || '📎'
}

function toYoutubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let videoId = ''
    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace('/', '')
    } else {
      videoId = parsed.searchParams.get('v') || ''
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  } catch {
    return url
  }
}

export default function MaterialViewer({ material, course }) {
  if (!material) {
    return (
      <div className="material-viewer material-viewer--default">
        <img
          className="material-viewer__course-image"
          src={course.imageUrl}
          alt={`Course image for ${course.name}`}
        />
        <div className="material-viewer__caption">
          <h2>{course.name}</h2>
          <p>Select a class material from the syllabus to view it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="material-viewer">
      <div className="material-viewer__header">
        <span className="material-viewer__icon" aria-hidden="true">
          {materialIcon(material)}
        </span>
        <h2>{material.title}</h2>
      </div>
      <div className="material-viewer__body">{renderMaterialBody(material)}</div>
    </div>
  )
}

function renderMaterialBody(material) {
  if (material.isYoutube) {
    return (
      <div className="material-viewer__video-wrap">
        <iframe
          className="material-viewer__iframe"
          src={toYoutubeEmbedUrl(material.url)}
          title={material.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  switch (material.type) {
    case 'pdf':
      return (
        <object data={material.url} type="application/pdf" className="material-viewer__pdf">
          <p>
            Unable to display PDF inline.{' '}
            <a href={material.url} target="_blank" rel="noreferrer">
              Open the PDF in a new tab
            </a>
            .
          </p>
        </object>
      )
    case 'video':
      return (
        <video className="material-viewer__video" controls src={material.url}>
          Your browser does not support embedded video.
        </video>
      )
    case 'md': {
      const html = material.text ? marked.parse(material.text) : ''
      return <div className="material-viewer__markdown" dangerouslySetInnerHTML={{ __html: html }} />
    }
    case 'image':
      return <img className="material-viewer__image" src={material.url} alt={material.title} />
    default:
      return (
        <p>
          <a href={material.url} target="_blank" rel="noreferrer">
            Open material
          </a>
        </p>
      )
  }
}
