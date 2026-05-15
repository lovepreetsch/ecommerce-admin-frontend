import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productSlice';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view', 'delete'
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 50 }));
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-success/10 text-success border border-success/20';
      case 'DRAFT': return 'bg-warning/10 text-warning border border-warning/20';
      case 'ARCHIVED': return 'bg-danger/10 text-danger border border-danger/20';
      default: return 'bg-surfaceHover text-textMuted border border-surfaceHover';
    }
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product || { name: '', description: '', price: '', sku: '', categoryId: '', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProduct(selectedProduct.id)).unwrap();
      toast.success('Product deleted successfully');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await dispatch(createProduct(selectedProduct)).unwrap();
        toast.success('Product added successfully');
      } else if (modalMode === 'edit') {
        await dispatch(updateProduct({ id: selectedProduct.id, productData: selectedProduct })).unwrap();
        toast.success('Product updated successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
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
            <h3 className="text-lg font-bold text-white">Delete Product</h3>
            <p className="text-sm text-textMuted mt-2">Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-surfaceHover">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90">Delete Product</button>
          </div>
        </div>
      );
    }

    if (modalMode === 'view') {
      return (
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-surfaceHover flex items-center justify-center text-4xl border border-surfaceHover">📦</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-textMuted">Product ID</p><p className="font-medium text-white">#{selectedProduct.id}</p></div>
            <div><p className="text-sm text-textMuted">Status</p><span className={`inline-block mt-1 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedProduct.status)}`}>{selectedProduct.status}</span></div>
            <div className="col-span-2"><p className="text-sm text-textMuted">Name</p><p className="font-medium text-white">{selectedProduct.name}</p></div>
            <div><p className="text-sm text-textMuted">Category</p><p className="font-medium text-white">{selectedProduct.categoryName || 'Uncategorized'}</p></div>
            <div><p className="text-sm text-textMuted">Price</p><p className="font-medium text-white">${parseFloat(selectedProduct.price).toFixed(2)}</p></div>
            <div><p className="text-sm text-textMuted">SKU</p><p className="font-medium text-white">{selectedProduct.sku}</p></div>
            <div className="col-span-2"><p className="text-sm text-textMuted">Description</p><p className="text-sm text-white mt-1 bg-surfaceHover/50 p-3 rounded-lg">{selectedProduct.description}</p></div>
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
          <label className="block text-sm font-medium text-textMuted mb-1">Product Name</label>
          <input required type="text" value={selectedProduct.name} onChange={e => setSelectedProduct({...selectedProduct, name: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Category ID</label>
            <input required type="number" value={selectedProduct.categoryId} onChange={e => setSelectedProduct({...selectedProduct, categoryId: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Status</label>
            <select value={selectedProduct.status} onChange={e => setSelectedProduct({...selectedProduct, status: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none">
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Price ($)</label>
            <input required type="number" step="0.01" value={selectedProduct.price} onChange={e => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">SKU</label>
            <input required type="text" value={selectedProduct.sku} onChange={e => setSelectedProduct({...selectedProduct, sku: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Description</label>
          <textarea rows="3" value={selectedProduct.description} onChange={e => setSelectedProduct({...selectedProduct, description: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-surfaceHover">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    );
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-sm text-textMuted mt-1">Manage your product catalog and inventory.</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-surfaceHover rounded-lg text-sm text-white placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-surfaceHover text-sm text-textMuted">
                <th className="py-4 px-6 font-medium">Product Name</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Price</th>
                <th className="py-4 px-6 font-medium">SKU</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && products.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-textMuted">Loading products...</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 border border-surfaceHover">
                        <span className="text-lg">📦</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-textMuted">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-textMuted">{product.categoryName || 'Uncategorized'}</td>
                  <td className="py-4 px-6 text-sm font-medium text-white">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="py-4 px-6 text-sm text-textMuted">{product.sku}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal('view', product)} className="p-1.5 text-textMuted hover:text-primary transition-colors rounded-md hover:bg-primary/10">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenModal('edit', product)} className="p-1.5 text-textMuted hover:text-accent transition-colors rounded-md hover:bg-accent/10">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(product)} className="p-1.5 text-textMuted hover:text-danger transition-colors rounded-md hover:bg-danger/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredProducts.length === 0 && (
                <tr><td colSpan="6" className="py-12 text-center text-textMuted">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'add' ? 'Add New Product' : modalMode === 'edit' ? 'Edit Product' : modalMode === 'delete' ? 'Confirm Deletion' : 'Product Details'}
        maxWidth="max-w-2xl"
      >
        {isModalOpen && renderModalContent()}
      </Modal>
    </div>
  );
}
