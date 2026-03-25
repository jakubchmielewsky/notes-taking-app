const DUPLICATE_KEY_ERROR_CODE = 11000;

export const isDuplicateKeyError = (error: unknown, field: string): boolean =>
  error instanceof Error &&
  (error as { code?: unknown }).code === DUPLICATE_KEY_ERROR_CODE &&
  (error as { keyPattern?: Record<string, unknown> }).keyPattern?.[field] !=
    null;
