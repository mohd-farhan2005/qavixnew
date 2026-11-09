import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fetchTeamMembers, API_BASE_URL } from '@/lib/blog-api';

describe('Team API integration', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('fetches team members from /api/team with Accept header', async () => {
    const mockApiResponse = {
      success: true,
      count: 2,
      data: [
        {
          id: 1,
          name: 'Zack Hill',
          position: 'Founder & CEO',
          email: 'zack@qavyx.com',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          order: 1,
          is_active: true,
        },
        {
          id: 2,
          name: 'Arlton Lowry',
          position: 'Partner & CCO',
          email: 'arlton@qavyx.com',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
          photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
          order: 2,
          is_active: true,
        },
      ],
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockApiResponse,
    });
    globalThis.fetch = fetchMock;

    const data = await fetchTeamMembers();

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/team`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
        }),
      })
    );

    expect(data).toHaveLength(2);
    expect(data[0]?.name).toBe('Zack Hill');
    expect(data[0]?.position).toBe('Founder & CEO');
  });

  it('falls back to /api/team-members if /api/team is empty or fails', async () => {
    const mockAliasResponse = {
      success: true,
      data: [
        {
          id: 3,
          name: 'Sarah Devine',
          position: 'Director of Projects',
          email: 'sarah@qavyx.com',
          photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
          order: 3,
          is_active: true,
        },
      ],
    };

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/team')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ success: false }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockAliasResponse,
      });
    });
    globalThis.fetch = fetchMock;

    const data = await fetchTeamMembers();
    expect(data).toHaveLength(1);
    expect(data[0]?.name).toBe('Sarah Devine');
  });
});

