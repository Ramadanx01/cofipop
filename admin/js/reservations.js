document.addEventListener('DOMContentLoaded', () => {
    const reservationsTableBody = document.getElementById('reservationsTableBody');

    async function loadReservations() {
        try {
            const reservations = await fetchData('/api/reservations');
            renderReservations(reservations);
        } catch (error) {
            console.error('Error loading reservations:', error);
            reservationsTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">⚠️ Failed to load reservations.</td>
                </tr>`;
        }
    }

    function renderReservations(reservations) {
        reservationsTableBody.innerHTML = '';

        if (Array.isArray(reservations) && reservations.length > 0) {
            reservations.forEach(reservation => {
                const row = reservationsTableBody.insertRow();
                const statusBadgeClass = reservation.status === 'Confirmed' ? 'bg-success' : 'bg-warning';

                row.innerHTML = `
                    <td>${reservation.id}</td>
                    <td>${reservation.customerName}</td>
                    <td>${reservation.email}</td>
                    <td>${reservation.numberOfPeople}</td>
                    <td>${new Date(reservation.date).toLocaleDateString()}</td>
                    <td>${reservation.time}</td>
                    <td><span class="badge ${statusBadgeClass}">${reservation.status}</span></td>
                    <td>
                        ${reservation.status !== 'Confirmed' ? `
                            <button class="btn btn-sm btn-success confirm-btn" data-id="${reservation.id}">
                                <i class="fas fa-check"></i> Confirm
                            </button>` : ''}
                        <button class="btn btn-sm btn-danger cancel-btn" data-id="${reservation.id}">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </td>
                `;
            });
        } else {
            reservationsTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted">No reservations found.</td>
                </tr>`;
        }
    }

    reservationsTableBody.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id || e.target.closest('button')?.dataset.id);
        if (isNaN(id)) return;

        if (e.target.closest('.confirm-btn')) {
            if (confirm('Confirm this reservation?')) {
                try {
                    await fetchData(`/api/reservations/${id}/confirm`, 'PUT');
                    showToast('Reservation confirmed ✔️', 'success');
                    loadReservations();
                } catch (error) {
                    console.error('Error confirming reservation:', error);
                }
            }
        } else if (e.target.closest('.cancel-btn')) {
            if (confirm('Cancel this reservation?')) {
                try {
                    await fetchData(`/api/reservations/${id}`, 'DELETE');
                    showToast('Reservation cancelled ❌', 'danger');
                    loadReservations();
                } catch (error) {
                    console.error('Error cancelling reservation:', error);
                }
            }
        }
    });

    loadReservations();
});
