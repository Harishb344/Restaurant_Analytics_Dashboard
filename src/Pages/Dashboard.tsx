import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterBar from "../Components/FilterBar";
import styles from "./dashboard.module.css";

interface Restaurant {
  id: number;
  name: string;
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

interface AnalyticsResponse {
  analytics?: { [date: string]: DailyAnalytics };
  topRestaurants?: TopRestaurant[];
}

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [analytics, setAnalytics] = useState<{ [date: string]: DailyAnalytics }>({});
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(err => console.log("Error fetching restaurants:", err));
  }, []);

  useEffect(() => {
    axios
      .get<AnalyticsResponse>("http://127.0.0.1:8000/api/analytics", { params: filters })
      .then(res => {
        setAnalytics(res.data.analytics || {});
        setTopRestaurants(res.data.topRestaurants || []);
      })
      .catch(err => console.log("Error fetching analytics:", err));
  }, [filters]);

  return (
    <div className={styles.dashboard}>
      <FilterBar
        restaurants={restaurants}
        onApply={appliedFilters => setFilters(appliedFilters)}
      />

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
                  <td>{data.orders}</td>
                  <td>₹{data.revenue.toLocaleString()}</td>
                  <td>₹{data.avgOrderValue.toFixed(2)}</td>
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
                {r.name} - ₹{r.revenue.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
