import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilter from '../SearchFilter';

describe('SearchFilter', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders search input', () => {
    render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        placeholder="Search engineers..."
      />
    );
    
    const input = screen.getByPlaceholderText('Search engineers...');
    expect(input).toBeInTheDocument();
  });

  it('displays initial value', () => {
    render(
      <SearchFilter
        value="initial search"
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveValue('initial search');
  });

  it('calls onChange after debounce delay', async () => {
    render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        debounceMs={300}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...');
    
    // Simulate typing by changing the input value and triggering onChange
    fireEvent.change(input, { target: { value: 'test' } });
    
    // onChange should not be called immediately
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Fast-forward time by 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('debounces multiple rapid changes', async () => {
    render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        debounceMs={300}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...');
    
    // Simulate multiple rapid changes
    fireEvent.change(input, { target: { value: 'test' } });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    fireEvent.change(input, { target: { value: 'new' } });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    fireEvent.change(input, { target: { value: 'final' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Should be called, last call should be with 'final'
    expect(mockOnChange).toHaveBeenCalled();
    const calls = mockOnChange.mock.calls;
    if (calls.length > 0) {
      expect(calls[calls.length - 1][0]).toBe('final');
    }
  });

  it('updates value when prop changes', () => {
    const { rerender } = render(
      <SearchFilter
        value="initial"
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveValue('initial');
    
    rerender(
      <SearchFilter
        value="updated"
        onChange={mockOnChange}
      />
    );
    
    expect(input).toHaveValue('updated');
  });

  it('uses custom debounce delay', async () => {
    render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        debounceMs={500}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...');
    
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Should not call onChange after 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Should call onChange after 500ms total
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('handles empty input', async () => {
    render(
      <SearchFilter
        value="test"
        onChange={mockOnChange}
        debounceMs={300}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...');
    
    fireEvent.change(input, { target: { value: '' } });
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        className="custom-class"
      />
    );
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('clears timeout on unmount', () => {
    const { unmount } = render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        debounceMs={300}
      />
    );
    
    unmount();
    
    // Should not throw error when timers are cleared
    vi.advanceTimersByTime(300);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('handles special characters in input', async () => {
    render(
      <SearchFilter
        value=""
        onChange={mockOnChange}
        debounceMs={300}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...');
    
    fireEvent.change(input, { target: { value: 'test@123 & more' } });
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('test@123 & more');
  });
});

