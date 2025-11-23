import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">
            {this.state.error?.message || "Something went wrong"}
          </p>
          <button
            onClick={this.reset}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

