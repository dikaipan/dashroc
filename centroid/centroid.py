import pandas as pd
import geopandas as gpd

# =================================================================
# 1. Kamus Pemetaan Perbaikan FINAL (V7)
# =================================================================
provinsi_mapping = {
    # Fokus pada sisa 4 nama yang gagal:
    'Nusa Tenggara Barat': 'NUSA TENGGARA BARAT', # Nama lengkap
    'Kepulauan Bangka Belitung': 'KEPULAUAN BANGKA BELITUNG', # Nama lengkap
    'Nanggroe Aceh Darussalam': 'ACEH', # Map ke nama yang lebih sederhana
    'Aceh': 'ACEH',
    
    # Tambahkan mapping lain yang sudah terbukti dibutuhkan:
    'DI Yogyakarta': 'DAERAH ISTIMEWA YOGYAKARTA', 
    'Sumatra Utara': 'SUMATERA UTARA',
    'Sumatra Selatan': 'SUMATERA SELATAN',
    'Sumatra Barat': 'SUMATERA BARAT',
    'sumatra Selatan': 'SUMATERA SELATAN',
    'sumatra Utara': 'SUMATERA UTARA',
    'sumatra Barat': 'SUMATERA BARAT',
    'West Java': 'JAWA BARAT',
    'Kalimantan Selata': 'KALIMANTAN SELATAN',
    'Tangerang': 'BANTEN', 
    'Jakarta': 'DKI JAKARTA',
    'Papua Selatan': 'PAPUA', 
    'Papua Barat daya': 'PAPUA BARAT',
    'papua Tengah': 'PAPUA',
    'Papua Tengah': 'PAPUA',
    'Papua Pegunungan': 'PAPUA',
    'nan': None, 
    '0': None, 
}

# --- 2. Muat Data ---
df_mesin = pd.read_csv('data_mesin.csv') 
gdf_provinsi = gpd.read_file('indonesia-prov.geojson')

# ----------------------------------------------------
# 3. Pembersihan dan Pemetaan Data Mesin (CSV)
# ----------------------------------------------------

# Hapus baris di mana kolom 'provinsi' adalah nilai string 'nan' atau '0'
df_mesin = df_mesin[~df_mesin['provinsi'].astype(str).str.lower().str.strip().isin(['nan', '0'])]

# Terapkan pemetaan perbaikan
df_mesin['provinsi_cleaned'] = df_mesin['provinsi'].replace(provinsi_mapping, regex=False)

# Bersihkan kolom provinsi untuk dijadikan kunci merge
df_mesin['provinsi_key'] = df_mesin['provinsi_cleaned'].astype(str).str.lower().str.strip()


# ----------------------------------------------------
# 4. Pembersihan dan Centroid GeoJSON
# ----------------------------------------------------
# Bersihkan kolom Propinsi di GeoJSON untuk dijadikan kunci merge
gdf_provinsi['provinsi_key'] = gdf_provinsi['Propinsi'].astype(str).str.lower().str.strip()

# Hitung Centroid (re-proyeksi untuk akurasi)
gdf_provinsi['centroid'] = gdf_provinsi.to_crs(epsg=3857).geometry.centroid.to_crs(gdf_provinsi.crs)
gdf_provinsi['latitude'] = gdf_provinsi['centroid'].y
gdf_provinsi['longitude'] = gdf_provinsi['centroid'].x

# Siapkan Tabel Pencarian Centroid
centroid_lookup = gdf_provinsi[['provinsi_key', 'latitude', 'longitude']].copy()

# ----------------------------------------------------
# 5. Gabungkan Koordinat ke Data Mesin
# ----------------------------------------------------
df_mesin_with_coords = pd.merge(
    df_mesin,
    centroid_lookup,
    on='provinsi_key', 
    how='left'
)

# Hapus kolom bantuan
df_mesin_with_coords.drop(columns=['provinsi_key', 'provinsi_cleaned'], inplace=True)


# --- 6. Verifikasi dan Simpan Hasil ---
df_nan_final = df_mesin_with_coords[df_mesin_with_coords['latitude'].isna()]

print("\n---------------------------------------------------------")
print(f"✅ Total data terkonversi (Non-NaN): {df_mesin_with_coords['latitude'].count()} dari {len(df_mesin_with_coords)} baris")
print(f"❌ Jumlah baris yang gagal dikonversi (NaN): {len(df_nan_final)}")
print("Nama Provinsi yang **Masih** Gagal Cocok (Sisaan Terakhir):")
print(df_nan_final['provinsi'].unique())
print("---------------------------------------------------------")

df_mesin_with_coords.to_csv('data_mesin_dengan_centroid_FINAL_V7.csv', index=False)
print("\nFile baru 'data_mesin_dengan_centroid_FINAL_V7.csv' telah berhasil dibuat.")