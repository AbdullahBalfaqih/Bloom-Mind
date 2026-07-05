import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInDown, FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { BarChart2, TrendingUp, Clock, ShieldAlert } from 'lucide-react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface AppLimit {
  id: string;
  name: string;
  timeUsed: string;
  limitPercent: number;
  color: string;
  blocked: boolean;
  iconName: string;
}

export default function Stats() {
  const [appLimits, setAppLimits] = useState<AppLimit[]>([
    { id: '1', name: 'WhatsApp', timeUsed: '2h 15m', limitPercent: 75, color: '#25D366', blocked: false, iconName: 'whatsapp' },
    { id: '2', name: 'Instagram', timeUsed: '1h 10m', limitPercent: 58, color: '#E1306C', blocked: false, iconName: 'instagram' },
    { id: '3', name: 'Snapchat', timeUsed: '45m', limitPercent: 90, color: '#000000', blocked: false, iconName: 'snapchat-ghost' },
    { id: '4', name: 'TikTok', timeUsed: '1h 40m', limitPercent: 120, color: '#000000', blocked: true, iconName: 'tiktok' },
    { id: '5', name: 'YouTube', timeUsed: '2h 30m', limitPercent: 83, color: '#FF0000', blocked: false, iconName: 'youtube' },
    { id: '6', name: 'Telegram', timeUsed: '50m', limitPercent: 41, color: '#0088cc', blocked: false, iconName: 'telegram-plane' },
  ]);

  const [activeTab, setActiveTab] = useState(1);
  const [previousTab, setPreviousTab] = useState(1);
  const tabPosition = useSharedValue(1);
  const tabWidth = useSharedValue(0);

  const handleTabPress = (index: number) => {
    setPreviousTab(activeTab);
    setActiveTab(index);
    tabPosition.value = withSpring(index, { damping: 20, stiffness: 200 });
  };

  const animatedTabStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPosition.value * tabWidth.value }]
    };
  });

  const toggleBlock = (id: string) => {
    setAppLimits(prev =>
      prev.map(app => (app.id === id ? { ...app, blocked: !app.blocked } : app))
    );
  };

  const currentData = [
    {
      focusTime: '3h 15m', efficiency: '92%', vs: '+4% vs yesterday', chart: [1, 1.5, 3, 2, 4, 1, 2],
      apps: appLimits.map(a => ({ ...a, timeUsed: '30m', limitPercent: Math.floor(a.limitPercent / 3) }))
    },
    {
      focusTime: '19h 45m', efficiency: '84%', vs: '+12% vs last week', chart: [2, 3, 3.5, 4, 3, 2.5, 2],
      apps: appLimits
    },
    {
      focusTime: '85h 20m', efficiency: '78%', vs: '+8% vs last month', chart: [4, 5, 3.5, 4.5, 4, 3.5, 5],
      apps: appLimits.map(a => ({ ...a, timeUsed: '14h 30m', limitPercent: Math.min(150, a.limitPercent * 3) }))
    }
  ][activeTab];

  // Determine animation direction based on tab selection
  const directionAnimation = activeTab > previousTab 
    ? SlideInRight.duration(300) 
    : SlideInLeft.duration(300);

  return (
    <Animated.ScrollView entering={FadeInDown.duration(400).springify()} className="flex-1 bg-[#FFFFFF]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-16 pb-6">
        <BarChart2 color="#F4B5A4" size={28} />
        <Text className="text-[#333333] font-bold text-2xl ml-3">Productivity Stats</Text>
      </View>

      {/* Selector Tabs (Day, Week, Month) */}
      <View className="flex-row mx-5 mb-6 bg-[#FAF0E6] border border-[#E5E7EB] rounded-2xl p-1.5 shadow-sm relative">
        <Animated.View 
          className="absolute left-1.5 top-1.5 bottom-1.5 bg-[#F4B5A4] rounded-xl shadow-md shadow-[#F4B5A4]/20"
          style={[
            animatedTabStyle, 
            { width: '33.33%' }
          ]}
        />
        
        {['Day', 'Week', 'Month'].map((tab, i) => (
          <Pressable 
            key={tab} 
            className="flex-1 items-center py-2.5 z-10"
            onPress={() => handleTabPress(i)}
            onLayout={(e) => {
              if (i === 0) tabWidth.value = e.nativeEvent.layout.width;
            }}
          >
            <Text className={activeTab === i ? "text-white font-bold text-base" : "text-[#666666] font-semibold text-base"}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Animated Content Wrapper */}
      <Animated.View key={activeTab} entering={FadeIn.duration(300)}>
        {/* Summary Stat Cards */}
        <View className="flex-row px-5 gap-x-4 mb-8">
          <View className="flex-1 bg-[#FAF0E6] border border-[#E5E7EB] rounded-3xl p-5 justify-between shadow-sm">
            <View className="flex-row items-center gap-x-1.5 mb-2">
              <Clock color="#F4B5A4" size={16} />
              <Text className="text-[#666666] text-sm font-medium">Focus Time</Text>
            </View>
            <Text className="text-[#333333] font-extrabold text-3xl">{currentData.focusTime}</Text>
            <Text className="text-[#F4B5A4] text-xs font-bold mt-2">{currentData.vs}</Text>
          </View>

          <View className="flex-1 bg-[#FAF0E6] border border-[#E5E7EB] rounded-3xl p-5 justify-between shadow-sm">
            <View className="flex-row items-center gap-x-1.5 mb-2">
              <TrendingUp color="#3b82f6" size={16} />
              <Text className="text-[#666666] text-sm font-medium">Efficiency</Text>
            </View>
            <Text className="text-[#333333] font-extrabold text-3xl">{currentData.efficiency}</Text>
            <Text className="text-[#3b82f6] text-xs font-bold mt-2">+4% focus depth</Text>
          </View>
        </View>

        {/* Chart Panel */}
        <View className="bg-[#FAF0E6] border border-[#E5E7EB] rounded-3xl p-6 mx-5 mb-8 shadow-sm">
          <Text className="text-[#333333] font-bold text-base mb-6 tracking-wider">
            {activeTab === 0 ? 'Daily Output' : activeTab === 1 ? 'Weekly Output' : 'Monthly Output'}
          </Text>
          <View className="h-40 flex-row items-end justify-between px-2">
            {currentData.chart.map((val, i) => (
              <View key={i} className="items-center w-8">
                <View 
                  className="w-4 bg-[#F4B5A4] rounded-t-full mb-3" 
                  style={{ height: val * 25 }}
                />
                <Text className="text-[#666666] text-xs font-bold">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Apps Time Limits List */}
        <View className="px-5 mb-16">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[#333333] font-bold text-lg tracking-wider">Device App Limits</Text>
            <View className="bg-[#EF4444]/10 border border-[#EF4444]/20 px-2.5 py-1 rounded-lg flex-row items-center gap-x-1">
              <Text className="text-[#EF4444] font-black text-xs">Active Blocking</Text>
            </View>
          </View>

          {currentData.apps.map((app) => {
            return (
              <View 
                key={app.id} 
                className={app.blocked 
                  ? "bg-[#FEF2F2] border p-4 rounded-3xl mb-4 flex-row items-center justify-between shadow-sm border-[#EF4444]/40" 
                  : "bg-[#FAF0E6] border p-4 rounded-3xl mb-4 flex-row items-center justify-between shadow-sm border-[#E5E7EB]"
                }
              >
                <View className="flex-row items-center flex-1 mr-4">
                  <View className="justify-center items-center mr-5">
                    <FontAwesome5 name={app.iconName} color={app.color} size={32} />
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-[#333333] font-bold text-base">{app.name}</Text>
                      <View className="flex-row items-center gap-x-1.5">
                        <Text className="text-[#666666] text-sm">{app.timeUsed}</Text>
                        <Text 
                          className="text-sm font-black"
                          style={{ color: app.limitPercent > 100 ? '#EF4444' : '#666666' }}
                        >
                          {app.limitPercent}%
                        </Text>
                      </View>
                    </View>
                    
                    {/* Progress Limit Bar */}
                    <View className="w-full h-1.5 bg-[#FFFFFF] rounded-full overflow-hidden border border-[#E5E7EB]">
                      <View 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${Math.min(app.limitPercent, 100)}%`,
                          backgroundColor: app.limitPercent > 100 ? '#EF4444' : app.color
                        }} 
                      />
                    </View>
                  </View>
                </View>

                {/* Block/Restrict toggle */}
                <View className="items-center justify-center">
                  <Text className="text-[11px] font-bold mb-1" style={{ color: app.blocked ? '#EF4444' : '#999999' }}>
                    {app.blocked ? 'Locked' : 'Active'}
                  </Text>
                  <Switch
                    value={app.blocked}
                    onValueChange={() => toggleBlock(app.id)}
                    trackColor={{ false: '#DDDDDD', true: '#F4B5A4' }}
                    thumbColor={app.blocked ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}
