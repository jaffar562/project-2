import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, Trash2, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase, WebsiteContent } from '../../lib/supabase';

interface ContentManagerProps {
  theme?: string;
}

const ContentManager: React.FC<ContentManagerProps> = ({ theme = 'dark' }) => {
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .order('section', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      toast.error('Failed to fetch website content');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContent = async (data: any) => {
    try {
      const contentData = {
        section: data.section,
        key: data.key,
        content: { text: data.content },
        is_active: true
      };

      const { error } = await supabase
        .from('website_content')
        .insert([contentData]);

      if (error) throw error;

      toast.success('Content added successfully');
      setShowAddForm(false);
      reset();
      fetchContent();
    } catch (error) {
      toast.error('Failed to add content');
      console.error('Error:', error);
    }
  };

  const handleUpdateContent = async (id: string, data: any) => {
    try {
      const contentData = {
        section: data.section,
        key: data.key,
        content: { text: data.content },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('website_content')
        .update(contentData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Content updated successfully');
      setEditingContent(null);
      fetchContent();
    } catch (error) {
      toast.error('Failed to update content');
      console.error('Error:', error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Content deleted successfully');
      fetchContent();
    } catch (error) {
      toast.error('Failed to delete content');
      console.error('Error:', error);
    }
  };

  const toggleContentStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Content ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchContent();
    } catch (error) {
      toast.error('Failed to update content status');
      console.error('Error:', error);
    }
  };

  const ContentForm = ({ contentItem, onSubmit, onCancel }: any) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Section</label>
          <input
            {...register('section', { required: 'Section is required' })}
            defaultValue={contentItem?.section}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="e.g., hero, company"
          />
          {errors.section && <p className="text-red-400 text-sm mt-1">{errors.section.message as string}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Key</label>
          <input
            {...register('key', { required: 'Key is required' })}
            defaultValue={contentItem?.key}
            className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="e.g., title, subtitle"
          />
          {errors.key && <p className="text-red-400 text-sm mt-1">{errors.key.message as string}</p>}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Content</label>
        <textarea
          {...register('content', { required: 'Content is required' })}
          defaultValue={contentItem?.content?.text}
          rows={4}
          className={`w-full px-3 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
          placeholder="Enter your content here..."
        />
        {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content.message as string}</p>}
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Content
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
          <h1 className={`text-3xl font-bold ${themeStyles.text}`}>Content Manager</h1>
          <p className={`${themeStyles.textSecondary} mt-1`}>Manage website content and text</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Add New Content</h3>
          <ContentForm
            onSubmit={handleAddContent}
            onCancel={() => {
              setShowAddForm(false);
              reset();
            }}
          />
        </div>
      )}

      {/* Content List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {content.map((item) => (
          <div key={item.id} className={`${themeStyles.card} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
            {editingContent === item.id ? (
              <ContentForm
                contentItem={item}
                onSubmit={(data: any) => handleUpdateContent(item.id, data)}
                onCancel={() => setEditingContent(null)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${themeStyles.text}`}>
                        {item.section}.{item.key}
                      </h3>
                      <p className={`text-sm ${themeStyles.textMuted} capitalize`}>
                        {item.section} Section
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingContent(item.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-sm font-medium ${themeStyles.textMuted} mb-2`}>Content:</p>
                  <div className={`p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg ${themeStyles.textSecondary} text-sm leading-relaxed`}>
                    {item.content?.text || 'No content'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    item.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  }`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleContentStatus(item.id, item.is_active)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      item.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {item.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>

                <div className={`mt-4 text-xs ${themeStyles.textMuted}`}>
                  Last updated: {new Date(item.updated_at).toLocaleString()}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {content.length === 0 && (
        <div className={`${themeStyles.card} border rounded-xl p-12 text-center`}>
          <FileText className={`w-12 h-12 ${themeStyles.textMuted} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-2`}>No content found</h3>
          <p className={`${themeStyles.textSecondary} mb-4`}>Get started by adding your first content item.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Add Your First Content
          </button>
        </div>
      )}

      {/* Content Sections Summary */}
      <div className={`${themeStyles.card} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Content Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from(new Set(content.map(item => item.section))).map(section => (
            <div key={section} className="text-center">
              <div className={`text-2xl font-bold ${themeStyles.text}`}>
                {content.filter(item => item.section === section).length}
              </div>
              <div className={`text-sm ${themeStyles.textMuted} capitalize`}>{section} Section</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentManager;