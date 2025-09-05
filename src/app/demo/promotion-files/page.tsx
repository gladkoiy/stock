import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Image as ImageIcon, Upload, Download, Eye, Edit, Trash2 } from 'lucide-react';

export default function PromotionFilesDemo() {
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
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/stock/demo/" className="hover:text-gray-900">Демо</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Управление файлами</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold mb-1">Управление файлами акции</h1>
              <p className="text-sm sm:text-base text-gray-600">Демонстрация интерфейса загрузки файлов</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Статическая демо-версия
              </CardTitle>
              <CardDescription>
                Это демонстрация интерфейса загрузки файлов. В реальном приложении здесь работает drag&drop и взаимодействие с API.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* File Upload Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Загрузка файлов</CardTitle>
              <CardDescription>Перетащите файлы или нажмите для выбора</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Загрузка файлов (демо)
                </h3>
                <p className="text-gray-600 mb-4">
                  Поддерживаемые форматы: JPG, PNG, GIF, PDF, DOC, DOCX
                </p>
                <button 
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                >
                  Выберите файлы
                </button>
                <p className="text-xs text-gray-500 mt-2">Максимальный размер: 10MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Images Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Изображения акции
                <Badge variant="secondary" className="ml-auto">3</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-3 space-y-3">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-blue-400" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">
                        Изображение акции {i}.jpg
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Порядок: {i}</span>
                        <Badge variant="default" className="text-xs">Активный</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 sm:flex">
                      <button className="flex items-center justify-center px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors" disabled>
                        <Eye className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Просмотр</span>
                      </button>
                      <button className="flex items-center justify-center px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors" disabled>
                        <Download className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Скачать</span>
                      </button>
                      <button className="flex items-center justify-center px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors" disabled>
                        <Edit className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Редакт.</span>
                      </button>
                      <button className="flex items-center justify-center px-2 py-1 text-xs border rounded text-red-600 hover:bg-red-50 transition-colors" disabled>
                        <Trash2 className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Удалить</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Документы
                <Badge variant="secondary" className="ml-auto">2</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {['Правила акции.pdf', 'Техническое задание.docx'].map((filename, i) => (
                  <div key={i} className="border rounded-lg p-3 space-y-3">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">
                          {filename.split('.').pop()?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium" title={filename}>
                        {filename}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Порядок: {i + 1}</span>
                        <Badge variant="default" className="text-xs">Активный</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 sm:flex">
                      <button className="flex items-center justify-center px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors" disabled>
                        <Eye className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Просмотр</span>
                      </button>
                      <button className="flex items-center justify-center px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors" disabled>
                        <Download className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Скачать</span>
                      </button>
                      <button className="flex items-center justify-center px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors" disabled>
                        <Edit className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Редакт.</span>
                      </button>
                      <button className="flex items-center justify-center px-2 py-1 text-xs border rounded text-red-600 hover:bg-red-50 transition-colors" disabled>
                        <Trash2 className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Удалить</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Back link */}
          <div className="text-center">
            <a 
              href="/stock/demo/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Назад к демо
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}