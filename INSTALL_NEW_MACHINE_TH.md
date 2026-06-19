# คู่มือย้ายและเปิดใช้งาน VSeries-Project บนเครื่องใหม่

อัปเดตล่าสุด: 2026-05-23

โปรเจกต์นี้เหลือโครงสร้างหลักแบบเรียบง่าย:

```text
VSeries-Project/
  backend/
  frontend/
  INSTALL_NEW_MACHINE_TH.md
```

- `backend/` คือ API server ใช้ Express + MongoDB
- `frontend/` คือเว็บแอป ใช้ Next.js
- คู่มือนี้คือไฟล์แนะนำการติดตั้งและเปิดใช้งาน

## 1. สิ่งที่ต้องติดตั้งบนเครื่องใหม่

ติดตั้งโปรแกรมเหล่านี้ก่อน:

1. Node.js LTS พร้อม npm
2. Internet สำหรับติดตั้ง dependency และเชื่อมต่อ MongoDB
3. โปรแกรมแตกไฟล์ ZIP ถ้าได้รับโปรเจกต์มาเป็นไฟล์ ZIP

ตรวจว่า Node.js พร้อมใช้งาน:

```bat
node -v
npm -v
```

## 2. วิธีเปิดโปรเจกต์ครั้งแรก

แตกไฟล์โปรเจกต์ไปไว้ใน path ที่อ่านง่าย เช่น:

```text
C:\VSeries-Project
```

จากนั้นเปิด Command Prompt หรือ PowerShell 2 หน้าต่าง

หน้าต่างที่ 1 สำหรับ backend:

```bat
cd /d C:\VSeries-Project\backend
npm ci
npm run dev
```

หน้าต่างที่ 2 สำหรับ frontend:

```bat
cd /d C:\VSeries-Project\frontend
npm ci
npm run dev
```

เมื่อ frontend พร้อมแล้ว ให้เปิดเว็บ:

```text
http://localhost:3000
```

ตรวจ backend ได้ที่:

```text
http://localhost:5000/api/health
```

ถ้าขึ้นประมาณนี้ แปลว่า backend ทำงานแล้ว:

```json
{ "status": "ok" }
```

## 3. ไฟล์ environment ที่สำคัญ

Backend ใช้ไฟล์:

```text
backend\.env
```

Frontend ใช้ไฟล์:

```text
frontend\.env.local
```

ค่าที่ควรตรวจ:

- `MONGO_URI` ต้องเชื่อม MongoDB ได้
- `JWT_SECRET` ของ backend และ frontend ต้องตรงกัน
- `ADMIN_USERNAME` และ `ADMIN_PASSWORD` ใช้สร้างหรืออัปเดต admin
- `NEXT_PUBLIC_API_URL` ควรเป็น `http://localhost:5000/api` เมื่อรัน local
- `NEXT_PUBLIC_SITE_URL` ควรเป็น `http://localhost:3000` เมื่อรัน local
- `CORS_ORIGIN` หรือ `CORS_ORIGINS` ต้องอนุญาต frontend URL

ตรวจค่า env:

```bat
cd /d C:\VSeries-Project\backend
npm run check:env
```

```bat
cd /d C:\VSeries-Project\frontend
npm run check:env
```

## 4. สร้างหรืออัปเดต admin

ถ้า database ใหม่ยังไม่มี admin ให้รัน:

```bat
cd /d C:\VSeries-Project\backend
npm run seed:admin
```

คำสั่งนี้จะใช้ `ADMIN_USERNAME` และ `ADMIN_PASSWORD` จาก `backend\.env`

## 5. ตรวจความพร้อมก่อนใช้งานจริง

Backend:

```bat
cd /d C:\VSeries-Project\backend
npm run check:env
npm test
```

Frontend:

```bat
cd /d C:\VSeries-Project\frontend
npm run check:env
npm run lint
npm run build
```

ถ้าขั้นตอนไหน fail ให้แก้ก่อนนำไปใช้งานจริง

## 6. ถ้าจะนำโปรเจกต์ขึ้น Git

แนะนำให้ใช้ Git แบบใดแบบหนึ่งเท่านั้น:

