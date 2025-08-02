document.addEventListener('DOMContentLoaded', () => {
    const reviewsTableBody = document.getElementById('reviewsTableBody');

    async function loadReviews() {
        try {
            const reviews = await fetchData('/api/reviews');
            renderReviews(reviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
            reviewsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">⚠️ Failed to load reviews.</td>
                </tr>`;
        }
    }

    function renderReviews(reviews) {
        reviewsTableBody.innerHTML = '';

        if (Array.isArray(reviews) && reviews.length > 0) {
            reviews.forEach(review => {
                const statusBadgeClass = review.status === 'Approved' ? 'bg-success' : 'bg-warning';

                const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

                const row = reviewsTableBody.insertRow();
                row.innerHTML = `
                    <td>${review.id}</td>
                    <td>${review.customerName}</td>
                    <td>${review.text.length > 80 ? review.text.substring(0, 80) + '…' : review.text}</td>
                    <td>${stars}</td>
                    <td><span class="badge ${statusBadgeClass}">${review.status}</span></td>
                    <td>
                        ${review.status !== 'Approved' ? `
                            <button class="btn btn-sm btn-success approve-btn" data-id="${review.id}">
                                <i class="fas fa-check"></i> Approve
                            </button>` : ''}
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${review.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </td>
                `;
            });
        } else {
            reviewsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">No reviews found.</td>
                </tr>`;
        }
    }

    reviewsTableBody.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id || e.target.closest('button')?.dataset.id);
        if (isNaN(id)) return;

        if (e.target.closest('.approve-btn')) {
            if (confirm('Approve this review?')) {
                try {
                    await fetchData(`/api/reviews/${id}/approve`, 'PUT');
                    showToast('Review approved ✔️', 'success');
                    loadReviews();
                } catch (error) {
                    console.error('Error approving review:', error);
                }
            }
        } else if (e.target.closest('.delete-btn')) {
            if (confirm('Delete this review?')) {
                try {
                    await fetchData(`/api/reviews/${id}`, 'DELETE');
                    showToast('Review deleted ❌', 'danger');
                    loadReviews();
                } catch (error) {
                    console.error('Error deleting review:', error);
                }
            }
        }
    });

    loadReviews();
});
