import { Component } from "react";

/**
 * Top-level error boundary — production requirement.
 * Catches render crashes (e.g. WebGL unavailable) and shows a recoverable
 * HUD screen instead of a blank page. Logs with request context where possible.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#0e0e0e",
            color: "#8ff5ff",
            fontFamily: "monospace",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: 20, letterSpacing: 2 }}>// HUD_FAULT — RENDER CORE OFFLINE</h1>
            <p style={{ opacity: 0.7, margin: "12px 0 20px" }}>
              {this.state.error?.message || "An unexpected rendering error occurred."}
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: "#8ff5ff",
                color: "#0e0e0e",
                border: "none",
                padding: "10px 22px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              REBOOT HUD
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
