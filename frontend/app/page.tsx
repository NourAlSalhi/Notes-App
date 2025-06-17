"use client";

import { useState, useEffect } from "react";
import NoteCard from "./note/components/NoteCard";
import NoteModal from "./note/components/NoteModal";
import { API_BASE_URL } from "@/data";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function HomePage() {
  const token = localStorage.getItem("token");

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) {
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const openModal = (note?: Note) => {
    setSelectedNote(note || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleSave = async (newNote: { title: string; content: string }) => {
    if (selectedNote) {
      try {
        const res = await fetch(`${API_BASE_URL}/notes/${selectedNote.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newNote),
        });
        if (!res.ok) throw new Error("Failed to update note");
        const updatedNote = await res.json();
        setNotes(
          notes.map((n) => (n.id === selectedNote.id ? updatedNote : n))
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/notes`, {
          method: "POST",
         headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newNote),
        });
        if (!res.ok) throw new Error("Failed to create note");
        const createdNote = await res.json();
        setNotes([...notes, createdNote]);
      } catch (err) {
        console.error(err);
      }
    }
    closeModal();
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Your Notes
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading notes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => openModal(note)}
              onDelete={() => handleDelete(note.id)}
            />
          ))}
        </div>
      )}

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
          onSave={handleSave}
        />
      )}
    </div>
  );
}
