import React from "react";

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
      onClick={() => onView(note)}
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {note.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
      </div>
      <div className="flex justify-end space-x-2 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note._id);
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
