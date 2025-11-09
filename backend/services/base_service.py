"""
Base service class for CSV-based data operations
Provides common CRUD operations that can be reused by all service classes
"""
import os
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Callable, Optional
import pandas as pd
from config import Config
from backend.utils.csv_utils import read_csv_normalized


class BaseService(ABC):
    """Base service class for CSV-based data operations"""
    
    def __init__(self, file_name: str, primary_key: str, entity_name: str):
        """
        Initialize base service
        
        Args:
            file_name: Name of the CSV file (e.g., "data_ce.csv")
            primary_key: Name of the primary key column (e.g., "id", "wsid", "part_number")
            entity_name: Name of the entity for logging (e.g., "engineer", "machine")
        """
        self.file_path = os.path.join(Config.DATA_DIR, file_name)
        self.primary_key = primary_key
        self.entity_name = entity_name
    
    def _get_dataframe(self) -> pd.DataFrame:
        """
        Get normalized dataframe from CSV file
        
        Returns:
            Normalized DataFrame
            
        Raises:
            FileNotFoundError: If file doesn't exist
        """
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"{self.entity_name.capitalize()} data not found")
        return read_csv_normalized(self.file_path)
    
    def _save_dataframe(self, df: pd.DataFrame) -> None:
        """
        Save dataframe to CSV file
        
        Args:
            df: DataFrame to save
            
        Raises:
            PermissionError: If file is locked or permission denied
            IOError: If file cannot be written
        """
        try:
            # Check if file exists and is writable
            if os.path.exists(self.file_path):
                # Check if file is read-only
                if not os.access(self.file_path, os.W_OK):
                    raise PermissionError(f"File {self.file_path} is read-only or locked. Please close the file if it's open in another application.")
            
            # Try to save
            df.to_csv(self.file_path, index=False, encoding='utf-8')
        except PermissionError:
            raise
        except IOError as e:
            raise IOError(f"Cannot write to file {self.file_path}. Make sure the file is not open in another application (Excel, Notepad, etc.) and you have write permissions.")
        except Exception as e:
            raise Exception(f"Failed to save {self.entity_name} data: {str(e)}")
    
    def _check_primary_key_exists(self, df: pd.DataFrame) -> None:
        """
        Check if primary key column exists in dataframe
        
        Args:
            df: DataFrame to check
            
        Raises:
            ValueError: If primary key column not found
        """
        if self.primary_key not in df.columns:
            raise ValueError(f"{self.entity_name.capitalize()} {self.primary_key} column not found in data")
    
    def _find_by_primary_key(self, df: pd.DataFrame, key_value: str) -> pd.Index:
        """
        Find row index by primary key value
        
        Args:
            df: DataFrame to search
            key_value: Primary key value to find
            
        Returns:
            Index of the row
            
        Raises:
            ValueError: If entity not found
        """
        if key_value not in df[self.primary_key].values:
            raise ValueError(f"{self.entity_name.capitalize()} with {self.primary_key} {key_value} not found")
        return df[df[self.primary_key] == key_value].index[0]
    
    @abstractmethod
    def _validate(self, data: Dict[str, Any], is_create: bool = False) -> None:
        """
        Validate data before create/update
        
        Args:
            data: Data to validate
            is_create: Whether this is a create operation
            
        Raises:
            ValueError: If validation fails
        """
        pass
    
    def get_all(self) -> List[Dict[str, Any]]:
        """
        Get all entities
        
        Returns:
            List of all entities as dictionaries
        """
        df = self._get_dataframe()
        data = df.to_dict(orient="records")
        print(f"[INFO] Loaded {len(data)} {self.entity_name} records")
        return data
    
    def get_by_id(self, key_value: str) -> Dict[str, Any]:
        """
        Get entity by primary key
        
        Args:
            key_value: Primary key value
            
        Returns:
            Entity as dictionary
        """
        df = self._get_dataframe()
        self._check_primary_key_exists(df)
        self._find_by_primary_key(df, key_value)
        
        entity = df[df[self.primary_key] == key_value].to_dict(orient="records")[0]
        return entity
    
    def create(self, entity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create new entity
        
        Args:
            entity_data: Entity data to create
            
        Returns:
            Success response dictionary
        """
        # Validate
        self._validate(entity_data, is_create=True)
        
        # Read existing
        if os.path.exists(self.file_path):
            df = self._get_dataframe()
        else:
            df = pd.DataFrame()
        
        # Check duplicate
        if not df.empty and self.primary_key in df.columns:
            if entity_data.get(self.primary_key) in df[self.primary_key].values:
                raise ValueError(f"{self.entity_name.capitalize()} with this {self.primary_key} already exists")
        
        # Append
        new_df = pd.DataFrame([entity_data])
        df = pd.concat([df, new_df], ignore_index=True)
        
        # Save
        self._save_dataframe(df)
        print(f"[INFO] Created new {self.entity_name}: {entity_data.get(self.primary_key)}")
        
        return {"ok": True, "message": f"{self.entity_name.capitalize()} created successfully"}
    
    def update(self, key_value: str, updated_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update entity
        
        Args:
            key_value: Primary key value
            updated_data: Data to update
            
        Returns:
            Success response dictionary
        """
        df = self._get_dataframe()
        self._check_primary_key_exists(df)
        idx = self._find_by_primary_key(df, key_value)
        
        # Update
        for key, value in updated_data.items():
            if key in df.columns:
                df.at[idx, key] = value
        
        # Save
        self._save_dataframe(df)
        print(f"[INFO] Updated {self.entity_name}: {key_value}")
        
        return {"ok": True, "message": f"{self.entity_name.capitalize()} updated successfully"}
    
    def delete(self, key_value: str) -> Dict[str, Any]:
        """
        Delete entity
        
        Args:
            key_value: Primary key value
            
        Returns:
            Success response dictionary
        """
        df = self._get_dataframe()
        self._check_primary_key_exists(df)
        self._find_by_primary_key(df, key_value)
        
        # Delete
        df = df[df[self.primary_key] != key_value]
        
        # Save
        self._save_dataframe(df)
        print(f"[INFO] Deleted {self.entity_name}: {key_value}")
        
        return {"ok": True, "message": f"{self.entity_name.capitalize()} deleted successfully"}
    
    def bulk_upsert(self, entities_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Bulk insert or update entities (for CSV import)
        
        Args:
            entities_data: List of entity data dictionaries
            
        Returns:
            Success response dictionary
        """
        if not entities_data:
            raise ValueError("No data provided")
        
        # Read existing
        if os.path.exists(self.file_path):
            df_existing = self._get_dataframe()
        else:
            df_existing = pd.DataFrame()
        
        # Create new dataframe
        df_new = pd.DataFrame(entities_data)
        
        if df_existing.empty:
            df_result = df_new
        else:
            # Merge: update existing, add new
            if self.primary_key in df_existing.columns:
                df_result = pd.concat([df_existing, df_new]).drop_duplicates(
                    subset=[self.primary_key], keep='last'
                )
            else:
                df_result = pd.concat([df_existing, df_new], ignore_index=True)
        
        # Save
        self._save_dataframe(df_result)
        print(f"[INFO] Bulk upserted {len(entities_data)} {self.entity_name}s")
        
        return {
            "ok": True, 
            "message": f"Successfully upserted {len(entities_data)} {self.entity_name}s"
        }

