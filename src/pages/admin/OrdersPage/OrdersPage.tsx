import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Visibility,
  Edit,
  LocalShipping,
} from '@mui/icons-material';
import { AdminLayout } from '../components/AdminLayout';
import { useApi, useMutation } from '@/shared/hooks/useApi';
import { mockOrdersApi, Order, OrderStatus } from '@/shared/lib/api';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { toast } from 'sonner';

/**
 * Admin orders management page component
 * 
 * Features:
 * - Order listing with status
 * - Order status updates
 * - Order details view
 * - Customer information
 */
const OrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');

  // Fetch orders
  const {
    data: orders,
    loading: ordersLoading,
    execute: refetchOrders
  } = useApi(() => mockOrdersApi.getAllOrders(), { immediate: true });

  // Update order status mutation
  const {
    loading: updateLoading,
    execute: updateOrderStatus
  } = useMutation(({ orderId, status }: { orderId: string; status: OrderStatus }) =>
    mockOrdersApi.updateOrderStatus(orderId, status)
  );

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusUpdateOpen(true);
  };

  const handleStatusUpdateSubmit = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus({ orderId: selectedOrder.id, status: newStatus });
      toast.success(`Order status updated to ${getStatusLabel(newStatus)}`);
      await refetchOrders();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      toast.error(errorMessage);
    } finally {
      setStatusUpdateOpen(false);
      setSelectedOrder(null);
    }
  };

  const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (ordersLoading) {
    return (
      <AdminLayout>
        <Container maxWidth="lg" className="py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg" className="py-8">
        <div className="mb-8">
          <Typography variant="h4" component="h1" gutterBottom>
            Order Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Monitor and manage customer orders
          </Typography>
        </div>

        {orders && orders.length > 0 ? (
          <>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              {orders.length} order{orders.length !== 1 ? 's' : ''} total
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          #{order.id.slice(-8).toUpperCase()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(order.createdAt)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          Customer #{order.userId.slice(-6).toUpperCase()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatPrice(order.totalAmount)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={getStatusLabel(order.status)}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(order)}
                          aria-label="view order details"
                        >
                          <Visibility />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleStatusUpdate(order)}
                          aria-label="update order status"
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Alert severity="info">
            <Typography variant="h6" gutterBottom>
              No orders found
            </Typography>
            <Typography variant="body2">
              Orders will appear here once customers start placing them
            </Typography>
          </Alert>
        )}

        {/* Order Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Order Details - #{selectedOrder?.id.slice(-8).toUpperCase()}
          </DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="subtitle2" gutterBottom>
                      Order Date
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedOrder.createdAt)}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="subtitle2" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={getStatusLabel(selectedOrder.status)}
                      color={getStatusColor(selectedOrder.status) as any}
                      size="small"
                    />
                  </div>
                </div>

                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                  </Typography>
                </div>

                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    Order Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product.name}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{formatPrice(item.price)}</TableCell>
                            <TableCell align="right">
                              {formatPrice(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <Typography variant="h6">Total Amount</Typography>
                    <Typography variant="h6" color="primary">
                      {formatPrice(selectedOrder.totalAmount)}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog
          open={statusUpdateOpen}
          onClose={() => setStatusUpdateOpen(false)}
        >
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth className="mt-4">
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setStatusUpdateOpen(false)}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdateSubmit}
              variant="contained"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default OrdersPage;