import { View, Text, Pressable } from 'react-native';
import { useStore } from '../../store/useStore';
import { Bell, ChevronRight, Plus } from 'lucide-react-native';

export default function Home() {
  const { totalFocusTime, streak, gardenHealth } = useStore();

  const hours = Math.floor(totalFocusTime / 60);
  const minutes = totalFocusTime % 60;

  return (
    <View className="flex-1 bg-[#0F0B15] px-5 pt-16">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-white font-semibold text-xl">Good Morning, Omar</Text>
          <Text className="text-[#8D8B91] text-sm">Let's grow your best day.</Text>
        </View>
        <Bell color="#8D8B91" size={24} />
      </View>

      {/* Focus Status Card */}
      <View className="bg-[#1C1A22] rounded-3xl p-6 mb-6">
        <Text className="text-[#8D8B91] mb-2">Today's Focus</Text>
        <View className="flex-row items-end">
          <Text className="text-white text-4xl font-bold">{hours}h {minutes}m</Text>
          <Text className="text-[#8D8B91] text-sm ml-2 mb-1">/ 5h 00m</Text>
        </View>
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-[#8D8B91] text-xs">Remaining Time: 2h 15m</Text>
          <View className="w-16 h-16 rounded-full border-4 border-[#38531B] justify-center items-center">
            <Text className="text-white font-bold text-sm">55%</Text>
          </View>
        </View>
      </View>

      {/* AI Recommendation Card */}
      <View className="bg-[#1C1A22] rounded-3xl p-6 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white font-semibold">AI Recommendation</Text>
          <ChevronRight color="#8D8B91" size={20} />
        </View>
        <Text className="text-[#8D8B91] text-sm leading-5 mb-4">
          You've been on social media more than usual. Try a 20 min break and get back to your goals.
        </Text>
        <Pressable className="bg-[#2A2831] py-3 rounded-xl items-center">
          <Text className="text-white font-medium">View Insight</Text>
        </Pressable>
      </View>

      {/* Current Streak */}
      <View className="flex-row justify-between items-center bg-[#1C1A22] rounded-2xl p-4 mb-4">
        <Text className="text-white font-medium">Current Streak</Text>
        <Text className="text-white font-bold">{streak} Days</Text>
      </View>

      <View className="flex-row justify-between items-center bg-[#1C1A22] rounded-2xl p-4">
        <View>
          <Text className="text-white font-medium">Garden Status</Text>
          <Text className="text-[#8D8B91] text-xs mt-1">Your plants are growing well!</Text>
        </View>
        <Text className="text-[#619B36] font-bold">{gardenHealth}%</Text>
      </View>
    </View>
  );
}
