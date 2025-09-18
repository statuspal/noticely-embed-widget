import './widget.css';

// Main widget component - displays status information with controls
export const Widget = ({
  /* eslint-disable @typescript-eslint/no-unused-vars */
  subdomain,
  theme = 'light',
  position = 'bottom-right'
}: Window['NoticelyWidgetConfig']) => {
  return (
    <div
      className={`status-widget status-widget--${position}`}
      data-theme={theme}
    >
      {/* Widget Header with title and controls */}
      <div className="status-widget__header">
        <h3 className="status-widget__title">Status</h3>
        <button
          className="status-widget__close"
          onClick={() => window.NoticelyWidget.destroy()}
          title="Close"
          aria-label="Close widget"
        >
          ✕
        </button>
      </div>

      {/* Widget Content */}
      <div className="status-widget__content">
        <div className="status-widget__status">
          <div className="status-widget__indicator" />
          <span className="status-widget__message">
            All systems operational
          </span>
        </div>
      </div>
    </div>
  );
};

export default Widget;
