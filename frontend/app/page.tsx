'use client';

import { useState } from 'react';
import NoteCard from './note/components/NoteCard';
import NoteModal from './note/components/NoteModal';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'First Note', content: 'This is the first note...' },
    { id: 2, title: 'Second Note', content: 'Another one here...' },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (note?: Note) => {
    setSelectedNote(note || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Notes</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => openModal(note)}
            onDelete={() => setNotes(notes.filter(n => n.id !== note.id))}
          />
        ))}
      </div>

      <button
        onClick={() => openModal()}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white text-3xl rounded-full p-4 shadow-lg"
        aria-label="Add Note"
      >
        +
      </button>

      {isModalOpen && (
        <NoteModal
          note={selectedNote}
          onClose={closeModal}
          onSave={(newNote) => {
            if (selectedNote) {
              setNotes(notes.map(n => n.id === selectedNote.id ? newNote : n));
            } else {
              setNotes([...notes, { ...newNote, id: Date.now() }]);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}
