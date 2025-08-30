import React, { useState } from "react";
import styles from "./Filters.module.css";

interface FilterProps {
  restaurants: { id: number; name: string }[];
  onApply: (filters: {
    restaurant_id?: number;
    start_date?: string;
    end_date?: string;
    min_amount?: number;
    max_amount?: number;
    start_hour?: number;
    end_hour?: number;
  }) => void;
}

export default function FilterBar({ restaurants, onApply }: FilterProps) {
  const [restaurantId, setRestaurantId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(10000);
  const [startHour, setStartHour] = useState<number>(0);
  const [endHour, setEndHour] = useState<number>(23);

  const handleApply = () => {
    onApply({
      restaurant_id: restaurantId,
      start_date: startDate,
      end_date: endDate,
      min_amount: minAmount,
      max_amount: maxAmount,
      start_hour: startHour,
      end_hour: endHour
    });
  };

  const handleReset = () => {
    setRestaurantId(undefined);
    setStartDate("");
    setEndDate("");
    setMinAmount(0);
    setMaxAmount(10000);
    setStartHour(0);
    setEndHour(23);
    onApply({});
  };

  return (
    <div className={styles.filters}>
      {/* Restaurant Dropdown */}
      <label htmlFor="restaurant">Restaurant:</label>
      <select
        id="restaurant"
        value={restaurantId ?? ""}
        onChange={(e) => setRestaurantId(e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">All Restaurants</option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      {/* Date Range */}
      <label htmlFor="startDate">Start Date:</label>
      <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

      <label htmlFor="endDate">End Date:</label>
      <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      {/* Amount Range */}
      <label htmlFor="minAmount">Min Amount:</label>
      <input
        id="minAmount"
        type="number"
        value={minAmount}
        onChange={(e) => setMinAmount(Number(e.target.value))}
      />

      <label htmlFor="maxAmount">Max Amount:</label>
      <input
        id="maxAmount"
        type="number"
        value={maxAmount}
        onChange={(e) => setMaxAmount(Number(e.target.value))}
      />

      {/* Hour Range */}
      <label htmlFor="startHour">Start Hour:</label>
      <input
        id="startHour"
        type="number"
        min={0}
        max={23}
        value={startHour}
        onChange={(e) => setStartHour(Number(e.target.value))}
      />

      <label htmlFor="endHour">End Hour:</label>
      <input
        id="endHour"
        type="number"
        min={0}
        max={23}
        value={endHour}
        onChange={(e) => setEndHour(Number(e.target.value))}
      />

      {/* Apply / Reset Buttons */}
      <button onClick={handleApply}>Apply Filters</button>
      <button onClick={handleReset}>Remove Filters</button>
    </div>
  );
}
