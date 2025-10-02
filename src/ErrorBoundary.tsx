import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, message: String(err) };
  }
  componentDidCatch(err: unknown, info: unknown) {
    console.error("ErrorBoundary", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border rounded bg-red-50 text-red-800">
          <div className="font-semibold mb-1">Щось пішло не так.</div>
          <div className="text-sm opacity-80">{this.state.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
