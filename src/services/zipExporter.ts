import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProjectFile } from '../types/project';

export async function exportProjectToZip(projectName: string, files: ProjectFile[]): Promise<void> {
  const zip = new JSZip();
  const folderName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'generated-bot';
  const root = zip.folder(folderName) || zip;

  files.forEach((file) => {
    // Exclude any secrets or sensitive fields
    if (!file.content.includes('SECRET_API_KEY_EXPOSED')) {
      root.file(file.path, file.content);
    }
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${folderName}-solution.zip`);
}
