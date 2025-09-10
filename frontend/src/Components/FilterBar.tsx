import React, { useState } from "react";
import styles from "./Filters.module.css";

interface Restaurant {
  id: number;
  name: string;
}

interface FilterProps {
  restaurants: Restaurant[];
  onApply: (filters: {
    restaurantId?: number;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    startHour?: number;
    endHour?: number;
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
      restaurantId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      startHour,
      endHour
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

  const canApply = !startDate || !endDate;

  return (
    <div className={styles.filters}>
      <label htmlFor="restaurant">Restaurant:</label>
      <select
        id="restaurant"
        value={restaurantId ?? ""}
        onChange={e => setRestaurantId(e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">All Restaurants</option>
        {restaurants.map(r => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <label htmlFor="startDate">Start Date:</label>
      <input
        id="startDate"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />

      <label htmlFor="endDate">End Date:</label>
      <input
        id="endDate"
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />

      <label htmlFor="minAmount">Min Amount:</label>
      <input
        id="minAmount"
        type="number"
        value={minAmount}
        onChange={e => setMinAmount(Number(e.target.value))}
      />

      <label htmlFor="maxAmount">Max Amount:</label>
      <input
        id="maxAmount"
        type="number"
        value={maxAmount}
        onChange={e => setMaxAmount(Number(e.target.value))}
      />

      <label htmlFor="startHour">Start Hour:</label>
      <input
        id="startHour"
        type="number"
        min={0}
        max={23}
        value={startHour}
        onChange={e => setStartHour(Number(e.target.value))}
      />

      <label htmlFor="endHour">End Hour:</label>
      <input
        id="endHour"
        type="number"
        min={0}
        max={23}
        value={endHour}
        onChange={e => setEndHour(Number(e.target.value))}
      />

      <button onClick={handleApply} disabled={canApply}>
        Apply Filters
      </button>
      <button onClick={handleReset}>Remove Filters</button>

      <div className={styles.helperText}>
        {!restaurantId && "Select a restaurant to get started."}
        {restaurantId && (!startDate || !endDate) &&
          "Please select a date range to view analytics."}
      </div>
    </div>
  );
}
