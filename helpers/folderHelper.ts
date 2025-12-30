import path from 'path';
import { fileURLToPath } from 'url';

export function getCurrentFolderName(metaUrl: string): string {
    const filePath = fileURLToPath(metaUrl);
    const folderPath = path.dirname(filePath);
    return path.basename(folderPath);
}
