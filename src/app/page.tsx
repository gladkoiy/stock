'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import { PromotionCard } from '@/components/PromotionCard';
import { PromotionModal } from '@/components/PromotionModal';
import { PromotionRead } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, RefreshCw, Search } from 'lucide-react';

export default function Home() {
  const [promotions, setPromotions] = useState<PromotionRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<PromotionRead | null>(null);
  const router = useRouter();

  const fetchPromotions = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    try {
      const data = await apiClient.getPromotions({
        include_inactive: showInactive,
      });
      setPromotions(data);
    } catch (error) {
      toast.error('Ошибка при загрузке списка акций');
      console.error('Error fetching promotions:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showInactive]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const filteredPromotions = promotions.filter((promotion) =>
    promotion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (promotion: PromotionRead) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleFileManagement = (promotionId: string) => {
    router.push(`/promotions/${promotionId}/files`);
  };

  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
  };

  const handleModalSuccess = () => {
    fetchPromotions(true);
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-6">
          {/* Action Panel */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Акции</h2>
              <Button onClick={handleCreatePromotion}>
                <Plus className="h-4 w-4 mr-2" />
                Создать акцию
              </Button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Поиск по названию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Show Inactive Switch */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-inactive"
                  checked={showInactive}
                  onCheckedChange={setShowInactive}
                />
                <Label htmlFor="show-inactive">Показать неактивные</Label>
              </div>
              
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPromotions(true)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
            </div>
          </div>

          {/* Promotions List */}
          {filteredPromotions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {searchQuery ? 'Акции не найдены' : 'Нет акций для отображения'}
              </div>
              {!searchQuery && (
                <Button onClick={handleCreatePromotion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать первую акцию
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPromotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  onEdit={handleEdit}
                  onFileManagement={handleFileManagement}
                  onRefresh={() => fetchPromotions(true)}
                />
              ))}
            </div>
          )}
        </main>

        <PromotionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          promotion={editingPromotion}
          parentPromotions={promotions.filter(p => !p.isChild)}
        />
      </div>
    </ProtectedRoute>
  );
}
