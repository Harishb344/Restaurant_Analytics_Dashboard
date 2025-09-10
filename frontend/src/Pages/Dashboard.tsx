import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterBar from "../Components/FilterBar";
import styles from "./dashboard.module.css";

interface Order {
  id: number;
  restaurant_id: number;
  order_amount: number;
  order_time: string;
}

interface Restaurant {
  id: number;
  name: string;
  orders: Order[];
}

interface DailyAnalytics {
  orders: number;
  revenue: number;
  avgOrderValue: number;
  peakHour: number | null;
}

interface TopRestaurant {
  restaurant_id: number;
  name: string;
  revenue: number;
}

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [analytics, setAnalytics] = useState<{ [date: string]: DailyAnalytics }>({});
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/merge")
      .then(res => setRestaurants(res.data.restaurants || []))
      .catch(err => console.log("Error fetching merged JSON:", err));
  }, []);

  useEffect(() => {
    if (restaurants.length === 0) return;

    const { restaurantId, startDate, endDate } = filters;

    const filteredRestaurants = restaurantId
      ? restaurants.filter(r => r.id === restaurantId)
      : restaurants;

    let allOrders: Order[] = filteredRestaurants.flatMap(r => r.orders || []);

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      allOrders = allOrders.filter(o => {
        const date = new Date(o.order_time);
        return date >= start && date <= end;
      });
    }

    const analyticsMap: { [date: string]: DailyAnalytics } = {};

    allOrders.forEach(o => {
      const date = o.order_time.split("T")[0];
      const hour = new Date(o.order_time).getHours();
      const amount = o.order_amount || 0;

      if (!analyticsMap[date]) {
        analyticsMap[date] = { orders: 0, revenue: 0, avgOrderValue: 0, peakHour: null };
      }

      analyticsMap[date].orders += 1;
      analyticsMap[date].revenue += amount;
      analyticsMap[date].avgOrderValue = analyticsMap[date].revenue / analyticsMap[date].orders;

    
      analyticsMap[date].peakHour = hour;
    });

    const top = restaurants
      .map(r => ({
        restaurant_id: r.id,
        name: r.name,
        revenue: (r.orders || []).reduce((sum, o) => sum + (o.order_amount || 0), 0)
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    setAnalytics(analyticsMap);
    setTopRestaurants(top);
  }, [filters, restaurants]);

  return (
    <div className={styles.dashboard}>
      <FilterBar restaurants={restaurants} onApply={setFilters} />

      {Object.keys(analytics).length > 0 && (
        <div className={styles.charts}>
          <h2>Daily Analytics</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Revenue (₹)</th>
                <th>Avg Order Value (₹)</th>
                <th>Peak Hour</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics).map(([date, data]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{data.orders || 0}</td>
                  <td>₹{(data.revenue || 0).toLocaleString()}</td>
                  <td>₹{isNaN(data.avgOrderValue) ? 0 : data.avgOrderValue.toFixed(2)}</td>
                  <td>{data.peakHour !== null ? data.peakHour : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {topRestaurants.length > 0 && (
        <div className={styles.topRestaurants}>
          <h2>Top 3 Restaurants</h2>
          <ul>
            {topRestaurants.map(r => (
              <li key={r.restaurant_id}>
                {r.name} - ₹{(r.revenue || 0).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
