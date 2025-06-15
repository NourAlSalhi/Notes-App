'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
}

// Temporary mock notes list (normally you'd get from DB or localStorage)
const mockNotes: Note[] = [
  { id: 1, title: 'First Note', content: 'This is the full content of the first note.' },
  { id: 2, title: 'Second Note', content: 'This is the full content of the second note.' },
];

export default function NoteDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const noteId = Number(id);
    const foundNote = mockNotes.find((n) => n.id === noteId);
    setNote(foundNote || null);
  }, [id]);

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Note not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{note.title}</h1>
        <p className="text-gray-700 whitespace-pre-line">{note.content}</p>

        <button
          onClick={() => router.back()}
          className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back
        </button>
      </div>
    </div>
  );
}
