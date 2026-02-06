import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">
                            ⚠️ Application Error
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Something went wrong. Please check the console for more details.
                        </p>

                        {this.state.error && (
                            <div className="bg-red-100 border border-red-400 rounded p-4 mb-4">
                                <p className="font-semibold text-red-800 mb-2">Error Message:</p>
                                <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </div>
                        )}

                        {this.state.errorInfo && (
                            <details className="bg-gray-100 border border-gray-300 rounded p-4">
                                <summary className="font-semibold cursor-pointer mb-2">
                                    Component Stack Trace
                                </summary>
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
