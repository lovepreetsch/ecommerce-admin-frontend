import { useState } from 'react';
import { Save, Bell, Shield, Globe, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    siteName: 'ShopVerse',
    supportEmail: 'support@shopverse.com',
    currency: 'USD',
    taxRate: '10',
    emailNotifications: true,
    orderAlerts: true,
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-textMuted mt-1">Manage global platform configurations.</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'general' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-textMuted hover:bg-surface hover:text-white'}`}>
            <Globe className="w-5 h-5" /> General Store
          </button>
          <button onClick={() => setActiveTab('payment')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'payment' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-textMuted hover:bg-surface hover:text-white'}`}>
            <CreditCard className="w-5 h-5" /> Payments & Tax
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-textMuted hover:bg-surface hover:text-white'}`}>
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-textMuted hover:bg-surface hover:text-white'}`}>
            <Shield className="w-5 h-5" /> Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-6">General Store Information</h2>
                <div className="space-y-5 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-2">Store Name</label>
                    <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-surfaceHover rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-2">Support Email</label>
                    <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-surfaceHover rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-6">Payments & Tax</h2>
                <div className="space-y-5 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-2">Default Currency</label>
                    <select name="currency" value={settings.currency} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-surfaceHover rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-2">Global Tax Rate (%)</label>
                    <input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-surfaceHover rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-6 max-w-xl">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-surfaceHover bg-surface/30">
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-textMuted mt-1">Send transactional emails to customers.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surfaceHover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-surfaceHover bg-surface/30">
                    <div>
                      <p className="font-medium text-white">Admin Order Alerts</p>
                      <p className="text-sm text-textMuted mt-1">Notify admins of new incoming orders.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="orderAlerts" checked={settings.orderAlerts} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surfaceHover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-6">Security & Advanced</h2>
                <div className="space-y-6 max-w-xl">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-danger/30 bg-danger/5">
                    <div>
                      <p className="font-medium text-danger">Maintenance Mode</p>
                      <p className="text-sm text-textMuted mt-1">Disable storefront access. Admin remains active.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surfaceHover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-danger"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
