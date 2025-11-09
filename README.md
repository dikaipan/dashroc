# ROC Dashboard

Dashboard untuk Engineering & Machine Management System.

## 🚀 Features

- **Dashboard**: Overview data engineer dan mesin dengan visualisasi interaktif
- **Engineers Management**: CRUD operations untuk data engineer/teknisi
- **Machines Management**: CRUD operations untuk data mesin
- **Stock Parts Management**: Manajemen spare parts inventory
- **FSL Locations**: Manajemen Field Service Location (gudang regional)
- **Decision Support**: Analisis data untuk pengambilan keputusan
- **Structure View**: Visualisasi struktur organisasi
- **Interactive Maps**: Peta interaktif dengan Leaflet
- **Charts & Analytics**: Visualisasi data dengan Recharts
- **Dark Mode**: Support dark/light theme

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- npm atau yarn

## 🛠️ Installation

### Backend

1. Clone repository:
```bash
git clone <repository-url>
cd rocdash
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
# Edit .env file with your configuration
```

5. Run backend:
```bash
python app.py
```

Backend akan berjalan di `http://localhost:5000`

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
cp .env.example .env
# Edit .env file with your API URL
```

4. Run development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

5. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
rocdash/
├── backend/           # Flask backend
│   ├── models/       # Data models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Utility functions
│   │   └── contexts/    # React contexts
│   └── dist/         # Build output
├── data/             # CSV data files
├── config.py         # Configuration
├── app.py            # Flask application
└── requirements.txt  # Python dependencies
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `SECRET_KEY`: Secret key untuk Flask session
- `DEBUG`: Debug mode (True/False)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 5000)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)

### Frontend Configuration

Edit `frontend/vite.config.js` untuk mengubah API proxy target.

## 📊 API Endpoints

### Engineers
- `GET /api/engineers` - Get all engineers
- `POST /api/engineers` - Create engineer
- `GET /api/engineers/<id>` - Get engineer by ID
- `PUT /api/engineers/<id>` - Update engineer
- `DELETE /api/engineers/<id>` - Delete engineer

### Machines
- `GET /api/machines` - Get all machines
- `POST /api/machines` - Create machine
- `GET /api/machines/<wsid>` - Get machine by WSID
- `PUT /api/machines/<wsid>` - Update machine
- `DELETE /api/machines/<wsid>` - Delete machine

### Stock Parts
- `GET /api/stock-parts` - Get all stock parts
- `POST /api/stock-parts` - Create stock part
- `GET /api/stock-parts/<part_number>` - Get stock part by part number
- `PUT /api/stock-parts/<part_number>` - Update stock part
- `DELETE /api/stock-parts/<part_number>` - Delete stock part

### FSL Locations
- `GET /api/fsl-locations` - Get all FSL locations

### Monthly Machines
- `GET /api/monthly-machines` - Get monthly machine data

## 🧪 Testing

```bash
# Backend tests
pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Production Build

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Run backend:
```bash
python app.py
```

### Docker (Coming Soon)

```bash
docker-compose up -d
```

## 📝 Development

### Code Style

- Backend: Follow PEP 8
- Frontend: ESLint configuration included

### Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🐛 Troubleshooting

### Backend Issues

- **Port already in use**: Change PORT in `.env`
- **CSV file locked**: Close Excel/Notepad if CSV file is open
- **Permission denied**: Check file permissions

### Frontend Issues

- **API connection failed**: Check API URL in `vite.config.js`
- **Build fails**: Clear `node_modules` and reinstall
- **CORS errors**: Check CORS configuration in backend

## 📄 License

This project is proprietary software.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- React Team
- Flask Team
- Leaflet for maps
- Recharts for charts

