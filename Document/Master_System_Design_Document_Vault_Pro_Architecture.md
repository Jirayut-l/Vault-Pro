# Master System Design Document: Vault Pro Architecture

**System Name:** Vault Pro
**Version:** 11.0 (Consolidated Master Document)
**Architect:** Alex

## Table of Contents
1. Executive Summary
2. Core Features & Functional Requirements
3. High-Level Architecture, Tech Stack & DevOps
4. Database Schema Updates
5. RESTful API Endpoints (Full Documentation)
6. JWT System Technical Specification
7. User Interface (UI) Architecture & Specification

## 1. Executive Summary
เอกสารฉบับนี้เป็น "Master Document" ที่รวบรวมการออกแบบระบบ **"Vault Pro"** สำหรับการเปลี่ยนการจัดการการเงินส่วนบุคคลจากระบบ Manual ไปสู่ Software Architecture ระดับมืออาชีพ โดยบูรณาการระบบความปลอดภัยผ่าน Authentication/Login (JWT), API Endpoints แบบครบวงจร, และข้อกำหนด UI Specification สำหรับการพัฒนาหน้าจอ Dashboard ที่รองรับ Data Visualization อย่างสมบูรณ์

## 2. Core Features & Functional Requirements
| Category | Features Description |
| :--- | :--- |
| **Authentication** | ระบบ Login, Register และจัดการ Session ด้วย JWT เพื่อความปลอดภัยของข้อมูลการเงิน |
| **Account Management** | จัดการบัญชีแยกย่อย (Necessity, Play, Long-term, Financial Freedom, Education, Give/Mom, Condo) |
| **Transaction Engine** | รองรับ Income, Expense, Inter-account Transfers, และ Full CRUD Operations |
| **Investment Tracker** | บันทึกรายการซื้อ/ขายกองทุนเพื่อลดหย่อนภาษี (RMF/Thai ESG/ETF) และคำนวณต้นทุนเฉลี่ย/NAV |
| **Subscription & Dashboard** | ระบบจัดการค่าใช้จ่ายรายเดือนอัตโนมัติ และ Dashboard สรุปภาพรวมรายเดือน |

## 3. High-Level Architecture, Tech Stack & DevOps
* **Frontend:** Next.js (TypeScript), **Tailwind CSS V4+**, และ NextAuth.js (Auth.js) สำหรับจัดการ Session รองรับ Responsive Design
* **Backend:** Go (Golang) มอบประสิทธิภาพสูงและ Type-safety ใช้ JWT ป้องกัน Endpoints
* **Database:** PostgreSQL ใช้ Bcrypt เข้ารหัสรหัสผ่านผู้ใช้ และ Decimal สำหรับคำนวณยอดเงิน
* **ORM:** Gorm (Golang)
* **DevOps & Infrastructure (New):** บริหารจัดการ Environment ด้วย **Docker Containerization** เพื่อแยก Service (Frontend, Backend, Database) ออกเป็น Container ที่ชัดเจน (Docker Compose) ทำให้ง่ายต่อการ Deploy ขึ้น Server และรองรับการทำ CI/CD Pipeline ในอนาคต

## 4. Database Schema Updates
โครงสร้างหลักประกอบด้วยตาราง Users, Accounts, Transactions, Internal_Loans, Investments และ Subscriptions

### 4.1 Table: Subscriptions (รายการประจำ/รายเดือน)
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| id | UUID (PK) | รหัสรายการ |
| user_id | UUID (FK) | เจ้าของรายการ |
| name | VARCHAR(100) | ชื่อบริการ (เช่น Zwift, YouTube Premium) |
| amount | DECIMAL(15,2) | จำนวนเงินที่ถูกเรียกเก็บ |
| billing_cycle_day | INT | วันที่ต้องตัดรอบบิลของทุกเดือน (1-31) |
| account_id | UUID (FK) | กำหนดว่าให้ตัดเงินจาก Jar ไหน |

## 5. RESTful API Endpoints (Full Documentation)

### 5.1 Authentication (ระบบล็อคอิน)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/auth/register` | สมัครสมาชิก |
| **POST** | `/api/v1/auth/login` | ล็อคอิน (คืนค่า JWT Token) |
| **GET** | `/api/v1/auth/me` | ดึงข้อมูล User ปัจจุบัน |

