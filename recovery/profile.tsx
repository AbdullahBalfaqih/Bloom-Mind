import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { ArrowLeft, Edit2, User, Leaf, BarChart2, Trophy, ShieldCheck, Bell, Settings, HelpCircle, LogOut, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';

export default function Profile() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!isFocused) return <View className="flex-1 bg-white" />;

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      <Animated.ScrollView entering={FadeInDown.duration(400).springify()} className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-16 pb-4">
          <Pressable onPress={() => router.back()}>
            <ArrowLeft color="#333333" size={24} />
          </Pressable>
          <Text className="text-[#E29578] font-bold text-xl tracking-wide">My Profile</Text>
          <Pressable>
            <Edit2 color="#E29578" size={22} />
          </Pressable>
        </View>

        {/* Profile Info */}
        <View className="items-center mt-4 mb-6">
          <View className="w-28 h-28 rounded-full bg-[#FAF0E6] mb-4 overflow-hidden border border-[#E29578]/30 items-center justify-center">
             <User color="#E29578" size={48} />
          </View>
          <Text className="text-[#333333] font-black text-2xl mb-1 tracking-wide">Abdullah Balfaqih</Text>
          <Text className="text-[#999999] text-sm font-medium">ID: 25030024</Text>
        </View>

        {/* Quick Actions (Darker Peach Box) */}
        <View className="flex-row mx-6 bg-[#E29578] rounded-2xl py-5 mb-10 shadow-sm">
          <View className="flex-1 items-center justify-center border-r border-[#FFFFFF]/40">
            <BarChart2 color="#333333" size={28} strokeWidth={1.5} className="mb-2" />
            <Text className="text-[#333333] text-xs font-semibold">Focus Stats</Text>
          </View>
          <View className="flex-1 items-center justify-center border-r border-[#FFFFFF]/40">
            <Leaf color="#333333" size={28} strokeWidth={1.5} className="mb-2" />
            <Text className="text-[#333333] text-xs font-semibold">My Garden</Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Trophy color="#333333" size={28} strokeWidth={1.5} className="mb-2" />
            <Text className="text-[#333333] text-xs font-semibold">Achievements</Text>
          </View>
        </View>

        {/* Menu List */}
        <View className="px-6 pb-12">
          <MenuItem icon={<User color="#333333" size={20} />} title="Account Details" />
          <MenuItem icon={<Globe color="#333333" size={20} />} title="Language" />
          <MenuItem icon={<Bell color="#333333" size={20} />} title="Notifications" />
          <MenuItem icon={<Settings color="#333333" size={20} />} title="Settings" />
          <MenuItem icon={<ShieldCheck color="#333333" size={20} />} title="Privacy Policy" />
          <MenuItem icon={<HelpCircle color="#333333" size={20} />} title="Help" />
          <MenuItem 
            icon={<LogOut color="#333333" size={20} />} 
            title="Logout" 
            onPress={() => setShowLogoutModal(true)} 
          />
        </View>
      </Animated.ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View className="w-full bg-white rounded-3xl p-6 pt-8 pb-4 items-center">
            <Text className="text-[#333333] font-bold text-lg mb-8 text-center tracking-wide">
              Are you sure you want to log out?
            </Text>
            
            <View className="flex-row w-full justify-between gap-x-4 mb-8">
              <Pressable 
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 bg-[#E29578] py-3.5 rounded-full items-center active:opacity-80"
              >
                <Text className="text-white font-bold text-base">Cancel</Text>
              </Pressable>
              
              <Pressable 
                onPress={handleLogout}
                className="flex-1 bg-[#FAF0E6] py-3.5 rounded-full items-center active:opacity-80"
              >
                <Text className="text-[#E29578] font-bold text-base opacity-70">Log Out</Text>
              </Pressable>
            </View>
            
            <View className="w-full h-[1px] bg-[#E29578]/20" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MenuItem({ icon, title, onPress }: { icon: any, title: string, onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center mb-6 active:opacity-70">
      <View className="w-12 h-12 rounded-full bg-[#E29578]/40 items-center justify-center mr-4">
        {icon}
      </View>
      <Text className="text-[#333333] text-base font-semibold flex-1 tracking-wide">{title}</Text>
    </Pressable>
  );
}