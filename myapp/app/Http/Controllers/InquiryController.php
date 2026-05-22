<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->inquiries()->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_type' => 'required|string|max:255',
            'brand_name' => 'nullable|string|max:255',
            'design_details' => 'nullable|string',
            'quantity' => 'required|integer|min:100',
        ]);

        $inquiry = $request->user()->inquiries()->create($request->all());

        return response()->json($inquiry, 201);
    }

    public function update(Request $request, Inquiry $inquiry)
    {
        if ($request->user()->id !== $inquiry->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'product_type' => 'required|string|max:255',
            'brand_name' => 'nullable|string|max:255',
            'design_details' => 'nullable|string',
            'quantity' => 'required|integer|min:100',
        ]);

        $inquiry->update($request->all());

        return response()->json($inquiry);
    }

    public function destroy(Request $request, Inquiry $inquiry)
    {
        if ($request->user()->id !== $inquiry->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $inquiry->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
