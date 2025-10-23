
# Menswear E-Commerce Platform

A modern, full-stack e-commerce application for menswear built with Django REST Framework and React + Vite.

## 🚀 Features

* **User Authentication** : Register, login, and logout functionality
* **Product Browsing** : View all products with filtering by category
* **Shopping Cart** : Add, update, and remove items from cart
* **Checkout Process** : Complete order with shipping information
* **Order Management** : View order history with detailed information
* **Responsive Design** : Modern UI that works on all devices
* **Real-time Updates** : Cart updates reflect immediately

## 📋 Prerequisites

* Python 3.8+
* Node.js 16+
* PostgreSQL
* npm or yarn

## 🛠️ Backend Setup

### 1. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE productdb;
\q
```

### 2. Install Python Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install django djangorestframework django-cors-headers psycopg2-binary pillow
```

### 3. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Start Backend Server

```bash
python manage.py runserver
```

Backend will run on `http://localhost:8000`

## 🎨 Frontend Setup

### 1. Navigate to Project Root

```bash
cd C:\Users\athir\Desktop\Steffin
```

### 2. Create React + Vite Project

```bash
npm create vite@latest frontend -- --template react
cd frontend
```

### 3. Install Dependencies

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom lucide-react
```

### 4. Project Structure

Create the following folder structure:

```
frontend/
├── src/
│   ├── api/
│   │   ├── config.js
│   │   └── services.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProductCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Orders.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
└── package.json
```

### 5. Copy Configuration Files

Use the provided artifacts to copy:

* `tailwind.config.js`
* `src/index.css`
* All API, context, component, and page files

### 6. Update API Base URL (if needed)

In `src/api/config.js`, update the API URL if your backend runs on a different port:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### 7. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📊 Adding Sample Data

### Using Django Admin

1. Navigate to `http://localhost:8000/admin`
2. Login with superuser credentials
3. Add Categories:
   * Shirts
   * Pants
   * Jackets
   * Accessories
4. Add Products with:
   * Name, Description, Price
   * Category, Brand, Size
   * Image URL (use placeholder images)
   * Stock quantity
   * Mark some as featured

### Using Django Shell

```bash
python manage.py shell
```

```python
from product.models import Category, Product

# Create categories
shirts = Category.objects.create(name="Shirts", description="Premium shirts")
pants = Category.objects.create(name="Pants", description="Stylish trousers")

# Create products
Product.objects.create(
    name="Classic White Shirt",
    description="Premium cotton white shirt",
    price=49.99,
    category=shirts,
    brand="STEFFIN",
    size="M",
    stock=50,
    is_featured=True,
    image_url="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"
)
```

## 🔐 API Endpoints

### Authentication

* `POST /api/auth/register/` - Register new user
* `POST /api/auth/login/` - Login user
* `POST /api/auth/logout/` - Logout user
* `GET /api/auth/user/` - Get current user

### Products

* `GET /api/products/` - List all products
* `GET /api/products/:id/` - Get product details
* `GET /api/products/featured/` - Get featured products
* `GET /api/products/?category=:id` - Filter by category

### Categories

* `GET /api/categories/` - List all categories

### Cart

* `GET /api/cart/` - Get user's cart
* `POST /api/cart/add_item/` - Add item to cart
* `PATCH /api/cart/update_item/` - Update cart item
* `DELETE /api/cart/remove_item/` - Remove cart item
* `DELETE /api/cart/clear/` - Clear cart

### Orders

* `GET /api/orders/` - List user's orders
* `POST /api/orders/` - Create new order
* `GET /api/orders/:id/` - Get order details

## 🎨 Design Features

* **Modern UI** : Clean, contemporary design with smooth animations
* **Responsive** : Works seamlessly on desktop, tablet, and mobile
* **Dark Theme** : Sophisticated dark color scheme with white accents
* **Smooth Transitions** : Hover effects and page transitions
* **Loading States** : Skeleton screens and loading indicators
* **Error Handling** : User-friendly error messages

## 📱 Pages Overview

1. **Home** : Hero section, featured products, categories preview
2. **Products** : Filterable product grid with sidebar
3. **Product Detail** : Full product information with add to cart
4. **Cart** : Shopping cart with quantity management
5. **Checkout** : Order form with summary
6. **Orders** : Order history with detailed view
7. **Login/Register** : Authentication forms

## 🔧 Troubleshooting

### CORS Issues

Ensure `CORS_ALLOW_ALL_ORIGINS = True` in Django settings.py

### Database Connection

Verify PostgreSQL credentials in settings.py match your setup

### Port Already in Use

```bash
# Backend
python manage.py runserver 8001

# Frontend - update vite.config.js
server: { port: 5174 }
```

### Token Not Working

Clear localStorage and login again:

```javascript
localStorage.clear()
```

## 🚀 Deployment

### Backend (Heroku/Railway)

1. Add `gunicorn` to requirements.txt
2. Create Procfile: `web: gunicorn backend_django.wsgi`
3. Set environment variables for database

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy dist folder
