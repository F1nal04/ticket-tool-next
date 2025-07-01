import { writeFileSync, readFileSync, existsSync, unlinkSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created data directory:', DATA_DIR);
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

export const storage = {
  set: (key: string, value: string): void => {
    try {
      // Ensure directory exists before writing
      if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
      }
      
      const filePath = join(DATA_DIR, `${key}.json`);
      writeFileSync(filePath, value, 'utf8');
      console.log(`Storage SET: ${key} saved to file`);
    } catch (error) {
      console.error(`Storage SET error for ${key}:`, error);
      throw error; // Re-throw so the caller knows it failed
    }
  },
  
  get: (key: string): string | null => {
    try {
      const filePath = join(DATA_DIR, `${key}.json`);
      if (!existsSync(filePath)) {
        console.log(`Storage GET: ${key} not found`);
        return null;
      }
      const value = readFileSync(filePath, 'utf8');
      console.log(`Storage GET: ${key} found`);
      return value;
    } catch (error) {
      console.error(`Storage GET error for ${key}:`, error);
      return null;
    }
  },
  
  has: (key: string): boolean => {
    try {
      const filePath = join(DATA_DIR, `${key}.json`);
      const exists = existsSync(filePath);
      console.log(`Storage HAS: ${key}, exists: ${exists}`);
      return exists;
    } catch (error) {
      console.error(`Storage HAS error for ${key}:`, error);
      return false;
    }
  },
  
  delete: (key: string): boolean => {
    try {
      const filePath = join(DATA_DIR, `${key}.json`);
      if (!existsSync(filePath)) {
        return false;
      }
      unlinkSync(filePath);
      console.log(`Storage DELETE: ${key} deleted`);
      return true;
    } catch (error) {
      console.error(`Storage DELETE error for ${key}:`, error);
      return false;
    }
  },
  
  // Debug method to see all keys
  getAllKeys: (): string[] => {
    try {
      const files = readdirSync(DATA_DIR);
      const keys = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
      console.log(`Storage getAllKeys: found ${keys.length} tickets`);
      return keys;
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }
};