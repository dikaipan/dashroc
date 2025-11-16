# 🧪 Testing Guide

Panduan lengkap untuk menjalankan tests di proyek ROC Dashboard.

## 📋 Daftar Isi

1. [Setup Testing](#setup-testing)
2. [Frontend Testing](#frontend-testing)
3. [Backend Testing](#backend-testing)
4. [Menjalankan Tests](#menjalankan-tests)
5. [Menulis Tests](#menulis-tests)
6. [Best Practices](#best-practices)

## 🚀 Setup Testing

### Frontend Testing (Vitest)

1. Install dependencies:
```bash
cd frontend
npm install --legacy-peer-deps
```

**Note**: Menggunakan `--legacy-peer-deps` karena React 19 masih baru dan beberapa testing libraries belum fully support. Atau buat file `.npmrc` dengan `legacy-peer-deps=true`.

Dependencies yang diinstall:
- `vitest` - Testing framework
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - DOM matchers
- `@testing-library/user-event` - User event simulation
- `jsdom` - DOM environment untuk testing

### Backend Testing (pytest)

1. Install dependencies:
```bash
pip install -r requirements-dev.txt
```

Dependencies yang diinstall:
- `pytest` - Testing framework
- `pytest-cov` - Coverage reporting
- `pytest-flask` - Flask testing utilities
- `pytest-mock` - Mocking utilities

## 🎨 Frontend Testing

### Struktur Test Files

```
frontend/src/
├── utils/
│   ├── __tests__/
│   │   └── textUtils.test.js
├── components/
│   └── common/
│       └── __tests__/
│           └── CustomAlert.test.jsx
└── test/
    └── setup.js
```

### Menjalankan Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Contoh Test

```javascript
// frontend/src/utils/__tests__/textUtils.test.js
import { describe, it, expect } from 'vitest';
import { normalizeText } from '../textUtils';

describe('normalizeText', () => {
  it('should normalize text to lowercase', () => {
    expect(normalizeText('HELLO')).toBe('hello');
  });
});
```

## 🔧 Backend Testing

### Struktur Test Files

```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_helpers.py
│   ├── test_validators.py
│   └── test_api.py
└── pytest.ini
```

### Menjalankan Backend Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest backend/tests/test_helpers.py

# Run specific test
pytest backend/tests/test_helpers.py::TestToSnake::test_basic_conversion

# Run with coverage
pytest --cov=backend --cov-report=html

# Run with verbose output
pytest -v

# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration
```

### Contoh Test

```python
# backend/tests/test_helpers.py
import pytest
from backend.utils.helpers import to_snake

def test_to_snake():
    assert to_snake("Machine Status") == "machine_status"
```

## 📊 Coverage Reports

### Frontend Coverage

```bash
cd frontend
npm run test:coverage
```

Coverage report akan tersedia di:
- Terminal output
- `frontend/coverage/` directory

### Backend Coverage

```bash
pytest --cov=backend --cov-report=html
```

Coverage report akan tersedia di:
- Terminal output
- `htmlcov/index.html` (buka di browser)

## ✍️ Menulis Tests

### Frontend Test Template

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Backend Test Template

```python
import pytest
from backend.utils.helpers import my_function

class TestMyFunction:
    def test_basic_case(self):
        result = my_function('input')
        assert result == 'expected'
    
    def test_edge_case(self):
        with pytest.raises(ValueError):
            my_function(None)
```

## 🎯 Best Practices

### 1. Test Naming
- Gunakan nama deskriptif: `test_should_return_error_when_input_is_invalid`
- Group tests dengan `describe` blocks
- Gunakan `it` atau `test` untuk individual test cases

### 2. Test Structure (AAA Pattern)
```javascript
it('should do something', () => {
  // Arrange - Setup test data
  const input = 'test';
  
  // Act - Execute the function
  const result = myFunction(input);
  
  // Assert - Check the result
  expect(result).toBe('expected');
});
```

### 3. Test Isolation
- Setiap test harus independen
- Jangan bergantung pada urutan test
- Cleanup setelah setiap test

### 4. Mocking
```javascript
// Mock API calls
vi.mock('../api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'test' }))
}));
```

### 5. Coverage Goals
- Aim for >80% coverage
- Focus on critical paths
- Don't test implementation details

## 🐛 Troubleshooting

### Frontend Tests

**Problem**: Tests fail with "Cannot find module"
**Solution**: Check import paths and file extensions

**Problem**: DOM methods not available
**Solution**: Ensure `jsdom` is installed and configured in `vite.config.js`

### Backend Tests

**Problem**: Import errors
**Solution**: Check `sys.path` in `conftest.py`

**Problem**: CSV file errors
**Solution**: Use test fixtures or mock file operations

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Flask Testing Documentation](https://flask.palletsprojects.com/en/2.3.x/testing/)

## 🎉 Next Steps

1. ✅ Setup testing frameworks
2. ✅ Create example tests
3. ⏳ Add more test cases
4. ⏳ Increase coverage
5. ⏳ Add E2E tests
6. ⏳ Setup CI/CD with tests

## 📝 Test Checklist

- [x] Setup Vitest for frontend
- [x] Setup pytest for backend
- [x] Create example unit tests
- [x] Create example component tests
- [x] Create example API tests
- [ ] Add more utility tests
- [ ] Add more component tests
- [ ] Add more API integration tests
- [ ] Add E2E tests
- [ ] Setup test coverage reporting
- [ ] Add test scripts to package.json
- [ ] Document testing practices

