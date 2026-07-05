import { View, Text, Pressable, ScrollView, Animated as RNAnimated, LayoutAnimation } from 'react-native';
import { ArrowLeft, Bell, Leaf, Sparkles, Trophy, Clock, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import Animated, { FadeInDown, SlideInRight, FadeOut } from 'react-native-reanimated';

type NotificationType = 'focus' | 'garden' | 'coach' | 'achievement';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Focus Goal Reached! 🎉',
    message: 'You have successfully completed 5 hours of focus today. Your garden is thriving!',
    time: '2m ago',
    type: 'focus',
    isRead: false,
  },
  {
    id: '2',
    title: 'Your Plants Need Water 💧',
    message: 'It\'s been a while since your last focus session. Start now to keep your plants healthy.',
    time: '1h ago',
    type: 'garden',
    isRead: false,
  },
  {
    id: '3',
    title: 'Coach Tip of the Day 💡',
    message: 'Try the Pomodoro technique for your next task: 25 mins work, 5 mins break.',
    time: '3h ago',
    type: 'coach',
    isRead: true,
  },
  {
    id: '4',
    title: 'New Achievement Unlocked! 🏆',
    message: 'You earned the "Focus Master" badge for a 7-day streak.',
    time: 'Yesterday',
    type: 'achievement',
    isRead: true,
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAllAsRead = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleRemoveNotification = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIconForType = (type: NotificationType, isRead: boolean) => {
    const color = isRead ? '#999999' : '#E29578';
    switch (type) {
      case 'focus': return <Clock color={color} size={20} />;
      case 'garden': return <Leaf color={color} size={20} />;
      case 'coach': return <Sparkles color={color} size={20} />;
      case 'achievement': return <Trophy color={color} size={20} />;
      default: return <Bell color={color} size={20} />;
    }
  };

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-16 pb-4 bg-[#FFFFFF] border-b border-[#F0F0F0] shadow-sm z-10">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-[#F5F5F5]">
          <ArrowLeft color="#333333" size={24} />
        </Pressable>
        <Text className="text-[#333333] font-black text-xl tracking-wide">Notifications</Text>
        <Pressable onPress={handleMarkAllAsRead} className="p-2 -mr-2">
          <Text className="text-[#E29578] font-bold text-sm">Read All</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <Animated.View entering={FadeInDown} className="flex-1 items-center justify-center pt-32">
            <View className="w-24 h-24 bg-[#E29578]/10 rounded-full items-center justify-center mb-6">
              <Bell color="#E29578" size={40} opacity={0.8} />
            </View>
            <Text className="text-[#333333] font-black text-xl mb-2">All Caught Up!</Text>
            <Text className="text-[#999999] text-center font-medium">You have no new notifications.</Text>
          </Animated.View>
        ) : (
          notifications.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={SlideInRight.delay(index * 100).duration(400).springify()}
              exiting={FadeOut}
              className={`flex-row items-start p-4 mb-3 rounded-2xl border ${
                item.isRead 
                  ? 'bg-[#FFFFFF] border-[#EEEEEE]' 
                  : 'bg-[#FAF0E6] border-[#E29578]/30 shadow-sm'
              }`}
            >
              {/* Icon */}
              <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                item.isRead ? 'bg-[#F5F5F5]' : 'bg-[#FFFFFF] shadow-sm'
              }`}>
                {getIconForType(item.type, item.isRead)}
              </View>

              {/* Text Content */}
              <View className="flex-1 mr-2">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className={`font-bold text-base flex-1 mr-2 ${item.isRead ? 'text-[#666666]' : 'text-[#333333]'}`}>
                    {item.title}
                  </Text>
                  <Text className="text-[#999999] text-xs font-semibold mt-1">{item.time}</Text>
                </View>
                <Text className={`text-sm leading-5 ${item.isRead ? 'text-[#999999]' : 'text-[#666666]'}`}>
                  {item.message}
                </Text>
              </View>

              {/* Close Button */}
              <Pressable 
                onPress={() => handleRemoveNotification(item.id)}
                className="p-1 -mr-1 -mt-1 rounded-full active:bg-[#00000010]"
              >
                <X color="#BBBBBB" size={16} />
              </Pressable>
            </Animated.View>
          ))
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
