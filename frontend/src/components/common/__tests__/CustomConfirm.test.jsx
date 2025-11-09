import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import CustomConfirm from '../CustomConfirm';

// Wrapper component to provide ThemeProvider
const ThemeWrapper = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('CustomConfirm', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders warning confirm dialog', () => {
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          type="warning"
          message="Are you sure?"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('Konfirmasi')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Ya')).toBeInTheDocument();
    expect(screen.getByText('Batal')).toBeInTheDocument();
  });

  it('renders danger confirm dialog', () => {
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          type="danger"
          message="This action cannot be undone"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument();
  });

  it('renders info confirm dialog', () => {
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          type="info"
          message="Please confirm"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('Please confirm')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Delete Item"
          message="Are you sure you want to delete?"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete?')).toBeInTheDocument();
  });

  it('renders with custom button texts', () => {
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          confirmText="Delete"
          cancelText="Cancel"
          message="Confirm deletion"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      </ThemeWrapper>
    );
    
    const cancelButton = screen.getByText('Batal');
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked (covers close functionality)', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      </ThemeWrapper>
    );
    
    // Test cancel button which also calls onClose
    const cancelButton = screen.getByText('Batal');
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onConfirm and onClose when confirm button is clicked', async () => {
    const user = userEvent.setup();
    mockOnConfirm.mockResolvedValue(undefined);
    
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      </ThemeWrapper>
    );
    
    const confirmButton = screen.getByText('Ya');
    await user.click(confirmButton);
    
    // According to implementation: onClose is called first, then onConfirm
    expect(mockOnClose).toHaveBeenCalled();
    
    // Wait for async onConfirm to be called
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled();
    }, { timeout: 100 });
  });

  it('handles async onConfirm callback', async () => {
    const user = userEvent.setup();
    mockOnConfirm.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      </ThemeWrapper>
    );
    
    const confirmButton = screen.getByText('Ya');
    await user.click(confirmButton);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnConfirm).toHaveBeenCalled();
    }, { timeout: 200 });
  });

  it('does not render when isOpen is false', () => {
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Hidden message"
        />
      </ThemeWrapper>
    );
    
    expect(screen.queryByText('Hidden message')).not.toBeInTheDocument();
  });

  it('handles missing onConfirm gracefully', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          message="Test message"
        />
      </ThemeWrapper>
    );
    
    const confirmButton = screen.getByText('Ya');
    
    // Click confirm button
    await user.click(confirmButton);
    
    // According to implementation: handleConfirm only calls onClose if onConfirm exists
    // If onConfirm is not provided, handleConfirm does nothing
    // This is expected behavior - confirm button should only work if onConfirm is provided
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('uses default title when not provided', () => {
    render(
      <ThemeWrapper>
        <CustomConfirm
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('Konfirmasi')).toBeInTheDocument();
  });
});

