<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_create_comment_for_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/posts/{$post->id}/comments", [
                             'comment' => 'This is a test comment.'
                         ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Comment created successfully'
                 ]);

        $this->assertDatabaseHas('comments', [
            'comment' => 'This is a test comment.',
            'post_id' => $post->id,
            'user_id' => $user->id
        ]);
    }

    /** @test */
    public function creating_comment_requires_comment_text()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/posts/{$post->id}/comments", []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['comment']);
    }

    /** @test */
    public function creating_comment_fails_for_nonexistent_post()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $invalidPostId = 9999;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/posts/{$invalidPostId}/comments", [
                             'comment' => 'Test comment'
                         ]);

        $response->assertStatus(404);
    }

    /** @test */
    public function user_can_delete_own_comment()
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        $comment = Comment::factory()->create([
            'post_id' => $post->id,
            'user_id' => $user->id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/comments/{$comment->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Comment deleted successfully']);

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    /** @test */
    public function user_cannot_delete_others_comment()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $post = Post::factory()->create();
        $comment = Comment::factory()->create([
            'post_id' => $post->id,
            'user_id' => $otherUser->id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/comments/{$comment->id}");

        $response->assertStatus(403); // unauthorized
    }
}
