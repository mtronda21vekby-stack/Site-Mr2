'use client'

import { useState } from 'react'

export default function AdminPhotosPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [uploaded, setUploaded] = useState<string[]>([])

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const upload = async () => {
    if (!file) return

    const form = new FormData()
    form.append('file', file)

    setStatus('Uploading...')

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: form,
    })

    const data = await res.json()

    if (!res.ok) {
      setStatus(data.error || 'Upload failed')
      return
    }

    setUploaded((prev) => [data.url, ...prev])
    setStatus('Uploaded')
    setFile(null)
    setPreview(null)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-4">Photo Upload</h1>

      <input type="file" accept="image/*" onChange={onSelect} />

      {preview && (
        <div className="mt-4">
          <img src={preview} className="w-64 border" />
        </div>
      )}

      <button onClick={upload} className="mt-4 px-4 py-2 border">
        Upload
      </button>

      <div className="mt-2">{status}</div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {uploaded.map((url, i) => (
          <img key={i} src={url} className="w-full border" />
        ))}
      </div>
    </div>
  )
}
