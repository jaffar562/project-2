import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, MessageCircle, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, Customer } from '../../lib/supabase';

interface CustomersManagerProps {
  theme?: string;
}

const CustomersManager: React.FC<CustomersManagerProps> = ({ theme = 'dark' }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          input: 'bg-white border-gray-300 text-gray-900'
        };
      case 'glass':
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          input: 'bg-white/5 border-white/10 text-white'
        };
      default: // dark
        return {
          card: 'bg-gray-800 border-gray-700',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          input: 'bg-gray-700 border-gray-600 text-white'
        };
    }
  };

  const themeStyles = getThemeClasses();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      toast.error('Failed to fetch customers');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error('Error:', error);
    }
  };

  const toggleCustomerStatus = async (customerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', customerId);

      if (error) throw error;

      toast.success(`Customer ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to update customer status');
      console.error('Error:', error);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(searchLower) ||
      customer.last_name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      (customer.discord_username && customer.discord_username.toLowerCase().includes(searchLower))
    );
  });

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
          <h1 className={`text-3xl font-bold ${themeStyles.text}`}>Customers Manager</h1>
          <p className={`${themeStyles.textSecondary} mt-1`}>Manage and view customer information</p>
        </div>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className={`${themeStyles.card} border rounded-xl p-6`}>
        <div className="relative max-w-md">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeStyles.textMuted}`} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>
        <div className={`mt-2 text-sm ${themeStyles.textSecondary}`}>
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className={`${themeStyles.card} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {customer.first_name.charAt(0)}{customer.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${themeStyles.text}`}>
                    {customer.first_name} {customer.last_name}
                  </h3>
                  <p className={`text-sm ${themeStyles.textMuted}`}>
                    Member since {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Edit Customer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Customer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <Mail className={`w-4 h-4 ${themeStyles.textMuted}`} />
                <span className={`text-sm ${themeStyles.textSecondary} truncate`}>{customer.email}</span>
              </div>
              {customer.discord_username && (
                <div className="flex items-center space-x-2">
                  <MessageCircle className={`w-4 h-4 ${themeStyles.textMuted}`} />
                  <span className={`text-sm ${themeStyles.textSecondary}`}>{customer.discord_username}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-xl font-bold ${themeStyles.text}`}>{customer.total_orders}</div>
                <div className={`text-xs ${themeStyles.textMuted}`}>Total Orders</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${themeStyles.text}`}>₹{customer.total_spent.toLocaleString()}</div>
                <div className={`text-xs ${themeStyles.textMuted}`}>Total Spent</div>
              </div>
            </div>

            {customer.last_order_date && (
              <div className="mb-4">
                <div className={`text-sm ${themeStyles.textMuted}`}>Last Order:</div>
                <div className={`text-sm ${themeStyles.textSecondary}`}>
                  {new Date(customer.last_order_date).toLocaleDateString()}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                customer.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
              }`}>
                {customer.is_active ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => toggleCustomerStatus(customer.id, customer.is_active)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  customer.is_active
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                }`}
              >
                {customer.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className={`${themeStyles.card} border rounded-xl p-12 text-center`}>
          <Users className={`w-12 h-12 ${themeStyles.textMuted} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-2`}>
            {searchTerm ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className={`${themeStyles.textSecondary} mb-4`}>
            {searchTerm 
              ? 'Try adjusting your search terms to find customers.'
              : 'Customers will appear here once they start placing orders.'}
          </p>
          {!searchTerm && (
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
              Add Your First Customer
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold ${themeStyles.text}`}>{customers.length}</div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Total Customers</div>
        </div>
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold text-green-500`}>
            {customers.filter(c => c.is_active).length}
          </div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Active Customers</div>
        </div>
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold ${themeStyles.text}`}>
            {customers.reduce((sum, customer) => sum + customer.total_orders, 0)}
          </div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Total Orders</div>
        </div>
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold ${themeStyles.text}`}>
            ₹{customers.reduce((sum, customer) => sum + customer.total_spent, 0).toLocaleString()}
          </div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Total Revenue</div>
        </div>
      </div>
    </div>
  );
};

export default CustomersManager;