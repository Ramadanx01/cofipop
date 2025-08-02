document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');

    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const product = {
                name: document.getElementById('productName').value,
                description: document.getElementById('productDescription').value,
                price: parseFloat(document.getElementById('productPrice').value),
                category: document.getElementById('productCategory').value,
                image: document.getElementById('productImage').value
            };

            try {
                // --- Backend API Call to Add Product ---
                // Replace '/api/products' with your actual product creation endpoint
                // The 'fetchData' function in common.js will handle headers and JSON stringify
                const newProduct = await fetchData('/api/products', 'POST', product);
                console.log('Product added:', newProduct); // Log the response from the backend

                showToast('Product added successfully', 'success');
                addProductForm.reset(); // Clear the form
            } catch (error) {
                console.error('Error adding product:', error);
                // showToast handled by common.js fetchData
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const submitBtn = document.querySelector('#addProductForm button[type="submit"]');

    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const product = {
                name: document.getElementById('productName').value.trim(),
                description: document.getElementById('productDescription').value.trim(),
                price: parseFloat(document.getElementById('productPrice').value),
                category: document.getElementById('productCategory').value.trim(),
                image: document.getElementById('productImage').value.trim()
            };

            // ✅ Basic validation
            if (!product.name || isNaN(product.price) || !product.category) {
                showToast('Please fill in all required fields correctly.', 'warning');
                return;
            }

            try {
                // ✅ Show loading spinner on button
                showLoading(submitBtn);

                // --- Backend API Call to Add Product ---
                const newProduct = await fetchData('/api/products', 'POST', product);
                console.log('Product added:', newProduct);

                showToast('Product added successfully', 'success');
                addProductForm.reset(); // Clear the form
            } catch (error) {
                console.error('Error adding product:', error);
                // showToast handled by common.js
            } finally {
                hideLoading(submitBtn); // ✅ Hide spinner
            }
        });
    }
});
