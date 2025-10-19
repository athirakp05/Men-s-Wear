from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/user/', views.current_user, name='current-user'),
    path('cart/', views.CartViewSet.as_view({'get': 'list'}), name='cart'),
    path('cart/add/', views.CartViewSet.as_view({'post': 'add_item'}), name='cart-add'),
    path('cart/update/', views.CartViewSet.as_view({'patch': 'update_item'}), name='cart-update'),
    path('cart/remove/', views.CartViewSet.as_view({'delete': 'remove_item'}), name='cart-remove'),
    path('cart/clear/', views.CartViewSet.as_view({'delete': 'clear'}), name='cart-clear'),
]