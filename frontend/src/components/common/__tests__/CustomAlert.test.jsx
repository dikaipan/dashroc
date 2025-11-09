import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import CustomAlert from '../CustomAlert';

// Wrapper component to provide ThemeProvider
const ThemeWrapper = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('CustomAlert', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders success alert', () => {
    render(
      <ThemeWrapper>
        <CustomAlert
          isOpen={true}
          onClose={mockOnClose}
          type="success"
          message="Success message"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('renders error alert', () => {
    render(
      <ThemeWrapper>
        <CustomAlert
          isOpen={true}
          onClose={mockOnClose}
          type="error"
          message="Error message"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <ThemeWrapper>
        <CustomAlert
          isOpen={true}
          onClose={mockOnClose}
          type="info"
          title="Test Title"
          message="Test message"
        />
      </ThemeWrapper>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onClose when OK button is clicked', async () => {
    render(
      <ThemeWrapper>
        <CustomAlert
          isOpen={true}
          onClose={mockOnClose}
          type="info"
          message="Info message"
        />
      </ThemeWrapper>
    );
    
    const okButton = screen.getByText('OK');
    okButton.click();
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('does not render when isOpen is false', () => {
    render(
      <ThemeWrapper>
        <CustomAlert
          isOpen={false}
          onClose={mockOnClose}
          type="success"
          message="Hidden message"
        />
      </ThemeWrapper>
    );
    
    expect(screen.queryByText('Hidden message')).not.toBeInTheDocument();
  });
});

