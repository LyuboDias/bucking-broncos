import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { GREEN, ORANGE, GREY } from "@/app/constants";

export default function LeaderboardPage() {
  const mockPlayers = [
    { id: 1, name: "Alice", points: 1200 },
    { id: 2, name: "Charlie", points: 1200 },
    { id: 3, name: "Charlie", points: 250 },
    { id: 4, name: "Diana", points: 200 },
    { id: 5, name: "Eve", points: 180 },
    { id: 6, name: "Frank", points: 175 },
    { id: 7, name: "Grace", points: 170 },
    { id: 8, name: "Heidi", points: 165 },
    { id: 9, name: "Ivan", points: 160 },
    { id: 10, name: "Judy", points: 155 },
    { id: 11, name: "Karl", points: 150 },
    { id: 12, name: "Laura", points: 145 },
    { id: 13, name: "Mallory", points: 140 },
    { id: 14, name: "Niaj", points: 135 },
    { id: 15, name: "Olivia", points: 130 },
    { id: 16, name: "Peggy", points: 125 },
    { id: 17, name: "Rupert", points: 110 },
    { id: 18, name: "Sybil", points: 15 },
    { id: 19, name: "Trent", points: 15 },
    { id: 20, name: "Victor", points: 15 },
  ];

  const topPlayers = [...mockPlayers]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const sortedByPointsAsc = [...mockPlayers].sort((a, b) => a.points - b.points);
  const minScore = sortedByPointsAsc[0]?.points;
  const bottomPlayersNonMin = sortedByPointsAsc.filter(p => p.points !== minScore).slice(0, 5 - sortedByPointsAsc.filter(p => p.points === minScore).length);
  const bottomPlayersMin = sortedByPointsAsc.filter(p => p.points === minScore);
  const bottomPlayers = [...bottomPlayersNonMin, ...bottomPlayersMin];

  const topScore = topPlayers[0]?.points;
  const secondTopScore = topPlayers.find(p => p.points < topScore)?.points;

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mx-auto">
        <h1 className="text-6xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Top 5 players by points</p>
      </div>

      <div className="flex flex-col md:flex-row md:gap-24 gap-8 w-full max-w-12xl items-stretch">
        {/* Top Players */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                <Trophy className="h-5 w-5" style={{ color: ORANGE }} />
                Top Players
              </CardTitle>
              <CardDescription style={{ color: GREY }}>Based on total points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPlayers.map((player, index) => (
                  <div key={player.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold text-sm">
                        {player.points === topScore ? (
                          <Trophy className="h-4 w-4" style={{ color: ORANGE }} />
                        ) : player.points === secondTopScore ? (
                          <Medal className="h-4 w-4" style={{ color: ORANGE }} />
                        ) : (
                          <span style={{ color: ORANGE }}>{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <div
                          className={`font-medium ${player.points === topScore ? "border rounded-full px-3 py-1" : ""}`}
                          style={player.points === topScore ? { color: GREEN, borderColor: GREEN } : {}}
                        >
                          {player.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-semibold"
                        style={player.points === topScore ? { color: GREEN } : {}}
                      >
                        <span
                          role="img"
                          aria-label="money bag"
                          style={player.points === topScore ? { marginRight: 4, fontSize: '1.5rem', color: GREEN, verticalAlign: 'middle' } : { marginRight: 4 }}
                        >
                          💰
                        </span>
                        {player.points}
                      </div>
                    </div>
                  </div>
                ))}
                {topPlayers.length === 0 && <div className="text-center py-4 text-muted-foreground">No players found</div>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Players */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                <Trophy className="h-5 w-5" style={{ color: ORANGE }} />
                Bottom Players
              </CardTitle>
              <CardDescription style={{ color: GREY }}>Lowest scoring 5 players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bottomPlayers.map((player, index) => (
                  <div key={player.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-medium ${player.points === minScore ? "border rounded-full px-3 py-1" : ""}`}
                          style={player.points === minScore ? { color: ORANGE, borderColor: ORANGE } : {}}
                        >
                          {player.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-semibold"
                        style={player.points === minScore ? { color: ORANGE } : {}}
                      >
                        <span
                          role="img"
                          aria-label="money bag"
                          style={player.points === minScore ? { marginRight: 4, fontSize: '.7rem', color: GREEN, verticalAlign: 'middle' } : { marginRight: 4 }}
                        >
                          💰
                        </span>
                        {player.points}
                      </div>
                    </div>
                  </div>
                ))}
                {bottomPlayers.length === 0 && <div className="text-center py-4 text-muted-foreground">No players found</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
