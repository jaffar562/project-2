import React, { useState, useEffect } from 'react';
import { Save, Settings, Globe, MessageCircle, CreditCard, Shield, Bell, Database } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase, SystemSettings as SystemSettingsType } from '../../lib/supabase';

interface SystemSettingsProps {
  theme?: string;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ theme = 'dark' }) => {
  const [settings, setSettings] = useState<SystemSettingsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          input: 'bg-white border-gray-300 text-gray-900',
          tabActive: 'bg-blue-50 text-blue-600 border-blue-200',
          tabInactive: 'text-gray-600 hover:bg-gray-50'
        };
      case 'glass':
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          input: 'bg-white/5 border-white/10 text-white',
          tabActive: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          tabInactive: 'text-white/70 hover:bg-white/10'
        };
      default: // dark
        return {
          card: 'bg-gray-800 border-gray-700',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          input: 'bg-gray-700 border-gray-600 text-white',
          tabActive: 'bg-purple-900/50 text-purple-300 border-purple-500/50',
          tabInactive: 'text-gray-300 hover:bg-gray-700'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
      
      // Populate form with existing settings
      data?.forEach(setting => {
        setValue(setting.key, setting.value);
      });
    } catch (error) {
      toast.error('Failed to fetch system settings');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (data: any) => {
    try {
      // Update existing settings and create new ones
      const updates = Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? value : { value },
        description: getSettingDescription(key),
        is_public: isPublicSetting(key)
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .upsert(update, { onConflict: 'key' });

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Error:', error);
    }
  };

  const getSettingDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      'site_maintenance': 'Site maintenance mode settings',
      'discord_webhook': 'Discord webhook URL for notifications',
      'payment_methods': 'Available payment methods configuration',
      'email_settings': 'Email configuration settings',
      'security_settings': 'Security and authentication settings',
      'notification_settings': 'System notification preferences'
    };
    return descriptions[key] || `Configuration for ${key}`;
  };

  const isPublicSetting = (key: string) => {
    const publicSettings = ['site_maintenance', 'payment_methods'];
    return publicSettings.includes(key);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Site Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Site Name</label>
            <input
              {...register('site_name')}
              defaultValue="Demon Node™"
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Your site name"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Site Tagline</label>
            <input
              {...register('site_tagline')}
              defaultValue="Premium Hosting Solutions"
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Your site tagline"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Maintenance Mode</h3>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="checkbox"
            {...register('site_maintenance.enabled')}
            className="rounded"
          />
          <label className={`text-sm ${themeStyles.textSecondary}`}>Enable maintenance mode</label>
        </div>
        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Maintenance Message</label>
          <textarea
            {...register('site_maintenance.message')}
            defaultValue="Site is under maintenance"
            rows={3}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
            placeholder="Message to show during maintenance"
          />
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('payment_methods.discord')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Discord Orders</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('payment_methods.stripe')}
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Stripe Payments</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('payment_methods.paypal')}
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>PayPal</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Discord Integration</h3>
        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Webhook URL</label>
          <input
            {...register('discord_webhook.url')}
            type="url"
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="https://discord.com/api/webhooks/..."
          />
          <p className={`text-xs ${themeStyles.textMuted} mt-1`}>Discord webhook URL for order notifications</p>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Email Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>SMTP Host</label>
            <input
              {...register('email_settings.smtp_host')}
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>SMTP Port</label>
            <input
              {...register('email_settings.smtp_port')}
              type="number"
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="587"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Email Username</label>
            <input
              {...register('email_settings.username')}
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="your-email@gmail.com"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Email Password</label>
            <input
              {...register('email_settings.password')}
              type="password"
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="App password"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Analytics</h3>
        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Google Analytics ID</label>
          <input
            {...register('analytics.google_analytics_id')}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="G-XXXXXXXXXX"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Order Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('notifications.new_orders')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>New order notifications</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('notifications.order_status_changes')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Order status change notifications</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('notifications.payment_confirmations')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Payment confirmation notifications</label>
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>System Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('notifications.system_alerts')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>System alert notifications</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('notifications.server_status')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Server status notifications</label>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('notifications.backup_reports')}
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Backup report notifications</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('security.two_factor_auth')}
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Enable two-factor authentication</label>
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Session Timeout (minutes)</label>
            <input
              {...register('security.session_timeout')}
              type="number"
              defaultValue={60}
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="60"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>API Security</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Rate Limit (requests per minute)</label>
            <input
              {...register('security.rate_limit')}
              type="number"
              defaultValue={100}
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="100"
            />
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('security.api_key_required')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Require API key for external requests</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Backup Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('database.auto_backup')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Enable automatic backups</label>
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Backup Frequency</label>
            <select
              {...register('database.backup_frequency')}
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Retention Period (days)</label>
            <input
              {...register('database.retention_days')}
              type="number"
              defaultValue={30}
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="30"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Performance</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Query Timeout (seconds)</label>
            <input
              {...register('database.query_timeout')}
              type="number"
              defaultValue={30}
              className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="30"
            />
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              {...register('database.enable_caching')}
              defaultChecked
              className="rounded"
            />
            <label className={`text-sm ${themeStyles.textSecondary}`}>Enable query caching</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'security':
        return renderSecuritySettings();
      case 'database':
        return renderDatabaseSettings();
      default:
        return renderGeneralSettings();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${themeStyles.text}`}>System Settings</h1>
          <p className={`${themeStyles.textSecondary} mt-1`}>Configure your system preferences and integrations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${themeStyles.card} border rounded-xl p-2`}>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id ? themeStyles.tabActive : themeStyles.tabInactive
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit(handleSaveSettings)}>
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          {renderTabContent()}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </form>

      {/* Current Settings Display */}
      <div className={`${themeStyles.card} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Current Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.map((setting) => (
            <div key={setting.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className={`font-medium ${themeStyles.text} mb-1`}>{setting.key}</div>
              <div className={`text-sm ${themeStyles.textMuted} mb-2`}>{setting.description}</div>
              <div className={`text-xs ${themeStyles.textSecondary} font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded`}>
                {JSON.stringify(setting.value, null, 2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;