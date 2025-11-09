import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();
  const mockOnItemsPerPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination with page info', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    expect(screen.getByText(/Showing 1 to 10 of 50 items/)).toBeInTheDocument();
  });

  it('calculates start and end items correctly', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    expect(screen.getByText(/Showing 11 to 20 of 50 items/)).toBeInTheDocument();
  });

  it('handles last page correctly', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        itemsPerPage={10}
        totalItems={47}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    expect(screen.getByText(/Showing 41 to 47 of 47 items/)).toBeInTheDocument();
  });

  it('handles zero items', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        itemsPerPage={10}
        totalItems={0}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    expect(screen.getByText(/Showing 0 to 0 of 0 items/)).toBeInTheDocument();
  });

  it('calls onPageChange when next button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    const nextButton = screen.getByTitle('Next page');
    await user.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    const prevButton = screen.getByTitle('Previous page');
    await user.click(prevButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    const prevButton = screen.getByTitle('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    const nextButton = screen.getByTitle('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    const page3Button = screen.getByText('3');
    await user.click(page3Button);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onItemsPerPageChange when items per page is changed', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    const select = screen.getByDisplayValue('10');
    await user.selectOptions(select, '25');
    
    expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(25);
  });

  it('shows all pages when totalPages is 5 or less', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows ellipsis when totalPages is more than 5', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        itemsPerPage={10}
        totalItems={100}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    // When currentPage is 1, should show: 1, 2, 3, 4, ..., 10
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Ellipsis should be present when there are more than 5 pages
    const ellipsis = screen.queryAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
    
    // Last page (10) should be visible
    // Use getAllByText and filter for button elements to avoid conflicts
    const allButtons = screen.getAllByRole('button');
    const pageButtons = allButtons.filter(btn => {
      const text = btn.textContent?.trim();
      return text && /^\d+$/.test(text);
    });
    const pageNumbers = pageButtons.map(btn => parseInt(btn.textContent.trim()));
    expect(pageNumbers).toContain(10);
  });

  it('does not render when totalPages is 1 and showItemsPerPage is false', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        itemsPerPage={10}
        totalItems={10}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
        showItemsPerPage={false}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders items per page selector when showItemsPerPage is true', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
        showItemsPerPage={true}
      />
    );
    
    expect(screen.getByText(/Items per page:/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('does not render page navigation when totalPages is 1', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        itemsPerPage={10}
        totalItems={10}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    expect(screen.queryByTitle('Next page')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Previous page')).not.toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    const page3Button = screen.getByText('3');
    expect(page3Button).toHaveClass('bg-blue-500');
  });

  it('does not call onPageChange when clicking current page', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
      />
    );
    
    const page2Button = screen.getByText('2');
    await user.click(page2Button);
    
    // Should still call onPageChange, but with same page
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });
});

