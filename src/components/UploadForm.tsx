'use client'

import { useState } from 'react'

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null)
    const [jobDescription, setJobDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setIsLoading(true)
        setError(null)
        setResult(null)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('jobDescription', jobDescription)

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`)
            }

            const data = await res.json()
            setResult(data)
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Resume PDF
                    </label>
                    <div className="mt-2">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Job Description
                    </label>
                    <div className="mt-2">
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={4}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Paste the job description here..."
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !file}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Resume'}
                </button>

                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}
            </form>

            {result && (
                <div className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-2xl font-bold">Analysis Result</h2>
                        <div className={`text-4xl font-bold ${result.score >= 70 ? 'text-green-600' : result.score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {result.score}/100
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{result.feedback}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-green-600 mb-2">Matched Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.matched_keywords?.map((kw: string) => (
                                    <span key={kw} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{kw}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-600 mb-2">Missing Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_keywords?.map((kw: string) => (
                                    <span key={kw} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {result.rewritten_bullets && result.rewritten_bullets.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Suggested Improvements</h3>
                            <div className="space-y-4">
                                {result.rewritten_bullets.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-200">
                                        <div className="text-red-700 line-through text-sm mb-1">{item.original}</div>
                                        <div className="text-green-700 text-sm font-medium">{item.new}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}
