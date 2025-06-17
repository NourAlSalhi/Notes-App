interface Notes {
  _id: string;
  title: string;
  content: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
  onSave: (
    noteData: { title: string; content: string },
    id?: string
  ) => Promise<void>;
}

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

interface NoteDetails {
  id: number;
  title: string;
  content: string;
}
