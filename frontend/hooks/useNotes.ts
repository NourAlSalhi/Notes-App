// src/hooks/useNotes.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/lib/react-hot-toast";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/data";

interface UseNotesResult {
  notes: Note[];
  loading: boolean;
  fetchNotes: () => Promise<void>;
  handleSave: (noteData: { title: string; content: string }, id?: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export const useNotes = (): UseNotesResult => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!token) {
      console.warn("No authentication token found. Redirecting to login.");
      setLoading(false);
      toast.error("Please log in to view your notes.");
      router.push("/sign-in");
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
      toast.error(
        `Failed to fetch notes: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSave = useCallback(
    async (noteData: { title: string; content: string }, id?: string) => {
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
            body: JSON.stringify(noteData),
          });
          if (!res.ok) throw new Error("Failed to update note");
          savedNote = await res.json();
          setNotes((prevNotes) => prevNotes.map((n) => (n._id === id ? savedNote : n)));
          toast.success("Note updated successfully!");
        } else {
          // Create new note
          res = await fetch(`${API_BASE_URL}/notes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(noteData),
          });
          if (!res.ok) throw new Error("Failed to create note");
          savedNote = await res.json();
          setNotes((prevNotes) => [...prevNotes, savedNote]);
          toast.success("Note created successfully!");
        }
        return savedNote;
      } catch (err) {
        console.error("Error saving note:", err);
        toast.error(
          `Failed to save note: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        throw err;
      }
    },
    [token]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!token) {
        toast.error("Authentication required to delete notes.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to delete note: ${res.status} ${errorText}`);
        }
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
        toast.success("Note deleted successfully!");
      } catch (err) {
        console.error("Error deleting note:", err);
        toast.error(
          `Failed to delete note: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        throw err;
      }
    },
    [token]
  );

  return { notes, loading, fetchNotes, handleSave, handleDelete };
};