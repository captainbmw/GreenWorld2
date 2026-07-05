import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { listenToProducts, escapeHtml } from './products.js';

const productForm = document.getElementById('productForm');
const adminProductList = document.getElementById('adminProductList');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const productCountBadge = document.getElementById('productCount');

let isEditing = false;
let currentEditId = null;

// Show/Hide Loading
function toggleLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

// Render the product table for admin
function renderAdminTable(products) {
    adminProductList.innerHTML = '';
    productCountBadge.textContent = `${products.length} Product${products.length === 1 ? '' : 's'}`;

    if (products.length === 0) {
        adminProductList.innerHTML = '<tr><td colspan="4" class="text-center py-4">No products found. Add your first one!</td></tr>';
        return;
    }

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${escapeHtml(product.image)}" class="product-img-preview me-3" alt="${escapeHtml(product.name)}">
                    <div>
                        <div class="fw-bold">${escapeHtml(product.name)}</div>
                        <small class="text-muted text-truncate d-inline-block" style="max-width: 200px;">${escapeHtml(product.description)}</small>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-light text-dark border">${escapeHtml(product.category)}</span></td>
            <td>Ksh ${escapeHtml(product.price)}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${product.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        adminProductList.appendChild(tr);
    });

    // Add Event Listeners for Edit and Delete
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const product = products.find(p => p.id === id);
            startEdit(product);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    toggleLoading(true);
                    await deleteDoc(doc(db, 'products', id));
                    alert('Product deleted successfully!');
                } catch (error) {
                    console.error("Error deleting product: ", error);
                    alert('Error deleting product.');
                } finally {
                    toggleLoading(false);
                }
            }
        });
    });
}

// Start Editing Mode
function startEdit(product) {
    isEditing = true;
    currentEditId = product.id;
    formTitle.textContent = 'Edit Product';
    submitBtn.textContent = 'Update Product';
    cancelBtn.style.display = 'block';

    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('category').value = product.category;
    document.getElementById('image').value = product.image;
    document.getElementById('description').value = product.description;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset Form
function resetForm() {
    isEditing = false;
    currentEditId = null;
    formTitle.textContent = 'Add New Product';
    submitBtn.textContent = 'Add Product';
    cancelBtn.style.display = 'none';
    productForm.reset();
}

cancelBtn.addEventListener('click', resetForm);

// Handle Form Submission
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        category: document.getElementById('category').value,
        image: document.getElementById('image').value,
        description: document.getElementById('description').value,
        timestamp: serverTimestamp()
    };

    try {
        toggleLoading(true);
        if (isEditing) {
            await updateDoc(doc(db, 'products', currentEditId), productData);
            alert('Product updated successfully!');
        } else {
            await addDoc(collection(db, 'products'), productData);
            alert('Product added successfully!');
        }
        resetForm();
    } catch (error) {
        console.error("Error saving product: ", error);
        alert('Error saving product: ' + error.message);
    } finally {
        toggleLoading(false);
    }
});

// Initialize real-time listening
listenToProducts(renderAdminTable);