### ทางเลือก A: ใช้ Git repo เดียวที่โฟลเดอร์ `VSeries-Project`

เหมาะถ้าต้องการเก็บ backend และ frontend ไว้ใน repo เดียว

ก่อน `git init` ให้ตรวจว่าไม่มี `.git` ซ้อนอยู่ใน `backend/` หรือ `frontend/`

ถ้ามี `.git` ซ้อน เช่น `frontend\.git` ให้ลบออกก่อน ไม่อย่างนั้น Git อาจมอง `frontend` เป็น repo ย่อยและไม่ push ไฟล์เว็บขึ้นไปตามปกติ

ตัวอย่างคำสั่ง:

```bat
cd /d C:\VSeries-Project
git init
git add .
git commit -m "Initial VSeries project"
```

### ทางเลือก B: แยก backend และ frontend เป็นคนละ Git repo

เหมาะถ้าจะ deploy backend และ frontend แยกบริการกัน เช่น backend ไป Render และ frontend ไป Vercel

ตัวอย่าง backend:

```bat
cd /d C:\VSeries-Project\backend
git init
git add .
git commit -m "Initial backend"
```

ตัวอย่าง frontend:

```bat
cd /d C:\VSeries-Project\frontend
git init
git add .
git commit -m "Initial frontend"
```

ไฟล์ `.gitignore` สำคัญมาก เพราะช่วยกันไม่ให้ไฟล์ลับและไฟล์ขนาดใหญ่ขึ้น Git เช่น:

- `.env`
- `.env.local`
- `node_modules`
- `.next`

ก่อน push ให้ตรวจด้วย:

```bat
git status
```

อย่าให้ไฟล์ env หรือ dependency โผล่อยู่ในรายการที่จะ commit

## 7. ปัญหาที่พบบ่อย

### `node` หรือ `npm` ไม่รู้จัก

ติดตั้ง Node.js LTS แล้วเปิด Command Prompt/PowerShell ใหม่

### `npm ci` fail

ให้ตรวจ Internet และตรวจว่าอยู่ในโฟลเดอร์ที่มี `package-lock.json`

ตัวอย่าง:

```bat
cd /d C:\VSeries-Project\backend
npm ci
```

```bat
cd /d C:\VSeries-Project\frontend
npm ci
```

### เว็บเปิดได้แต่ไม่มีข้อมูล

ตรวจตามลำดับนี้:

1. backend ยังรันอยู่หรือไม่
2. เปิด `http://localhost:5000/api/health` ได้หรือไม่
3. `frontend\.env.local` มี `NEXT_PUBLIC_API_URL=http://localhost:5000/api` หรือไม่
4. `backend\.env` มี `MONGO_URI` ที่เชื่อม MongoDB ได้หรือไม่
5. MongoDB Atlas อนุญาต IP ของเครื่องใหม่แล้วหรือไม่

### Admin login ไม่ได้

ตรวจว่า:

1. มี admin ใน database แล้ว
2. `JWT_SECRET` ใน backend และ frontend ตรงกัน
3. `ADMIN_USERNAME` และ `ADMIN_PASSWORD` ใน `backend\.env` ถูกต้อง
4. ถ้าเปลี่ยนรหัส admin ให้รัน `npm run seed:admin` อีกครั้ง

## 8. หมายเหตุเรื่องความปลอดภัย

ไฟล์ `backend\.env` และ `frontend\.env.local` อาจมี database connection string, JWT secret, media signing secret หรือรหัสผ่าน admin

เก็บไฟล์โปรเจกต์นี้เป็นไฟล์ส่วนตัว ถ้าเคยส่งให้คนอื่น ควรเปลี่ยน secret และรหัสผ่านที่เกี่ยวข้องทันที

## 9. สรุปแบบเร็ว

```bat
cd /d C:\VSeries-Project\backend
npm ci
npm run dev
```

เปิดอีกหน้าต่าง:

```bat
cd /d C:\VSeries-Project\frontend
npm ci
npm run dev
```

แล้วเปิด:

```text
http://localhost:3000
```
