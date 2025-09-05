'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PromotionRead } from '@/types';
import { 
  Calendar,
  Edit,
  Trash2,
  FolderOpen,
  Plus,
  Image as ImageIcon,
  FileText,
  Users,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { generatePromoUrl } from '@/lib/utils';
import { toast } from 'sonner';

interface PromotionCardProps {
  promotion: PromotionRead;
  onEdit: (promotion: PromotionRead) => void;
  onFileManagement: (promotionId: string) => void;
  onRefresh: () => void;
}

export function PromotionCard({ 
  promotion, 
  onEdit, 
  onFileManagement, 
  onRefresh 
}: PromotionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить эту акцию?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await apiClient.deletePromotion(promotion.id);
      toast.success('Акция удалена успешно');
      onRefresh();
    } catch (error) {
      toast.error('Ошибка при удалении акции');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  const totalFiles = promotion.promotionImages.length + 
                    promotion.partnerImages.length + 
                    promotion.documents.length + 
                    (promotion.promotionLogo ? 1 : 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{promotion.name}</CardTitle>
              <Badge variant={promotion.isActive ? 'default' : 'secondary'}>
                {promotion.isActive ? 'Активна' : 'Неактивна'}
              </Badge>
              {promotion.isParent && (
                <Badge variant="outline" className="text-xs">
                  Родительская
                </Badge>
              )}
              {promotion.isChild && (
                <Badge variant="outline" className="text-xs">
                  Дочерняя
                </Badge>
              )}
            </div>
            <CardDescription>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                  </span>
                </div>
              </div>
            </CardDescription>
          </div>
          {promotion.promotionLogo && (
            <div className="ml-4 flex-shrink-0">
              <Image
                src={apiClient.buildFileUrl(promotion.promotionLogo.file_path)}
                alt="Логотип"
                width={48}
                height={48}
                className="h-12 w-12 rounded object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Статистика файлов */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              {promotion.children.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{promotion.children.length} дочерних</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
                <span>{promotion.promotionImages.length} изображений</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{totalFiles} файлов</span>
              </div>
            </div>
          </div>

          {/* Кнопки действий - mobile responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(promotion)}
              className="w-full lg:w-auto"
            >
              <Edit className="h-4 w-4 mr-1" />
              <span className="lg:hidden">Редакт.</span>
              <span className="hidden lg:inline">Редактировать</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onFileManagement(promotion.id)}
              className="w-full lg:w-auto"
            >
              <FolderOpen className="h-4 w-4 mr-1" />
              Файлы
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(generatePromoUrl(promotion.id), '_blank')}
              className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              <span className="lg:hidden">Просмотр</span>
              <span className="hidden lg:inline">Просмотреть акцию</span>
            </Button>
            {promotion.isParent && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Это будет реализовано позже
                  toast.info('Функция создания дочерней акции будет добавлена');
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Дочерняя
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Удалить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}