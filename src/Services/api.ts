import axios from "axios"


const API_URL="http://127.0.0.1:8000/api"

export interface Order
{
    id:number,
    restaurant_id:number,
    order_amount:number,
    order_time:string
}
export interface Restaurant
{
    id:number,
    name:string,
    location:string,
    cuisine:string
}

//fetch all restaurants

export const fetchRestaurants=async (): Promise<Restaurant[]>=>{
const reponse=await axios.get(`${API_URL}/restaurants`);
return reponse.data;
}

//fetch all orders for a specific restaurants and optional data range

export const fetchOrdersPerRestaurants=async(
    restaurantId:number,
    from?:string,
    to?:string
):Promise<Order[]>=>{
    const params:any={restaurant_id:restaurantId}
    if (from) params.from=from;
    if (to)   params.to=to;
    
    const reponse=await axios.get(`${API_URL}/analytics/orders`,{params})
    return reponse.data;
}

export const fetchTopRestaurantsByRevenue=async(
    top: number=3,
    from?: string,
    to?:string
):Promise<Restaurant[]>=>{
    const params: any={top};
    if (from) params.from=from;
    if (to)   params.to=to;

    const reponse=await axios.get(`${API_URL}/analytics/top-restaurants`,{params})
    return reponse.data;
}
