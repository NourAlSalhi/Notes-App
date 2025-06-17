"use client";
import { useState, useEffect } from "react";
import NoteCard from "./note/components/NoteCard";
import NoteModal from "./note/components/NoteModal";
import { API_BASE_URL } from "@/data";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const router = useRouter();

  const [notes, setNotes] = useState<Notes[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) {
        console.warn("No authentication token found. Please log in.");
        setLoading(false);
         toast.error("Please log in to view your notes.");
        router.push('/login');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch notes: ${res.status} ${errorText}`);
        }
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
        toast.error(`Failed to fetch notes: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  const openModal = (note?: Note) => {
    setSelectedNote(note || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null); 
  };

  const handleSave = async (newNoteData: { title: string; content: string }, id?: string) => {
    if (!token) {
      toast.error("Authentication required to save notes.");
      return;
    }
    try {
      let res;
      let savedNote: Note;

      if (id) {
        res = await fetch(`${API_BASE_URL}/notes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newNoteData),
        });
        if (!res.ok) throw new Error("Failed to update note");
        savedNote = await res.json();
        setNotes(notes.map((n) => (n._id === id ? savedNote : n)));
        toast.success("Note updated successfully!");
      } else {
        res = await fetch(`${API_BASE_URL}/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newNoteData),
        });
        if (!res.ok) throw new Error("Failed to create note");
        savedNote = await res.json();
        setNotes((prevNotes) => [...prevNotes, savedNote]);
        toast.success("Note created successfully!");
        closeModal(); 
        return;
      }
      closeModal();
    } catch (err) {
      console.error("Error saving note:", err);
      toast.error(`Failed to save note: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      toast.error("Authentication required to delete notes.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes(notes.filter((n) => n._id !== id));
      toast.success("Note deleted successfully!");
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error(`Failed to delete note: ${err instanceof Error ? err.message : String(err)}`);
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
          {notes.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No notes found. Click the '+' button to create one!</p>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onView={() => openModal(note)}
                onEdit={() => {
                  setSelectedNote(note);
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDelete(note._id)}
              />
            ))
          )}
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