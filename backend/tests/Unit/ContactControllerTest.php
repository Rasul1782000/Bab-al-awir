<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Api\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ContactControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Session::flush();
    }

    public function test_store_creates_contact(): void
    {
        $controller = new ContactController();
        $contactData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+971 50 123 4567',
            'subject' => 'General Inquiry',
            'message' => 'Hello, I have a question about your products.',
        ];

        $request = Request::create('/api/contact', 'POST', $contactData);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->store($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals('John Doe', $data['data']['name']);
        $this->assertEquals('john@example.com', $data['data']['email']);
        $this->assertEquals('new', $data['data']['status']);
    }

    public function test_index_returns_contacts(): void
    {
        $controller = new ContactController();
        $contacts = [
            [
                'id' => 'CNT-TEST1',
                'name' => 'Test User',
                'email' => 'test@example.com',
                'subject' => 'Inquiry',
                'message' => 'Hello',
                'status' => 'new',
            ],
        ];
        Session::put('contacts', $contacts);

        $request = Request::create('/api/contact', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->index();
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertCount(1, $data['data']['data']);
    }

    public function test_show_returns_contact(): void
    {
        $controller = new ContactController();
        $contact = [
            'id' => 'CNT-TEST1',
            'name' => 'Test User',
            'email' => 'test@example.com',
            'subject' => 'Inquiry',
            'message' => 'Hello',
            'status' => 'new',
        ];
        Session::put('contacts', [$contact]);

        $request = Request::create('/api/contact/CNT-TEST1', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->show('CNT-TEST1');
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals('CNT-TEST1', $data['data']['id']);
    }

    public function test_show_returns_404_for_missing_contact(): void
    {
        $controller = new ContactController();
        $request = Request::create('/api/contact/NONEXISTENT', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->show('NONEXISTENT');
        $this->assertEquals(404, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertEquals('Contact not found', $data['message']);
    }

    public function test_update_changes_status(): void
    {
        $controller = new ContactController();
        $contact = [
            'id' => 'CNT-TEST1',
            'name' => 'Test User',
            'email' => 'test@example.com',
            'subject' => 'Inquiry',
            'message' => 'Hello',
            'status' => 'new',
            'status_label' => 'New',
        ];
        Session::put('contacts', [$contact]);

        $request = Request::create('/api/contact/CNT-TEST1', 'PUT', ['status' => 'resolved']);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->update($request, 'CNT-TEST1');
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals('resolved', $data['data']['status']);
        $this->assertEquals('Resolved', $data['data']['status_label']);
    }
}