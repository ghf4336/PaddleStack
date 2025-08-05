import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { X, Plus, Users, Trophy, Clock, MapPin } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  status: 'waiting' | 'playing' | 'next';
}

interface Court {
  id: string;
  name: string;
  isActive: boolean;
  players: string[];
}

interface Game {
  position: number;
  players: string[];
}

export default function App() {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Alice', status: 'next' },
    { id: '2', name: 'Bob', status: 'next' },
    { id: '3', name: 'Charlie', status: 'waiting' },
    { id: '4', name: 'Diana', status: 'waiting' },
    { id: '5', name: 'Eve', status: 'playing' },
  ]);

  const [courts, setCourts] = useState<Court[]>([
    { id: '1', name: 'Court 1', isActive: true, players: ['Jarred', 'Eve', 'shelby', 'adrian'] },
  ]);

  const [newPlayerName, setNewPlayerName] = useState('');
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

  const nextUpGames: Game[] = [
    { position: 1, players: ['Frank', 'Peter'] },
    { position: 2, players: ['Alice', 'Bob'] },
  ];

  const upcomingGames: Game[] = [
    { position: 3, players: ['Charlie', 'Diana'] },
  ];

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        status: 'waiting',
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
      setIsAddPlayerOpen(false);
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const loadTestData = () => {
    const testPlayers: Player[] = [
      { id: 'test1', name: 'Alex', status: 'waiting' },
      { id: 'test2', name: 'Sarah', status: 'waiting' },
      { id: 'test3', name: 'Mike', status: 'waiting' },
      { id: 'test4', name: 'Emma', status: 'waiting' },
    ];
    setPlayers([...players, ...testPlayers]);
  };

  const addCourt = () => {
    const newCourt: Court = {
      id: (courts.length + 1).toString(),
      name: `Court ${courts.length + 1}`,
      isActive: false,
      players: [],
    };
    setCourts([...courts, newCourt]);
  };

  const completeGame = (courtId: string) => {
    setCourts(courts.map(court => 
      court.id === courtId 
        ? { ...court, players: [], isActive: false }
        : court
    ));
  };

  const getStatusDot = (status: Player['status']) => {
    switch (status) {
      case 'playing':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'next':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg">
              <span className="font-bold">pickle park</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-800">Queue Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Players */}
          <div className="space-y-6">
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Players ({players.length})</span>
                  </div>
                  <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-white text-green-600 hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Player
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Player</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Enter player name"
                          value={newPlayerName}
                          onChange={(e) => setNewPlayerName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddPlayerOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addPlayer}>Add Player</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Button 
                  variant="outline" 
                  onClick={loadTestData}
                  className="w-full mb-4 border-green-300 text-green-700 hover:bg-green-50"
                >
                  Load Test Data
                </Button>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusDot(player.status)}
                        <span className="font-medium">{player.name}</span>
                        {player.status === 'playing' && (
                          <Badge className="bg-blue-100 text-blue-800">On Court</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlayer(player.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-700">
                  <Clock className="w-5 h-5" />
                  <span>General Queue (0)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-500 text-center py-8">No players in general queue</p>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Next Up */}
          <div className="space-y-6">
            <Card className="shadow-lg border-yellow-200">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Next Up (4/4)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-600 mb-4">The following players will be playing next</p>
                <div className="grid grid-cols-2 gap-3">
                  {nextUpGames.map((game) => (
                    game.players.map((player, index) => (
                      <div
                        key={`${game.position}-${index}`}
                        className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-lg text-center border-2 border-yellow-300 shadow-sm"
                      >
                        <div className="text-sm text-yellow-700 mb-1">#{game.position + index}</div>
                        <div className="font-semibold text-yellow-900">{player}</div>
                      </div>
                    ))
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Next up in 2 Games (2/4)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-600 mb-4">These players will play in 2 games</p>
                <div className="grid grid-cols-2 gap-3">
                  {upcomingGames.map((game) => (
                    game.players.map((player, index) => (
                      <div
                        key={`upcoming-${game.position}-${index}`}
                        className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-lg text-center border-2 border-orange-300 shadow-sm"
                      >
                        <div className="text-sm text-orange-700 mb-1">#{game.position + index}</div>
                        <div className="font-semibold text-orange-900">{player}</div>
                      </div>
                    ))
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Courts */}
          <div className="space-y-6">
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Courts ({courts.length})</span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={addCourt}
                    className="bg-white text-green-600 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Court
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {courts.map((court) => (
                  <div key={court.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{court.name}</h4>
                      <Badge 
                        className={court.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-600"
                        }
                      >
                        {court.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    {court.players.length > 0 && (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {court.players.map((player, index) => (
                            <div 
                              key={index}
                              className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded text-center border border-blue-200"
                            >
                              <span className="text-blue-800 font-medium">{player}</span>
                            </div>
                          ))}
                        </div>
                        
                        {court.isActive && (
                          <Button 
                            onClick={() => completeGame(court.id)}
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                          >
                            Complete Game
                          </Button>
                        )}
                      </>
                    )}
                    
                    {court.players.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No players assigned</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}