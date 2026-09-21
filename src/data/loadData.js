import { parseCsv } from './csv.js'

import coursesCsvRaw from '../../project-assets/history_courses.csv?raw'
import classesCsvRaw from '../../project-assets/history_classes.csv?raw'
import instructorsCsvRaw from '../../project-assets/history_instructors.csv?raw'
import materialsCsvRaw from '../../project-assets/course_materials.csv?raw'

// URL map for binary/media material files (pdf, mp4, images, etc.)
const materialFileUrls = import.meta.glob('../../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Raw text map for markdown material files, so we can render them inline.
const materialFileText = import.meta.glob('../../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function resolveMaterialFile(filePath) {
  // filePath in the CSV is relative to project-assets/, e.g. "materials/foo.pdf"
  const filename = filePath.split('/').pop()

  const urlKey = Object.keys(materialFileUrls).find((k) => k.endsWith(`/${filename}`))
  const textKey = Object.keys(materialFileText).find((k) => k.endsWith(`/${filename}`))

  return {
    url: urlKey ? materialFileUrls[urlKey] : null,
    text: textKey ? materialFileText[textKey] : null,
  }
}

const instructorRows = parseCsv(instructorsCsvRaw)
const courseRows = parseCsv(coursesCsvRaw)
const classRows = parseCsv(classesCsvRaw)
const materialRows = parseCsv(materialsCsvRaw)

const instructorsById = new Map(instructorRows.map((row) => [row.instructor_id, row]))

function isYoutubeUrl(value) {
  return /youtu\.?be/.test(value)
}

const materials = materialRows
  .map((row) => {
    const isRemoteUrl = /^https?:\/\//.test(row.file_path)
    const resolved = isRemoteUrl ? { url: row.file_path, text: null } : resolveMaterialFile(row.file_path)

    return {
      id: row.material_id,
      courseId: row.course_id,
      classId: row.class_id,
      order: Number(row.display_order) || 0,
      title: row.material_title,
      type: row.material_type,
      isYoutube: row.material_type === 'youtube' || isYoutubeUrl(row.file_path),
      url: resolved.url,
      text: resolved.text,
    }
  })
  .sort((a, b) => a.order - b.order)

const materialsByClassId = materials.reduce((map, material) => {
  const list = map.get(material.classId) || []
  list.push(material)
  map.set(material.classId, list)
  return map
}, new Map())

const classes = classRows
  .map((row) => ({
    id: row.class_id,
    courseId: row.course_id,
    weekNumber: Number(row.week_number),
    date: row.date,
    name: row.class_name,
    materials: materialsByClassId.get(row.class_id) || [],
  }))
  .sort((a, b) => (a.weekNumber - b.weekNumber) || a.date.localeCompare(b.date))

const classesByCourseId = classes.reduce((map, klass) => {
  const list = map.get(klass.courseId) || []
  list.push(klass)
  map.set(klass.courseId, list)
  return map
}, new Map())

export const courses = courseRows.map((row) => ({
  id: row.course_id,
  name: row.name,
  shortDescription: row.short_description,
  longDescription: row.long_description,
  numberOfClasses: Number(row.number_of_classes),
  numberOfWeeks: Number(row.number_of_weeks),
  imageUrl: row.image_url,
  instructor: instructorsById.get(row.instructor_id) || null,
  classes: classesByCourseId.get(row.course_id) || [],
}))

export const instructors = instructorRows

export function getCourseById(courseId) {
  return courses.find((course) => course.id === courseId) || null
}
