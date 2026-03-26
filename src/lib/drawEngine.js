/**
 * drawEngine.js
 * Optimized for Supabase Schema: draws (id, winning_numbers, status, jackpot_rolled)
 * winners (id, user_id, draw_id, match_type, verification_status, payment_status, prize)
 */

// 🟢 1. RANDOM NUMBER GENERATOR
export function generateRandomNumbers() {
    const set = new Set();
    while (set.size < 5) {
        set.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(set).sort((a, b) => a - b);
}

// 🟢 2. ALGORITHMIC DRAW (Weighted by Frequency)
export async function generateAlgorithmicNumbers(supabase) {
    const { data: scores } = await supabase.from("scores").select("score");
    if (!scores || scores.length < 10) return generateRandomNumbers();

    const freq = {};
    scores.forEach(s => freq[s.score] = (freq[s.score] || 0) + 1);
    
    const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
    const result = new Set([
        parseInt(sorted[0]), // Most common
        parseInt(sorted[sorted.length - 1]), // Rarest
        ...generateRandomNumbers().slice(0, 3) 
    ]);
    
    return Array.from(result).slice(0, 5).sort((a, b) => a - b);
}

// 🟢 3. MATCH LOGIC
export function getMatchType(userScores, winningNumbers) {
    const matches = userScores.filter(s => winningNumbers.includes(s)).length;
    if (matches === 5) return "5-match";
    if (matches === 4) return "4-match";
    if (matches === 3) return "3-match";
    return null;
}

// 🟢 4. SIMULATE DRAW (Preview Mode)
export async function simulateDraw(supabase, strategy = 'random', manualNumbers = null) {
    try {
        const numbers = manualNumbers || (strategy === 'algorithmic' 
            ? await generateAlgorithmicNumbers(supabase) 
            : generateRandomNumbers());

        const { count: activeUsers } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("subscription_status", "active");

        const totalPool = (activeUsers || 0) * 100;

        const { data: allScores } = await supabase.from("scores").select("user_id, score, date");
        const userMap = groupLatestScores(allScores);
        const previewWinners = [];

        const distribution = { "5-match": 0.40, "4-match": 0.35, "3-match": 0.25 };
        const tierBuckets = { "5-match": [], "4-match": [], "3-match": [] };

        for (const userId in userMap) {
            if (userMap[userId].length < 3) continue;
            const match = getMatchType(userMap[userId], numbers);
            if (match) tierBuckets[match].push(userId);
        }

        let potentialRollover = 0;
        for (const tier in tierBuckets) {
            const users = tierBuckets[tier];
            const tierShare = totalPool * distribution[tier];
            if (users.length === 0) {
                if (tier === "5-match") potentialRollover = tierShare;
                continue;
            }
            const prize = Math.floor(tierShare / users.length);
            users.forEach(uid => previewWinners.push({ user_id: uid, match_type: tier, prize }));
        }

        return { numbers, preview: previewWinners, totalPool, potentialRollover, activeUsers };
    } catch (err) {
        console.error("Simulation Error:", err);
        return { numbers: [], preview: [], totalPool: 0, potentialRollover: 0 };
    }
}

// 🟢 5. FINAL DRAW EXECUTION
export async function runFinalDraw(supabase, strategy = 'random', manualNumbers = null) {
    try {
        const numbers = manualNumbers || (strategy === 'algorithmic' 
            ? await generateAlgorithmicNumbers(supabase) 
            : generateRandomNumbers());

        const { count: activeUsers } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("subscription_status", "active");

        const totalPool = (activeUsers || 0) * 100;

        // Create Draw Record (Using columns found in your schema)
        const { data: draw, error: drawError } = await supabase
            .from("draws")
            .insert({
                winning_numbers: numbers,
                status: "published",
                jackpot_rolled: false 
            })
            .select().single();

        if (drawError) throw drawError;

        // RESET WINNERS: Clear old records to prevent dashboard confusion
        await supabase.from("winners").delete().neq("id", "00000000-0000-0000-0000-000000000000");

        const { data: allScores } = await supabase.from("scores").select("user_id, score, date");
        const userMap = groupLatestScores(allScores);
        
        let finalWinnersToInsert = [];
        const distribution = { "5-match": 0.40, "4-match": 0.35, "3-match": 0.25 };
        const tierBuckets = { "5-match": [], "4-match": [], "3-match": [] };

        for (const userId in userMap) {
            if (userMap[userId].length < 3) continue;
            const match = getMatchType(userMap[userId], numbers);
            if (match) tierBuckets[match].push(userId);
        }

        // Calculate Prizes & Build Insert Array
        for (const tier in tierBuckets) {
            const users = tierBuckets[tier];
            if (users.length === 0) continue;

            const tierShare = totalPool * distribution[tier];
            const prizePerUser = Math.floor(tierShare / users.length);
            
            users.forEach(userId => {
                finalWinnersToInsert.push({
                    user_id: userId,
                    draw_id: draw.id,
                    match_type: tier,
                    verification_status: "pending",
                    payment_status: "pending",
                    prize: prizePerUser
                });
            });
        }

        if (finalWinnersToInsert.length > 0) {
            const { error: insertError } = await supabase.from("winners").insert(finalWinnersToInsert);
            if (insertError) throw insertError;
        }

        // Update Jackpot Status: true if no one hit 5-match
        await supabase
            .from("draws")
            .update({ jackpot_rolled: tierBuckets["5-match"].length === 0 })
            .eq("id", draw.id);

        return { numbers, winnerCount: finalWinnersToInsert.length, totalPool };

    } catch (err) {
        console.error("Draw Execution Error:", err);
        throw err;
    }
}

// 🟢 HELPER: Group Latest 5 Scores per User
function groupLatestScores(scores) {
    const map = {};
    scores.forEach(s => {
        if (!map[s.user_id]) map[s.user_id] = [];
        map[s.user_id].push(s);
    });
    for (const id in map) {
        map[id] = map[id]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(s => s.score);
    }
    return map;
}