'use client';

import { useRouter } from 'next/navigation';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
}: {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();

  return (
    <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition">
      <div onClick={() => router.push(`/note/${note.id}`)}>
        <h2 className="font-semibold text-lg text-gray-800">{note.title}</h2>
        <p className="text-sm text-gray-600 mt-1 truncate">{note.content}</p>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button onClick={onEdit} className="text-blue-500 hover:underline text-sm">Edit</button>
        <button onClick={onDelete} className="text-red-500 hover:underline text-sm">Delete</button>
      </div>
    </div>
  );
}
