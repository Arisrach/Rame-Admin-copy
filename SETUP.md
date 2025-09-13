# Setup Rame Admin dengan XAMPP dan MySQL

## Prerequisites
- XAMPP terinstall dan berjalan
- Node.js dan npm terinstall
- Git terinstall

## Langkah-langkah Setup

### 1. Setup Database MySQL

1. **Buka XAMPP Control Panel**
2. **Start Apache dan MySQL**
3. **Buka phpMyAdmin** (http://localhost/phpmyadmin)
4. **Buat database baru** dengan nama `rame_admin`

### 2. Setup Environment

1. **Copy file environment:**
   ```bash
   cp .env.local .env
   ```

2. **Edit file .env** dan sesuaikan konfigurasi database:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/rame_admin"
   ```

   Jika MySQL root memiliki password, gunakan:
   ```env
   DATABASE_URL="mysql://root:your_password@localhost:3306/rame_admin"
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migration

```bash
npx prisma db push
```

### 6. Setup Default Admin User

```bash
node scripts/setup-db.js
```

### 7. Start Development Server

```bash
npm run dev
```

## Default Login Credentials

Setelah menjalankan setup, Anda dapat login dengan:

- **Email:** admin@rame.com
- **Password:** admin123

⚠️ **PENTING:** Ganti password default setelah login pertama!

## Struktur Database

### Tabel: admins
- `id` - Primary key (auto increment)
- `email` - Email admin (unique)
- `password` - Password ter-hash
- `name` - Nama admin (optional)
- `role` - Role admin (default: "admin")
- `isActive` - Status aktif (default: true)
- `createdAt` - Tanggal dibuat
- `updatedAt` - Tanggal diupdate

## Troubleshooting

### Database Connection Error
- Pastikan XAMPP MySQL berjalan
- Periksa konfigurasi DATABASE_URL di .env
- Pastikan database `rame_admin` sudah dibuat

### Prisma Error
- Jalankan `npx prisma generate` ulang
- Pastikan Prisma schema sudah benar

### Port Already in Use
- Ganti port di package.json atau matikan aplikasi lain yang menggunakan port 3000

## Development Commands

```bash
# Start development server
npm run dev

# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database
npx prisma db push --force-reset
```
