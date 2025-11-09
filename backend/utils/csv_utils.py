from typing import List
import pandas as pd
from backend.utils.helpers import to_snake

def read_csv_normalized(path: str) -> pd.DataFrame:
    """
    Read CSV file with normalization
    
    Args:
        path: Path to CSV file
        
    Returns:
        Normalized DataFrame with snake_case columns
        
    Raises:
        Exception: If file cannot be read with any encoding
    """
    encodings: List[str] = ["utf-8", "utf-8-sig", "latin1", "cp1252"]
    
    for enc in encodings:
        try:
            df = pd.read_csv(path, encoding=enc, low_memory=False)
            break
        except UnicodeDecodeError:
            continue
    else:
        raise Exception(f"Cannot read file {path}")
    
    # Normalize columns
    df.columns = [to_snake(c) for c in df.columns]
    
    # Important text columns that should not be converted to numeric
    important_text_cols: List[str] = [
        'machine_status', 'maintenance_status', 'customer', 'branch_name',
        'wsid', 'sn', 'machine_type', 'name', 'vendor', 'region', 'area_group',
        'id', 'part_number', 'part_name', 'fsl'
    ]
    
    # Convert numerics
    for col in df.columns:
        if col not in important_text_cols:
            try:
                df[col] = pd.to_numeric(df[col], errors="ignore", downcast="float")
            except Exception:
                pass
    
    # Fill NaN
    for col in df.columns:
        df[col] = df[col].fillna("")
    
    return df