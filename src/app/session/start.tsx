import { View, Text, ScrollView, Pressable } from 'react-native';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';

export default function StartSession() {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-[#0F0B15]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-16 pb-6">
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color="#ffffff" size={24} />
        </Pressable>
        <Text className="text-white font-semibold text-lg ml-6">Start Session</Text>
      </View>

      <ScrollView className="flex-1 px-5">
        <Text className="text-[#8D8B91] mb-4">What are you planning to do?</Text>
        
        <View className="bg-[#1C1A22] rounded-3xl p-2 mb-8">
          {['Instagram', 'YouTube', 'TikTok', 'Other App', 'Study / Work'].map((item, i) => (
            <Pressable key={i} className="flex-row items-center p-4 border-b border-[#252529] last:border-b-0">
              <View className={`w-6 h-6 rounded-md mr-4 ${i === 0 ? 'bg-pink-500' : i === 1 ? 'bg-red-500' : 'bg-gray-500'}`} />
              <Text className="text-white font-medium flex-1">{item}</Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row justify-between items-center mb-10">
          <Text className="text-[#8D8B91]">Session Goal (Optional)</Text>
          <View className="flex-row items-center bg-[#1C1A22] px-4 py-2 rounded-xl">
            <Text className="text-white mr-2">30 min</Text>
            <ChevronDown color="#8D8B91" size={16} />
          </View>
        </View>

        <Link href="/session/active" asChild>
          <Pressable className="bg-[#38531B] w-full py-4 rounded-full items-center">
            <Text className="text-white font-semibold text-lg">Start Session</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}
