<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ContactController extends Controller
{
    use RespondsWithJson;

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:5000',
        ]);

        $contact = [
            'id' => 'CNT-' . Str::upper(Str::random(8)),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
            'status_label' => 'New',
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString(),
        ];

        $contacts = session()->get('contacts', []);
        array_unshift($contacts, $contact);
        session()->put('contacts', $contacts);

        return $this->ok($contact, 'Message sent successfully. We will get back to you soon.');
    }

    public function index(): JsonResponse
    {
        $contacts = session()->get('contacts', []);
        $page = request()->get('page', 1);
        $perPage = min(request()->get('per_page', 20), 100);

        $offset = ($page - 1) * $perPage;
        $paginatedContacts = array_slice($contacts, $offset, $perPage);

        return $this->ok([
            'data' => $paginatedContacts,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => count($contacts),
                'last_page' => ceil(count($contacts) / $perPage),
            ],
        ], 'Contacts retrieved');
    }

    public function show(string $id): JsonResponse
    {
        $contacts = session()->get('contacts', []);
        $contact = collect($contacts)->firstWhere('id', $id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact not found',
                'data' => null,
            ], 404);
        }

        return $this->ok($contact, 'Contact retrieved');
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,in_progress,resolved,closed',
        ]);

        $contacts = session()->get('contacts', []);
        $contactIndex = collect($contacts)->search(fn($c) => $c['id'] === $id);

        if ($contactIndex === false) {
            return response()->json([
                'success' => false,
                'message' => 'Contact not found',
                'data' => null,
            ], 404);
        }

        $statusLabels = [
            'new' => 'New',
            'in_progress' => 'In Progress',
            'resolved' => 'Resolved',
            'closed' => 'Closed',
        ];

        $contacts[$contactIndex]['status'] = $validated['status'];
        $contacts[$contactIndex]['status_label'] = $statusLabels[$validated['status']];
        $contacts[$contactIndex]['updated_at'] = now()->toISOString();

        session()->put('contacts', $contacts);

        return $this->ok($contacts[$contactIndex], 'Contact updated');
    }
}