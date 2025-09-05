# 📊 Система управления акциями "Командор"

Современное веб-приложение для управления акциями, загрузки файлов и работы с партнерскими материалами.

## 🚀 Технологии

- **Frontend**: Next.js 15.5.2, TypeScript, Tailwind CSS
- **UI Framework**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation  
- **API**: Axios с JWT аутентификацией
- **File Upload**: Multipart form data с drag&drop
- **Responsive**: Always Works™ adaptive design

## 🛠 Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/gladkoiy/stock.git
cd stock

# Установить зависимости  
npm install

# Запустить в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
npm start
```

## 🌐 Деплой

### Vercel (рекомендуется)
1. Подключите репозиторий к [Vercel](https://vercel.com)
2. Vercel автоматически определит Next.js проект
3. Настройте переменные окружения (если нужны)
4. Деплой произойдет автоматически

### Netlify
1. Подключите репозиторий к [Netlify](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Включите Next.js runtime в настройках

### Railway
1. Подключите репозиторий к [Railway](https://railway.app)
2. Выберите Next.js template
3. Деплой произойдет автоматически

## 📱 Особенности

- **Полностью адаптивный дизайн** - работает на всех устройствах
- **Drag & Drop загрузка файлов** - удобная загрузка изображений и документов  
- **Управление акциями** - создание, редактирование, архивация
- **Файловый менеджер** - организация по типам (изображения, логотипы, документы)
- **Партнерские материалы** - отдельное управление партнерскими файлами
- **TypeScript** - полная типизация для надежности
- **ESLint + Prettier** - качество кода

## 🔗 API Endpoints

Приложение взаимодействует с API:
- `POST /auth/login` - аутентификация
- `GET /promotions` - список акций
- `POST /promotions` - создание акции
- `PUT /promotions/{id}` - обновление акции
- `DELETE /promotions/{id}` - удаление акции
- `POST /static/upload` - загрузка файлов
- `DELETE /static/files/{id}` - удаление файлов

## 📝 Конфигурация

### API URL
API URL настраивается в `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://api.komandor-stock.ru';
```

### Изображения  
Домены для изображений в `next.config.ts`:
```typescript
images: {
  domains: ['api.komandor-stock.ru'],
}
```

## 🚦 CI/CD

GitHub Actions автоматически:
- Проверяет код с ESLint
- Выполняет проверку типов TypeScript  
- Собирает проект для продакшена

## 📄 Лицензия

MIT License - используйте свободно для коммерческих и некоммерческих целей.

---

🤖 Создано с помощью [Claude Code](https://claude.ai/code)
