<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_register_successfully()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['id', 'name', 'email', 'created_at', 'updated_at']);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    /**
     * @test
     * @dataProvider invalidRegistrationDataProvider
     */
    public function registration_fails_with_invalid_data($payload, $expectedErrors)
    {
        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors($expectedErrors);
    }

    public static function invalidRegistrationDataProvider(): array
    {
        return [
            'missing all fields' => [
                [],
                ['name', 'email', 'password']
            ],
            'missing email' => [
                ['name' => 'Test', 'password' => 'password123'],
                ['email']
            ],
            'short password' => [
                ['name' => 'Test', 'email' => 'test@example.com', 'password' => '123'],
                ['password']
            ],
            'invalid email format' => [
                ['name' => 'Test', 'email' => 'not-an-email', 'password' => 'password123'],
                ['email']
            ],
        ];
    }

    /** @test */
    public function registration_fails_with_duplicate_email()
    {
        User::factory()->create(['email' => 'duplicate@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'duplicate@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function user_can_login_with_correct_credentials()
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token']);
    }

    /** @test */
    public function login_fails_with_wrong_credentials()
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('correct-password')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password'
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Invalid credentials']);
    }

    /** @test */
    public function user_can_logout_successfully()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Logged out']);
    }

    /** @test */
    public function logout_fails_without_token()
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }
}
