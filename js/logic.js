// logic.js
const USERS_STORAGE_KEY = 'cofiPopUsers';
const REVIEWS_STORAGE_KEY = 'cofiPopReviews';
const RESERVATIONS_STORAGE_KEY = 'cofiPopReservations';
const CUSTOM_ORDERS_STORAGE_KEY = 'cofiPopCustomOrders';

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error(`Error parsing data from localStorage for key "${key}":`, e);
        return null;
    }
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error saving data to localStorage for key "${key}":`, e);
    }
}

export function registerUser(username, password, isAdmin = false) {
    const users = getFromLocalStorage(USERS_STORAGE_KEY) || [];
    if (users.find(user => user.username === username)) return false;
    users.push({ username, password, isAdmin, id: Date.now() });
    saveToLocalStorage(USERS_STORAGE_KEY, users);
    return true;
}

export function loginUser(username, password) {
    const users = getFromLocalStorage(USERS_STORAGE_KEY) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        saveToLocalStorage('currentUser', user);
        return user;
    }
    return null;
}

export function logoutUser() {
    localStorage.removeItem('currentUser');
    console.log('User logged out from logic.js.');
}

export function getCurrentUser() {
    return getFromLocalStorage('currentUser');
}

export function isAdminLoggedIn() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.isAdmin === true;
}

export function getReviews() {
    return getFromLocalStorage(REVIEWS_STORAGE_KEY) || [];
}

export function addReview(review) {
    const reviews = getReviews();
    reviews.push({ ...review, id: Date.now() });
    saveToLocalStorage(REVIEWS_STORAGE_KEY, reviews);
    return true;
}

export function updateReview(reviewId, updatedReviewData) {
    let reviews = getReviews();
    const index = reviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
        reviews[index] = { ...reviews[index], ...updatedReviewData };
        saveToLocalStorage(REVIEWS_STORAGE_KEY, reviews);
        return true;
    }
    return false;
}

export function deleteReview(reviewId) {
    let reviews = getReviews();
    const initialLength = reviews.length;
    reviews = reviews.filter(r => r.id !== reviewId);
    saveToLocalStorage(REVIEWS_STORAGE_KEY, reviews);
    return reviews.length < initialLength;
}

export function getReservations() {
    return getFromLocalStorage(RESERVATIONS_STORAGE_KEY) || [];
}

export function saveReservation(reservation) {
    let reservations = getReservations();
    reservations.push(reservation);
    saveToLocalStorage(RESERVATIONS_STORAGE_KEY, reservations);
}

export function updateReservationStatus(id, newStatus) {
    let reservations = getReservations();
    const index = reservations.findIndex(res => res.id == id);
    if (index !== -1) {
        reservations[index].status = newStatus;
        saveToLocalStorage(RESERVATIONS_STORAGE_KEY, reservations);
    }
}

export function deleteReservation(id) {
    let reservations = getReservations();
    reservations = reservations.filter(res => res.id != id);
    saveToLocalStorage(RESERVATIONS_STORAGE_KEY, reservations);
}

export function getCustomOrders() {
    return getFromLocalStorage(CUSTOM_ORDERS_STORAGE_KEY) || [];
}

export function saveCustomOrder(customOrder) {
    let customOrders = getCustomOrders();
    customOrders.push(customOrder);
    saveToLocalStorage(CUSTOM_ORDERS_STORAGE_KEY, customOrders);
}

export function updateCustomOrderStatus(id, newStatus) {
    let customOrders = getCustomOrders();
    const index = customOrders.findIndex(order => order.id == id);
    if (index !== -1) {
        customOrders[index].status = newStatus;
        saveToLocalStorage(CUSTOM_ORDERS_STORAGE_KEY, customOrders);
    }
}

export function deleteCustomOrder(id) {
    let customOrders = getCustomOrders();
    customOrders = customOrders.filter(order => order.id != id);
    saveToLocalStorage(CUSTOM_ORDERS_STORAGE_KEY, customOrders);
}

export function loadAdminReservations() {
    const reservations = getReservations();
    const adminReservationsList = document.getElementById('adminReservationsList');
    if (!adminReservationsList) return;
    adminReservationsList.innerHTML = reservations.length === 0 ? '<tr><td colspan="6">No reservations found.</td></tr>' : '';
    reservations.forEach(res => {
        adminReservationsList.innerHTML += `
            <tr>
                <td>${res.id}</td>
                <td>${res.name}</td>
                <td>${res.email}</td>
                <td>${new Date(res.date).toLocaleDateString()} ${res.time}</td>
                <td>${res.guests}</td>
                <td>
                    <select class="form-select reservation-status" data-id="${res.id}">
                        <option value="Pending" ${res.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Confirmed" ${res.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="Cancelled" ${res.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm delete-reservation-btn" data-id="${res.id}">Delete</button>
                </td>
            </tr>
        `;
    });
    document.querySelectorAll('.reservation-status').forEach(select => {
        select.onchange = (e) => {
            updateReservationStatus(e.target.dataset.id, e.target.value);
        };
    });
    document.querySelectorAll('.delete-reservation-btn').forEach(button => {
        button.onclick = (e) => {
            if (confirm('Are you sure you want to delete this reservation?')) {
                deleteReservation(e.target.dataset.id);
            }
        };
    });
}

export function loadAdminCustomOrders() {
    const customOrders = getCustomOrders();
    const adminCustomOrdersList = document.getElementById('adminCustomOrdersList');
    if (!adminCustomOrdersList) return;
    adminCustomOrdersList.innerHTML = customOrders.length === 0 ? '<tr><td colspan="5">No custom orders found.</td></tr>' : '';
    customOrders.forEach(order => {
        adminCustomOrdersList.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.name}</td>
                <td>${order.email}</td>
                <td>${order.details}</td>
                <td>
                    <select class="form-select custom-order-status" data-id="${order.id}">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm delete-custom-order-btn" data-id="${order.id}">Delete</button>
                </td>
            </tr>
        `;
    });
    document.querySelectorAll('.custom-order-status').forEach(select => {
        select.onchange = (e) => {
            updateCustomOrderStatus(e.target.dataset.id, e.target.value);
        };
    });
    document.querySelectorAll('.delete-custom-order-btn').forEach(button => {
        button.onclick = (e) => {
            if (confirm('Are you sure you want to delete this custom order?')) {
                deleteCustomOrder(e.target.dataset.id);
            }
        };
    });
}