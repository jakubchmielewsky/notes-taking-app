import { apiClient } from "./client";
import type {
  CurrentUserResponse,
  Notes,
  NoteDetails,
  CreateNoteRequest,
  UpdateNoteRequest,
} from "@notes/shared-types";

// Auth
export const authApi = {
  refresh: () => apiClient.post<{ accessToken: string }>("/auth/refresh"),
  logout: () => apiClient.post("/auth/logout"),
  logoutAll: () => apiClient.post("/auth/logout-all"),
};

// Users
export const usersApi = {
  me: () => apiClient.get<CurrentUserResponse>("/users/me"),
};

// Notes
export const notesApi = {
  list: (params?: { archived?: boolean }) =>
    apiClient.get<Notes>("/notes", { params }),
  details: (noteId: string) =>
    apiClient.get<NoteDetails>(`/notes/${noteId}`),
  create: (body: CreateNoteRequest) =>
    apiClient.post<NoteDetails>("/notes", body),
  update: (noteId: string, body: UpdateNoteRequest) =>
    apiClient.patch<NoteDetails>(`/notes/${noteId}`, body),
  archive: (noteId: string) =>
    apiClient.post<NoteDetails>(`/notes/${noteId}/archive`),
  restore: (noteId: string) =>
    apiClient.post<NoteDetails>(`/notes/${noteId}/restore`),
  delete: (noteId: string) => apiClient.delete(`/notes/${noteId}`),
};
