# Legal Lab Төсөл - Байршуулах заавар

Энэхүү файл нь Legal Lab төслийг сервер дээр байршуулах болон үйлдвэрлэлийн горимд ажиллуулах зааврыг агуулна.

## Байршуулах алхмууд

### 1. Frontend-ийг үйлдвэрлэлийн горимд бэлдэх
#### Энэ үйлдлийг хийхээс өмнө legal-lab\legal-lab\src\services доторх api.js файлын baseURL-г өөрчлөнө.
```bash
cd legal-lab
npm run build
```
#### Энэ нь `build/` хавтсанд үйлдвэрлэлийн файлуудыг үүсгэнэ. Дараа нь build хавтасаа frontend сервер рүү хуулна.
```bash
scp -r build/ ndc-user@103.85.185.102:/home/ndc-user/
```
#### frontend сервер рүү нэвтэрнэ.
```bash
ssh ndc-user@103.85.185.102
Nuuts$Ug$6
```
#### ороход build хавтас хуулагдсан байх ба үүнийг /var/www/ хавтас руу хуулна.
```bash
sudo cp -r build/ /var/www/
```
#### /var/www/ хавтас руу орно.
```bash
cd /var/www/
```
#### html хавтсыг устгана.
```bash
sudo rm -rf html/
```
#### build хавтсыг html нэртэй болгоно.
```bash
sudo mv build/ html/
```

### 2. Backend-ийг үйлдвэрлэлийн горимд бэлдэх
#### Энэ үйлдлийг хийхээс өмнө backend хавтас доторх node_modules хавтсыг устгана. Үүний дараа backend хавтсыг backend сервер рүү хуулна.
```bash
scp -r backend/ ndc-user@103.85.185.35:/home/ndc-user/
```
#### backend сервер рүү нэвтэрнэ.
```bash
ssh ndc-user@103.85.185.35
Nuuts$ug$8
```
#### backend хавтас доторх index файлыг pm2 ашиглаж ажиллуулж байгаа болохоор pm2 болон nginx хоёрыг restart хийхэд болно.
```bash
pm2 restart index
sudo systemctl restart nginx
```
#### backend шинэ сан ашиглаж өөрчлөлт оруулсан бол node_modules хавтсыг backend сервер дээрээс устгаж дахиж суулгана.
```bash
cd backend
npm install
```
## Нэмэлт мэдээлэл
### Backend серверийн байнгын ажиллагаа
Серверийг байнгын ажиллагаанд оруулахын тулд [PM2](https://pm2.keymetrics.io/) ашиглаж байгаа.

Дэлгэрэнгүй судлахыг хүсвэл [backend сервер ubuntu дээр тохируулах заавар](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04#step-2-creating-a-node-js-application)-ийг үзнэ үү.

### Домэйн тохиргоо
- Домэйн холбохын тулд [NGINX](https://www.nginx.com/) ашиглаж байгаа.

## Дэлгэрэнгүй мэдээлэл

- React-ийн талаар илүү ихийг мэдэхийг хүсвэл [React баримт бичиг](https://reactjs.org/)-ийг үзнэ үү.
- Node.js-ийн талаар илүү ихийг мэдэхийг хүсвэл [Node.js баримт бичиг](https://nodejs.org/)-ийг үзнэ үү.
- PM2-ийн талаар илүү ихийг мэдэхийг хүсвэл [PM2 баримт бичиг](https://pm2.keymetrics.io/)-ийг үзнэ үү.

## Лиценз

Энэхүү төсөл нь MIT лицензтэй. © 2025 Altangerel Ganbaatar. Дэлгэрэнгүй мэдээллийг `LICENSE` файлд үзнэ үү.
