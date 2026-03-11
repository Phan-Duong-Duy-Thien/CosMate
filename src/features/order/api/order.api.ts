/**
 * Order API
 * Handles order creation API calls
 */
import axiosInstance from '@/services/axiosInstance';
import type { CreateOrderPayload, CreateOrderResponse, OrderItem, OrderDetail } from '../types';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Ship order response types
interface ShipImage {
  id: number;
  imageUrl: string;
  stage: string;
  note: string;
  confirm: boolean;
}

interface ShipTracking {
  id: number;
  trackingCode: string;
  trackingStatus: string;
  stage: string;
  createdAt: string;
}

interface ShipOrderResult {
  images: ShipImage[];
  tracking: ShipTracking;
}

/**
 * Create a new order
 * @param cosplayerId - The cosplayer user ID
 * @param payload - Order creation data
 * @returns Created order with payment URL
 */
export async function createOrder(
  cosplayerId: number,
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const response = await axiosInstance.post<ApiResponse<CreateOrderResponse>>(
    `/api/orders?cosplayerId=${cosplayerId}`,
    payload
  );
  return response.data.result;
}

/**
 * Get all orders for a provider
 * @param providerId - The provider ID
 * @returns List of orders for the provider
 */
export async function getOrdersByProvider(providerId: number): Promise<OrderItem[]> {
  const response = await axiosInstance.get<ApiResponse<OrderItem[]>>(
    `/api/orders/provider/${providerId}`
  );
  return response.data.result;
}

/**
 * Get all orders for a user
 * @param userId - The user ID
 * @returns List of orders for the user
 */
export async function getOrdersByUserId(userId: number): Promise<OrderItem[]> {
  const response = await axiosInstance.get<ApiResponse<OrderItem[]>>(
    `/api/orders/user/${userId}`
  );
  return response.data.result;
}

/**
 * Prepare an order (update status to PREPARING)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function prepareOrder(orderId: number): Promise<OrderItem> {
  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/prepare`
  );
  return response.data.result;
}

/**
 * Ship an order (update status to SHIPPING_OUT)
 * @param orderId - The order ID
 * @param trackingCode - The tracking code for shipment
 * @param notes - Array of notes mapped to images by index
 * @param images - Array of image files
 * @returns Ship order result with images and tracking info
 */
export async function shipOrder(
  orderId: number,
  trackingCode: string,
  notes: string[],
  images: File[]
): Promise<ShipOrderResult> {
  const formData = new FormData();

  // Append each image with the same key 'images'
  images.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post<ApiResponse<ShipOrderResult>>(
    `/api/orders/${orderId}/ship?trackingCode=${encodeURIComponent(trackingCode)}`,
    formData,
    {
      params: {
        notes: notes,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.result;
}

/**
 * Deliver out an order (update status to DELIVERING_OUT)
 * @param orderId - The order ID
 * @returns Updated order with tracking info
 */
export async function deliverOutOrder(orderId: number): Promise<OrderItem> {
  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/deliver-out`
  );
  return response.data.result;
}

/**
 * Confirm delivery of an order (update status to IN_USE)
 * @param orderId - The order ID
 * @param images - Array of image files
 * @param notes - Array of notes (one per image, can be empty strings)
 * @returns Updated order
 */
export async function confirmDeliveryOrder(
  orderId: number,
  images: File[],
  notes: string[]
): Promise<OrderItem> {
  const formData = new FormData();

  // Append each image with the same key 'images'
  images.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/confirm-delivery`,
    formData,
    {
      params: {
        notes: notes,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.result;
}

/**
 * Get order detail by ID
 * @param orderId - The order ID
 * @returns Order detail with all related data
 */
export async function getOrderById(orderId: number): Promise<OrderDetail> {
  const response = await axiosInstance.get<ApiResponse<OrderDetail>>(
    `/api/orders/${orderId}`
  );
  return response.data.result;
}

/**
 * Complete an order (update status to COMPLETED)
 * @param orderId - The order ID
 * @returns Updated order
 */
export async function completeOrder(orderId: number): Promise<OrderItem> {
  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/complete`
  );
  return response.data.result;
}

/**
 * Return an order (update status to SHIPPING_BACK)
 * @param orderId - The order ID
 * @param trackingCode - The tracking code for return shipment
 * @param notes - Array of notes (one per image, empty strings as safe default)
 * @param images - Array of image files
 * @returns Updated order
 */
export async function returnOrder(
  orderId: number,
  trackingCode: string,
  notes: string[],
  images: File[]
): Promise<OrderItem> {
  const formData = new FormData();

  // Append each image with the same key 'images'
  images.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post<ApiResponse<OrderItem>>(
    `/api/orders/${orderId}/return?trackingCode=${encodeURIComponent(trackingCode)}`,
    formData,
    {
      params: {
        notes: notes,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.result;
}
