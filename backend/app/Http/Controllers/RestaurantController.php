<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    //
    private $fileUrl='https://drive.google.com/uc?export=download&id=1luoLVYPwtoZT11KXphdqwogROs7Fk10N';

    public function index(Request $request)
    {
        $json = file_get_contents($this->fileUrl);
        $restaurants = json_decode($json, true);


        if ($request->has('search')) {
            $search = strtolower($request->search);
            $restaurants = array_filter($restaurants, fn($r) => strpos(strtolower($r['name']), $search) !== false);
        }

   
        if ($request->sort == 'name') {
            usort($restaurants, fn($a,$b) => strcmp($a['name'], $b['name']));
        }

        // Pagination
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 10);
        $restaurants = array_slice($restaurants, ($page-1)*$perPage, $perPage);

        return response()->json($restaurants);
    }

    public function show($id)
    {
        $json = file_get_contents($this->fileUrl);
        $restaurants = json_decode($json, true);

        $restaurant = array_filter($restaurants, fn($r) => $r['id'] == $id);
        return response()->json(array_values($restaurant));
    }
}
