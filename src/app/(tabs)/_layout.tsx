import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Leaf, BarChart2, MessageSquare, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80, // A bit taller to comfortably fit the line below
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#333333',
        tabBarInactiveTintColor: '#E29578',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full">
              <Home color={color} size={28} strokeWidth={focused ? 2 : 1.5} />
              {focused && (
                <View className="absolute -bottom-3 w-10 h-[2px] bg-[#333333] rounded-full" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full">
              <Leaf color={color} size={28} strokeWidth={focused ? 2 : 1.5} />
              {focused && (
                <View className="absolute -bottom-3 w-10 h-[2px] bg-[#333333] rounded-full" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full">
              <BarChart2 color={color} size={28} strokeWidth={focused ? 2 : 1.5} />
              {focused && (
                <View className="absolute -bottom-3 w-10 h-[2px] bg-[#333333] rounded-full" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full">
              <MessageSquare color={color} size={28} strokeWidth={focused ? 2 : 1.5} />
              {focused && (
                <View className="absolute -bottom-3 w-10 h-[2px] bg-[#333333] rounded-full" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center h-full">
              <User color={color} size={28} strokeWidth={focused ? 2 : 1.5} />
              {focused && (
                <View className="absolute -bottom-3 w-10 h-[2px] bg-[#333333] rounded-full" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
