import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Coins, User } from "lucide-react";
import { GREEN, ORANGE, GREY } from "@/app/constants";
import { getUsers } from "@/lib/data";


export default async function LeaderboardPage() {
  // Fetch all users from Supabase
  const users = await getUsers();
  
  // Filter out admin users
  const nonAdminUsers = users.filter(user => !user.isAdmin);
  
  // Sort users by balance and get top 6
  const topUsers = [...nonAdminUsers]
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 6);

  // Sort users by balance in ascending order (lowest first)
  const sortedByBalanceAsc = [...nonAdminUsers].sort((a, b) => a.balance - b.balance);
  
  // Find the minimum balance value
  const minBalance = sortedByBalanceAsc[0]?.balance;
  
  // Get users that don't have the minimum balance (for bottom 6)
  const bottomUsersNonMin = sortedByBalanceAsc
    .filter(u => u.balance !== minBalance)
    .slice(0, 6 - sortedByBalanceAsc.filter(u => u.balance === minBalance).length);
  
  // Get users with the minimum balance
  const bottomUsersMin = sortedByBalanceAsc.filter(u => u.balance === minBalance);
  
  // Combine to get bottom 6 users
  const bottomUsers = [...bottomUsersNonMin, ...bottomUsersMin].slice(0, 6);

  // Get top 3 balance values
  const topBalance = topUsers[0]?.balance;
  const secondTopBalance = topUsers[1]?.balance;
  const thirdTopBalance = topUsers[2]?.balance;

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mx-auto">
        <h1 className="text-6xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-2">Top users by coin balance</p>
      </div>

      <div className="flex flex-col md:flex-row md:gap-24 gap-8 w-full max-w-12xl items-stretch">
        {/* Top Users */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                <Trophy className="h-5 w-5" style={{ color: ORANGE }} />
                Top Users
              </CardTitle>
              <CardDescription style={{ color: GREY }}>Based on total coins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers.map((user, index) => {
                  // Set color based on rank - only for top 3
                  let rankColor = "";
                  if (index === 0) {
                    rankColor = GREEN;
                  } else if (index === 1) {
                    rankColor = ORANGE;
                  } else if (index === 2) {
                    rankColor = GREY;
                  }
                  
                  return (
                    <div key={user.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold text-sm">
                          {index === 0 ? (
                            <Trophy className="h-4 w-4" style={{ color: GREEN }} />
                          ) : index === 1 ? (
                            <Medal className="h-4 w-4" style={{ color: ORANGE }} />
                          ) : index === 2 ? (
                            <Medal className="h-4 w-4" style={{ color: GREY }} />
                          ) : (
                            <User className="h-5 w-5" style={{ color: ORANGE }} />
                          )}
                        </div>
                        <div>
                          <div
                            className={`font-medium ${rankColor ? "border rounded-full px-3 py-1" : ""}`}
                            style={rankColor ? { color: rankColor, borderColor: rankColor } : {}}
                          >
                            {user.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-semibold"
                          style={rankColor ? { color: rankColor } : {}}
                        >
                          {index === 0 ? (
                            <span
                              role="img"
                              aria-label="coins"
                              style={{ marginRight: 4, fontSize: '1.5rem', color: rankColor, verticalAlign: 'middle' }}
                            >
                              💰
                            </span>
                          ) : (
                            <span style={{ marginRight: 4, verticalAlign: 'middle' }}>
                              <Coins className="h-4 w-4 inline mr-1" style={rankColor ? { color: rankColor } : {}} />
                            </span>
                          )}
                          {user.balance} coins
                        </div>
                      </div>
                    </div>
                  );
                })}
                {topUsers.length === 0 && <div className="text-center py-4 text-muted-foreground">No users found</div>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Users */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                <Medal className="h-5 w-5" style={{ color: ORANGE }} />
                Bottom Users
              </CardTitle>
              <CardDescription style={{ color: GREY }}>Lowest coin balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bottomUsers.map((user, index) => (
                  <div key={user.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold text-sm">
                        <User className="h-5 w-5" style={{ color: ORANGE }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-medium ${user.balance === minBalance ? "border rounded-full px-3 py-1" : ""}`}
                          style={user.balance === minBalance ? { color: ORANGE, borderColor: ORANGE } : {}}
                        >
                          {user.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-semibold"
                        style={user.balance === minBalance ? { color: ORANGE } : {}}
                      >
                        <span style={{ marginRight: 4, verticalAlign: 'middle' }}>
                          <Coins className="h-4 w-4 inline mr-1" style={user.balance === minBalance ? { color: ORANGE } : {}} />
                        </span>
                        {user.balance} coins
                      </div>
                    </div>
                  </div>
                ))}
                {bottomUsers.length === 0 && <div className="text-center py-4 text-muted-foreground">No users found</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
