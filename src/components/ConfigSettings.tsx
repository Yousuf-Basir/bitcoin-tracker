import React from 'react';
import { useConfig } from '../context/ConfigContext';

interface ConfigSettingsProps {
  className?: string;
}

const ConfigSettings: React.FC<ConfigSettingsProps> = ({ className = '' }) => {
  const { config, updateConfig } = useConfig();

  // Available refresh interval options in milliseconds
  const refreshIntervals = [
    { label: '10 seconds', value: 10000 },
    { label: '30 seconds', value: 30000 },
    { label: '1 minute', value: 60000 },
    { label: '5 minutes', value: 300000 },
  ];

  const handleAutoRefreshToggle = () => {
    updateConfig({ autoRefreshEnabled: !config.autoRefreshEnabled });
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ refreshIntervalMs: parseInt(e.target.value, 10) });
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-white mb-3">Settings</h3>
      
      <div className="flex items-center mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={config.autoRefreshEnabled}
            onChange={handleAutoRefreshToggle}
          />
          <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          <span className="ms-3 text-sm font-medium text-gray-300">Auto-refresh</span>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Refresh Interval
        </label>
        <select
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={config.refreshIntervalMs}
          onChange={handleIntervalChange}
          disabled={!config.autoRefreshEnabled}
        >
          {refreshIntervals.map((interval) => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        {config.autoRefreshEnabled 
          ? `Prices will refresh every ${config.refreshIntervalMs / 1000} seconds` 
          : 'Auto-refresh is disabled. Prices will only update when you refresh the page.'}
      </div>
    </div>
  );
};

export default ConfigSettings;
