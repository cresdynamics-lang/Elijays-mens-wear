import { formatKES } from '../../lib/format';

const ShiftSummaryView = ({ summary, onDone, embedded = false }) => {
  if (!summary) {
    return (
      <div className={`${embedded ? 'py-16' : 'min-h-screen'} text-white flex flex-col items-center justify-center`}>
        <p className="text-accent-500/60">No shift summary available.</p>
        {onDone && (
          <button type="button" onClick={onDone} className="mt-4 text-accent-400 underline text-sm">
            Back to login
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${embedded ? 'py-8' : 'min-h-screen'} text-white p-8 max-w-lg mx-auto`}>
      <h1 className="text-2xl font-semibold text-accent-100">Shift ended</h1>
      <p className="text-accent-500/60 mt-2">{summary.seller?.full_name}</p>
      <dl className="mt-8 space-y-4">
        <div className="flex justify-between"><dt>Cash</dt><dd>{formatKES(summary.total_cash)}</dd></div>
        <div className="flex justify-between"><dt>M-Pesa</dt><dd>{formatKES(summary.total_mpesa)}</dd></div>
        <div className="flex justify-between"><dt>Card</dt><dd>{formatKES(summary.total_card)}</dd></div>
        <div className="flex justify-between font-bold text-accent-400"><dt>Total sales</dt><dd>{formatKES(summary.total_sales)}</dd></div>
        <div className="flex justify-between text-sm text-accent-500/50"><dt>Transactions</dt><dd>{summary.sales?.length || 0}</dd></div>
      </dl>
      {onDone && (
        <button type="button" onClick={onDone} className="mt-10 bg-accent-600 text-base-950 px-6 py-3 rounded-lg font-bold">
          Done
        </button>
      )}
    </div>
  );
};

export default ShiftSummaryView;
