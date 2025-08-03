'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Starting upload for file:', file.name, file.type, file.size);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/pitch-deck', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      console.log('Response length:', responseText.length);

      if (response.ok) {
        try {
          const result = JSON.parse(responseText);
          console.log('Parsed result:', result);
          setResult(result);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response that failed to parse:', responseText);
          setError(`JSON Parse Error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } else {
        try {
          const errorData = JSON.parse(responseText);
          setError(errorData.error || `Upload failed with status ${response.status}`);
        } catch (parseError) {
          console.error('Error response parse error:', parseError);
          setError(`Upload failed with status ${response.status}. Response: ${responseText}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Pitch Upload Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select PowerPoint or PDF file:
          </label>
          <input
            type="file"
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {uploading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700">Uploading... Please wait.</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-semibold text-red-700">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-700">Success!</h3>
            <pre className="text-sm text-green-600 mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Select a PowerPoint (.ppt/.pptx) or PDF file</li>
          <li>Check the browser console (F12) for detailed logs</li>
          <li>Look for any &quot;unexpected token&quot; or JSON parsing errors</li>
          <li>The response details will be shown above</li>
        </ol>
      </div>
    </div>
  );
}