# Fungsi untuk memvalidasi data engineer/teknisi
def validate_engineer(data, is_create=False):
    """
    Memvalidasi data engineer/teknisi sebelum disimpan ke database.
    
    Fungsi ini memeriksa kelengkapan dan kebenaran format data engineer,
    termasuk field wajib (ID dan nama) serta koordinat geografis (latitude dan longitude).
    
    Args:
        data (dict): Dictionary berisi data engineer yang akan divalidasi.
                     Field yang diharapkan:
                     - id (str, wajib): ID unik engineer
                     - name (str, wajib): Nama lengkap engineer
                     - latitude (float, opsional): Koordinat garis lintang (-90 hingga 90)
                     - longitude (float, opsional): Koordinat garis bujur (-180 hingga 180)
        is_create (bool, optional): Flag untuk menandakan apakah ini operasi create.
                                    Default: False
    
    Returns:
        bool: True jika semua validasi berhasil
    
    Raises:
        ValueError: Jika ID atau name kosong/tidak ada
        ValueError: Jika latitude tidak dalam rentang -90 hingga 90
        ValueError: Jika longitude tidak dalam rentang -180 hingga 180
        ValueError: Jika format latitude atau longitude tidak valid
    
    Contoh:
        >>> data = {'id': 'ENG001', 'name': 'John Doe', 'latitude': -6.2088, 'longitude': 106.8456}
        >>> validate_engineer(data)
        True
    """
    # Blok 1: Validasi field wajib (ID dan nama)
    # Memastikan data engineer memiliki ID dan nama yang tidak kosong
    if not data.get('id') or not data.get('name'):
        raise ValueError("ID and name are required")
    
    # Blok 2: Validasi latitude (garis lintang)
    # Memastikan nilai latitude berada dalam rentang -90 hingga 90 derajat
    if 'latitude' in data and data['latitude']:
        try:
            lat = float(data['latitude'])
            if not (-90 <= lat <= 90):
                raise ValueError("Latitude must be between -90 and 90")
        except (ValueError, TypeError):
            raise ValueError("Invalid latitude format")
    
    # Blok 3: Validasi longitude (garis bujur)
    # Memastikan nilai longitude berada dalam rentang -180 hingga 180 derajat
    if 'longitude' in data and data['longitude']:
        try:
            lng = float(data['longitude'])
            if not (-180 <= lng <= 180):
                raise ValueError("Longitude must be between -180 and 180")
        except (ValueError, TypeError):
            raise ValueError("Invalid longitude format")
    
    return True

# Fungsi untuk memvalidasi data mesin
def validate_machine(data, is_create=False):
    """
    Memvalidasi data mesin sebelum disimpan ke database.
    
    Fungsi ini memeriksa kelengkapan data mesin termasuk WSID dan nama cabang,
    serta memvalidasi status mesin jika tersedia.
    
    Args:
        data (dict): Dictionary berisi data mesin yang akan divalidasi.
                     Field yang diharapkan:
                     - wsid (str, wajib): Workshop/Workstation ID mesin
                     - branch_name (str, wajib): Nama cabang tempat mesin berada
                     - machine_status (str, opsional): Status mesin, harus salah satu dari:
                       * 'Active': Mesin beroperasi normal
                       * 'Inactive': Mesin tidak aktif
                       * 'Maintenance': Mesin sedang dalam pemeliharaan
                       * 'Down': Mesin rusak/tidak berfungsi
        is_create (bool, optional): Flag untuk menandakan apakah ini operasi create.
                                    Default: False
    
    Returns:
        bool: True jika semua validasi berhasil
    
    Raises:
        ValueError: Jika WSID kosong atau tidak ada
        ValueError: Jika branch_name kosong atau tidak ada
    
    Note:
        Jika machine_status tidak valid, akan menampilkan warning tetapi tidak throw error.
    
    Contoh:
        >>> data = {'wsid': 'WS001', 'branch_name': 'Jakarta Pusat', 'machine_status': 'Active'}
        >>> validate_machine(data)
        True
    """
    # Blok 1: Validasi WSID (Workshop/Workstation ID)
    # Memastikan setiap mesin memiliki WSID yang tidak kosong
    if not data.get('wsid'):
        raise ValueError("WSID is required")
    
    # Blok 2: Validasi nama cabang
    # Memastikan mesin terdaftar pada suatu cabang
    if not data.get('branch_name'):
        raise ValueError("Branch name is required")
    
    # Blok 3: Validasi status mesin (opsional)
    # Mengecek apakah status mesin sesuai dengan daftar status yang valid
    # Status yang valid: Active (aktif), Inactive (tidak aktif), Maintenance (pemeliharaan), Down (rusak)
    valid_statuses = ['Active', 'Inactive', 'Maintenance', 'Down']
    if 'machine_status' in data and data['machine_status']:
        if data['machine_status'] not in valid_statuses:
            print(f"[WARNING] Invalid machine status: {data['machine_status']}")
    
    return True

