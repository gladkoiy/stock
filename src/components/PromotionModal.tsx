'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PromotionRead } from '@/types';
import { promotionSchema, PromotionFormData } from '@/lib/validations';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  promotion?: PromotionRead | null;
  parentPromotions?: PromotionRead[];
}

export function PromotionModal({
  isOpen,
  onClose,
  onSuccess,
  promotion,
  parentPromotions = [],
}: PromotionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!promotion;

  const form = useForm({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      isActive: true,
      isParent: false,
      parentId: 'none',
      rules: '',
      couponsPlaceholder: '',
    },
  });

  // Reset form when modal opens/closes or promotion changes
  useEffect(() => {
    if (isOpen) {
      if (promotion) {
        // Convert ISO date strings to datetime-local format
        const formatDateForInput = (dateString: string) => {
          const date = new Date(dateString);
          return format(date, "yyyy-MM-dd'T'HH:mm");
        };

        form.reset({
          name: promotion.name,
          startDate: formatDateForInput(promotion.startDate),
          endDate: formatDateForInput(promotion.endDate),
          isActive: promotion.isActive,
          isParent: promotion.isParent || false,
          parentId: promotion.parentId || 'none',
          rules: promotion.rules || '',
          couponsPlaceholder: promotion.couponsPlaceholder || '',
        });
      } else {
        // Default values for new promotion
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        form.reset({
          name: '',
          startDate: format(now, "yyyy-MM-dd'T'HH:mm"),
          endDate: format(tomorrow, "yyyy-MM-dd'T'HH:mm"),
          isActive: true,
          isParent: false,
          parentId: 'none',
          rules: '',
          couponsPlaceholder: '',
        });
      }
    }
  }, [isOpen, promotion, form]);

  const onSubmit = async (data: PromotionFormData) => {
    setIsLoading(true);
    try {
      // Convert datetime-local format back to ISO
      const startDate = new Date(data.startDate).toISOString();
      const endDate = new Date(data.endDate).toISOString();
      
      const promotionData = {
        name: data.name,
        startDate,
        endDate,
        isActive: data.isActive,
        parentId: data.parentId === 'none' ? null : data.parentId,
        rules: data.rules || null,
        couponsPlaceholder: data.couponsPlaceholder || null,
      };

      if (isEditing && promotion) {
        await apiClient.updatePromotion({
          id: promotion.id,
          ...promotionData,
        });
        toast.success('Акция обновлена успешно');
      } else {
        await apiClient.createPromotion(promotionData);
        toast.success('Акция создана успешно');
      }

      onSuccess();
      onClose();
    } catch {
      toast.error(isEditing ? 'Ошибка при обновлении акции' : 'Ошибка при создании акции');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Filter parent promotions - exclude current promotion and its children
  // Also separate active and inactive promotions
  const availableParentPromotions = parentPromotions.filter(p => 
    p.id !== promotion?.id && 
    !p.isChild && 
    p.parentId !== promotion?.id
  );

  const activeParentPromotions = availableParentPromotions.filter(p => {
    const now = new Date();
    const endDate = new Date(p.endDate);
    return p.isActive && endDate > now;
  });

  const expiredParentPromotions = availableParentPromotions.filter(p => {
    const now = new Date();
    const endDate = new Date(p.endDate);
    return !p.isActive || endDate <= now;
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">
            {isEditing ? 'Редактировать акцию' : 'Создать акцию'}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {isEditing 
              ? 'Внесите изменения в данные акции.' 
              : 'Заполните форму для создания новой акции.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название акции *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите название акции"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Дата начала *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        disabled={isLoading}
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Дата окончания *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        disabled={isLoading}
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Активная акция</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Будет ли акция активной после создания
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isParent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Родительская акция</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Может ли эта акция иметь дочерние акции
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // Если отмечаем как родительскую, убираем выбор родителя
                          if (checked) {
                            form.setValue('parentId', 'none');
                          }
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {availableParentPromotions.length > 0 && !form.watch('isParent') && (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Родительская акция</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Автоматически устанавливаем даты родительской акции
                        if (value !== 'none') {
                          const selectedParent = availableParentPromotions.find(p => p.id === value);
                          if (selectedParent) {
                            const formatDateForInput = (dateString: string) => {
                              const date = new Date(dateString);
                              return format(date, "yyyy-MM-dd'T'HH:mm");
                            };
                            
                            form.setValue('startDate', formatDateForInput(selectedParent.startDate));
                            form.setValue('endDate', formatDateForInput(selectedParent.endDate));

                            // Показать предупреждение для неактивных/завершенных акций
                            const now = new Date();
                            const endDate = new Date(selectedParent.endDate);
                            if (!selectedParent.isActive || endDate <= now) {
                              toast.warning(
                                `Внимание: родительская акция "${selectedParent.name}" ${
                                  !selectedParent.isActive ? 'неактивна' : 'уже завершилась'
                                }. Даты автоматически установлены, но рекомендуется выбрать активную акцию или создать основную акцию.`
                              );
                            }
                          }
                        }
                      }}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите родительскую акцию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Нет (основная акция)</SelectItem>
                        
                        {activeParentPromotions.length > 0 && (
                          <>
                            {activeParentPromotions.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} ✅
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {expiredParentPromotions.length > 0 && (
                          <>
                            {expiredParentPromotions.map((p) => {
                              const now = new Date();
                              const endDate = new Date(p.endDate);
                              const isExpired = endDate <= now;
                              return (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} {!p.isActive ? '⏸️' : isExpired ? '⏰' : '❌'}
                                </SelectItem>
                              );
                            })}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="couponsPlaceholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Плейсхолдер для купонов</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите плейсхолдер"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Правила акции</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введите правила и условия акции"
                      className="min-h-[100px]"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Сохранить' : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}