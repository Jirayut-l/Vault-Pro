# Vault Pro - ระบบจัดการการเงินส่วนบุคคลระดับมืออาชีพ

**Vault Pro** คือแพลตฟอร์มจัดการการเงินส่วนบุคคล (Personal Finance Management) ที่ออกแบบมาเพื่อเปลี่ยนการบันทึกบัญชีแบบ Manual ไปสู่ระบบซอฟต์แวร์ที่มีสถาปัตยกรรมระดับมืออาชีพ เน้นความแม่นยำทางการเงินสูงสุด ความปลอดภัย และประสบการณ์ผู้ใช้ที่ทันสมัย

## 🚀 จุดเด่นของระบบ (Core Features)

- **Zero-Float Financial Engine:** บังคับใช้กฎ "ห้ามใช้ Float" ในการคำนวณเงิน โดยใช้สเปกทศนิยมความแม่นยำสูง (Decimal) ทั่วทั้งระบบ
- **6-Jar Distribution Logic:** ระบบกระจายรายได้เข้า 6 บัญชีแยกย่อย (Necessity, Financial Freedom, Long-term Savings, Education, Play, Give) โดยอัตโนมัติตามสัดส่วนเปอร์เซ็นต์ที่กำหนด
- **Secure Authentication:** ระบบลงชื่อเข้าใช้งานด้วย JWT (Access & Refresh Tokens) พร้อมการเก็บ Refresh Token ใน HttpOnly Cookies เพื่อความปลอดภัยสูงสุด
- **Interactive Dashboard:** หน้าสรุปภาพรวมทางการเงินพร้อมกราฟวิเคราะห์ข้อมูล (Data Visualization) ที่สวยงามและตอบสนองแบบ Responsive
- **Transaction Engine:** รองรับการบันทึกรายรับ รายจ่าย และการโอนเงินระหว่าง Jar อย่างสมบูรณ์

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### หน้าบ้าน (Frontend)
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS V4+
- **Components:** shadcn/ui (Nova Preset)
- **Auth:** NextAuth.js
- **Charts:** Recharts
- **Math:** Decimal.js

### หลังบ้าน (Backend)
- **Language:** Go (Golang)
- **Framework:** Gin Web Framework
- **ORM:** GORM (PostgreSQL Driver)
- **Database:** PostgreSQL 16
- **Precision:** shopspring/decimal

### โครงสร้างพื้นฐาน & QA
- **Infrastructure:** Docker & Docker Compose (Multi-stage builds)
- **QA:** Go testing/testify/sqlmock (Backend), Vitest (Frontend), Playwright (E2E)

## 🏗️ สถาปัตยกรรมของระบบ (Architecture)

โปรเจกต์นี้ใช้โครงสร้างแบบ **Layered Architecture** เพื่อความง่ายในการขยายระบบและการทดสอบ:
- **Handler Layer:** จัดการ HTTP Request/Response และการทำ Binding ข้อมูล
- **Service Layer:** เก็บ Business Logic หลัก (เช่น การคำนวณ 6 Jars)
- **Repository Layer:** จัดการการเชื่อมต่อและ Query ฐานข้อมูล

นอกจากนี้ยังมีการใช้ระบบ **AI Skills** (`.gemini/skills/`) เพื่อกำหนดมาตรฐานวิศวกรรมเฉพาะทางภายในทีมพัฒนา

## 🚦 การเริ่มต้นใช้งาน (Getting Started)

### วิธีที่ 1: ใช้งานผ่าน Docker (แนะนำ)
คุณสามารถรันระบบทั้งหมด (Frontend, Backend, Database) ได้ด้วยคำสั่งเดียว:
```bash
docker-compose up --build
```
ระบบจะพร้อมใช้งานที่:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api/v1

### วิธีที่ 2: การพัฒนาแบบ Local
1. **เตรียมฐานข้อมูล:** รัน PostgreSQL และสร้าง Database ชื่อ `vault_pro`
2. **Backend:**
   ```bash
   cd backend
   go mod download
   go run cmd/api/main.go
   ```
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🧪 การทดสอบระบบ (Testing)

- **Backend Unit Tests:** `cd backend && go test ./...`
- **Frontend Unit Tests:** `cd frontend && npm test`
- **End-to-End Tests:** `cd frontend && npx playwright test`

---
*จัดทำโดยทีมพัฒนา Vault Pro*
