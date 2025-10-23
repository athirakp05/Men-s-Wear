from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from .models import Category, Product, Order
from .serializers import (
    CategorySerializer, ProductSerializer, OrderSerializer, UserSerializer
)

class AdminCategoryViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for Category management"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]

class AdminProductViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for Product management"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = Product.objects.all().order_by('-created_at')
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category_id=category)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get product statistics"""
        total_products = Product.objects.count()
        low_stock = Product.objects.filter(stock__lt=10).count()
        out_of_stock = Product.objects.filter(stock=0).count()
        featured_products = Product.objects.filter(is_featured=True).count()
        
        return Response({
            'total_products': total_products,
            'low_stock': low_stock,
            'out_of_stock': out_of_stock,
            'featured_products': featured_products
        })

class AdminOrderViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for Order management"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = Order.objects.all().order_by('-created_at')
        status_filter = self.request.query_params.get('status', None)
        user_id = self.request.query_params.get('user', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        return queryset

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES).keys():
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get order statistics"""
        from django.db.models import Sum, Count
        
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        processing_orders = Order.objects.filter(status='processing').count()
        completed_orders = Order.objects.filter(status='delivered').count()
        total_revenue = Order.objects.filter(status='delivered').aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        return Response({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'processing_orders': processing_orders,
            'completed_orders': completed_orders,
            'total_revenue': float(total_revenue)
        })

    def destroy(self, request, *args, **kwargs):
        """Prevent deleting orders"""
        return Response(
            {'error': 'Orders cannot be deleted'}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin ViewSet for User management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics"""
        total_users = User.objects.count()
        admin_users = User.objects.filter(is_staff=True).count()
        active_users = User.objects.filter(is_active=True).count()
        
        return Response({
            'total_users': total_users,
            'admin_users': admin_users,
            'active_users': active_users,
            'regular_users': total_users - admin_users
        })