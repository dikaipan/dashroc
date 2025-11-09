import re
import json
from datetime import datetime
from typing import Any, Dict, List, Optional

def to_snake(s: str) -> str:
    """
    Convert string to snake_case
    
    Args:
        s: Input string
        
    Returns:
        snake_case string
        
    Example:
        >>> to_snake("Machine Status")
        'machine_status'
        >>> to_snake("YearsExperience")
        'years_experience'
    """
    s = str(s).strip()
    s = re.sub(r"[^\w\s]", "", s)
    s = re.sub(r"\s+", "_", s)
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s)
    return s.lower()

def to_camel(s: str) -> str:
    """
    Convert snake_case to camelCase
    
    Args:
        s: Input string in snake_case
        
    Returns:
        camelCase string
        
    Example:
        >>> to_camel("machine_status")
        'machineStatus'
    """
    components = s.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def safe_float(value: Any, default: float = 0.0) -> float:
    """
    Safely convert value to float
    
    Args:
        value: Value to convert
        default: Default value if conversion fails
        
    Returns:
        Float value or default
    """
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def safe_int(value: Any, default: int = 0) -> int:
    """
    Safely convert value to int
    
    Args:
        value: Value to convert
        default: Default value if conversion fails
        
    Returns:
        Integer value or default
    """
    try:
        return int(value)
    except (ValueError, TypeError):
        return default

def safe_str(value: Any, default: str = "") -> str:
    """
    Safely convert value to string
    
    Args:
        value: Value to convert
        default: Default value if None
        
    Returns:
        String value or default
    """
    if value is None or value == "":
        return default
    return str(value)

def clean_dict(data: Dict, remove_none: bool = True, remove_empty: bool = False) -> Dict:
    """
    Clean dictionary by removing None or empty values
    
    Args:
        data: Dictionary to clean
        remove_none: Remove None values
        remove_empty: Remove empty strings
        
    Returns:
        Cleaned dictionary
    """
    cleaned = {}
    for key, value in data.items():
        if remove_none and value is None:
            continue
        if remove_empty and value == "":
            continue
        cleaned[key] = value
    return cleaned

def format_response(success: bool, message: str = "", data: Any = None, error: str = None) -> Dict:
    """
    Format API response
    
    Args:
        success: Success status
        message: Success message
        data: Response data
        error: Error message
        
    Returns:
        Formatted response dictionary
    """
    response = {
        "ok": success,
    }
    
    if message:
        response["message"] = message
    
    if data is not None:
        response["data"] = data
    
    if error:
        response["error"] = error
    
    response["timestamp"] = datetime.now().isoformat()
    
    return response

def paginate(items: List, page: int = 1, per_page: int = 50) -> Dict:
    """
    Paginate list of items
    
    Args:
        items: List of items to paginate
        page: Page number (1-indexed)
        per_page: Items per page
        
    Returns:
        Dictionary with pagination info and items
    """
    total = len(items)
    total_pages = (total + per_page - 1) // per_page
    
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        "items": items[start:end],
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }

def filter_dict_list(items: List[Dict], filters: Dict) -> List[Dict]:
    """
    Filter list of dictionaries by criteria
    
    Args:
        items: List of dictionaries
        filters: Filter criteria {key: value}
        
    Returns:
        Filtered list
        
    Example:
        >>> data = [{"region": "Region 1", "name": "John"}, {"region": "Region 2", "name": "Jane"}]
        >>> filter_dict_list(data, {"region": "Region 1"})
        [{"region": "Region 1", "name": "John"}]
    """
    if not filters:
        return items
    
    filtered = []
    for item in items:
        match = True
        for key, value in filters.items():
            if key not in item or item[key] != value:
                match = False
                break
        if match:
            filtered.append(item)
    
    return filtered

def search_dict_list(items: List[Dict], search_term: str, search_fields: List[str] = None) -> List[Dict]:
    """
    Search in list of dictionaries
    
    Args:
        items: List of dictionaries
        search_term: Search term
        search_fields: Fields to search in (None = all fields)
        
    Returns:
        Filtered list
    """
    if not search_term:
        return items
    
    search_term = search_term.lower()
    results = []
    
    for item in items:
        fields_to_search = search_fields if search_fields else item.keys()
        
        for field in fields_to_search:
            if field in item:
                value = str(item[field]).lower()
                if search_term in value:
                    results.append(item)
                    break
    
    return results

