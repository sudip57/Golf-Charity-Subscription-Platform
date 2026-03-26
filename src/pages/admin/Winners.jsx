import React, { useState, useEffect } from 'react';
import { CheckCircle, Search, DollarSign, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWinners();
  }, []);

  // 🟢 FETCH WINNERS
  const fetchWinners = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("winners")
      .select(`
        id,
        match_type,
        prize,
        verification_status,
        payment_status,
        proof_url,
        users (
          email
        ),
        draws (
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) setWinners(data || []);

    setLoading(false);
  };

  // 🟢 VERIFY
  const handleVerify = async (winnerId) => {
    const { error } = await supabase
      .from("winners")
      .update({ verification_status: "approved" })
      .eq("id", winnerId);

    if (!error) fetchWinners();
  };

  // 🟢 MARK PAID
  const handlePayout = async (winnerId) => {
    const { error } = await supabase
      .from("winners")
      .update({ payment_status: "paid" })
      .eq("id", winnerId);

    if (!error) fetchWinners();
  };

  // 🟢 SEARCH
  const filteredWinners = winners.filter(w =>
    w.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.match_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Winners Management</h1>
          <p className="text-sm text-gray-500">Verify and manage payouts</p>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Draw Date</th>
              <th className="p-4 text-left">Match / Prize</th>
              <th className="p-4 text-left">Proof</th>
              <th className="p-4 text-left">Verification</th>
              <th className="p-4 text-right">Payout</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">Loading...</td>
              </tr>
            ) : filteredWinners.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">No winners</td>
              </tr>
            ) : (
              filteredWinners.map(w => (
                <tr key={w.id} className="border-t">

                  {/* USER */}
                  <td className="p-4 font-medium">
                    {w.users?.email || "N/A"}
                  </td>

                  {/* DATE */}
                  <td className="p-4">
                    {w.draws?.created_at
                      ? new Date(w.draws.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* MATCH + PRIZE */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold">{w.match_type}</span>
                      <span className="text-green-600">₹{w.prize || 0}</span>
                    </div>
                  </td>

                  {/* PROOF */}
                  <td className="p-4">
                    {w.proof_url ? (
                      <a
                        href={w.proof_url}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">No Proof</span>
                    )}
                  </td>

                  {/* VERIFICATION */}
                  <td className="p-4">
                    {w.verification_status === "approved" ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Verified
                      </span>
                    ) : (
                      <Button onClick={() => handleVerify(w.id)}>
                        <Clock className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                    )}
                  </td>

                  {/* PAYOUT */}
                  <td className="p-4 text-right">
                    {w.payment_status === "paid" ? (
                      <span className="text-green-600 font-semibold">
                        Paid ✅
                      </span>
                    ) : (
                      <Button
                        onClick={() => handlePayout(w.id)}
                        disabled={w.verification_status !== "approved"}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Pay
                      </Button>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Winners;