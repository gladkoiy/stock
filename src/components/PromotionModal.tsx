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
import { Label } from '@/components/ui/label';
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

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      isActive: true,
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
    } catch (error) {
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
  const availableParentPromotions = parentPromotions.filter(p => 
    p.id !== promotion?.id && 
    !p.isChild && 
    p.parentId !== promotion?.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать акцию' : 'Создать акцию'}
          </DialogTitle>
          <DialogDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата начала *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
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
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата окончания *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            {availableParentPromotions.length > 0 && (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Родительская акция</FormLabel>
                    <Select
                      onValueChange={field.onChange}
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
                        {availableParentPromotions.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
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