def sort_dict_list(items: List[Dict], sort_by: str, descending: bool = False) -> List[Dict]:
    """
    Sort list of dictionaries
    
    Args:
        items: List of dictionaries
        sort_by: Field to sort by
        descending: Sort in descending order
        
    Returns:
        Sorted list
    """
    if not sort_by or sort_by not in items[0]:
        return items
    
    return sorted(items, key=lambda x: x.get(sort_by, ""), reverse=descending)

def calculate_percentage(value: float, total: float, decimals: int = 2) -> float:
    """
    Calculate percentage
    
    Args:
        value: Value
        total: Total
        decimals: Decimal places
        
    Returns:
        Percentage
    """
    if total == 0:
        return 0.0
    return round((value / total) * 100, decimals)

def group_by(items: List[Dict], key: str) -> Dict[str, List[Dict]]:
    """
    Group list of dictionaries by key
    
    Args:
        items: List of dictionaries
        key: Key to group by
        
    Returns:
        Dictionary with grouped items
        
    Example:
        >>> data = [{"region": "R1", "name": "A"}, {"region": "R1", "name": "B"}, {"region": "R2", "name": "C"}]
        >>> group_by(data, "region")
        {"R1": [{"region": "R1", "name": "A"}, {"region": "R1", "name": "B"}], "R2": [{"region": "R2", "name": "C"}]}
    """
    grouped = {}
    for item in items:
        group_key = item.get(key, "unknown")
        if group_key not in grouped:
            grouped[group_key] = []
        grouped[group_key].append(item)
    
    return grouped

def count_by(items: List[Dict], key: str) -> Dict[str, int]:
    """
    Count items by key value
    
    Args:
        items: List of dictionaries
        key: Key to count by
        
    Returns:
        Dictionary with counts
        
    Example:
        >>> data = [{"region": "R1"}, {"region": "R1"}, {"region": "R2"}]
        >>> count_by(data, "region")
        {"R1": 2, "R2": 1}
    """
    counts = {}
    for item in items:
        value = item.get(key, "unknown")
        counts[value] = counts.get(value, 0) + 1
    
    return counts

def merge_dicts(*dicts: Dict) -> Dict:
    """
    Merge multiple dictionaries
    
    Args:
        *dicts: Dictionaries to merge
        
    Returns:
        Merged dictionary
    """
    result = {}
    for d in dicts:
        result.update(d)
    return result

def deep_get(dictionary: Dict, keys: str, default: Any = None) -> Any:
    """
    Get nested dictionary value using dot notation
    
    Args:
        dictionary: Dictionary to search
        keys: Dot-separated keys (e.g., "user.address.city")
        default: Default value if key not found
        
    Returns:
        Value or default
        
    Example:
        >>> data = {"user": {"address": {"city": "Jakarta"}}}
        >>> deep_get(data, "user.address.city")
        'Jakarta'
    """
    keys_list = keys.split('.')
    value = dictionary
    
    for key in keys_list:
        if isinstance(value, dict) and key in value:
            value = value[key]
        else:
            return default
    
    return value

def truncate_string(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Truncate string to max length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated
        
    Returns:
        Truncated string
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix

def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human-readable format
    
    Args:
        size_bytes: Size in bytes
        
    Returns:
        Formatted size string
        
    Example:
        >>> format_file_size(1024)
        '1.0 KB'
        >>> format_file_size(1048576)
        '1.0 MB'
    """
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} PB"

def is_valid_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email string to validate
        
    Returns:
        True if valid email format
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename by removing unsafe characters
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    # Remove path separators and unsafe characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Replace spaces with underscores
    filename = filename.replace(' ', '_')
    return filename

def generate_id(prefix: str = "", length: int = 8) -> str:
    """
    Generate random ID
    
    Args:
        prefix: ID prefix
        length: Length of random part
        
    Returns:
        Generated ID
    """
    import random
    import string
    
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choice(chars) for _ in range(length))
    
    if prefix:
        return f"{prefix}_{random_part}"
    return random_part

def log_info(message: str, data: Any = None):
    """
    Log info message
    
    Args:
        message: Log message
        data: Additional data to log
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log = f"[INFO] [{timestamp}] {message}"
    
    if data:
        log += f" | Data: {json.dumps(data) if isinstance(data, dict) else str(data)}"
    
    print(log)

def log_error(message: str, error: Exception = None):
    """
    Log error message
    
    Args:
        message: Log message
        error: Exception object
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log = f"[ERROR] [{timestamp}] {message}"
    
    if error:
        log += f" | Error: {str(error)}"
    
    print(log)