# Netlify Deployment Guide

## 🚀 Deploy ROC Dashboard to Netlify

This guide will help you deploy your ROC Dashboard application to Netlify with serverless functions.

## 📋 Prerequisites

1. **Netlify Account**: Create a free account at [netlify.com](https://netlify.com)
2. **Netlify CLI**: Install globally or use the provided script
3. **Git Repository**: Your code should be in a Git repository

## 🛠️ Deployment Methods

### Method 1: Automated Script (Recommended)

**Windows:**
```powershell
.\deploy-netlify.ps1
```

**Mac/Linux:**
```bash
chmod +x deploy-netlify.sh
./deploy-netlify.sh
```

### Method 2: Manual Deployment

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build Frontend:**
```bash
cd frontend
npm install
npm run build
cd ..
```

3. **Install Function Dependencies:**
```bash
pip install -r netlify/functions/requirements.txt
```

4. **Deploy to Netlify:**
```bash
netlify deploy --prod --dir=frontend/dist --functions=netlify/functions
```

### Method 3: Git-based Deployment (CI/CD)

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Configure build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Functions directory**: `netlify/functions`

## 📁 Project Structure for Netlify

```
rocdash/
├── frontend/
│   ├── dist/              # Built frontend (static files)
│   └── package.json       # Frontend dependencies
├── netlify/
│   └── functions/
│       ├── api.py         # Main API function
│       ├── engineers.py   # Engineers API
│       ├── machines.py    # Machines API
│       └── requirements.txt
├── netlify.toml           # Netlify configuration
└── backend/               # Original Flask backend (source for functions)
```

## ⚙️ Configuration

### netlify.toml
- **Build output**: `frontend/dist`
- **Functions**: `netlify/functions`
- **API redirects**: `/api/*` → `/.netlify/functions/:splat`
- **SPA fallback**: All routes → `/index.html`

### Environment Variables
Set these in your Netlify dashboard:
- `PYTHON_VERSION`: `3.9`
- `NODE_VERSION`: `18`

## 🔧 How It Works

1. **Frontend**: React app built to static files in `frontend/dist`
2. **Backend**: Flask routes converted to Netlify Functions
3. **API Calls**: Frontend calls `/api/*` which redirects to functions
4. **Data**: CSV files in `data/` directory are included in build

## 🌐 Accessing Your App

After deployment:
- **Main app**: `https://your-site.netlify.app`
- **API endpoints**: `https://your-site.netlify.app/api/engineers`

## 🐛 Troubleshooting

### Function Errors
- Check Netlify Functions logs in dashboard
- Ensure all dependencies are in `requirements.txt`
- Verify Python version compatibility

### Build Errors
- Check frontend build logs
- Ensure all npm dependencies are installed
- Verify build command in Netlify settings

### API Connection Issues
- Check redirect rules in `netlify.toml`
- Verify function names match API routes
- Check CORS settings

## 📝 Notes

- CSV data files are read-only in Netlify Functions
- File uploads may need alternative storage (e.g., Netlify Forms, S3)
- For production, consider using a database instead of CSV files

## 🔄 Updates

To update your deployment:
1. Make changes to your code
2. Run the deployment script again
3. Or push to Git if using CI/CD

## 📞 Support

- Netlify Documentation: [docs.netlify.com](https://docs.netlify.com)
- Functions Guide: [functions.netlify.com](https://functions.netlify.com)
