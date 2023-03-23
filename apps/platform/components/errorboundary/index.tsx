import React, { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Renders Fallback UI in case of error in child component.
 * Important section can be wrapped with ErrorBoundary with provided fallback component.
 * @returns {ReactNode}
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    /**
     * Error monitoring library like: sentry can be implemented here.
     */
    if (process.env.NODE_ENV === "development")
      console.error({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || "Unexpected client error";
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
