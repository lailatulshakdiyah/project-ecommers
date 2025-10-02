# DataPak Store - E-Commerce Paket Data Internet

Sebuah aplikasi web e-commerce untuk pembelian paket data internet yang dibangun dengan Next.js, TypeScript, Ant Design, dan JSON Server sebagai mock backend.

## Fitur

- 🔐 **Autentikasi**: Sistem login untuk admin dan customer
- 👥 **Manajemen Customer**: CRUD operations untuk data customer
- 📦 **Paket Data**: Katalog paket data internet dengan berbagai kategori
- 💳 **Transaksi**: Sistem pembelian paket dengan validasi saldo
- 📊 **Dashboard**: Overview statistik dan data transaksi terbaru
- 📱 **Responsive Design**: Optimized untuk desktop dan mobile

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, React 19
- **UI Library**: Ant Design
- **Styling**: Tailwind CSS
- **Font**: Roboto
- **Backend**: JSON Server (Mock API)
- **HTTP Client**: Axios
- **State Management**: React Context & Hooks

## Prerequisites

- Node.js (v18 atau lebih baru)
- npm atau yarn

## Installation & Setup

1. **Clone repository dan install dependencies**
   ```bash
   npm install
   ```

2. **Jalankan JSON Server dan Next.js development server**
   ```bash
   npm run dev:full
   ```
   
   Atau jalankan secara terpisah:
   ```bash
   # Terminal 1 - JSON Server
   npm run json-server
   
   # Terminal 2 - Next.js
   npm run dev
   ```

3. **Akses aplikasi**
   - Frontend: http://localhost:3000
   - JSON Server API: http://localhost:3001

## Demo Credentials

### Admin
- Username: `admin`
- Password: `admin123`
- **Access**: Full admin dashboard, customer management, transaction management

### Customer
- Username: `customer1`
- Password: `password`
- **Access**: Customer dashboard, buy packages, view profile & transaction history

## API Endpoints (JSON Server)

- `GET /users` - Daftar user
- `GET /customers` - Daftar customer
- `POST /customers` - Tambah customer baru
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Hapus customer
- `GET /packages` - Daftar paket data
- `GET /transactions` - Daftar transaksi
- `POST /transactions` - Buat transaksi baru

## Project Structure

```
project-ecommers/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── customers/         # Customer management
│   ├── transactions/      # Transaction management
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── customer/        # Customer components
│   ├── transaction/     # Transaction components
│   └── DashboardLayout.tsx
├── hooks/               # Custom React hooks
│   └── useAuth.tsx     # Authentication context
├── lib/                # Utilities
│   └── api.ts          # API service layer
├── types/              # TypeScript type definitions
│   └── index.ts
├── db.json            # JSON Server database
└── package.json
```

## Features Walkthrough

### 1. Authentication
- Login dengan username/password
- Persistent session dengan localStorage
- Route protection untuk halaman yang memerlukan auth

### 2. Dashboard
- Statistik overview (customers, transactions, revenue)
- Tabel transaksi terbaru
- Cards untuk metrics utama

### 3. Customer Management
- Tabel daftar customer dengan pagination
- Form add/edit customer
- Delete customer dengan confirmation
- Validasi email dan required fields

### 4. Transaction Management
- Katalog paket data dengan cards
- Form pembuatan transaksi
- Validasi saldo customer
- Update saldo otomatis setelah transaksi
- History transaksi dengan status

### 5. Package Catalog
- 5 paket data dengan kategori berbeda
- Harga dan kuota yang bervariasi
- Visual cards dengan color coding

## Development Notes

### Custom Hooks
- `useAuth`: Mengelola state authentication dan localStorage
- Context Provider pattern untuk sharing auth state

### API Layer
- Centralized API calls di `lib/api.ts`
- Error handling dan TypeScript interfaces
- Axios interceptors untuk common configs

### Responsive Design
- Ant Design Grid system
- Mobile-first approach
- Adaptive layout untuk berbagai screen size

### State Management
- React Context untuk global auth state
- Local state dengan useState untuk component-level data
- useEffect untuk data fetching lifecycle

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run json-server` - Start JSON Server mock API
- `npm run dev:full` - Start both servers concurrently
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Mock Data

Database awal (`db.json`) sudah terisi dengan:
- 2 users (1 admin, 1 customer)
- 3 customers dengan saldo berbeda
- 5 paket data internet
- 2 sample transactions

## Future Enhancements

- [ ] Real-time notifications
- [ ] Payment gateway integration
- [ ] Customer dashboard untuk self-service
- [ ] Advanced reporting dan analytics
- [ ] Email notifications
- [ ] Customer wallet top-up
- [ ] Package recommendations
- [ ] Usage tracking

## Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
