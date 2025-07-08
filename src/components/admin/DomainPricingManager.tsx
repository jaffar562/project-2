import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Globe, Star, TrendingUp, Tag, Flame } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase, DomainPricing } from '../../lib/supabase';

interface DomainPricingManagerProps {
  theme?: string;
}

const DomainPricingManager: React.FC<DomainPricingManagerProps> = ({ theme = 'dark' }) => {
  const [domains, setDomains] = useState<DomainPricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-blue-500 hover:bg-blue-600',
          input: 'bg-white border-gray-300 text-gray-900'
        };
      case 'glass':
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-purple-500/80 hover:bg-purple-600/80',
          input: 'bg-white/5 border-white/10 text-white'
        };
      default: // dark
        return {
          card: 'bg-gray-800 border-gray-700',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-purple-500 hover:bg-purple-600',
          input: 'bg-gray-700 border-gray-600 text-white'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const { data, error } = await supabase
        .from('domain_pricing')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setDomains(data || []);
    } catch (error) {
      toast.error('Failed to fetch domain pricing');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = async (data: any) => {
    try {
      const domainData = {
        ...data,
        price_inr: parseInt(data.price_inr),
        price_usd: data.price_usd ? parseInt(data.price_usd) : null,
        is_featured: data.is_featured || false,
        is_trending: data.is_trending || false,
        is_discount: data.is_discount || false,
        is_premium: data.is_premium || false,
        sort_order: domains.length,
        is_active: true
      };

      const { error } = await supabase
        .from('domain_pricing')
        .insert([domainData]);

      if (error) throw error;

      toast.success('Domain pricing added successfully');
      setShowAddForm(false);
      reset();
      fetchDomains();
    } catch (error) {
      toast.error('Failed to add domain pricing');
      console.error('Error:', error);
    }
  };

  const handleUpdateDomain = async (id: string, data: any) => {
    try {
      const domainData = {
        ...data,
        price_inr: parseInt(data.price_inr),
        price_usd: data.price_usd ? parseInt(data.price_usd) : null,
        is_featured: data.is_featured || false,
        is_trending: data.is_trending || false,
        is_discount: data.is_discount || false,
        is_premium: data.is_premium || false,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('domain_pricing')
        .update(domainData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Domain pricing updated successfully');
      setEditingDomain(null);
      fetchDomains();
    } catch (error) {
      toast.error('Failed to update domain pricing');
      console.error('Error:', error);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain pricing?')) return;

    try {
      const { error } = await supabase
        .from('domain_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Domain pricing deleted successfully');
      fetchDomains();
    } catch (error) {
      toast.error('Failed to delete domain pricing');
      console.error('Error:', error);
    }
  };

  const toggleDomainStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('domain_pricing')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Domain ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchDomains();
    } catch (error) {
      toast.error('Failed to update domain status');
      console.error('Error:', error);
    }
  };

  const getDomainBadges = (domain: DomainPricing) => {
    const badges = [];
    if (domain.is_featured) badges.push({ icon: Star, text: 'Featured', color: 'bg-yellow-500' });
    if (domain.is_trending) badges.push({ icon: TrendingUp, text: 'Trending', color: 'bg-green-500' });
    if (domain.is_discount) badges.push({ icon: Tag, text: 'Discount', color: 'bg-red-500' });
    if (domain.is_premium) badges.push({ icon: Flame, text: 'Premium', color: 'bg-purple-500' });
    return badges;
  };

  const DomainForm = ({ domain, onSubmit, onCancel }: any) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>TLD</label>
          <input
            {...register('tld', { required: 'TLD is required' })}
            defaultValue={domain?.tld}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder=".com"
          />
          {errors.tld && <p className="text-red-400 text-sm mt-1">{errors.tld.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Price (INR)</label>
          <input
            type="number"
            {...register('price_inr', { required: 'Price is required' })}
            defaultValue={domain?.price_inr}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="999"
          />
          {errors.price_inr && <p className="text-red-400 text-sm mt-1">{errors.price_inr.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Price (USD)</label>
          <input
            type="number"
            {...register('price_usd')}
            defaultValue={domain?.price_usd}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="Optional"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Sort Order</label>
          <input
            type="number"
            {...register('sort_order')}
            defaultValue={domain?.sort_order || 0}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_featured')}
            defaultChecked={domain?.is_featured}
            className="mr-2"
          />
          <label className={`text-sm ${themeStyles.textSecondary}`}>Featured</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_trending')}
            defaultChecked={domain?.is_trending}
            className="mr-2"
          />
          <label className={`text-sm ${themeStyles.textSecondary}`}>Trending</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_discount')}
            defaultChecked={domain?.is_discount}
            className="mr-2"
          />
          <label className={`text-sm ${themeStyles.textSecondary}`}>Discount</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_premium')}
            defaultChecked={domain?.is_premium}
            className="mr-2"
          />
          <label className={`text-sm ${themeStyles.textSecondary}`}>Premium</label>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Domain
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 ${themeStyles.card} border rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center`}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
      </div>
    </form>
  );

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
          <h1 className={`text-3xl font-bold ${themeStyles.text}`}>Domain Pricing Manager</h1>
          <p className={`${themeStyles.textSecondary} mt-1`}>Manage domain extension pricing and availability</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Domain
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Add New Domain Pricing</h3>
          <DomainForm
            onSubmit={handleAddDomain}
            onCancel={() => {
              setShowAddForm(false);
              reset();
            }}
          />
        </div>
      )}

      {/* Domains List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {domains.map((domain) => (
          <div key={domain.id} className={`${themeStyles.card} border rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative`}>
            {editingDomain === domain.id ? (
              <DomainForm
                domain={domain}
                onSubmit={(data: any) => handleUpdateDomain(domain.id, data)}
                onCancel={() => setEditingDomain(null)}
              />
            ) : (
              <>
                {/* Badges */}
                <div className="absolute -top-2 -right-2 flex flex-wrap gap-1">
                  {getDomainBadges(domain).map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <div key={index} className={`${badge.color} text-white text-xs px-2 py-1 rounded-full flex items-center animate-pulse`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {badge.text}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${themeStyles.text}`}>{domain.tld}</h3>
                      <p className={`text-sm ${themeStyles.textMuted}`}>Domain Extension</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingDomain(domain.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDomain(domain.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className={`text-sm ${themeStyles.textMuted}`}>Price:</span>
                    <span className={`font-semibold ${themeStyles.text}`}>
                      ₹{domain.price_inr}/year
                      {domain.price_usd && <span className="text-xs ml-1">(${domain.price_usd})</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${themeStyles.textMuted}`}>Sort Order:</span>
                    <span className={`${themeStyles.textSecondary}`}>{domain.sort_order}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    domain.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  }`}>
                    {domain.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleDomainStatus(domain.id, domain.is_active)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      domain.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {domain.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {domains.length === 0 && (
        <div className={`${themeStyles.card} border rounded-xl p-12 text-center`}>
          <Globe className={`w-12 h-12 ${themeStyles.textMuted} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-2`}>No domain pricing found</h3>
          <p className={`${themeStyles.textSecondary} mb-4`}>Get started by adding your first domain extension.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Add Your First Domain
          </button>
        </div>
      )}
    </div>
  );
};

export default DomainPricingManager;