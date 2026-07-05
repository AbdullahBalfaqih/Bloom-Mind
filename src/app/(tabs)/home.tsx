import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import Animated, { FadeInDown, SlideInRight, ZoomIn } from 'react-native-reanimated';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Bell, BookOpen, Coffee, Code, Brain, Target, Heart, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const FOCUS_MODES = [
  { id: 'Deep Work', icon: Target },
  { id: 'Reading', icon: BookOpen },
  { id: 'Coding', icon: Code },
  { id: 'Meditate', icon: Brain },
  { id: 'Break', icon: Coffee },
];

export default function Home() {
  const router = useRouter();
  const { totalFocusTime, streak, gardenHealth } = useStore();
  const [activeMode, setActiveMode] = useState('Deep Work');

  const hours = Math.floor(totalFocusTime / 60);
  const minutes = totalFocusTime % 60;

  return (
    <View className="flex-1 bg-[#FFFFFF] pt-16">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} className="px-6">
        
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} className="flex-row justify-between items-center mb-6">
          <Animated.View entering={SlideInRight.delay(200).duration(500).springify()}>
            <Text className="text-[#E29578] font-black text-2xl tracking-wide">Hi, Abdullah</Text>
            <Text className="text-[#333333] text-sm font-medium mt-1">Ready to grow your focus garden?</Text>
          </Animated.View>
          <Pressable onPress={() => router.push('/notifications')} className="w-12 h-12 bg-[#E29578]/20 rounded-full justify-center items-center relative">
            <Bell color="#E29578" size={24} />
            {/* Unread badge */}
            <View className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-[#E29578] rounded-full border-2 border-white" />
          </Pressable>
        </Animated.View>

        {/* Banner (Special Offer style) */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mb-8">
          <View className="bg-[#FAF0E6] rounded-3xl overflow-hidden shadow-sm flex-row h-32 relative">
             {/* Decorative elements */}
             <View className="absolute -left-10 -top-10 w-32 h-32 bg-[#E29578]/10 rounded-full" />
             <View className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#E29578]" />
             <View className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full" />
             
             <View className="flex-1 justify-center pl-5 z-10">
                <Text className="text-[#333333] font-black text-lg leading-tight mb-1">Boost Your{'\n'}Productivity</Text>
                <Text className="text-[#666666] text-xs font-bold">AI Coach Insight</Text>
             </View>
             
             <View className="flex-[1.2] justify-center items-center z-10 pr-2">
                <Text className="text-white font-black text-xl tracking-wider mb-2 text-center">Special{'\n'}Focus</Text>
                <Pressable className="bg-white/20 border border-white/40 px-4 py-1.5 rounded-full active:bg-white/30">
                  <Text className="text-white text-xs font-black">20% More XP!</Text>
                </Pressable>
             </View>
          </View>
          {/* Dots */}
          <View className="flex-row justify-center mt-4 gap-x-1.5">
             <View className="w-6 h-1.5 bg-[#333333] rounded-full" />
             <View className="w-4 h-1.5 bg-[#E29578]/40 rounded-full" />
             <View className="w-4 h-1.5 bg-[#E29578]/40 rounded-full" />
          </View>
        </Animated.View>

        {/* Focus Modes */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="mb-8">
          <Text className="text-[#E29578] font-bold text-lg mb-4 tracking-wide">Focus Modes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible" contentContainerStyle={{ paddingRight: 20 }}>
            {FOCUS_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <Pressable 
                  key={mode.id} 
                  onPress={() => setActiveMode(mode.id)} 
                  className="items-center mr-4 active:opacity-80"
                >
                  <View className={`w-16 h-16 rounded-2xl justify-center items-center mb-2 transition-all ${
                    isActive ? 'bg-[#E29578] shadow-md shadow-[#E29578]/40' : 'bg-[#FAF0E6] border border-[#E29578]/20 shadow-sm'
                  }`}>
                     <Icon color={isActive ? '#FFFFFF' : '#E29578'} size={28} strokeWidth={isActive ? 2 : 1.5} />
                  </View>
                  <Text className={`text-xs font-bold ${isActive ? 'text-[#E29578]' : 'text-[#333333]'}`}>
                    {mode.id}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Today's Top Goal */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} className="mb-8">
          <Text className="text-[#E29578] font-bold text-lg mb-4 tracking-wide">Today's Top Goal</Text>
          <View className="bg-[#E29578]/40 rounded-[28px] p-6 flex-row items-center relative overflow-visible h-44 shadow-sm border border-[#E29578]/20">
             <View className="w-[55%] z-10 justify-center">
                <Text className="text-[#333333] font-black text-xl mb-1.5">Focus Mode</Text>
                <Text className="text-[#666666] text-xs leading-4 mb-4 font-semibold">
                  You've completed {hours}h {minutes}m out of your 5h goal. Keep growing!
                </Text>
                <View className="flex-row items-center gap-x-2">
                   <View className="bg-white px-3 py-1.5 rounded-full flex-row items-center shadow-sm">
                      <Target color="#E29578" size={14} strokeWidth={2.5} />
                      <Text className="text-[#333333] font-black text-xs ml-1">55%</Text>
                   </View>
                   <Pressable className="bg-white px-4 py-1.5 rounded-full shadow-sm active:bg-gray-100">
                      <Text className="text-[#333333] font-bold text-xs">Start Now</Text>
                   </Pressable>
                </View>
             </View>
             
             {/* Visual element representing the 'product' sticking out on the right */}
             <View className="absolute -right-2 -top-4 bottom-0 justify-center z-20">
                <Animated.View entering={ZoomIn.delay(600).duration(600).springify()} className="w-36 h-48 bg-white rounded-2xl shadow-xl border border-[#E29578]/30 items-center justify-center p-2 relative overflow-hidden">
                   {/* Top 'Cart' drawer style */}
                   <View className="absolute top-0 w-full h-8 bg-[#F5F5F5] border-b border-[#EEEEEE] rounded-t-xl justify-center items-center">
                      <View className="w-8 h-1 bg-[#DDDDDD] rounded-full" />
                   </View>
                   
                   {/* Plant Growth Indicator */}
                   <Text className="text-[#E29578] font-black text-4xl mt-6 tracking-tighter shadow-sm">55%</Text>
                   <Text className="text-[#999999] text-[10px] font-black tracking-widest mt-1">Completed</Text>
                   
                   {/* Decorative shelves mimicking the cart */}
                   <View className="w-full mt-4 flex-col gap-y-2 px-2">
                      <View className="w-full h-1.5 bg-[#E29578]/20 rounded-full" />
                      <View className="w-full h-1.5 bg-[#E29578]/20 rounded-full" />
                      <View className="w-2/3 h-1.5 bg-[#E29578]/20 rounded-full self-center" />
                   </View>
                </Animated.View>
             </View>
          </View>
        </Animated.View>

        {/* Daily Challenges */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} className="mb-8">
          <Text className="text-[#E29578] font-bold text-lg mb-4 tracking-wide">Daily Challenges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible" contentContainerStyle={{ paddingRight: 20 }}>
            {/* Challenge 1 */}
            <View className="w-64 bg-[#FAF0E6] p-4 rounded-2xl mr-4 border border-[#E29578]/10 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-[#E29578]/20 rounded-full items-center justify-center mr-3 shadow-sm">
                  <Target color="#E29578" size={20} strokeWidth={2} />
                </View>
                <View>
                  <Text className="text-[#333333] font-bold">Deep Focus</Text>
                  <Text className="text-[#999999] text-xs font-medium">Complete 2 hours</Text>
                </View>
              </View>
              <View className="w-full bg-white h-2 rounded-full overflow-hidden shadow-sm">
                <View className="w-[60%] h-full bg-[#E29578] rounded-full" />
              </View>
              <Text className="text-right text-[#E29578] text-[10px] font-black mt-1.5">60%</Text>
            </View>

            {/* Challenge 2 */}
            <View className="w-64 bg-[#FAF0E6] p-4 rounded-2xl mr-4 border border-[#E29578]/10 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-[#E29578]/20 rounded-full items-center justify-center mr-3 shadow-sm">
                  <Coffee color="#E29578" size={20} strokeWidth={2} />
                </View>
                <View>
                  <Text className="text-[#333333] font-bold">Stay Hydrated</Text>
                  <Text className="text-[#999999] text-xs font-medium">Take 3 water breaks</Text>
                </View>
              </View>
              <View className="w-full bg-white h-2 rounded-full overflow-hidden shadow-sm">
                <View className="w-[33%] h-full bg-[#E29578] rounded-full" />
              </View>
              <Text className="text-right text-[#E29578] text-[10px] font-black mt-1.5">1 / 3</Text>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Your Virtual Garden (Grid) */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} className="mb-6">
          <Text className="text-[#E29578] font-bold text-lg mb-4 tracking-wide">Your Virtual Garden</Text>
          <View className="flex-row justify-between">
             
             {/* Item 1 */}
             <View className="w-[48%]">
                <View className="w-full aspect-[4/5] bg-[#FAF0E6] rounded-2xl mb-3 items-center justify-center relative shadow-sm border border-[#E29578]/10">
                   {/* We don't have real plant assets easily accessible, so we use a huge icon as a placeholder */}
                   <Target color="#E29578" size={64} opacity={0.5} />
                </View>
                <Text className="text-[#333333] font-black text-base">Focus Sprout</Text>
                <Text className="text-[#999999] text-[11px] font-bold mb-3 mt-0.5 border-b border-[#EEEEEE] pb-2 leading-tight">
                  Planted today during your deep work session.
                </Text>
                <View className="flex-row justify-between items-center">
                   <Text className="text-[#E29578] font-black text-sm">120 XP</Text>
                   <View className="flex-row gap-x-1">
                      <Pressable><Heart color="#E29578" fill="#E29578" opacity={0.6} size={20} /></Pressable>
                      <Pressable><Plus color="#E29578" opacity={0.6} size={20} /></Pressable>
                   </View>
                </View>
             </View>
             
             {/* Item 2 */}
             <View className="w-[48%]">
                <View className="w-full aspect-[4/5] bg-[#FAF0E6] rounded-2xl mb-3 items-center justify-center relative shadow-sm border border-[#E29578]/10">
                   <BookOpen color="#E29578" size={64} opacity={0.5} />
                </View>
                <Text className="text-[#333333] font-black text-base">Mindful Tree</Text>
                <Text className="text-[#999999] text-[11px] font-bold mb-3 mt-0.5 border-b border-[#EEEEEE] pb-2 leading-tight">
                  Planted 3 days ago. Needs more attention.
                </Text>
                <View className="flex-row justify-between items-center">
                   <Text className="text-[#E29578] font-black text-sm">240 XP</Text>
                   <View className="flex-row gap-x-1">
                      <Pressable><Heart color="#E29578" fill="#E29578" opacity={0.6} size={20} /></Pressable>
                      <Pressable><Plus color="#E29578" opacity={0.6} size={20} /></Pressable>
                   </View>
                </View>
             </View>

          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
