import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Edit, Star, StarHalf } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, updateReviewStatus, deleteReview } from '../store/slices/reviewSlice';
import Modal from '../components/ui/Modal';
import { toast } from 'react-toastify';

export default function ReviewsPage() {
  const dispatch = useDispatch();
  const { items: reviews, loading } = useSelector((state) => state.reviews);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'delete'
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const handleOpenModal = (mode, review = null) => {
    setModalMode(mode);
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteReview(selectedReview.id)).unwrap();
      toast.success('Review deleted successfully');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateReviewStatus({ 
        id: selectedReview.id, 
        status: selectedReview.status 
      })).unwrap();
      toast.success('Review status updated successfully');
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update review');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<Star key={i} className="w-4 h-4 fill-warning text-warning" />);
      else if (i - 0.5 === rating) stars.push(<StarHalf key={i} className="w-4 h-4 fill-warning text-warning" />);
      else stars.push(<Star key={i} className="w-4 h-4 text-surfaceHover" />);
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-success/10 text-success border-success/20';
      case 'REJECTED': return 'bg-danger/10 text-danger border-danger/20';
      default: return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderModalContent = () => {
    if (modalMode === 'delete') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Review</h3>
            <p className="text-sm text-textMuted mt-2">Are you sure you want to delete this review? This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-surfaceHover">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90">Delete Review</button>
          </div>
        </div>
      );
    }

    if (modalMode === 'view') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-surfaceHover">
            <div>
              <p className="text-sm text-textMuted">Product</p>
              <p className="text-lg font-bold text-white">{selectedReview.productName || `Product #${selectedReview.productId}`}</p>
            </div>
            <div className="text-right">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(selectedReview.status)}`}>{selectedReview.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-textMuted">Customer Email</p><p className="font-medium text-white">{selectedReview.userEmail || `User #${selectedReview.userId}`}</p></div>
            <div><p className="text-sm text-textMuted">Date</p><p className="font-medium text-white">{selectedReview.createdAt || 'N/A'}</p></div>
            <div className="col-span-2">
              <p className="text-sm text-textMuted mb-1">Rating</p>
              {renderStars(selectedReview.rating)}
            </div>
            <div className="col-span-2">
              <p className="text-sm text-textMuted">Comment</p>
              <div className="mt-2 bg-background p-4 rounded-lg border border-surfaceHover">
                <p className="text-white whitespace-pre-wrap">{selectedReview.comment}</p>
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-surfaceHover text-white rounded-lg hover:bg-surfaceHover/80">Close</button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Status</label>
          <select value={selectedReview.status} onChange={e => setSelectedReview({...selectedReview, status: e.target.value})} className="w-full px-4 py-2 bg-background border border-surfaceHover rounded-lg text-white focus:ring-2 focus:ring-primary/50 outline-none">
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-surfaceHover mt-6">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-surfaceHover text-textMuted rounded-lg hover:bg-surfaceHover">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reviews</h1>
          <p className="text-sm text-textMuted mt-1">Manage and moderate customer product reviews.</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search by product or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-surfaceHover rounded-lg text-sm text-white placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-surfaceHover text-sm text-textMuted">
                <th className="py-4 px-6 font-medium">Product</th>
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Rating</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && reviews.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-textMuted">Loading reviews...</td></tr>
              ) : filteredReviews.map((review) => (
                <tr key={review.id} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors group">
                  <td className="py-4 px-6"><span className="text-sm font-medium text-white">{review.productName || `Product #${review.productId}`}</span></td>
                  <td className="py-4 px-6 text-sm text-textMuted">{review.userEmail || `User #${review.userId}`}</td>
                  <td className="py-4 px-6">{renderStars(review.rating)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(review.status)}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal('view', review)} className="p-1.5 text-textMuted hover:text-white transition-colors rounded-md hover:bg-surfaceHover">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenModal('edit', review)} className="p-1.5 text-textMuted hover:text-accent transition-colors rounded-md hover:bg-surfaceHover">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(review)} className="p-1.5 text-textMuted hover:text-danger transition-colors rounded-md hover:bg-surfaceHover">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredReviews.length === 0 && <tr><td colSpan="5" className="py-12 text-center text-textMuted">No reviews found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'edit' ? 'Moderate Review' : modalMode === 'delete' ? 'Confirm Deletion' : 'Review Details'}>
        {isModalOpen && renderModalContent()}
      </Modal>
    </div>
  );
}
