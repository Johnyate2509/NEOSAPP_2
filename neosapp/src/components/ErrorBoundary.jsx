import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    // Guardar error para mostrar en UI y en consola
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('Error capturado por ErrorBoundary:', error, info);
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div style={{ padding: 24, background: '#fff6f6', color: '#6b0b0b', borderRadius: 6 }}>
          <h3>Error al cargar el Dashboard</h3>
          <p>{String(error && (error.message || error))}</p>
          {info && info.componentStack && (
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{info.componentStack}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