# Fungsi untuk memvalidasi data stok spare part
def validate_stock_part(data, is_create=False):
    """
    Memvalidasi data stok spare part sebelum disimpan ke database.
    
    Fungsi ini memeriksa kelengkapan data spare part termasuk nomor part
    dan memvalidasi kuantitas stok jika tersedia.
    
    Args:
        data (dict): Dictionary berisi data spare part yang akan divalidasi.
                     Field yang diharapkan:
                     - part_number (str, wajib): Nomor identifikasi spare part
                     - qty (int, opsional): Jumlah stok, harus bilangan bulat non-negatif
        is_create (bool, optional): Flag untuk menandakan apakah ini operasi create.
                                    Default: False
    
    Returns:
        bool: True jika semua validasi berhasil
    
    Raises:
        ValueError: Jika part_number kosong atau tidak ada
        ValueError: Jika qty bernilai negatif
        ValueError: Jika format qty tidak valid (bukan integer)
    
    Contoh:
        >>> data = {'part_number': 'PART-12345', 'qty': 50}
        >>> validate_stock_part(data)
        True
    """
    # Blok 1: Validasi nomor part
    # Memastikan setiap spare part memiliki nomor part yang unik dan tidak kosong
    if not data.get('part_number'):
        raise ValueError("Part number is required")
    
    # Blok 2: Validasi kuantitas stok (opsional)
    # Memastikan jumlah stok adalah angka positif (tidak boleh negatif)
    if 'qty' in data:
        try:
            qty = int(data['qty'])
            if qty < 0:
                raise ValueError("Quantity cannot be negative")
        except (ValueError, TypeError):
            raise ValueError("Invalid quantity format")
    
    return True

# Fungsi untuk memvalidasi data CSV sebelum import massal
def validate_csv_data(data, data_type):
    """
    Memvalidasi data dari file CSV sebelum melakukan import massal ke database.
    
    Fungsi ini memeriksa apakah file CSV tidak kosong dan memastikan semua field wajib
    tersedia di baris pertama (header) sesuai dengan tipe data yang diimport.
    
    Args:
        data (list atau pandas.DataFrame): Data hasil pembacaan file CSV.
                                           Bisa berupa list of dictionaries atau DataFrame.
        data_type (str): Tipe data yang akan diimport. Pilihan yang valid:
                        - 'engineers': Data engineer/teknisi
                        - 'machines': Data mesin
                        - 'stock-parts': Data spare part
    
    Returns:
        bool: True jika semua validasi berhasil
    
    Raises:
        ValueError: Jika file CSV kosong (tidak ada data)
        ValueError: Jika data_type tidak dikenali (bukan 'engineers', 'machines', atau 'stock-parts')
        ValueError: Jika field wajib tidak ditemukan di header CSV
    
    Field Wajib per Tipe Data:
        - engineers: 'id', 'name'
        - machines: 'wsid', 'branch_name'
        - stock-parts: 'part_number'
    
    Contoh:
        >>> csv_data = [{'id': 'ENG001', 'name': 'John'}, {'id': 'ENG002', 'name': 'Jane'}]
        >>> validate_csv_data(csv_data, 'engineers')
        True
    """
    # Blok 1: Validasi file CSV tidak kosong
    # Memastikan file CSV memiliki data sebelum diproses
    if not data or len(data) == 0:
        raise ValueError("CSV file is empty")
    
    # Blok 2: Menentukan field wajib berdasarkan tipe data
    # Setiap tipe data (engineers, machines, stock-parts) memiliki field wajib yang berbeda
    if data_type == 'engineers':
        required_fields = ['id', 'name']  # Engineer wajib punya ID dan nama
    elif data_type == 'machines':
        required_fields = ['wsid', 'branch_name']  # Mesin wajib punya WSID dan nama cabang
    elif data_type == 'stock-parts':
        required_fields = ['part_number']  # Spare part wajib punya nomor part
    else:
        raise ValueError(f"Unknown data type: {data_type}")
    
    # Blok 3: Validasi keberadaan field wajib di baris pertama CSV
    # Mengecek apakah semua field wajib ada di header/baris pertama file CSV
    first_row = data[0] if isinstance(data, list) else data.iloc[0]
    for field in required_fields:
        if field not in first_row:
            raise ValueError(f"Missing required field: {field}")
    
    return True