<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function authenticated_user_can_list_posts()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        Post::factory()->count(3)->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson('/api/posts');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function authenticated_user_can_create_post()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $payload = [
            'title' => 'Test Post',
            'content' => 'This is the post content.'
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/posts', $payload);

        $response->assertStatus(201)
                 ->assertJsonFragment($payload);

        $this->assertDatabaseHas('posts', array_merge($payload, ['user_id' => $user->id]));
    }

    /** @test */
    public function post_creation_requires_validation()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/posts', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'content']);
    }

    /** @test */
    public function authenticated_user_can_view_single_post()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $post = Post::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson("/api/posts/{$post->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'id' => $post->id,
                     'title' => $post->title,
                     'content' => $post->content
                 ]);
    }

    /** @test */
    public function user_can_update_own_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $updatedData = [
            'title' => 'Updated title',
            'content' => 'Updated content'
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/posts/{$post->id}", $updatedData);

        $response->assertStatus(200)
                 ->assertJsonFragment($updatedData);
    }

    /** @test */
    public function user_cannot_update_others_post()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $other->id]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/posts/{$post->id}", [
                             'title' => 'New Title',
                             'content' => 'New content'
                         ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_delete_own_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Post deleted']);

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    /** @test */
    public function user_cannot_delete_others_post()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $other->id]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(403);
    }
}
