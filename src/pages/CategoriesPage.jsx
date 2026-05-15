import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, FolderTree, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categorySlice';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { items: categories, loading } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view', 'delete'
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category || { name: '', description: '', slug: '', active: true });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCategory(selectedCategory.id)).unwrap();
      toast.success('Category deleted successfully');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await dispatch(createCategory(selectedCategory)).unwrap();
        toast.success('Category added successfully');
      } else if (modalMode === 'edit') {
        await dispatch(updateCategory({ id: selectedCategory.id, categoryData: selectedCategory })).unwrap();
        toast.success('Category updated successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    }
  };

  const renderModalContent = () => {
    if (modalMode === 'delete') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Category</h3>
            <p className="text-sm text-textMuted mt-2">Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-surfaceHover">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90">Delete Category</button>
          </div>
        </div>
      );
    }

    if (modalMode === 'view') {
      return (
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <FolderTree className="w-10 h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-textMuted">Category ID</p><p className="font-medium text-white">#{selectedCategory.id}</p></div>
            <div><p className="text-sm text-textMuted">Slug</p><p className="font-medium text-white">{selectedCategory.slug}</p></div>
            <div className="col-span-2"><p className="text-sm text-textMuted">Name</p><p className="font-medium text-white">{selectedCategory.name}</p></div>
            <div className="col-span-2"><p className="text-sm text-textMuted">Description</p><p className="text-sm text-white mt-1 bg-surfaceHover/50 p-3 rounded-lg">{selectedCategory.description}</p></div>
          </div>
          <div className="pt-6 flex justify-end">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-surfaceHover text-white rounded-lg hover:bg-surfaceHover/80">Close</button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Category Name</label>
          <input required type="text" value={selectedCategory.name} onChange={e => setSelectedCategory({...selectedCategory, name: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Slug</label>
          <input type="text" value={selectedCategory.slug} onChange={e => setSelectedCategory({...selectedCategory, slug: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" placeholder="auto-generated if empty" />
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Description</label>
          <textarea rows="3" value={selectedCategory.description} onChange={e => setSelectedCategory({...selectedCategory, description: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-surfaceHover mt-6">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    );
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Categories</h1>
          <p className="text-sm text-textMuted mt-1">Organize your products into categories.</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-surfaceHover rounded-lg text-sm text-white placeholder-textMuted outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && categories.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-textMuted">Loading categories...</div>
        ) : filteredCategories.map((category) => (
          <div key={category.id} className="glass-panel p-6 rounded-xl hover:shadow-primary/5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FolderTree className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal('view', category)} className="p-1.5 text-textMuted hover:text-white bg-surface rounded-md border border-surfaceHover">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => handleOpenModal('edit', category)} className="p-1.5 text-textMuted hover:text-accent bg-surface rounded-md border border-surfaceHover">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteClick(category)} className="p-1.5 text-textMuted hover:text-danger bg-surface rounded-md border border-surfaceHover">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              {category.name}
            </h3>
            <p className="text-sm text-textMuted mb-6 line-clamp-2 min-h-[40px]">{category.description}</p>
            
            <div className="pt-4 border-t border-surfaceHover flex justify-between items-center">
              <span className="text-xs text-textMuted font-mono">ID: #{category.id}</span>
              <span className="text-xs text-textMuted font-mono">{category.slug}</span>
            </div>
          </div>
        ))}
        {!loading && filteredCategories.length === 0 && <div className="col-span-3 text-center py-12 text-textMuted">No categories found.</div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Category' : modalMode === 'edit' ? 'Edit Category' : modalMode === 'delete' ? 'Confirm Deletion' : 'Category Details'}>
        {isModalOpen && renderModalContent()}
      </Modal>
    </div>
  );
}
