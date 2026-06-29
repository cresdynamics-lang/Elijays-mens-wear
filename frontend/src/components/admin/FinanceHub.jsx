import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import FinanceOverview from './FinanceOverview';

const MODULES = [
  { id: 'revenue', label: 'Revenue', description: 'Sales totals, profit, and order analytics' },
];

const FinanceHub = ({ forcedModule, readOnly = false }) => {
  const [module, setModule] = useState(forcedModule || 'revenue');

  const active = MODULES.find((m) => m.id === module) || MODULES[0];

  const renderModule = () => {
    switch (module) {
      case 'revenue':
        return <FinanceOverview readOnly={readOnly} />;
      default:
        return <FinanceOverview readOnly={readOnly} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-utility-gray/30 border border-accent/10 rounded-2xl p-4 sm:p-6">
        <p className="text-[10px] font-black tracking-[0.3em] text-accent/70">Finance</p>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-secondary mt-1">{active.label}</h2>
        <p className="text-xs text-secondary/70 mt-1 max-w-xl">{active.description}</p>
      </div>

      <div className="min-h-[400px]">{renderModule()}</div>
    </div>
  );
};

export default FinanceHub;
