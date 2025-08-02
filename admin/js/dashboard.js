document.addEventListener('DOMContentLoaded', () => {
    async function loadDashboardData() {
        const totalProductsElement = document.getElementById('totalProducts');
        const totalReservationsElement = document.getElementById('totalReservations');
        const totalReviewsElement = document.getElementById('totalReviews');
        const latestReservationsTableBody = document.getElementById('latestReservationsTableBody');
        const latestReviewsTableBody = document.getElementById('latestReviewsTableBody');

        try {
            // ✅ إجمالي المنتجات، الحجوزات، والمراجعات
            const summary = await fetchData('/api/dashboard/summary');
            totalProductsElement.textContent = summary.products ?? 0;
            totalReservationsElement.textContent = summary.reservations ?? 0;
            totalReviewsElement.textContent = summary.reviews ?? 0;

            // ✅ آخر الحجوزات
            const latestReservations = await fetchData('/api/reservations/latest');
            renderLatestReservations(latestReservations);

            // ✅ آخر المراجعات
            const latestReviews = await fetchData('/api/reviews/latest');
            renderLatestReviews(latestReviews);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    function renderLatestReservations(reservations) {
        const tbody = document.getElementById('latestReservationsTableBody');
        tbody.innerHTML = '';

        if (Array.isArray(reservations) && reservations.length > 0) {
            reservations.forEach((reservation, index) => {
                const row = tbody.insertRow();
                const date = new Date(reservation.date).toLocaleDateString('en-GB');
                const statusClass = reservation.status === 'Confirmed' ? 'success' : 'warning';

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${reservation.customerName}</td>
                    <td>${date}</td>
                    <td><span class="badge bg-${statusClass}">${reservation.status}</span></td>
                `;
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">No reservations to display.</td>
                </tr>
            `;
        }
    }

    function renderLatestReviews(reviews) {
        const tbody = document.getElementById('latestReviewsTableBody');
        tbody.innerHTML = '';

        if (Array.isArray(reviews) && reviews.length > 0) {
            reviews.forEach((review, index) => {
                const stars = '⭐'.repeat(review.rating);
                const truncatedText = review.text.length > 50 ? review.text.substring(0, 50) + '...' : review.text;

                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${review.customerName}</td>
                    <td>${truncatedText}</td>
                    <td>${stars}</td>
                `;
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">No reviews to display.</td>
                </tr>
            `;
        }
    }

    loadDashboardData();
});
