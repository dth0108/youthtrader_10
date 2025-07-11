import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SurveyHeader } from "@/components/survey/survey-header";
import { UserIdentityStep } from "@/components/survey/user-identity-step";
import { LocationStep } from "@/components/survey/location-step";
import { FoodDrinkStep } from "@/components/survey/food-drink-step";
import { TimeStep } from "@/components/survey/time-step";
import type { InsertSurveyResponse } from "@shared/schema";

export default function Survey() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(0); // Start with user identity step
  const [selectedAnimal, setSelectedAnimal] = useState<{ emoji: string; nickname: string } | null>(null);
  const [surveyData, setSurveyData] = useState({
    location: "",
    foodTypes: [] as string[],
    drinkTypes: [] as string[],
    timePreferences: [] as { time: string; priority: number }[],
  });

  // Generate unique session ID
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const submitSurveyMutation = useMutation({
    mutationFn: async (data: InsertSurveyResponse) => {
      const response = await apiRequest("POST", "/api/survey", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "설문 제출 완료",
        description: "설문이 성공적으로 제출되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/survey"] });
      setLocation("/results");
    },
    onError: (error) => {
      toast({
        title: "제출 실패",
        description: "설문 제출 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Survey submission error:", error);
    },
  });

  const handleLocationSelect = (location: string) => {
    setSurveyData(prev => ({ ...prev, location }));
  };

  const handleFoodToggle = (food: string) => {
    setSurveyData(prev => ({
      ...prev,
      foodTypes: prev.foodTypes.includes(food)
        ? prev.foodTypes.filter(f => f !== food)
        : [...prev.foodTypes, food]
    }));
  };

  const handleDrinkToggle = (drink: string) => {
    setSurveyData(prev => ({
      ...prev,
      drinkTypes: prev.drinkTypes.includes(drink)
        ? prev.drinkTypes.filter(d => d !== drink)
        : [...prev.drinkTypes, drink]
    }));
  };

  const handleTimeToggle = (time: string) => {
    setSurveyData(prev => {
      const existingTimeIndex = prev.timePreferences.findIndex(t => t.time === time);
      
      if (existingTimeIndex > -1) {
        // Remove the time and adjust priorities
        const newTimePreferences = prev.timePreferences
          .filter(t => t.time !== time)
          .map((t, index) => ({ ...t, priority: index + 1 }));
        
        return { ...prev, timePreferences: newTimePreferences };
      } else if (prev.timePreferences.length < 4) {
        // Add new time with next priority
        const newTimePreferences = [
          ...prev.timePreferences,
          { time, priority: prev.timePreferences.length + 1 }
        ];
        
        return { ...prev, timePreferences: newTimePreferences };
      }
      
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (!selectedAnimal) {
      toast({
        title: "오류",
        description: "캐릭터를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    const finalData: InsertSurveyResponse = {
      nickname: selectedAnimal.nickname,
      avatar: selectedAnimal.emoji,
      sessionId,
      location: surveyData.location,
      foodTypes: surveyData.foodTypes,
      drinkTypes: surveyData.drinkTypes,
      timePreferences: surveyData.timePreferences,
    };

    try {
      await submitSurveyMutation.mutateAsync(finalData);
    } catch (error) {
      // Error handling is done in mutation
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <UserIdentityStep
            selectedAnimal={selectedAnimal}
            onAnimalSelect={setSelectedAnimal}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <LocationStep
            selectedLocation={surveyData.location}
            onLocationSelect={handleLocationSelect}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <FoodDrinkStep
            selectedFoods={surveyData.foodTypes}
            selectedDrinks={surveyData.drinkTypes}
            onFoodToggle={handleFoodToggle}
            onDrinkToggle={handleDrinkToggle}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );
      case 3:
        return (
          <TimeStep
            selectedTimes={surveyData.timePreferences}
            onTimeToggle={handleTimeToggle}
            onSubmit={handleSubmit}
            onPrevious={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
      {currentStep > 0 && <SurveyHeader currentStep={currentStep} totalSteps={3} />}
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {renderCurrentStep()}
      </main>

      <footer className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border-t border-emerald-200/50 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-emerald-700">
              🌿 청년무역 인턴 동기 모임 설문 시스템 | 
              <span className="text-teal-600 font-medium"> 자연 친화적 익명 응답</span>
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              🏝️ 힐링과 소통이 있는 모임을 위해 | 문의사항은 주최자에게 연락해주세요
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
