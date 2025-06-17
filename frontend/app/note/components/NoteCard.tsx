type NoteCardProps = {
  note: { id: number; title: string; content: string };
  onEdit: () => void;
  onDelete: () => void;
};

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-xl font-semibold">{note.title}</h2>
      <p className="text-gray-600">{note.content}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
