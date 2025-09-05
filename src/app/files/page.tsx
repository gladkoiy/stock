'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { FileList } from '@/components/FileList';
import { PromotionRead, StaticFileType } from '@/types';
import { apiClient } from '@/lib/api';
import { generatePromoUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';

function PromotionFilesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotionId = searchParams.get('id') || '';
  
  const [promotion, setPromotion] = useState<PromotionRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPromotion = useCallback(async (refresh = false) => {
    if (!promotionId) {
      router.push('/');
      return;
    }

    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const promotions = await apiClient.getPromotions({ include_inactive: true });
      const targetPromotion = promotions.find(p => p.id === promotionId);
      
      if (!targetPromotion) {
        toast.error('Акция не найдена');
        router.push('/');
        return;
      }

      setPromotion(targetPromotion);
    } catch (error) {
      toast.error('Ошибка при загрузке данных акции');
      console.error('Error fetching promotion:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [promotionId, router]);

  useEffect(() => {
    fetchPromotion();
  }, [fetchPromotion]);

  const handleUploadComplete = () => {
    fetchPromotion(true);
  };

  const handleFileDeleted = () => {
    fetchPromotion(true);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p>Загрузка...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!promotion) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">Акция не найдена</p>
            <Button onClick={() => router.push('/')}>
              Вернуться к списку акций
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-4 sm:p-6">
          {/* Breadcrumbs and Header - Mobile Responsive */}
          <div className="mb-6">
            {/* Breadcrumbs - scrollable on mobile */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 overflow-x-auto pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="p-0 h-auto font-normal whitespace-nowrap"
              >
                Акции
              </Button>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate min-w-0">{promotion.name}</span>
              <span>/</span>
              <span className="whitespace-nowrap">Файлы</span>
            </div>

            {/* Header - mobile stacked */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold mb-1">Управление файлами</h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">Акция: {promotion.name}</p>
              </div>
              
              {/* Action buttons - mobile responsive */}
              <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => window.open(generatePromoUrl(promotion.id), '_blank')}
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span className="sm:hidden">Просмотр</span>
                  <span className="hidden sm:inline">Просмотреть акцию</span>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchPromotion(true)}
                    disabled={isRefreshing}
                    className="flex-1 sm:flex-initial"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Обновить</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="flex-1 sm:flex-initial"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Назад к списку</span>
                    <span className="sm:hidden">Назад</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* File Upload */}
            <FileUpload
              promotionId={promotionId}
              onUploadComplete={handleUploadComplete}
            />

            <Separator />

            {/* File Lists by Type */}
            <div className="space-y-6">
              <FileList
                files={promotion.promotionImages}
                fileType={StaticFileType.promotion_image}
                title="Изображения акции"
                promotionId={promotionId}
                onFileDeleted={handleFileDeleted}
              />

              <FileList
                files={promotion.partnerImages}
                fileType={StaticFileType.partner_image}
                title="Изображения партнеров"
                promotionId={promotionId}
                onFileDeleted={handleFileDeleted}
              />

              <FileList
                files={promotion.documents}
                fileType={StaticFileType.document}
                title="Документы"
                promotionId={promotionId}
                onFileDeleted={handleFileDeleted}
              />

              {/* Promotion Logo - Special handling for single file */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Логотип акции
                  {promotion.promotionLogo && (
                    <span className="text-sm text-gray-600">(текущий логотип)</span>
                  )}
                </h3>
                
                {promotion.promotionLogo ? (
                  <FileList
                    files={[promotion.promotionLogo]}
                    fileType={StaticFileType.promotion_logo}
                    title="Текущий логотип"
                    promotionId={promotionId}
                    onFileDeleted={handleFileDeleted}
                  />
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-600">Логотип не загружен</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Используйте форму загрузки выше и выберите тип &quot;Логотип акции&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function PromotionFilesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p>Загрузка...</p>
        </div>
      </div>
    }>
      <PromotionFilesContent />
    </Suspense>
  );
}