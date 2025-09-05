import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileText, Image as ImageIcon, Users } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Командор</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Демонстрация функций</h1>
          <p className="text-gray-600">Примеры страниц управления файлами акций</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                GitHub Pages Демо
              </CardTitle>
              <CardDescription>
                Это статическая демонстрационная версия системы управления акциями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Полнофункциональная версия требует Node.js сервера и подключения к API.
                В статической версии доступны только демонстрационные страницы.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <a 
                  href="/stock/demo/promotion-files/"
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Управление файлами</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Пример страницы загрузки и управления файлами акции
                  </p>
                </a>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <ImageIcon className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Галерея изображений</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Просмотр и редактирование изображений акций
                  </p>
                  <span className="text-xs text-gray-500 mt-2 block">Скоро</span>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Управление партнерами</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Добавление и настройка партнерских материалов
                  </p>
                  <span className="text-xs text-gray-500 mt-2 block">Скоро</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Технические особенности</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Framework:</span>
                  <span className="font-mono">Next.js 15.5.2</span>
                </div>
                <div className="flex justify-between">
                  <span>UI Library:</span>
                  <span className="font-mono">shadcn/ui + Tailwind CSS</span>
                </div>
                <div className="flex justify-between">
                  <span>TypeScript:</span>
                  <span className="text-green-600">✓ Full support</span>
                </div>
                <div className="flex justify-between">
                  <span>Responsive Design:</span>
                  <span className="text-green-600">✓ Always Works™</span>
                </div>
                <div className="flex justify-between">
                  <span>Deployment:</span>
                  <span className="font-mono">GitHub Actions + Pages</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}