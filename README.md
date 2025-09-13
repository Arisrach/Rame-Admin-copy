# Rame Admin Dashboard

Sistem administrasi untuk mengelola data Purchase Order PT. Rame Rekaguna Prakarsa dengan fitur login, dashboard interaktif, dan export data.

## 🚀 Fitur Utama

- **🔐 Sistem Login** - Autentikasi admin dengan database MySQL
- **📊 Dashboard Interaktif** - Tampilan data Purchase Order dengan editing inline
- **📈 Summary Cards** - Ringkasan total sales per group
- **📤 Export Data** - Export ke Excel (.xlsx) dan PDF
- **💾 Database Integration** - Penyimpanan data real-time ke MySQL
- **📱 Responsive Design** - Tampilan optimal di semua device

## 🛠️ Teknologi yang Digunakan

- **Frontend:** Next.js 15, React 19, TypeScript
- **UI Components:** shadcn/ui, Tailwind CSS
- **Database:** MySQL (XAMPP)
- **ORM:** Prisma
- **Export:** xlsx, jsPDF
- **Authentication:** bcryptjs

## 📋 Prerequisites

- XAMPP (Apache + MySQL)
- Node.js 18+ dan npm
- Git

## 🔧 Setup & Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd rame-admin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

#### Start XAMPP
1. Buka XAMPP Control Panel
2. Start **Apache** dan **MySQL**

#### Create Database
1. Buka phpMyAdmin: http://localhost/phpmyadmin
2. Buat database baru: `rame_admin`

#### Setup Environment
File `.env` sudah dikonfigurasi dengan:
```env
DATABASE_URL="mysql://root:@localhost:3306/rame_admin"
```

### 4. Initialize Database
```bash
# Create tables
/Applications/XAMPP/xamppfiles/bin/mysql -u root rame_admin -e "
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  group_name VARCHAR(50) NOT NULL,
  januari FLOAT DEFAULT 0,
  februari FLOAT DEFAULT 0,
  maret FLOAT DEFAULT 0,
  april FLOAT DEFAULT 0,
  mei FLOAT DEFAULT 0,
  juni FLOAT DEFAULT 0,
  juli FLOAT DEFAULT 0,
  agustus FLOAT DEFAULT 0,
  september FLOAT DEFAULT 0,
  oktober FLOAT DEFAULT 0,
  november FLOAT DEFAULT 0,
  desember FLOAT DEFAULT 0,
  totalQtyPO INT DEFAULT 0,
  totalValueSales FLOAT DEFAULT 0,
  targetGroup FLOAT,
  achieve FLOAT,
  year INT DEFAULT 2025,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);"

# Create default admin user
node scripts/setup-db.js

# Seed purchase order data
node scripts/seed-purchase-orders.js
```

### 5. Start Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di: http://localhost:3000

## 🔑 Default Login Credentials

- **Email:** admin@rame.com
- **Password:** admin123

⚠️ **PENTING:** Ganti password default setelah login pertama!

## 📊 Struktur Data

### Tabel: admins
- `id` - Primary key
- `email` - Email admin (unique)
- `password` - Password ter-hash
- `name` - Nama admin
- `role` - Role admin
- `isActive` - Status aktif
- `createdAt` - Tanggal dibuat
- `updatedAt` - Tanggal diupdate

### Tabel: purchase_orders
- `id` - Primary key
- `name` - Nama sales
- `group_name` - Group (A, B, C, D, Other)
- `januari` - `desember` - Data bulanan
- `totalQtyPO` - Total quantity PO
- `totalValueSales` - Total nilai sales
- `targetGroup` - Target group
- `achieve` - Persentase pencapaian
- `year` - Tahun data

## 🎯 Cara Penggunaan

### 1. Login
- Buka http://localhost:3000
- Masukkan email dan password
- Klik "Masuk"

### 2. Dashboard
- Lihat summary cards untuk total sales per group
- Klik pada cell data untuk mengedit
- Data akan otomatis tersimpan ke database

### 3. Export Data
- Klik "Export Excel" untuk download file .xlsx
- Klik "Export PDF" untuk download file .pdf

### 4. Logout
- Klik tombol "Logout" di header

## 📁 Struktur Project

```
rame-admin/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/     # API login
│   │   │   └── purchase-orders/ # API data PO
│   │   ├── dashboard/          # Halaman dashboard
│   │   └── page.tsx           # Halaman login
│   ├── components/ui/         # UI components
│   └── lib/                   # Utilities
├── prisma/
│   └── schema.prisma         # Database schema
├── scripts/
│   ├── setup-db.js          # Setup database
│   └── seed-purchase-orders.js # Seed data
└── public/                   # Static files
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## 🐛 Troubleshooting

### Database Connection Error
- Pastikan XAMPP MySQL berjalan
- Periksa konfigurasi DATABASE_URL di .env
- Pastikan database `rame_admin` sudah dibuat

### Port Already in Use
- Ganti port: `npm run dev -- -p 3001`
- Atau matikan aplikasi lain di port 3000

### API Error
- Periksa console browser untuk error details
- Pastikan database tables sudah dibuat
- Restart development server

## 📝 Notes

- Data akan otomatis tersimpan saat mengedit cell
- Export file akan didownload ke folder Downloads
- Aplikasi mendukung dark mode
- Responsive design untuk mobile dan desktop

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

Private project - PT. Rame Rekaguna Prakarsa