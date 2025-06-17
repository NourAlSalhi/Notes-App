// ./note/components/NoteCard.tsx
import React from "react";

interface Note {
  _id: string; // Use _id
  title: string;
  content: string;
}

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void; // New prop for viewing (opens modal in view mode)
  onEdit: (note: Note) => void; // Keeps explicit edit action, but can merge with onView
  onDelete: (id: string) => void; // Pass _id directly
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onView, onEdit, onDelete }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
      onClick={() => onView(note)} // Click the card to view details
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
      </div>
      <div className="flex justify-end space-x-2 mt-auto"> {/* Added mt-auto for alignment */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click from firing
            onEdit(note); // Pass entire note for edit
          }}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click from firing
            onDelete(note._id); // Pass _id for deletion
          }}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;