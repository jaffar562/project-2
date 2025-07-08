import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Star, Shield, Zap, Crown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase, HostingPlan } from '../../lib/supabase';

interface HostingPlansManagerProps {
  theme?: string;
}

const HostingPlansManager: React.FC<HostingPlansManagerProps> = ({ theme = 'dark' }) => {
  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
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
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('hosting_plans')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      toast.error('Failed to fetch hosting plans');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlan = async (data: any) => {
    try {
      const planData = {
        ...data,
        price_inr: parseInt(data.price_inr),
        price_usd: data.price_usd ? parseInt(data.price_usd) : null,
        addon_unit_price: parseInt(data.addon_unit_price),
        addon_backup_price: parseInt(data.addon_backup_price),
        features: data.features ? data.features.split(',').map((f: string) => f.trim()) : [],
        sort_order: plans.length,
        is_active: true
      };

      const { error } = await supabase
        .from('hosting_plans')
        .insert([planData]);

      if (error) throw error;

      toast.success('Hosting plan added successfully');
      setShowAddForm(false);
      reset();
      fetchPlans();
    } catch (error) {
      toast.error('Failed to add hosting plan');
      console.error('Error:', error);
    }
  };

  const handleUpdatePlan = async (id: string, data: any) => {
    try {
      const planData = {
        ...data,
        price_inr: parseInt(data.price_inr),
        price_usd: data.price_usd ? parseInt(data.price_usd) : null,
        addon_unit_price: parseInt(data.addon_unit_price),
        addon_backup_price: parseInt(data.addon_backup_price),
        features: data.features ? data.features.split(',').map((f: string) => f.trim()) : [],
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('hosting_plans')
        .update(planData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Hosting plan updated successfully');
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      toast.error('Failed to update hosting plan');
      console.error('Error:', error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const { error } = await supabase
        .from('hosting_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Hosting plan deleted successfully');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to delete hosting plan');
      console.error('Error:', error);
    }
  };

  const togglePlanStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hosting_plans')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchPlans();
    } catch (error) {
      toast.error('Failed to update plan status');
      console.error('Error:', error);
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'budget':
        return <Shield className="w-5 h-5 text-green-400" />;
      case 'powered':
        return <Zap className="w-5 h-5 text-orange-400" />;
      case 'premium':
        return <Crown className="w-5 h-5 text-purple-400" />;
      default:
        return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const PlanForm = ({ plan, onSubmit, onCancel }: any) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Plan Name</label>
          <input
            {...register('name', { required: 'Plan name is required' })}
            defaultValue={plan?.name}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="e.g., Dirt Plan"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Plan Type</label>
          <select
            {...register('plan_type', { required: 'Plan type is required' })}
            defaultValue={plan?.plan_type}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="">Select Type</option>
            <option value="budget">Budget</option>
            <option value="powered">Powered</option>
            <option value="premium">Premium</option>
          </select>
          {errors.plan_type && <p className="text-red-400 text-sm mt-1">{errors.plan_type.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Price (INR)</label>
          <input
            type="number"
            {...register('price_inr', { required: 'Price is required' })}
            defaultValue={plan?.price_inr}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="49"
          />
          {errors.price_inr && <p className="text-red-400 text-sm mt-1">{errors.price_inr.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Price (USD)</label>
          <input
            type="number"
            {...register('price_usd')}
            defaultValue={plan?.price_usd}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="Optional"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>RAM</label>
          <input
            {...register('ram', { required: 'RAM is required' })}
            defaultValue={plan?.ram}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="2GB"
          />
          {errors.ram && <p className="text-red-400 text-sm mt-1">{errors.ram.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>CPU</label>
          <input
            {...register('cpu', { required: 'CPU is required' })}
            defaultValue={plan?.cpu}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="100% CPU"
          />
          {errors.cpu && <p className="text-red-400 text-sm mt-1">{errors.cpu.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Storage</label>
          <input
            {...register('storage', { required: 'Storage is required' })}
            defaultValue={plan?.storage}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="5GB SSD"
          />
          {errors.storage && <p className="text-red-400 text-sm mt-1">{errors.storage.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Location</label>
          <input
            {...register('location', { required: 'Location is required' })}
            defaultValue={plan?.location || 'Mumbai'}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="Mumbai"
          />
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Unit Addon Price</label>
          <input
            type="number"
            {...register('addon_unit_price', { required: 'Unit addon price is required' })}
            defaultValue={plan?.addon_unit_price || 30}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="30"
          />
          {errors.addon_unit_price && <p className="text-red-400 text-sm mt-1">{errors.addon_unit_price.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Backup Addon Price</label>
          <input
            type="number"
            {...register('addon_backup_price', { required: 'Backup addon price is required' })}
            defaultValue={plan?.addon_backup_price || 25}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="25"
          />
          {errors.addon_backup_price && <p className="text-red-400 text-sm mt-1">{errors.addon_backup_price.message as string}</p>}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Features (comma-separated)</label>
        <input
          {...register('features')}
          defaultValue={plan?.features?.join(', ')}
          className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          placeholder="Free DDoS Protection, 24/7 Support"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Plan
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
          <h1 className={`text-3xl font-bold ${themeStyles.text}`}>Hosting Plans Manager</h1>
          <p className={`${themeStyles.textSecondary} mt-1`}>Manage your Minecraft hosting plans and pricing</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Plan
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Add New Hosting Plan</h3>
          <PlanForm
            onSubmit={handleAddPlan}
            onCancel={() => {
              setShowAddForm(false);
              reset();
            }}
          />
        </div>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`${themeStyles.card} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
            {editingPlan === plan.id ? (
              <PlanForm
                plan={plan}
                onSubmit={(data: any) => handleUpdatePlan(plan.id, data)}
                onCancel={() => setEditingPlan(null)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getPlanIcon(plan.plan_type)}
                    <div>
                      <h3 className={`text-lg font-semibold ${themeStyles.text}`}>{plan.name}</h3>
                      <p className={`text-sm ${themeStyles.textMuted} capitalize`}>{plan.plan_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingPlan(plan.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className={`text-sm ${themeStyles.textMuted}`}>Price:</span>
                    <span className={`font-semibold ${themeStyles.text}`}>₹{plan.price_inr}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${themeStyles.textMuted}`}>RAM:</span>
                    <span className={`${themeStyles.textSecondary}`}>{plan.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${themeStyles.textMuted}`}>CPU:</span>
                    <span className={`${themeStyles.textSecondary}`}>{plan.cpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${themeStyles.textMuted}`}>Storage:</span>
                    <span className={`${themeStyles.textSecondary}`}>{plan.storage}</span>
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="mb-4">
                    <p className={`text-sm font-medium ${themeStyles.textMuted} mb-2`}>Features:</p>
                    <div className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <p key={index} className={`text-xs ${themeStyles.textSecondary}`}>• {feature}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    plan.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  }`}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      plan.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {plan.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className={`${themeStyles.card} border rounded-xl p-12 text-center`}>
          <Server className={`w-12 h-12 ${themeStyles.textMuted} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-2`}>No hosting plans found</h3>
          <p className={`${themeStyles.textSecondary} mb-4`}>Get started by adding your first hosting plan.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Add Your First Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default HostingPlansManager;