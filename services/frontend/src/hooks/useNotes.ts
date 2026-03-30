import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notesApi } from "@/api/endpoints";
import type { CreateNoteRequest, UpdateNoteRequest } from "@notes/shared-types";

export const notesKeys = {
  all: ["notes"] as const,
  archived: ["notes", "archived"] as const,
  detail: (id: string) => ["notes", id] as const,
};

export function useNotes() {
  return useQuery({
    queryKey: notesKeys.all,
    queryFn: () => notesApi.list().then((r) => r.data),
  });
}

export function useArchivedNotes() {
  return useQuery({
    queryKey: notesKeys.archived,
    queryFn: () => notesApi.list({ archived: true }).then((r) => r.data),
  });
}

export function useNoteDetails(noteId: string) {
  return useQuery({
    queryKey: notesKeys.detail(noteId),
    queryFn: () => notesApi.details(noteId).then((r) => r.data),
    enabled: !!noteId,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateNoteRequest) =>
      notesApi.create(body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: notesKeys.all }),
  });
}

export function useUpdateNote(noteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateNoteRequest) =>
      notesApi.update(noteId, body).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notesKeys.all });
      qc.invalidateQueries({ queryKey: notesKeys.archived });
      qc.invalidateQueries({ queryKey: notesKeys.detail(noteId) });
    },
  });
}

export function useArchiveNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) =>
      notesApi.archive(noteId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notesKeys.all });
      qc.invalidateQueries({ queryKey: notesKeys.archived });
    },
  });
}

export function useRestoreNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) =>
      notesApi.restore(noteId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notesKeys.all });
      qc.invalidateQueries({ queryKey: notesKeys.archived });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => notesApi.delete(noteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notesKeys.all });
      qc.invalidateQueries({ queryKey: notesKeys.archived });
    },
  });
}
