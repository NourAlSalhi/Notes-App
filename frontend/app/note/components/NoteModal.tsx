// ./note/components/NoteModal.tsx
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function NoteModal({ note, onClose, onSave }: NoteModalProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isEditing, setIsEditing] = useState(!!note);
  const isCreating = !note;

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setIsEditing(!!note);
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content cannot be empty.");
      return;
    }
    try {
      await onSave({ title, content }, note?._id);
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error(
        `Failed to save note: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isCreating
            ? "Create New Note"
            : isEditing
            ? "Edit Note"
            : "Note Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isEditing && !isCreating}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={6}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!isEditing && !isCreating}
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            {!isCreating && !isEditing && (
              <button
                type="button"
                onClick={handleToggleEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
            )}

            {(isCreating || isEditing) && (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isCreating || isEditing ? "Cancel" : "Close"}
            </button>
          </div>
          {note && !isCreating && (
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Created:{" "}
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                Updated:{" "}
                {note.updatedAt
                  ? new Date(note.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