### 5.2 Dashboard & Reporting
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/dashboard/summary` | ดึงข้อมูลสรุปยอดเงินคงเหลือทั้ง 6 Jars พร้อมสรุปรายรับ-รายจ่ายรวมของเดือน |
| **GET** | `/api/v1/dashboard/expenses-by-category` | ดึงข้อมูลแยกหมวดหมู่เพื่อแสดงกราฟวงกลม (Pie Chart) |

### 5.3 Transaction Engine (จัดการธุรกรรม)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/transactions` | ดูประวัติรายการทั้งหมด (รองรับ Filter: Month, Year) |
| **POST** | `/api/v1/transactions` | สร้างรายการใหม่ (Income, Expense, Transfer) |
| **PUT** | `/api/v1/transactions/{id}` | แก้ไขรายการ (เปลี่ยนยอดเงิน, หมวดหมู่, หรือบัญชี) |
| **DELETE** | `/api/v1/transactions/{id}` | ลบรายการที่บันทึกผิดพลาด |

### 5.4 Subscriptions & Investments
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/subscriptions` | ดูรายการจ่ายประจำทั้งหมด |
| **POST** | `/api/v1/subscriptions` | ตั้งค่ารายการตัดเงินอัตโนมัติทุกเดือน |
| **GET** | `/api/v1/investments` | ดึงภาพรวมพอร์ต (RMF/Thai ESG/ETF) |
| **POST** | `/api/v1/investments/buy` | บันทึกรายการซื้อกองทุน |

## 6. JWT System Technical Specification
แนวทางการนำ JSON Web Token (JWT) มาใช้สำหรับการจัดการ Session และความปลอดภัยของ API Endpoints

### 6.1 Token Model & Encoding
* **Access Token:** ใช้ยืนยันตัวตน อายุสั้น (15-30 นาที) ส่งผ่าน `Authorization: Bearer Token`
* **Refresh Token:** ใช้ขอ Access Token ใหม่ อายุยาว (7-30 วัน) เก็บใน HttpOnly Cookie อย่างปลอดภัย
* **Algorithm:** HS256 หรือ RS256 สำหรับการลงนามโดย Go Backend

### 6.2 Security Best Practices
| Component | Best Practice |
| :--- | :--- |
| **Storage** | Access Token เก็บใน Memory, Refresh Token เก็บใน HttpOnly Cookie ป้องกัน XSS/CSRF (SameSite=Strict) |
| **Revocation** | เพิกถอน Refresh Token ทันทีเมื่อ Logout โดยใช้ Blacklist (Redis Cache) |
| **Validation** | Backend ตรวจสอบ Signature, วันหมดอายุ (exp), และสิทธิ์ของ User ก่อนรัน Query เสมอ |

## 7. User Interface (UI) Architecture & Specification
การออกแบบ UI ยึดหลัก Clean, Modern, Dark Mode-ready และเน้น Data Visualization เพื่อให้ผู้ใช้สามารถดูภาพรวมทางการเงินได้อย่างรวดเร็ว

### 7.1 Layout Structure (Dashboard)
* **Sidebar (Left Panel):** เมนูนำทางหลัก (Dashboard, Transactions, 6 Jars, Investments, Settings)
* **Top Header:** ช่องค้นหา (Search), การแจ้งเตือน, และ Profile
* **Main Content:** พื้นที่จัดแสดง Dashboard Metrics

### 7.2 Core Components & Styling (Tailwind CSS V4+)
| Component | Specification & Details |
| :--- | :--- |
| **Total Balance Cards** | แสดงยอดเงินรวม พร้อมตัวบ่งชี้แนวโน้ม (Trend Indicator) สีเขียว/แดง |
| **Statistics Chart** | กราฟแท่ง (Bar Chart) หรือ Area Chart แสดง Revenue Trajectory (Recharts / Chart.js) |
| **Accounts / Jars View** | Card ย่อยแสดงสถานะ 6 Jars พร้อม Progress Bar การใช้งานตามเปอร์เซ็นต์ |
| **Recent Transactions** | ตารางรายการเคลื่อนไหวล่าสุด (Activity Stream) แสดงรายการรับ-จ่ายแบบ Real-time |
