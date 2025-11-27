'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { StaticFileType } from '@/types';
import { fileUploadSchema, FileUploadFormData } from '@/lib/validations';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';

interface FileUploadProps {
  promotionId: string;
  onUploadComplete: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

export function FileUpload({ promotionId, onUploadComplete }: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<FileUploadFormData>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      caption: '',
      order: 0,
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const uploadFiles = async (data: FileUploadFormData & { fileType: StaticFileType }) => {
    if (selectedFiles.length === 0) {
      toast.error('Выберите файлы для загрузки');
      return;
    }

    const uploads = selectedFiles.map(file => ({ file, progress: 0 }));
    setUploadingFiles(uploads);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Update progress
        setUploadingFiles(prev => 
          prev.map((upload, idx) => 
            idx === i ? { ...upload, progress: 50 } : upload
          )
        );

        await apiClient.uploadFile(
          file,
          promotionId,
          data.fileType,
          data.caption || undefined,
          data.order || undefined
        );

        // Complete progress
        setUploadingFiles(prev => 
          prev.map((upload, idx) => 
            idx === i ? { ...upload, progress: 100 } : upload
          )
        );
      }

      toast.success(`Загружено файлов: ${selectedFiles.length}`);
      setSelectedFiles([]);
      setUploadingFiles([]);
      form.reset();
      onUploadComplete();
    } catch {
      toast.error('Ошибка при загрузке файлов');
      setUploadingFiles([]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileTypeOptions = () => [
    { value: StaticFileType.promotion_image, label: 'Изображение акции' },
    { value: StaticFileType.partner_image, label: 'Изображение партнера' },
    { value: StaticFileType.document, label: 'Документ' },
    { value: StaticFileType.promotion_logo, label: 'Логотип акции' },
    { value: StaticFileType.promotion_logo_mobile, label: 'Логотип для МП Копилка Доставка' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Загрузка файлов</CardTitle>
        <CardDescription>
          Перетащите файлы сюда или нажмите для выбора. Максимальный размер файла: 10MB
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            {isDragActive ? (
              <p>Отпустите файлы здесь...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Перетащите файлы сюда или <span className="text-primary">нажмите для выбора</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Поддерживаются: изображения, PDF, DOC, DOCX (до 10MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Выбранные файлы:</Label>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Form */}
        {selectedFiles.length > 0 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
              const fileTypeField = document.querySelector('[name="fileType"]') as HTMLSelectElement;
              if (!fileTypeField?.value) {
                toast.error('Выберите тип файла');
                return;
              }
              uploadFiles({ ...data, fileType: fileTypeField.value as StaticFileType });
            })}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fileType">Тип файла *</Label>
                  <Select name="fileType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип файла" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFileTypeOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка для перехода</FormLabel>
                      <FormControl>
                        <Input placeholder="Вставьте ссылку для перехода" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Порядок сортировки</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full mt-4"
                disabled={uploadingFiles.length > 0}
              >
                {uploadingFiles.length > 0 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Загрузить файлы
              </Button>
            </form>
          </Form>
        )}

        {/* Upload Progress */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Загрузка файлов:</Label>
            {uploadingFiles.map((upload, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{upload.file.name}</span>
                  <span>{upload.progress}%</span>
                </div>
                <Progress value={upload.progress} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}