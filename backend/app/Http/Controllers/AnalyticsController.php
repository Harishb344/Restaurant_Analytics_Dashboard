<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AnalyticsController extends Controller
{
    private $RestaurantsUrl = 'https://drive.google.com/uc?export=download&id=1luoLVYPwtoZT11KXphdqwogROs7Fk10N';
    private $OrdersUrl = 'https://drive.google.com/uc?export=download&id=1dWupxuuqRktDLhbWkjDxasxtElYvDYYo';

    private function getCachedData($url, $cacheKey, $ttl = 3600)
    {
        return Cache::remember($cacheKey, $ttl, function () use ($url) {
            return json_decode(file_get_contents($url), true);
        });
    }

    private function filterOrders($orders, $request)
    {
        if ($request->has('restaurant_id')) {
            $orders = array_filter($orders, fn($o) => $o['restaurant_id'] == $request->restaurant_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $start = strtotime($request->start_date);
            $end = strtotime($request->end_date);
            $orders = array_filter($orders, fn($o) => $start <= strtotime($o['order_time']) && strtotime($o['order_time']) <= $end);
        }

        return $orders;
    }
    public function analytics(Request $request)
    {
        $orders = json_decode(file_get_contents($this->OrdersUrl), true);
        $restaurants = json_decode(file_get_contents($this->RestaurantsUrl), true);
    
        $analyticsData = [];
        if ($request->has('restaurant_id')) {
            $restaurantOrders = array_filter($orders, fn($o) => $o['restaurant_id'] == $request->restaurant_id);
    
            $daily = [];
            foreach ($restaurantOrders as $order) {
                $day = date('Y-m-d', strtotime($order['order_time']));
                $hour = date('H', strtotime($order['order_time']));
    
                if (!isset($daily[$day])) {
                    $daily[$day] = ['orders' => 0, 'revenue' => 0, 'hourly' => []];
                }
    
                $daily[$day]['orders'] += 1;
                $daily[$day]['revenue'] += $order['order_amount'];
                $daily[$day]['hourly'][$hour] = ($daily[$day]['hourly'][$hour] ?? 0) + 1;
            }
    
            foreach ($daily as $day => $data) {
                $analyticsData[$day] = [
                    'orders' => $data['orders'],
                    'revenue' => $data['revenue'],
                    'avgOrderValue' => $data['orders'] > 0 ? round($data['revenue'] / $data['orders'], 2) : 0,
                    'peakHour' => !empty($data['hourly']) ? array_keys($data['hourly'], max($data['hourly']))[0] : null
                ];
            }
        }
    
        $totals = [];
        foreach ($orders as $order) {
            $rid = $order['restaurant_id'];
            if (!isset($totals[$rid])) {
                $totals[$rid] = ['orders' => 0, 'revenue' => 0];
            }
            $totals[$rid]['orders'] += 1;
            $totals[$rid]['revenue'] += $order['order_amount'];
        }
    
        uasort($totals, fn($a, $b) => $b['revenue'] <=> $a['revenue']);
        $top3 = array_slice($totals, 0, 3, true);
    
        $topRestaurants = [];
        foreach ($top3 as $rid => $stats) {
            $name = collect($restaurants)->firstWhere('id', $rid)['name'] ?? "Restaurant $rid";
            $topRestaurants[] = [
                'restaurant_id' => $rid,
                'name' => $name,
                'revenue' => $stats['revenue']
            ];
        }
    
        return response()->json([
            'type' => $request->has('restaurant_id') ? 'restaurant_analytics' : 'top_restaurants',
            'analytics' => $analyticsData,
            'topRestaurants' => $topRestaurants
        ]);
    }
    
}
