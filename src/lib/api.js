import { supabase } from './supabase';

const isMock = !import.meta.env.VITE_SUPABASE_URL;

// In-memory mock states
let mockScores = [];
// Generate some realistic mock charities
let mockCharities = [
  { id: '1', name: 'Youth Golf Foundation', description: 'Empowering underprivileged youth through golf.' },
  { id: '2', name: 'Clean Oceans Initiative', description: 'Working to clear plastic from our coastlines.' },
  { id: '3', name: 'Global Education Fund', description: 'Providing school supplies and tech to developing nations.' }
];
// Mock Users for Admin functionality
let mockUsers = [
  { id: '1', email: 'john@example.com', first_name: 'John', last_name: 'Doe', charity_id: '1', subscriptionStatus: 'active', joinedAt: '2025-01-15' },
  { id: '2', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', charity_id: '2', subscriptionStatus: 'inactive', joinedAt: '2025-02-10' },
  { id: '3', email: 'mike@example.com', first_name: 'Mike', last_name: 'Johnson', charity_id: null, subscriptionStatus: 'active', joinedAt: '2025-03-01' },
  { id: 'mock-user-id', email: 'user@impactlinks.com', first_name: 'Demo', last_name: 'User', charity_id: '1', subscriptionStatus: 'active', joinedAt: '2025-03-20' },
];

export const getScores = async (userId) => {
  if (isMock) {
    return { data: [...mockScores], error: null };
  }
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return { data, error };
};

export const addScore = async (userId, score, date) => {
  const parsedScore = parseInt(score);
  
  if (isMock) {
    const newScore = { 
      id: crypto.randomUUID(), 
      user_id: userId, 
      score: parsedScore, 
      date, 
      created_at: new Date().toISOString() 
    };
    mockScores.push(newScore);
    // Sort reverse chronologically
    mockScores.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Enforce max 5 rule
    if (mockScores.length > 5) {
      mockScores = mockScores.slice(0, 5);
    }
    return { data: newScore, error: null };
  }

  // Real Supabase Flow:
  const { error: insertError } = await supabase
    .from('scores')
    .insert([{ user_id: userId, score: parsedScore, date }]);
    
  if (insertError) return { error: insertError };

  // Fetch all scores for the user to enforce limit
  const { data: allScores, error: fetchError } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', userId)
    .order('date', { ascending: false });
    
  if (fetchError) return { error: fetchError };

  // If more than 5, delete the oldest
  if (allScores.length > 5) {
    const idsToDelete = allScores.slice(5).map(s => s.id);
    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .in('id', idsToDelete);
    if (deleteError) return { error: deleteError };
  }
  
  return { data: null, error: null };
};

export const getCharities = async () => {
  if (isMock) {
    return { data: [...mockCharities], error: null };
  }
  return supabase.from('charities').select('*').order('name');
};

export const addCharity = async (charityData) => {
  if (isMock) {
    const newCharity = { id: crypto.randomUUID(), ...charityData };
    mockCharities.push(newCharity);
    return { data: newCharity, error: null };
  }
  const { data, error } = await supabase.from('charities').insert([charityData]).select().single();
  return { data, error };
};

export const updateCharity = async (charityId, updates) => {
  if (isMock) {
    const idx = mockCharities.findIndex(c => c.id === charityId);
    if (idx !== -1) {
      mockCharities[idx] = { ...mockCharities[idx], ...updates };
      return { data: mockCharities[idx], error: null };
    }
    return { error: new Error('Charity not found') };
  }
  const { data, error } = await supabase.from('charities').update(updates).eq('id', charityId).select().single();
  return { data, error };
};

export const deleteCharity = async (charityId) => {
  if (isMock) {
    mockCharities = mockCharities.filter(c => c.id !== charityId);
    return { data: null, error: null };
  }
  const { error } = await supabase.from('charities').delete().eq('id', charityId);
  return { error };
};


export const updateUserCharity = async (userId, charityId) => {
  if (isMock) {
    return { data: null, error: null }; // Mock user object isn't fully preserved in memory across reload, but functional enough for UI state
  }
  return supabase
    .from('users')
    .update({ charity_id: charityId })
    .eq('id', userId);
};

// --- ADMIN SPECIFIC MOCK FUNCTIONS ---

export const getAllUsers = async () => {
  if (isMock) return { data: [...mockUsers], error: null };
  const { data, error } = await supabase.from('users').select('*');
  return { data, error };
};

export const updateAdminUser = async (userId, updates) => {
  if (isMock) {
    const idx = mockUsers.findIndex(u => u.id === userId);
    if (idx !== -1) {
      mockUsers[idx] = { ...mockUsers[idx], ...updates };
      return { data: mockUsers[idx], error: null };
    }
    return { error: new Error('User not found') };
  }
  const { data, error } = await supabase.from('users').update(updates).eq('id', userId);
  return { data, error };
};

export const updateScore = async (scoreId, updates) => {
  if (isMock) {
    const idx = mockScores.findIndex(s => s.id === scoreId);
    if (idx !== -1) {
      mockScores[idx] = { ...mockScores[idx], ...updates };
      return { data: mockScores[idx], error: null };
    }
    return { error: new Error('Score not found') };
  }
  const { data, error } = await supabase.from('scores').update({ score: parseInt(updates.score) }).eq('id', scoreId);
  return { data, error };
};

export const deleteScore = async (scoreId) => {
  if (isMock) {
    mockScores = mockScores.filter(s => s.id !== scoreId);
    return { data: null, error: null };
  }
  const { error } = await supabase.from('scores').delete().eq('id', scoreId);
  return { error };
};

// Generate mock winners
let mockWinners = [
  { id: '1', user_id: '1', user_email: 'john@example.com', run_date: '2025-03-20', match_type: '4-match', prize: '$500', verification_status: 'pending', payout_status: 'pending' },
  { id: '2', user_id: '2', user_email: 'jane@example.com', run_date: '2025-03-21', match_type: '3-match', prize: '$50', verification_status: 'verified', payout_status: 'pending' },
  { id: '3', user_id: 'mock-user-id', user_email: 'user@impactlinks.com', run_date: '2025-03-24', match_type: '5-match', prize: '$10,000', verification_status: 'verified', payout_status: 'completed' }
];

export const getAllWinners = async () => {
  if (isMock) return { data: [...mockWinners], error: null };
  const { data, error } = await supabase.from('winners').select(`*, users (email, first_name, last_name)`).order('created_at', { ascending: false });
  return { data, error };
};

export const verifyWinner = async (winnerId) => {
  if (isMock) {
    const idx = mockWinners.findIndex(w => w.id === winnerId);
    if (idx !== -1) {
      mockWinners[idx].verification_status = 'verified';
      return { data: mockWinners[idx], error: null };
    }
    return { error: new Error('Winner not found') };
  }
  const { data, error } = await supabase.from('winners').update({ verification_status: 'verified' }).eq('id', winnerId).select().single();
  return { data, error };
};

export const markPayoutComplete = async (winnerId) => {
  if (isMock) {
    const idx = mockWinners.findIndex(w => w.id === winnerId);
    if (idx !== -1) {
      mockWinners[idx].payout_status = 'completed';
      return { data: mockWinners[idx], error: null };
    }
    return { error: new Error('Winner not found') };
  }
  const { data, error } = await supabase.from('winners').update({ payment_status: 'completed' }).eq('id', winnerId).select().single();
  return { data, error };
};

export const getAdminStats = async () => {
  if (isMock) {
    return {
      data: {
        totalUsers: mockUsers.length + 125, // padding the stat for better view
        totalPrizePool: 45000,
        charityContributions: 12500,
        drawsCompleted: mockDrawHistory.length + 24
      },
      error: null
    };
  }
  // Simplified for real DB, normally you'd run aggregations or RPCs
  return { 
    data: { totalUsers: 0, totalPrizePool: 0, charityContributions: 0, drawsCompleted: 0 }, 
    error: null 
  };
};



let mockDrawHistory = [];

export const runDrawSimulation = async (logicType = 'random') => {
  if (isMock) {
    // Generate 5 random numbers 1-45
    const numbers = [];
    while(numbers.length < 5) {
      const r = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(r)) numbers.push(r);
    }
    
    // Simulate matches across mockUsers/mockScores
    // Since mockScores might be empty, let's create a predictable mock preview
    const preview = [
      { id: 'sim-1', match: '3-match', count: 12, prize: '$50' },
      { id: 'sim-2', match: '4-match', count: 3, prize: '$500' }
    ];
    
    // If logicType is algorithm, maybe we force a 5-match or no jackpot
    if (logicType === 'algorithm') {
      preview.push({ id: 'sim-3', match: '5-match', count: 0, prize: '$10,000' });
    } else {
      preview.push({ id: 'sim-3', match: '5-match', count: 1, prize: '$10,000' });
    }

    return { data: { numbers, preview }, error: null };
  }
  
  // Real implementation would call a Supabase Edge Function or drawEngine.js
  return { error: new Error('Simulation not implemented for real DB yet') };
};

export const publishDrawResults = async (numbers) => {
  if (isMock) {
    const newDraw = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      numbers,
      status: 'published'
    };
    mockDrawHistory.unshift(newDraw);
    return { data: newDraw, error: null };
  }
  return { error: new Error('Publish not implemented for real DB yet') };
};

export const getDrawHistory = async () => {
  if (isMock) return { data: mockDrawHistory, error: null };
  const { data, error } = await supabase.from('draws').select('*').order('created_at', { ascending: false });
  return { data, error };
};


