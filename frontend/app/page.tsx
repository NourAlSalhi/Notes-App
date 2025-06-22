"use client";
import { useState } from "react";
import NoteCard from "./note/components/NoteCard";
import NoteModal from "./note/components/NoteModal";
import { toast } from "@/lib/react-hot-toast";
import { useRouter } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";

export default function HomePage() {
  const router = useRouter();
  const { notes, loading, handleSave, handleDelete } = useNotes();

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

  const handleSaveAndCloseModal = async (
    noteData: { title: string; content: string },
    id?: string
  ) => {
    try {
      const savedNote = await handleSave(noteData, id);
      closeModal();
      if (!id && savedNote) {
        openModal(savedNote); 
      }

    } catch (error) {
      console.error("Error saving note in component:", error);
    }
  };
  const handleDeleteWithConfirmation = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this note?");
    if (!isConfirmed) {
      return;
    }
    try {
      await handleDelete(id);
    } catch (error) {
      console.error("Error deleting note in component:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/sign-in");
    toast.success("You have been logged out.");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-100 p-4 flex font-semibold justify-between">
        <h1 className="text-xl text-gray-800">All Notes</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
          Logout
        </button>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading notes...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.length === 0 ? ( 
              <p className="col-span-full text-center text-gray-500">
                No notes found. Click the '+' button to create one!
              </p>
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
                  onDelete={() => handleDeleteWithConfirmation(note._id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => openModal()}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-3xl rounded-full p-4 shadow-lg"
        aria-label="Add Note"
      >
        +
      </button>

      {isModalOpen && (
        <NoteModal
          note={selectedNote}
          onClose={closeModal}
          onSave={handleSaveAndCloseModal}
        />
      )}
    </div>
  );
}