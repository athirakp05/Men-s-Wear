from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, CartSerializer, CartItemSerializer,
    OrderSerializer, CreateOrderSerializer, UserSerializer, RegisterSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    POST /api/auth/register/
    Body: {
        "username": "string",
        "email": "string",
        "password": "string",
        "first_name": "string",
        "last_name": "string"
    }
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user
    POST /api/auth/login/
    Body: {
        "username": "string",
        "password": "string"
    }
    """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user
    POST /api/auth/logout/
    Headers: Authorization: Token <token>
    """
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Get current logged in user
    GET /api/auth/user/
    Headers: Authorization: Token <token>
    """
    return Response(UserSerializer(request.user).data)

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category CRUD operations
    
    list: GET /api/categories/
    retrieve: GET /api/categories/{id}/
    create: POST /api/categories/
    update: PUT /api/categories/{id}/
    partial_update: PATCH /api/categories/{id}/
    destroy: DELETE /api/categories/{id}/
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product CRUD operations
    
    list: GET /api/products/
    retrieve: GET /api/products/{id}/
    create: POST /api/products/
    update: PUT /api/products/{id}/
    partial_update: PATCH /api/products/{id}/
    destroy: DELETE /api/products/{id}/
    featured: GET /api/products/featured/
    
    Query Parameters for list:
    - category: Filter by category ID
    - featured: Filter featured products (true/false)
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Filter products based on query parameters
        """
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)
        
        if category:
            queryset = queryset.filter(category_id=category)
        if featured:
            queryset = queryset.filter(is_featured=True)
        
        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured products
        GET /api/products/featured/
        """
        featured_products = Product.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

class CartViewSet(viewsets.ViewSet):
    """
    ViewSet for Cart operations
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Get user's cart with all items
        GET /api/cart/
        Headers: Authorization: Token <token>
        """
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """
        Add item to cart
        POST /api/cart/add/
        Headers: Authorization: Token <token>
        Body: {
            "product_id": integer,
            "quantity": integer (default: 1)
        }
        """
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response(
                {'error': 'product_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
            if quantity <= 0:
                return Response(
                    {'error': 'Quantity must be greater than 0'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {'error': 'Invalid quantity'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        if product.stock < quantity:
            return Response(
                {'error': f'Insufficient stock. Only {product.stock} items available'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not item_created:
            new_quantity = cart_item.quantity + quantity
            if product.stock < new_quantity:
                return Response(
                    {'error': f'Cannot add {quantity} more. Only {product.stock - cart_item.quantity} items available'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_quantity
            cart_item.save()

        return Response(
            CartItemSerializer(cart_item).data, 
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        """
        Update cart item quantity
        PATCH /api/cart/update/
        Headers: Authorization: Token <token>
        Body: {
            "cart_item_id": integer,
            "quantity": integer
        }
        """
        cart_item_id = request.data.get('cart_item_id')
        quantity = request.data.get('quantity')

        if not cart_item_id:
            return Response(
                {'error': 'cart_item_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid quantity'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        if quantity <= 0:
            cart_item.delete()
            return Response(
                {'message': 'Item removed from cart'}, 
                status=status.HTTP_200_OK
            )

        if cart_item.product.stock < quantity:
            return Response(
                {'error': f'Insufficient stock. Only {cart_item.product.stock} items available'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """
        Remove item from cart
        DELETE /api/cart/remove/
        Headers: Authorization: Token <token>
        Body: {
            "cart_item_id": integer
        }
        """
        cart_item_id = request.data.get('cart_item_id')

        if not cart_item_id:
            return Response(
                {'error': 'cart_item_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, cart__user=request.user)
            cart_item.delete()
            return Response(
                {'message': 'Item removed from cart'}, 
                status=status.HTTP_200_OK
            )
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Cart item not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """
        Clear all items from cart
        DELETE /api/cart/clear/
        Headers: Authorization: Token <token>
        """
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response(
            {'message': 'Cart cleared successfully'}, 
            status=status.HTTP_200_OK
        )

class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order operations
    
    list: GET /api/orders/
    retrieve: GET /api/orders/{id}/
    create: POST /api/orders/
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Get orders for the current user
        """
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request):
        """
        Create a new order from cart items
        POST /api/orders/
        Headers: Authorization: Token <token>
        Body: {
            "shipping_address": "string",
            "phone_number": "string"
        }
        """
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Get user's cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        if not cart.items.exists():
            return Response(
                {'error': 'Cart is empty'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check stock availability for all items
        for cart_item in cart.items.all():
            if cart_item.product.stock < cart_item.quantity:
                return Response(
                    {'error': f'Insufficient stock for {cart_item.product.name}. Only {cart_item.product.stock} available'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_amount=cart.total_price,
            shipping_address=serializer.validated_data['shipping_address'],
            phone_number=serializer.validated_data['phone_number']
        )

        # Create order items and update stock
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            
            # Update product stock
            product = cart_item.product
            product.stock -= cart_item.quantity
            product.save()

        # Clear cart after successful order
        cart.items.all().delete()

        return Response(
            OrderSerializer(order).data, 
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """
        Prevent updating orders
        """
        return Response(
            {'error': 'Orders cannot be updated'}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def destroy(self, request, *args, **kwargs):
        """
        Prevent deleting orders
        """
        return Response(
            {'error': 'Orders cannot be deleted'}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )