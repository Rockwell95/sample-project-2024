export interface StatusPanelProps {
  readonly total: number;
  readonly isComplete: boolean;
}

export const StatusPanel = (props: StatusPanelProps) => {
  const { total, isComplete } = props;

  return (
    <div className="content fixed-grid has-2-cols">
      <div className="grid">
        <div className="cell">
          <div className="notification is-info">
            <strong>RUNNING TOTAL:</strong> {total}
          </div>
        </div>
        <div className="cell">
          {isComplete ? (
            <div className="notification is-success">
              <strong>COMPLETE!</strong> Final Total: {total}
            </div>
          ) : (
            <div className="notification is-warning">
              <strong>INCOMPLETE</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
