import { DailyMetrics, PlayerState, Quest, WeeklyBoss, Task } from './types';

interface BackupData {
  version: string;
  lastBackup: string;
  playerState: PlayerState;
  dailyMetrics: Record<string, DailyMetrics>;
  quests: Quest[];
  weeklyBoss: WeeklyBoss | null;
  tasks: Task[];
}

let directoryHandle: FileSystemDirectoryHandle | null = null;

// Request directory access from user
export async function setupBackupDirectory(): Promise<{ success: boolean; message: string; path?: string }> {
  try {
    // Check if File System Access API is supported
    if (!('showDirectoryPicker' in window)) {
      return {
        success: false,
        message: 'File System Access API not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser.'
      };
    }

    // Request directory access
    directoryHandle = await (window as any).showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents'
    });

    // Store the directory handle in localStorage for persistence
    // Note: The handle itself can't be stored, but we can verify permission on reload
    localStorage.setItem('backupDirectoryConfigured', 'true');
    localStorage.setItem('backupDirectoryName', directoryHandle.name);

    return {
      success: true,
      message: `Backup directory set to: ${directoryHandle.name}`,
      path: directoryHandle.name
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Directory selection cancelled'
      };
    }
    return {
      success: false,
      message: `Error setting up backup: ${error.message}`
    };
  }
}

// Check if we have directory access
export async function hasBackupAccess(): Promise<boolean> {
  if (!directoryHandle) return false;
  
  try {
    const permission = await (directoryHandle as any).queryPermission({ mode: 'readwrite' });
    return permission === 'granted';
  } catch {
    return false;
  }
}

// Request permission if needed
export async function requestBackupPermission(): Promise<boolean> {
  if (!directoryHandle) return false;
  
  try {
    const permission = await (directoryHandle as any).requestPermission({ mode: 'readwrite' });
    return permission === 'granted';
  } catch {
    return false;
  }
}

// Save backup to JSON file
export async function saveBackup(
  playerState: PlayerState,
  dailyMetrics: Record<string, DailyMetrics>,
  quests: Quest[],
  weeklyBoss: WeeklyBoss | null,
  tasks: Task[]
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if we have directory access
    if (!directoryHandle) {
      const configured = localStorage.getItem('backupDirectoryConfigured');
      if (configured) {
        return {
          success: false,
          message: 'Backup directory not accessible. Please reconfigure backup location.'
        };
      }
      return {
        success: false,
        message: 'Backup directory not configured. Please set up backup location first.'
      };
    }

    // Check/request permission
    const hasAccess = await hasBackupAccess();
    if (!hasAccess) {
      const granted = await requestBackupPermission();
      if (!granted) {
        return {
          success: false,
          message: 'Permission denied to write backup file'
        };
      }
    }

    // Prepare backup data
    const backupData: BackupData = {
      version: '1.0',
      lastBackup: new Date().toISOString(),
      playerState,
      dailyMetrics,
      quests,
      weeklyBoss,
      tasks
    };

    // Create/overwrite the backup file
    const fileName = 'pokelife-backup.json';
    const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    
    // Write the JSON data
    await writable.write(JSON.stringify(backupData, null, 2));
    await writable.close();

    // Update last backup time
    localStorage.setItem('lastBackupTime', new Date().toISOString());

    return {
      success: true,
      message: `Backup saved to ${directoryHandle.name}/${fileName}`
    };
  } catch (error: any) {
    console.error('Backup error:', error);
    return {
      success: false,
      message: `Backup failed: ${error.message}`
    };
  }
}

// Restore from backup
export async function restoreFromBackup(): Promise<{ 
  success: boolean; 
  message: string; 
  data?: BackupData 
}> {
  try {
    if (!directoryHandle) {
      return {
        success: false,
        message: 'Backup directory not configured'
      };
    }

    const fileName = 'pokelife-backup.json';
    const fileHandle = await directoryHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    const text = await file.text();
    const data: BackupData = JSON.parse(text);

    return {
      success: true,
      message: 'Backup restored successfully',
      data
    };
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return {
        success: false,
        message: 'No backup file found'
      };
    }
    return {
      success: false,
      message: `Restore failed: ${error.message}`
    };
  }
}

// Get backup info
export function getBackupInfo(): { 
  configured: boolean; 
  directoryName: string | null;
  lastBackup: string | null;
} {
  return {
    configured: localStorage.getItem('backupDirectoryConfigured') === 'true',
    directoryName: localStorage.getItem('backupDirectoryName'),
    lastBackup: localStorage.getItem('lastBackupTime')
  };
}

// Clear backup configuration
export function clearBackupConfig() {
  directoryHandle = null;
  localStorage.removeItem('backupDirectoryConfigured');
  localStorage.removeItem('backupDirectoryName');
  localStorage.removeItem('lastBackupTime');
}
