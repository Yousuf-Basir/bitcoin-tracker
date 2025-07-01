/**
 * Bitcoin Glance Tracker Configuration
 * 
 * This file contains global application settings that can be adjusted.
 */

export interface AppConfig {
  /**
   * Whether auto-refresh of cryptocurrency prices is enabled
   */
  autoRefreshEnabled: boolean;
  
  /**
   * Interval in milliseconds for auto-refreshing cryptocurrency prices
   * Default: 30000 (30 seconds)
   */
  refreshIntervalMs: number;
}

/**
 * Default application configuration
 */
const appConfig: AppConfig = {
  autoRefreshEnabled: false,
  refreshIntervalMs: 30000, // 30 seconds
};

export default appConfig;
