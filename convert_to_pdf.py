"""
Script untuk mengkonversi HTML documentation ke PDF
Menggunakan weasyprint atau pdfkit
"""

import sys
import os

def convert_with_weasyprint(html_file, pdf_file):
    """Convert HTML to PDF menggunakan WeasyPrint"""
    try:
        from weasyprint import HTML
        print(f"Mengkonversi {html_file} ke {pdf_file}...")
        HTML(filename=html_file).write_pdf(pdf_file)
        print(f"✅ Berhasil! PDF tersimpan di: {pdf_file}")
        return True
    except ImportError:
        print("❌ WeasyPrint tidak terinstall. Install dengan: pip install weasyprint")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def convert_with_pdfkit(html_file, pdf_file):
    """Convert HTML to PDF menggunakan pdfkit (memerlukan wkhtmltopdf)"""
    try:
        import pdfkit
        print(f"Mengkonversi {html_file} ke {pdf_file}...")
        pdfkit.from_file(html_file, pdf_file)
        print(f"✅ Berhasil! PDF tersimpan di: {pdf_file}")
        return True
    except ImportError:
        print("❌ pdfkit tidak terinstall. Install dengan: pip install pdfkit")
        print("   Juga perlu install wkhtmltopdf: https://wkhtmltopdf.org/downloads.html")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def convert_with_browser_print():
    """Instruksi untuk convert menggunakan browser print"""
    print("\n" + "="*60)
    print("CARA ALTERNATIF: Menggunakan Browser Print")
    print("="*60)
    print("1. Buka file PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html di browser")
    print("2. Tekan Ctrl+P (Windows) atau Cmd+P (Mac)")
    print("3. Pilih 'Save as PDF' sebagai destination")
    print("4. Klik 'Save'")
    print("="*60)

def main():
    html_file = "PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html"
    pdf_file = "PANDUAN_PENGGUNAAN_ROC_DASHBOARD.pdf"
    
    if not os.path.exists(html_file):
        print(f"❌ File {html_file} tidak ditemukan!")
        return
    
    print("Mencoba mengkonversi HTML ke PDF...")
    print("-" * 60)
    
    # Coba WeasyPrint dulu
    if convert_with_weasyprint(html_file, pdf_file):
        return
    
    # Coba pdfkit
    if convert_with_pdfkit(html_file, pdf_file):
        return
    
    # Jika keduanya gagal, berikan instruksi manual
    print("\n❌ Tidak ada library PDF yang tersedia.")
    convert_with_browser_print()

if __name__ == "__main__":
    main()

