'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StaticFileRead, StaticFileType } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import {
  Image as ImageIcon,
  FileText,
  Edit,
  Trash2,
  Download,
  Eye
} from 'lucide-react';

interface FileListProps {
  files: StaticFileRead[];
  fileType: StaticFileType;
  title: string;
  promotionId: string;
  onFileDeleted: () => void;
}

export function FileList({ 
  files, 
  fileType, 
  title, 
  onFileDeleted 
}: FileListProps) {
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<StaticFileRead | null>(null);

  // Since files are already filtered by the parent component, no need to filter again
  // API returns file_type as null, but files are already categorized in separate arrays
  const filteredFiles = files;

  const handleDelete = async (file: StaticFileRead) => {
    const confirmed = window.confirm(`Вы уверены, что хотите удалить файл "${file.filename}"?`);
    if (!confirmed) return;

    setDeletingFileId(file.file_path);
    try {
      // Note: The API doesn't provide file ID, using file_path as identifier
      // In a real implementation, you'd need a proper file ID
      await apiClient.deleteFile(file.file_path);
      toast.success('Файл удален успешно');
      onFileDeleted();
    } catch {
      toast.error('Ошибка при удалении файла');
    } finally {
      setDeletingFileId(null);
    }
  };

  const handlePreview = (file: StaticFileRead) => {
    setPreviewFile(file);
  };

  const isImage = (file: StaticFileRead) => {
    // Check filename first
    const filename = file.filename || '';
    if (filename && /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
      return true;
    }
    // If no filename, check file_path
    const filePath = file.file_path || '';
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  };


  if (filteredFiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>Файлы не найдены</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {fileType.includes('image') ? (
              <ImageIcon className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            {title}
            <Badge variant="secondary" className="ml-auto">
              {filteredFiles.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFiles.map((file, index) => (
              <div
                key={`${file.file_path}-${index}`}
                className="border rounded-lg p-3 space-y-3"
              >
                {/* File Preview */}
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {isImage(file) ? (
                    <Image
                      src={apiClient.buildFileUrl(file.file_path)}
                      alt={file.caption || file.filename || 'File'}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full cursor-pointer"
                      onClick={() => handlePreview(file)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex items-center justify-center w-full h-full">
                              <div class="text-center">
                                <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p class="text-xs text-gray-500">Изображение недоступно</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">
                        {file.filename?.split('.').pop()?.toUpperCase() || 'FILE'}
                      </p>
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-1">
                  <h4 className="text-sm font-medium truncate" title={file.caption || file.filename || 'Untitled'}>
                    {file.caption || file.filename || 'Без названия'}
                  </h4>
                  {file.caption && file.filename && file.caption !== file.filename && (
                    <p className="text-xs text-gray-600 truncate" title={file.filename}>
                      {file.filename}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {file.order !== null && (
                      <span>Порядок: {file.order}</span>
                    )}
                    <Badge variant={file.is_active ? 'default' : 'secondary'} className="text-xs">
                      {file.is_active ? 'Активный' : 'Неактивный'}
                    </Badge>
                  </div>
                </div>

                {/* Actions - mobile responsive */}
                <div className="grid grid-cols-2 gap-1 sm:flex">
                  <Button
                    size="sm"
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => handlePreview(file)}
                  >
                    <Eye className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline text-xs">Просмотр</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => {
                      // Open file in new tab for download
                      window.open(apiClient.buildFileUrl(file.file_path), '_blank');
                    }}
                  >
                    <Download className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline text-xs">Скачать</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => toast.info('Редактирование файлов будет добавлено позже')}
                  >
                    <Edit className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline text-xs">Редакт.</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="sm:flex-1"
                    onClick={() => handleDelete(file)}
                    disabled={deletingFileId === file.file_path}
                  >
                    <Trash2 className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline text-xs">Удалить</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewFile(null)}
        >
          <div className="max-w-4xl max-h-[90vh] p-4">
            {isImage(previewFile) ? (
              <Image
                src={apiClient.buildFileUrl(previewFile.file_path)}
                alt={previewFile.caption || previewFile.filename || 'Preview'}
                width={800}
                height={600}
                className="object-contain max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="bg-white p-8 rounded-lg text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{previewFile.filename}</h3>
                {previewFile.caption && (
                  <p className="text-gray-600 mb-4">{previewFile.caption}</p>
                )}
                <Button
                  onClick={() => window.open(apiClient.buildFileUrl(previewFile.file_path), '_blank')}
                >
                  Открыть файл
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}