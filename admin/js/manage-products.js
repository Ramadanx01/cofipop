document.addEventListener('DOMContentLoaded', () => {
    const productsTableBody = document.getElementById('productsTableBody');
    const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    const editProductForm = document.getElementById('editProductForm');

    async function loadProducts() {
        try {
            const products = await fetchData('/api/products');
            renderProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">⚠️ Failed to load products.</td>
                </tr>`;
        }
    }

    function renderProducts(products) {
        productsTableBody.innerHTML = '';

        if (Array.isArray(products) && products.length > 0) {
            products.forEach(product => {
                const row = productsTableBody.insertRow();
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${parseFloat(product.price).toFixed(2)} EGP</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-btn" data-id="${product.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </td>
                `;
            });
        } else {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">No products found.</td>
                </tr>`;
        }
    }

    // Event delegation for Edit and Delete
    productsTableBody.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id || e.target.closest('button')?.dataset.id);
        if (isNaN(id)) return;

        if (e.target.closest('.edit-btn')) {
            try {
                const product = await fetchData(`/api/products/${id}`);
                if (product) {
                    document.getElementById('editProductId').value = product.id;
                    document.getElementById('editProductName').value = product.name;
                    document.getElementById('editProductDescription').value = product.description;
                    document.getElementById('editProductPrice').value = product.price;
                    document.getElementById('editProductCategory').value = product.category;
                    document.getElementById('editProductImage').value = product.image;
                    editProductModal.show();
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        } else if (e.target.closest('.delete-btn')) {
            if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                try {
                    await fetchData(`/api/products/${id}`, 'DELETE');
                    showToast('Product deleted successfully', 'success');
                    loadProducts();
                } catch (error) {
                    console.error('Error deleting product:', error);
                }
            }
        }
    });

    // Submit edit form
    editProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = parseInt(document.getElementById('editProductId').value);
        const updatedProduct = {
            name: document.getElementById('editProductName').value,
            description: document.getElementById('editProductDescription').value,
            price: parseFloat(document.getElementById('editProductPrice').value),
            category: document.getElementById('editProductCategory').value,
            image: document.getElementById('editProductImage').value
        };

        try {
            await fetchData(`/api/products/${id}`, 'PUT', updatedProduct);
            showToast('Product updated successfully', 'success');
            editProductModal.hide();
            loadProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });

    loadProducts();
});
