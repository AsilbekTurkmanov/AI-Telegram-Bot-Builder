import { Project, ProjectFile, AiMessage } from '../types/project';

export interface AiChatResult {
  updatedProject: Project;
  aiMessage: AiMessage;
}

export function processAiChatMessage(project: Project, userPrompt: string): AiChatResult {
  const timestamp = new Date().toISOString();
  const cleanName = project.name.replace(/[^a-zA-Z0-9]/g, '');
  const updatedFiles = [...project.files];
  const affectedFilesList: string[] = [];
  const diffs: { file: string; before: string; after: string }[] = [];

  let assistantResponse = '';
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

  const lowerPrompt = userPrompt.toLowerCase();

  if (lowerPrompt.includes('referral') || lowerPrompt.includes('referal')) {
    riskLevel = 'Medium';
    const userClassIndex = updatedFiles.findIndex(f => f.name === 'User.cs');
    if (userClassIndex !== -1) {
      const oldContent = updatedFiles[userClassIndex].content;
      const newContent = oldContent.replace(
        'public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;',
        'public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;\n    public string? ReferralCode { get; set; }\n    public long? ReferredByUserId { get; set; }\n    public int ReferralBonusPoints { get; set; } = 0;'
      );
      updatedFiles[userClassIndex] = {
        ...updatedFiles[userClassIndex],
        content: newContent,
        version: updatedFiles[userClassIndex].version + 1,
        modifiedAt: timestamp
      };
      affectedFilesList.push(updatedFiles[userClassIndex].path);
      diffs.push({ file: 'User.cs', before: oldContent, after: newContent });
    }

    // Also add ReferralService.cs
    const refServicePath = `src/${cleanName}.Application/Services/ReferralService.cs`;
    const newRefContent = `namespace ${cleanName}.Application.Services;

public class ReferralService
{
    public string GenerateReferralLink(long telegramId) => $"https://t.me/${project.botName}?start=ref_{telegramId}";
}`;
    updatedFiles.push({
      id: `f_ref_${Date.now()}`,
      path: refServicePath,
      name: 'ReferralService.cs',
      language: 'csharp',
      version: 1,
      modifiedAt: timestamp,
      content: newRefContent
    });
    affectedFilesList.push(refServicePath);
    diffs.push({ file: 'ReferralService.cs', before: '', after: newRefContent });

    assistantResponse = `✅ Referral tizimi loyihaga muvaffaqiyatli qo'shildi!\n- User.cs modeliga ReferralCode va ReferralBonusPoints qo'shildi.\n- ReferralService.cs servisi yaratildi.`;

  } else if (lowerPrompt.includes('status') || lowerPrompt.includes('order')) {
    riskLevel = 'Low';
    const orderHandlerIndex = updatedFiles.findIndex(f => f.name === 'BotUpdateHandler.cs');
    if (orderHandlerIndex !== -1) {
      const oldContent = updatedFiles[orderHandlerIndex].content;
      const newContent = oldContent.replace(
        'Ready,',
        'Ready,\n            Delivering,'
      );
      updatedFiles[orderHandlerIndex] = {
        ...updatedFiles[orderHandlerIndex],
        content: newContent,
        version: updatedFiles[orderHandlerIndex].version + 1,
        modifiedAt: timestamp
      };
      affectedFilesList.push(updatedFiles[orderHandlerIndex].path);
      diffs.push({ file: 'BotUpdateHandler.cs', before: oldContent, after: newContent });
    }
    assistantResponse = `✅ Buyurtma statuslari ro'yxati va handler yangilandi! Status ketma-ketligi moslashtirildi.`;

  } else {
    // Generic enhancement
    riskLevel = 'Low';
    const readmeIndex = updatedFiles.findIndex(f => f.name === 'README.md');
    if (readmeIndex !== -1) {
      const oldContent = updatedFiles[readmeIndex].content;
      const newContent = oldContent + `\n\n### 📝 AI Modification Log (${new Date().toLocaleTimeString()}):\n- ${userPrompt}`;
      updatedFiles[readmeIndex] = {
        ...updatedFiles[readmeIndex],
        content: newContent,
        version: updatedFiles[readmeIndex].version + 1,
        modifiedAt: timestamp
      };
      affectedFilesList.push(updatedFiles[readmeIndex].path);
      diffs.push({ file: 'README.md', before: oldContent, after: newContent });
    }
    assistantResponse = `✅ AI bot talabingizni tahlil qildi va arxitektura fayllarini mos holda yangiladi!`;
  }

  const newVersionNum = project.versions.length + 1;
  const newSnapshot: Record<string, string> = {};
  updatedFiles.forEach(f => {
    newSnapshot[f.path] = f.content;
  });

  const aiMessage: AiMessage = {
    id: `msg_${Date.now()}`,
    role: 'assistant',
    content: assistantResponse,
    timestamp,
    affectedFiles: affectedFilesList,
    riskLevel,
    diffs
  };

  const updatedProject: Project = {
    ...project,
    files: updatedFiles,
    updatedAt: timestamp,
    versions: [
      ...project.versions,
      {
        version: newVersionNum,
        description: userPrompt,
        createdAt: timestamp,
        filesSnapshot: newSnapshot
      }
    ],
    messages: [...project.messages, { id: `user_${Date.now()}`, role: 'user', content: userPrompt, timestamp }, aiMessage]
  };

  return { updatedProject, aiMessage };
}
