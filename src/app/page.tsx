import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ExternalLink, Calendar, Users, FileText, Plus } from 'lucide-react';

export default function Home() {
  // Mock data for static demo
  const mockPromotions = [
    {
      id: '1',
      name: 'Летняя распродажа мебели',
      startDate: '2024-06-01T00:00:00Z',
      endDate: '2024-08-31T23:59:59Z',
      isActive: true,
      promotionImages: [1, 2, 3],
      partnerImages: [1, 2],
      documents: [1],
      promotionLogo: true
    },
    {
      id: '2', 
      name: 'Осенние скидки на кухни',
      startDate: '2024-09-01T00:00:00Z',
      endDate: '2024-11-30T23:59:59Z',
      isActive: true,
      promotionImages: [1, 2],
      partnerImages: [1, 2, 3],
      documents: [1, 2],
      promotionLogo: false
    },
    {
      id: '3',
      name: 'Новогодняя акция',
      startDate: '2024-12-01T00:00:00Z', 
      endDate: '2024-12-31T23:59:59Z',
      isActive: false,
      promotionImages: [1],
      partnerImages: [],
      documents: [1, 2, 3],
      promotionLogo: true
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Командор</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-sm text-gray-700">Демо пользователь</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Статическая демо-версия
              </CardTitle>
              <CardDescription>
                Это демонстрационная версия системы управления акциями для GitHub Pages.
                <br />
                Полный функционал доступен при развертывании на Node.js сервере с подключением к API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="/stock/demo/"
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  Посмотреть демо функций
                </a>
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  Next.js 15 + shadcn/ui + TypeScript
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Always Works™ Responsive
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:flex-1">
            <h2 className="text-2xl font-bold mb-2">Система управления акциями</h2>
            <p className="text-gray-600 mb-4">
              Управляйте акциями, загружайте изображения и документы, настраивайте партнерские материалы
            </p>
          </div>
          
          <div className="lg:flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                disabled
                className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать акцию
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {mockPromotions.map((promotion) => (
              <Card key={promotion.id} className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg leading-tight">
                      {promotion.name}
                    </CardTitle>
                    <Badge variant={promotion.isActive ? 'default' : 'secondary'}>
                      {promotion.isActive ? 'Активная' : 'Неактивная'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Изображения:</span>
                        <Badge variant="outline">{promotion.promotionImages.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Партнеры:</span>
                        <Badge variant="outline">{promotion.partnerImages.length}</Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Документы:</span>
                        <Badge variant="outline">{promotion.documents.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Логотип:</span>
                        <Badge variant={promotion.promotionLogo ? 'default' : 'secondary'}>
                          {promotion.promotionLogo ? '✓' : '–'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button 
                      disabled
                      className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Просмотреть</span>
                      <span className="sm:hidden">Просмотр</span>
                    </button>
                    
                    <a
                      href="/stock/demo/promotion-files/"
                      className="flex items-center justify-center px-3 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Файлы</span>
                      <span className="sm:hidden">Файлы</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}