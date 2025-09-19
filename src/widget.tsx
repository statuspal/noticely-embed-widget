import './widget.css';
import { useState } from 'preact/hooks';
import { TransitionGroup, CSSTransition } from 'preact-transitioning';

// Main widget component - displays status information with controls
export const Widget = ({ ongoing_notices }) => {
  const [ongoingNotices, setOngoingNotices] = useState(ongoing_notices);

  const { position = 'bottom-right', theme = 'light' } =
    window.NoticelyWidgetConfig;

  // Hide notices section after the last item exits
  const handleLastItemExited = () => {
    if (ongoingNotices.length < 2)
      setTimeout(() => window.NoticelyWidget.destroy(), 0);
  };

  // Position classes for Tailwind
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div
      className={`
        bg-transparent fixed z-[999999] w-80
        text-base-content
        font-sans text-sm leading-6
        ${positionClasses[position]}
        ${
          position.includes('right')
            ? 'widget-slide-right'
            : 'widget-slide-left'
        }
        animate-[widget-enter_0.5s_cubic-bezier(0.34,1.56,0.64,1)]
        max-sm:w-auto max-sm:left-4 max-sm:right-4
      `}
      data-theme={theme}
    >
      <TransitionGroup>
        {ongoingNotices.map(notice => (
          <CSSTransition
            key={notice.id}
            classNames="notice-item"
            duration={300}
            onExited={handleLastItemExited}
          >
            <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl">
              {/* Widget Header with title and controls */}
              <div className="flex justify-between items-center p-3 bg-base-200 border-b border-base-300">
                <h3 className="text-sm font-semibold text-base-content">
                  Status
                </h3>
                <button
                  className="btn btn-sm btn-ghost btn-circle hover:btn-error transition-all duration-200"
                  onClick={() => setOngoingNotices(prev => prev.filter(n => n.id !== notice.id))}
                  title="Close"
                  aria-label="Close widget"
                >
                  ✕
                </button>
              </div>

              {/* Widget Content */}
              <div className="p-4 max-sm:p-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse shadow-lg shadow-success/20" />
                  <span className="text-sm text-base-content font-medium">
                    All systems operational
                  </span>
                </div>
              </div>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default Widget;
