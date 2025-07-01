const ticketStore = new Map<string, string>();

export const storage = {
  set: (key: string, value: string): void => {
    ticketStore.set(key, value);
  },
  
  get: (key: string): string | null => {
    return ticketStore.get(key) || null;
  },
  
  has: (key: string): boolean => {
    return ticketStore.has(key);
  },
  
  delete: (key: string): boolean => {
    return ticketStore.delete(key);
  }
};