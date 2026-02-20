import { Router, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';

const router = Router();

// Redirect to GitHub for login
router.get('/login', (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = 'http://localhost:3001/api/auth/github/callback';

  // GitHub Apps do NOT use 'scope'. Their permissions are fixed.
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  res.redirect(githubUrl);
});

// Callback to exchange code for token and authenticate
router.get('/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Code not found' });
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      throw new Error('No access token returned from GitHub');
    }

    // 2. Fetch User Profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;

    // 3. Upsert user in Supabase
    // Note: The users table must exist with these fields
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .upsert(
        {
          github_id: String(userData.id),
          username: userData.login,
          avatar_url: userData.avatar_url,
          access_token: accessToken, // Might be needed for some API calls, but App Tokens are better for repos
        },
        { onConflict: 'github_id' }
      )
      .select()
      .single();

    if (dbError) {
      console.error('Database Error:', dbError);
      throw dbError;
    }

    // 4. Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
    const token = jwt.sign(
      { userId: dbUser.id, githubId: dbUser.github_id, username: dbUser.username },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // 5. Redirect back to frontend
    res.redirect(`http://localhost:5173/?token=${token}`);
  } catch (error: any) {
    console.error('OAuth Callback Error:', error?.response?.data || error.message);
    res.redirect('http://localhost:5173/login?error=oauth_failed');
  }
});

export default router;
