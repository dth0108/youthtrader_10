import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, MapPin, Utensils, Clock, Star, Trophy, Users, TrendingUp, Share2, Heart, Zap, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface SurveyStats {
  totalResponses: number;
  locationStats: Record<string, number>;
  foodStats: Record<string, number>;
  drinkStats: Record<string, number>;
  timeStats: Record<string, { count: number; priority: number }>;
}

interface Restaurant {
  id: number;
  name: string;
  location: string;
  foodType: string;
  rating: string;
  reviewCount: string;
  description: string;
  distance: string;
}

// Get constants from shared schema
const LOCATION_EMOJIS: Record<string, string> = {
  "gangnam": "🏙️", "hongdae": "🎭", "jongno": "🏛️", 
  "myeongdong": "🛍️", "hangang": "🌊", "sinchon": "🎓"
};

const FOOD_EMOJIS: Record<string, string> = {
  "korean": "🍖", "chinese": "🍜", "japanese": "🍣", 
  "western": "🍝", "bbq": "🔥", "other": "🌮"
};

const DRINK_EMOJIS: Record<string, string> = {
  "beer": "🍺", "soju": "🥃", "somaek": "🍻", 
  "highball": "🥂", "wine": "🍷", "nonalcoholic": "🥤"
};

const TIME_EMOJIS: Record<string, string> = {
  "17:00": "🌅", "18:00": "🌇", "19:00": "🌆", "20:00": "🌃"
};

