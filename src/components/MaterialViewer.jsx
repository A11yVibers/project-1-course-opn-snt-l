import ReactMarkdown from 'react-markdown'
import { youTubeEmbedUrl } from '../utils/format.js'

export default function MaterialViewer({ course, material, onClear }) {
  if (!material) {
    return (
      <div className="viewer">
        <div className="viewer__image" style={{ backgroundImage: `url(${course.imageUrl})` }} />
        <div className="viewer__caption">
          <h2>{course.name}</h2>
          <p>Select a class material from the syllabus to view it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="viewer">
      <div className="viewer__toolbar">
        <span className="viewer__title">{material.title}</span>
        <button className="viewer__close" onClick={onClear} aria-label="Return to course image">
          ✕ Close
        </button>
      </div>
      <div className="viewer__content">
        {material.type === 'pdf' && <iframe title={material.title} src={material.url} className="viewer__frame" />}
        {material.type === 'video' && (
          <video className="viewer__video" src={material.url} controls preload="metadata" />
        )}
        {material.type === 'youtube' && (
          <iframe
            title={material.title}
            src={youTubeEmbedUrl(material.url)}
            className="viewer__frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {material.type === 'md' && (
          <div className="viewer__markdown">
            <ReactMarkdown>{material.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
