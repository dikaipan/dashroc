# Spesifikasi Sistem - ROC Dashboard

## 📋 System Requirements

### Minimum System Requirements

#### Operating System
- **Windows**: Windows 10 atau lebih baru
- **Linux**: Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- **macOS**: macOS 10.15 (Catalina) atau lebih baru

#### Hardware
- **CPU**: Dual-core processor 2.0 GHz atau lebih baik
- **RAM**: Minimum 4 GB (Recommended: 8 GB)
- **Storage**: Minimum 2 GB free space
- **Network**: Internet connection untuk mengunduh dependencies

### Software Requirements

#### Backend (Python)
- **Python**: 3.8 atau lebih baru (Recommended: 3.10+)
- **Package Manager**: pip (included dengan Python)

#### Frontend (Node.js)
- **Node.js**: 18.0.0 atau lebih baru (Recommended: 18.x atau 20.x LTS)
- **Package Manager**: npm (included dengan Node.js) atau yarn

#### Browser (untuk mengakses aplikasi)
- **Chrome**: 90+ (Recommended)
- **Firefox**: 88+
- **Edge**: 90+
- **Safari**: 14+

## 📦 Dependencies

### Backend Dependencies (Python)
```
Flask==2.3.3
Flask-CORS==4.0.0
pandas==2.0.3
python-dotenv==1.0.0
```

**Development Dependencies** (optional):
```
pytest==7.4.3
pytest-cov==4.1.0
pytest-flask==1.3.0
pytest-mock==3.12.0
black==23.12.1
flake8==6.1.0
mypy==1.7.1
isort==5.13.2
```

### Frontend Dependencies (Node.js)

**Core Dependencies**:
- React 19.1.1
- React DOM 19.1.1
- React Router 7.9.5
- Vite 5.4.21
- Tailwind CSS 3.4.18

**Libraries**:
- Leaflet 1.9.4 (Maps)
- React-Leaflet 5.0.0 (React wrapper untuk Leaflet)
- Recharts 3.3.0 (Charts)
- React-Feather 2.0.10 (Icons)
- React-Hot-Toast 2.4.1 (Notifications)
- PapaParse 5.5.3 (CSV parsing)

**Development Dependencies**:
- ESLint 9.36.0
- Vitest 1.6.1 (Testing)
- @vitejs/plugin-react 5.0.4

## 🚀 Installation Steps

### 1. Install Python 3.8+

**Windows**:
- Download dari https://www.python.org/downloads/
- Pastikan "Add Python to PATH" dicentang saat instalasi
- Verify: `python --version`

**Linux**:
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

**macOS**:
```bash
brew install python3
```

### 2. Install Node.js 18+

**Windows/Linux/macOS**:
- Download dari https://nodejs.org/ (pilih LTS version)
- Verify: `node --version` dan `npm --version`

**Linux (alternative)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Clone & Setup Project

```bash
# Clone repository
git clone <repository-url>
cd rocdash

# Setup Backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install Python dependencies
pip install flask flask-cors pandas python-dotenv

# Setup Frontend
cd frontend
npm install
cd ..
```

## 🔧 Configuration

### Environment Variables

Create `.env` file di root directory:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
HOST=0.0.0.0
PORT=5000

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Data Directory
DATA_DIR=./data
```

### Frontend Configuration

Edit `frontend/vite.config.js` untuk mengubah:
- API proxy target (default: `http://127.0.0.1:5000`)
- Port development server (default: `5173`)

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend**:
```bash
# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Run Flask server
python app.py
```
Backend akan berjalan di: `http://localhost:5000`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di: `http://localhost:5173`

### Production Mode

**Build Frontend**:
```bash
cd frontend
npm run build
```

**Run Backend**:
```bash
# Set environment
export DEBUG=False
export SECRET_KEY=your-production-secret-key

# Run
python app.py
```

## 📊 Ports Used

- **Backend API**: `5000` (default)
- **Frontend Dev Server**: `5173` (default)
- **Frontend Production**: Served oleh Flask di port `5000`

## 🗂️ Data Files Required

Pastikan file CSV berikut ada di folder `data/`:
- `data_ce.csv` - Engineer data
- `data_mesin.csv` - Machine data
- `stok_part.csv` - Stock parts data
- `alamat_fsl.csv` - FSL locations data
- `data_mesin_perbulan.csv` - Monthly machine data

## ✅ Verification Checklist

Setelah instalasi, verifikasi:

- [ ] Python 3.8+ terinstall: `python --version`
- [ ] Node.js 18+ terinstall: `node --version`
- [ ] npm terinstall: `npm --version`
- [ ] Virtual environment aktif
- [ ] Python dependencies terinstall
- [ ] Node.js dependencies terinstall (`frontend/node_modules` ada)
- [ ] Data CSV files ada di folder `data/`
- [ ] Backend bisa dijalankan: `python app.py`
- [ ] Frontend bisa dijalankan: `cd frontend && npm run dev`
- [ ] Browser bisa mengakses `http://localhost:5173`

## 🐛 Troubleshooting

### Python Issues
- **Module not found**: Pastikan virtual environment aktif dan dependencies terinstall
- **Port 5000 already in use**: Ubah PORT di `.env` atau kill process yang menggunakan port 5000

### Node.js Issues
- **npm install fails**: Clear cache: `npm cache clean --force`
- **Port 5173 already in use**: Ubah port di `vite.config.js`
- **Module resolution errors**: Hapus `node_modules` dan `package-lock.json`, lalu `npm install` lagi

### Build Issues
- **Build fails**: Pastikan semua dependencies terinstall
- **Permission errors**: Pastikan folder `frontend/dist` bisa di-write

## 📝 Notes

- Aplikasi ini menggunakan **Vite** sebagai build tool (bukan Create React App)
- Backend menggunakan **Flask** dengan **CSV-based storage** (bukan database)
- Frontend menggunakan **React 19** dengan **React Router 7**
- Maps menggunakan **Leaflet** dengan **OpenStreetMap** tiles
- Charts menggunakan **Recharts** library

## 🔗 Useful Commands

```bash
# Backend
python app.py                    # Run Flask server
pytest                           # Run tests
pytest --cov                     # Run tests with coverage

# Frontend
npm run dev                      # Development server
npm run build                    # Production build
npm run preview                  # Preview production build
npm test                         # Run tests
npm run lint                     # Lint code
```

