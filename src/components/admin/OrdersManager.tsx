import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, Order } from '../../lib/supabase';

interface OrdersManagerProps {
  theme?: string;
}

const OrdersManager: React.FC<OrdersManagerProps> = ({ theme = 'dark' }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error:', error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
      console.error('Error:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.order_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'minecraft':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'vps':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'domain':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
          <h1 className={`text-3xl font-bold ${themeStyles.text}`}>Orders Manager</h1>
          <p className={`${themeStyles.textSecondary} mt-1`}>Manage and track all customer orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOrders}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`${themeStyles.card} border rounded-xl p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeStyles.textMuted}`} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-4 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="all">All Types</option>
            <option value="minecraft">Minecraft</option>
            <option value="vps">VPS</option>
            <option value="domain">Domain</option>
          </select>

          <div className={`text-sm ${themeStyles.textSecondary} flex items-center`}>
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className={`${themeStyles.card} border rounded-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>
                  Order ID
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>
                  Customer
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>
                  Type
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>
                  Amount
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>
                  Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${themeStyles.text}`}>#{order.order_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className={`text-sm font-medium ${themeStyles.text}`}>{order.customer_name}</div>
                      <div className={`text-sm ${themeStyles.textMuted}`}>{order.customer_email}</div>
                      {order.discord_username && (
                        <div className={`text-xs ${themeStyles.textMuted}`}>Discord: {order.discord_username}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(order.order_type)}`}>
                      {order.order_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${themeStyles.text}`}>
                      ₹{order.total_amount.toLocaleString()}
                    </div>
                    <div className={`text-xs ${themeStyles.textMuted}`}>{order.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-medium rounded-full border-0 ${getStatusColor(order.status)} focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${themeStyles.textSecondary}`}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className={`text-xs ${themeStyles.textMuted}`}>
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-500 hover:text-green-700 transition-colors"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className={`text-lg font-semibold ${themeStyles.text} mb-2`}>No orders found</div>
            <p className={`${themeStyles.textSecondary}`}>
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Orders will appear here once customers start placing them.'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold ${themeStyles.text}`}>{orders.length}</div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Total Orders</div>
        </div>
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold text-yellow-500`}>
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Pending</div>
        </div>
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold text-green-500`}>
            {orders.filter(o => o.status === 'active').length}
          </div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Active</div>
        </div>
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold text-red-500`}>
            {orders.filter(o => o.status === 'cancelled').length}
          </div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Cancelled</div>
        </div>
        <div className={`${themeStyles.card} border rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold ${themeStyles.text}`}>
            ₹{orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()}
          </div>
          <div className={`text-sm ${themeStyles.textMuted}`}>Total Revenue</div>
        </div>
      </div>
    </div>
  );
};

export default OrdersManager;