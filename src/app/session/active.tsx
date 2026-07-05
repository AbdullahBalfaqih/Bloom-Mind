import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';

export default function ActiveSession() {
  const router = useRouter();
  const { addFocusTime } = useStore();

  const handleEndSession = () => {
    // Add time to store and go back
    addFocusTime(25);
    router.replace('/(tabs)/home');
  };

  return (
    <View className="flex-1 bg-[#0F0B15] px-5 pt-20">
      <Text className="text-white font-semibold text-xl text-center mb-10">Session Active</Text>

      <View className="items-center mb-16">
        <Text className="text-white text-6xl font-bold mb-4">24:36</Text>
        <Text className="text-white text-lg mb-8">Instagram</Text>
        
        <View className="w-full flex-row items-center justify-between mb-2">
          <Text className="text-[#8D8B91] text-sm">Your goal: 30 min</Text>
        </View>
        <View className="w-full h-2 bg-[#252529] rounded-full mb-10">
          <View className="w-[82%] h-2 bg-[#E1306C] rounded-full" />
        </View>

        <Pressable 
          onPress={handleEndSession}
          className="bg-[#5C2B29] w-full py-4 rounded-xl items-center"
        >
          <Text className="text-[#E74C3C] font-semibold text-lg">End Session</Text>
        </Pressable>
      </View>

      <View className="bg-[#1C1A22] rounded-3xl p-6">
        <Text className="text-[#8D8B91] mb-2 font-medium">Live Insight</Text>
        <Text className="text-white leading-6 mb-4">
          You've used Instagram for 18 min more than yesterday at this time.
        </Text>
        {/* Placeholder for chart */}
        <View className="h-16 flex-row items-end border-b border-[#252529]">
          <View className="flex-1 h-[40%] bg-[#252529] mr-1" />
          <View className="flex-1 h-[60%] bg-[#252529] mr-1" />
          <View className="flex-1 h-[80%] bg-[#2A3F1D] mr-1" />
          <View className="flex-1 h-[100%] bg-[#619B36]" />
        </View>
      </View>
    </View>
  );
}
