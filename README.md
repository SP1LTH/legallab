# Legal Lab Төсөл

Энэхүү төсөл нь **frontend** (React дээр суурилсан) `legal-lab` хавтас дотор, мөн **backend** (Node.js/Express дээр суурилсан) `backend` хавтас дотор байрладаг.

## Урьдчилсан нөхцөлүүд

Төслийг ажиллуулахын тулд дараах програмууд таны системд суулгагдсан байх шаардлагатай:
- [Node.js](https://nodejs.org/) (v14 эсвэл түүнээс дээш)
- [npm](https://www.npmjs.com/) (v6 эсвэл түүнээс дээш)
- [MongoDB](https://www.mongodb.com/try/download/community) (Өгөгдлийн сангийн сервер)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (MongoDB өгөгдлийн санг удирдах хэрэгсэл)
- [Git](https://git-scm.com/) (Кодыг хувилах болон хувилбар удирдах хэрэгсэл)

## Төслийг хэрхэн ажиллуулах вэ?

### 1. Репозиторийг хуулбарлах
```bash
git clone https://github.com/your-repo/legal-lab.git
cd legal-lab
```

### 2. Хамааралтай сангуудыг суулгах
#### Frontend
```bash
cd legal-lab
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

### 3. Төслийг эхлүүлэх
#### Frontend
```bash
cd legal-lab
npm start
```
Энэ нь React хөгжүүлэлтийн серверийг эхлүүлнэ. [http://localhost:3000](http://localhost:3000) хаягаар хөтөч дээр нээж үзнэ үү.

#### Backend
```bash
cd ../backend
npm start
```
Энэ нь backend серверийг эхлүүлнэ. Анхдагчаар [http://localhost:5000](http://localhost:5000) хаягаар ажиллана.

## Боломжит Скриптүүд

### Frontend
- `npm start`: Frontend-ийг хөгжүүлэлтийн горимд ажиллуулна.
- `npm run build`: Frontend-ийг үйлдвэрлэлийн горимд бэлдэнэ.
- `npm test`: Frontend-ийн тестүүдийг ажиллуулна.

### Backend
- `npm start`: Backend серверийг ажиллуулна.
- `npm run dev`: Backend серверийг хөгжүүлэлтийн горимд hot-reloading-тай ажиллуулна (`nodemon` шаардлагатай).
- `npm test`: Backend-ийн тестүүдийг ажиллуулна.

## Дэлгэрэнгүй мэдээлэл

- React-ийн талаар илүү ихийг мэдэхийг хүсвэл [React баримт бичиг](https://reactjs.org/)-ийг үзнэ үү.
- Node.js-ийн талаар илүү ихийг мэдэхийг хүсвэл [Node.js баримт бичиг](https://nodejs.org/)-ийг үзнэ үү.

## Лиценз

Энэхүү төсөл нь MIT лицензтэй. © 2025 Altangerel Ganbaatar. Дэлгэрэнгүй мэдээллийг `LICENSE` файлд үзнэ үү.
