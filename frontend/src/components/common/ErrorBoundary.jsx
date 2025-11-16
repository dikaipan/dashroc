import React from 'react';

// ErrorBoundary component - class component to avoid hook ordering issues
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  componentDidUpdate(prevProps) {
    // Reset error state when children change (e.g., route change)
    // This helps recover from errors when navigating to a new route
    if (this.props.children !== prevProps.children && this.state.hasError) {
      this.setState({ 
        hasError: false,
        error: null,
        errorInfo: null
      });
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg max-w-2xl mx-auto mt-8">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">An error occurred while rendering this component.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-4">
              <summary className="cursor-pointer font-semibold mb-2">Error Details (Development Only)</summary>
              <pre className="text-xs bg-red-50 dark:bg-red-900/40 p-3 rounded overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo && (
                  <div className="mt-2">
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </pre>
            </details>
          )}
          <div className="flex gap-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