export default function Results() {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(true);

  const { data: stats, isLoading: statsLoading } = useQuery<SurveyStats>({
    queryKey: ["/api/survey/stats"],
  });

  const { data: restaurants, isLoading: restaurantsLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants/gangnam"],
  });

  useEffect(() => {
    setTimeout(() => setIsAnimating(false), 1000);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '청년 무역 인턴 모임 설문 결과',
        text: '우리 모임의 설문 결과를 확인해보세요!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크 복사 완료",
        description: "설문 결과 링크가 클립보드에 복사되었습니다.",
      });
    }
  };

  const handleDownload = () => {
    if (!stats) return;
    
    const data = {
      timestamp: new Date().toISOString(),
      stats,
      restaurants,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "다운로드 완료! 🎉",
      description: "설문 결과가 성공적으로 다운로드되었습니다.",
    });
  };

  if (statsLoading || restaurantsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-3xl">📊</span>
          </div>
          <div className="animate-pulse">
            <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-48 mx-auto mb-4"></div>
            <div className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full w-32 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-6 text-lg font-medium">결과를 불러오는 중... ✨</p>
        </div>
      </div>
    );
  }

  const getTopLocation = () => {
    if (!stats?.locationStats) return null;
    return Object.entries(stats.locationStats).sort((a, b) => b[1] - a[1])[0];
  };

  const getTopFood = () => {
    if (!stats?.foodStats) return null;
    return Object.entries(stats.foodStats).sort((a, b) => b[1] - a[1])[0];
  };

  const getTopDrink = () => {
    if (!stats?.drinkStats) return null;
    return Object.entries(stats.drinkStats).sort((a, b) => b[1] - a[1])[0];
  };

  const getTopTime = () => {
    if (!stats?.timeStats) return null;
    return Object.entries(stats.timeStats).sort((a, b) => b[1].priority - a[1].priority)[0];
  };

  const topLocation = getTopLocation();
  const topFood = getTopFood();
  const topDrink = getTopDrink();
  const topTime = getTopTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-blue-600/90"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 bounce-in">
              <span className="text-4xl pulse-emoji">🎉</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 bounce-in">설문 결과 발표!</h1>
            <p className="text-xl text-white/90 mb-6 bounce-in">실시간으로 집계된 모든 참가자의 선택을 확인해보세요</p>
            
            {/* Live Stats Bar */}
            <div className="flex justify-center items-center space-x-8 text-sm bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 bounce-in">
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span>{stats?.totalResponses || 0}명 참여</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>실시간 집계중</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={16} />
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Winner Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-xl bounce-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{LOCATION_EMOJIS[topLocation?.[0] || "gangnam"]}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">가장 인기 있는 장소는!</h3>
              <p className="text-2xl font-black mb-1">{topLocation?.[0] || "강남"}</p>
              <p className="text-sm text-white/90">{topLocation?.[1] || 0}표 획득</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-400 to-pink-500 text-white border-0 shadow-xl bounce-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{FOOD_EMOJIS[topFood?.[0] || "korean"]}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">오늘의 베스트 메뉴는!</h3>
              <p className="text-2xl font-black mb-1">{topFood?.[0] || "한식"}</p>
              <p className="text-sm text-white/90">{topFood?.[1] || 0}표 획득</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-0 shadow-xl bounce-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{DRINK_EMOJIS[topDrink?.[0] || "beer"]}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">건배 음료 1위!</h3>
              <p className="text-2xl font-black mb-1">{topDrink?.[0] || "맥주"}</p>
              <p className="text-sm text-white/90">{topDrink?.[1] || 0}표 획득</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white border-0 shadow-xl bounce-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{TIME_EMOJIS[topTime?.[0] || "18:00"]}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">골든 타임!</h3>
              <p className="text-2xl font-black mb-1">{topTime?.[0] || "18:00"}</p>
              <p className="text-sm text-white/90">최고 인기 시간</p>
            </CardContent>
          </Card>
        </div>

        {/* Location Results */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden bounce-in">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <MapPin size={24} />
              <span>📍 장소별 인기도</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {Object.keys(stats?.locationStats || {}).length}곳
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="space-y-6">
              {stats?.locationStats && Object.entries(stats.locationStats)
                .sort((a, b) => b[1] - a[1])
                .map(([location, count], index) => {
                  const percentage = stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0;
                  const isTop = index === 0;
                  return (
                    <div key={location} className={`fun-card p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      isTop ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {isTop && <Crown className="text-yellow-500" size={20} />}
                          <span className="text-2xl">{LOCATION_EMOJIS[location]}</span>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{location}</h3>
                            <p className="text-sm text-gray-600">#{index + 1} 인기 지역</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-purple-600">{count}표</div>
                          <div className="text-sm text-gray-600">{percentage.toFixed(0)}%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>인기도</span>
                          <span className="font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              isTop ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Food Results */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden bounce-in">
          <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <Utensils size={24} />
              <span>🍽️ 음식 선호도 랭킹</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                TOP {Object.keys(stats?.foodStats || {}).length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-red-50 to-pink-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats?.foodStats && Object.entries(stats.foodStats)
                .sort((a, b) => b[1] - a[1])
                .map(([food, count], index) => {
                  const percentage = stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0;
                  const isTop = index === 0;
                  return (
                    <div key={food} className={`fun-card p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      isTop ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {isTop && <Trophy className="text-yellow-500" size={18} />}
                          <span className="text-2xl">{FOOD_EMOJIS[food]}</span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{food}</h3>
                            <p className="text-sm text-gray-600">#{index + 1} 순위</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-red-600">{count}표</div>
                          <div className="text-sm text-gray-600">{percentage.toFixed(0)}%</div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isTop ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Drink Results */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden bounce-in">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <span className="text-2xl">🍻</span>
              <span>음료 선호도</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                건배 준비!
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats?.drinkStats && Object.entries(stats.drinkStats)
                .sort((a, b) => b[1] - a[1])
                .map(([drink, count], index) => {
                  const percentage = stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0;
                  const isTop = index === 0;
                  return (
                    <div key={drink} className={`fun-card p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      isTop ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {isTop && <Heart className="text-red-500" size={18} />}
                          <span className="text-2xl">{DRINK_EMOJIS[drink]}</span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{drink}</h3>
                            <p className="text-sm text-gray-600">#{index + 1} 선호</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-cyan-600">{count}표</div>
                          <div className="text-sm text-gray-600">{percentage.toFixed(0)}%</div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isTop ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Time Results */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden bounce-in">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <Clock size={24} />
              <span>⏰ 시간 선호도</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                7월 22일
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats?.timeStats && Object.entries(stats.timeStats)
                .sort((a, b) => b[1].priority - a[1].priority)
                .map(([time, data], index) => {
                  const percentage = stats.totalResponses > 0 ? (data.priority / (stats.totalResponses * 4)) * 100 : 0;
                  const isTop = index === 0;
                  return (
                    <div key={time} className={`fun-card p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      isTop ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {isTop && <Star className="text-yellow-500 fill-current" size={18} />}
                          <span className="text-2xl">{TIME_EMOJIS[time]}</span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{time}</h3>
                            <p className="text-sm text-gray-600">#{index + 1} 시간대</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-purple-600">{data.count}표</div>
                          <div className="text-sm text-gray-600">우선순위 점수</div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isTop ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-purple-400 to-indigo-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Final Decision */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden bounce-in">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <span className="text-2xl">🎯</span>
              <span>최종 결정! 우리의 완벽한 모임</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-gradient-to-br from-green-50 to-teal-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">모임 장소</h3>
                    <p className="text-xl text-blue-600 font-black">{topLocation?.[0] || "강남"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Utensils className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">메뉴</h3>
                    <p className="text-xl text-red-600 font-black">{topFood?.[0] || "한식"}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🍻</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">음료</h3>
                    <p className="text-xl text-cyan-600 font-black">{topDrink?.[0] || "맥주"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">시간</h3>
                    <p className="text-xl text-purple-600 font-black">7월 22일 {topTime?.[0] || "18:00"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-2xl mr-2">🎉</span>
                모임 정보가 확정되었습니다!
              </h3>
              <p className="text-gray-700">
                <strong>📅 일시:</strong> 2025년 7월 22일 (화요일) {topTime?.[0] || "18:00"}<br/>
                <strong>📍 장소:</strong> {topLocation?.[0] || "강남"} - {restaurants?.[0]?.name || "추천 식당"}<br/>
                <strong>🍽️ 메뉴:</strong> {topFood?.[0] || "한식"} 위주<br/>
                <strong>🍻 음료:</strong> {topDrink?.[0] || "맥주"}로 건배!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={handleShare} 
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Share2 className="mr-2" size={20} />
            결과 공유하기 🚀
          </Button>
          <Button 
            onClick={handleDownload} 
            variant="outline"
            className="px-8 py-4 text-lg font-semibold border-2 border-purple-500 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Download className="mr-2" size={20} />
            결과 다운로드 📊
          </Button>
        </div>
      </main>
    </div>
  );
}
