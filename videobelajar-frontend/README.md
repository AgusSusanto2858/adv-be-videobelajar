# 🎓 VideoBelajar - Platform Pembelajaran Online

Platform pembelajaran video interaktif yang memungkinkan pengguna mengakses koleksi video pembelajaran berkualitas tinggi dengan fitur guest mode untuk pengalaman uji coba.

## 🛠️ Update
* **Implementasi:** Implementasi stetate management menggunakan library redux

🎮 Demo Accounts
Untuk testing, gunakan akun berikut:
Admin Account
Email: admin@videobelajar.com
Password: admin123
Demo User Account
Email: user@example.com
Password: 123456

## 🛠️ Tech Stack

* **Frontend:** React 18 + Vite
* **Styling:** TailwindCSS
* **Routing:** React Router DOM
* **State Management:** React Hooks
* **Icons:** Lucide React
* **Build Tool:** Vite
* **Linting:** ESLint

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── atoms/           # Komponen terkecil (Button, Input, dll)
│   ├── molecules/       # Kombinasi atoms (Hero, Newsletter, dll)
│   └── organisms/       # Komponen kompleks (Navbar, Footer, dll)
├── layouts/             # Layout wrapper
├── pages/               # Halaman utama
├── data/                # Data statis dan mock
├── assets/              # Gambar, icons, dll
└── routes/              # Konfigurasi routing
```

## 🚀 Quick Start

### Prerequisites

Pastikan Anda memiliki software berikut:
* Node.js (v18 atau lebih baru)
* npm atau yarn

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/AgusSusanto2858/adv2-videobelajar.git
   cd adv2-videobelajar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. **Buka browser**
   ```
   http://localhost:5173
   ```

## 📖 Available Scripts

```bash
# Development
npm run dev          # Menjalankan development server
npm run build        # Build untuk production
npm run preview      # Preview build production
npm run lint         # Linting dengan ESLint
```
