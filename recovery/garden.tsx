import { View, Text, Image, Pressable, ScrollView, Dimensions, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Audio } from 'expo-av';
import { 
  Leaf, Droplet, Smile, Heart, Coins, Axe, Hammer, Sprout, Flower, Plus, X, Sun, Cloud, Bird, Calendar, Moon
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, useAnimatedStyle, withSequence, withTiming, withDelay, withRepeat, runOnJS 
} from 'react-native-reanimated';

type ActiveTool = 'none' | 'scythe' | 'watering' | 'hoe' | 'seeds_tomato' | 'seeds_mint' | 'seeds_sunflower';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Garden() {
  const { plots, waterPoints, seeds, xp, harvested, plowPlot, plantSeed, waterPlant, harvestPlant } = useStore();
  
  const [activeTool, setActiveTool] = useState<ActiveTool>('hoe');
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  
  // HUD state
  const [energy, setEnergy] = useState(165);
  const maxEnergy = 165;
  
  // Animation states
  const [actionPlotId, setActionPlotId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'water' | 'plow' | 'plant' | 'harvest' | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; x: number; y: number; text: string; color: string }[]>([]);

  // Ambient animations
  const cloudX = useSharedValue(-100);
  const cloud2X = useSharedValue(-200);
  const birdX = useSharedValue(-50);
  const birdScale = useSharedValue(1);

  const startBirdFlight = () => {
    birdX.value = -50;
    birdScale.value = 1;
    birdX.value = withTiming(SCREEN_WIDTH + 50, { duration: 12000 }, (finished) => {
      if (finished) {
        birdScale.value = -1;
        birdX.value = withTiming(-50, { duration: 12000 }, (finished2) => {
          if (finished2) {
            runOnJS(startBirdFlight)();
          }
        });
      }
    });
  };

  useEffect(() => {
    cloudX.value = withRepeat(withTiming(SCREEN_WIDTH + 100, { duration: 30000 }), -1, false);
    cloud2X.value = withRepeat(withDelay(15000, withTiming(SCREEN_WIDTH + 100, { duration: 40000 })), -1, false);
    startBirdFlight();
  }, []);

  const playSound = async (action: 'plow' | 'plant' | 'water' | 'harvest') => {
    try {
      const urls = {
        plow: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
        plant: 'https://assets.mixkit.co/active_storage/sfx/1990/1990-84.wav',
        water: 'https://assets.mixkit.co/active_storage/sfx/2448/2448-84.wav',
        harvest: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav',
      };
      const { sound } = await Audio.Sound.createAsync({ uri: urls[action] }, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.log('Audio playback error:', err);
    }
  };

  const showFloatingText = (text: string, color: string) => {
    const id = Date.now().toString();
    setFloatingTexts(prev => [...prev, { id, x: 20, y: -20, text, color }]);
  };

  const handlePlotPress = (id: number) => {
    setSelectedPlotId(id);
    const plot = plots.find(p => p.id === id);
    if (!plot) return;

    if (!plot.isPloughed && activeTool === 'hoe') {
      if (energy < 2) {
        showFloatingText('No Energy!', '#EF4444');
        return;
      }
      setActionPlotId(id);
      setActionType('plow');
      playSound('plow');
      setEnergy(e => e - 2);
      setTimeout(() => {
        plowPlot(id);
        setActionPlotId(null);
        showFloatingText('-2 Energy', '#EF4444');
      }, 500);
    } else if (plot.isPloughed && !plot.plant && activeTool.startsWith('seeds_')) {
      const seedType = activeTool.replace('seeds_', '') as 'tomato' | 'mint' | 'sunflower';
      if (seeds[seedType] > 0) {
        setActionPlotId(id);
        setActionType('plant');
        playSound('plant');
        setTimeout(() => {
          plantSeed(id, seedType);
          setActionPlotId(null);
        }, 500);
      } else {
        showFloatingText('No seeds!', '#EF4444');
      }
    } else if (plot.isPloughed && plot.plant && plot.plant.stage !== 'mature' && activeTool === 'watering') {
      if (waterPoints > 0) {
        setActionPlotId(id);
        setActionType('water');
        playSound('water');
        setTimeout(() => {
          waterPlant(id);
          setActionPlotId(null);
        }, 500);
      } else {
        showFloatingText('No water!', '#3b82f6');
      }
    } else if (plot.isPloughed && plot.plant && plot.plant.stage === 'mature' && activeTool === 'scythe') {
      setActionPlotId(id);
      setActionType('harvest');
      playSound('harvest');
      setTimeout(() => {
        harvestPlant(id);
        setActionPlotId(null);
        showFloatingText('+100 G', '#FBBF24');
      }, 500);
    }
  };

  const getPlantImage = (stage: 'seed' | 'sprout' | 'growing' | 'mature') => {
    switch (stage) {
      case 'seed': return require('@/assets/images/real_sprout_nopot.png');
      case 'sprout': return require('@/assets/images/real_sprout_nopot.png');
      case 'growing': return require('@/assets/images/real_growing_nopot.png');
      case 'mature': return require('@/assets/images/real_mature_nopot.png');
    }
  };

  const cloud1Style = useAnimatedStyle(() => ({ transform: [{ translateX: cloudX.value }] }));
  const cloud2Style = useAnimatedStyle(() => ({ transform: [{ translateX: cloud2X.value }] }));
  const birdStyle = useAnimatedStyle(() => ({ transform: [{ translateX: birdX.value }, { translateY: 80 }, { scaleX: birdScale.value }] }));

  return (
    <View className="flex-1 bg-[#86C053]">
      {/* Sky */}
      <View className="absolute top-0 left-0 right-0 h-40 bg-[#63B4F5] z-0" />
      <Animated.View style={[cloud1Style]} className="absolute top-6 left-0 opacity-80">
        <Cloud color="#ffffff" fill="#ffffff" size={40} />
      </Animated.View>
      <Animated.View style={[cloud2Style]} className="absolute top-16 left-0 opacity-60">
        <Cloud color="#ffffff" fill="#ffffff" size={30} />
      </Animated.View>
      <Animated.View style={[birdStyle]} className="absolute left-0">
        <Bird color="#1E1E1E" size={24} />
      </Animated.View>
      <View className="absolute top-10 right-10">
        <Sun color="#FBBF24" fill="#FBBF24" size={48} />
      </View>
      
      {/* HUD: Top Left Energy */}
      <View className="absolute top-12 left-4 z-20 bg-[#FFFBEA] border-2 border-[#D97706] rounded-full px-3 py-1.5 flex-row items-center shadow-md">
        <Heart color="#EF4444" fill="#EF4444" size={20} />
        <View className="ml-2 w-24 h-3 bg-[#E5E7EB] rounded-full overflow-hidden border border-[#D1D5DB]">
          <View className="h-full bg-[#EF4444]" style={{ width: `${(energy / maxEnergy) * 100}%` }} />
        </View>
        <Text className="ml-2 font-bold text-[#D97706] text-xs">{energy}</Text>
      </View>

      {/* HUD: Top Right Gold & Time */}
      <View className="absolute top-12 right-4 z-20 items-end">
        <View className="bg-[#FFFBEA] border-2 border-[#D97706] rounded-full px-3 py-1 flex-row items-center shadow-md mb-2">
          <Coins color="#F59E0B" fill="#F59E0B" size={16} />
          <Text className="ml-1 font-black text-[#D97706] text-sm">{(xp * 10).toLocaleString()} G</Text>
        </View>
        <View className="bg-[#8B5A2B] border-2 border-[#5C3A21] rounded-lg p-2 shadow-md items-center">
          <Text className="font-bold text-white text-[10px] uppercase">Spring 14</Text>
          <View className="flex-row items-center mt-1">
            <Calendar color="#FFF" size={12} />
            <Text className="font-black text-[#FDE047] text-xs ml-1">08:00 AM</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 mt-32 z-10" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="items-center px-4">
          <View className="w-full bg-[#654321] p-4 rounded-xl border-4 border-[#3E2723] shadow-lg flex-row flex-wrap justify-between">
            {plots.map((plot) => {
              const isSelected = selectedPlotId === plot.id;
              return (
                <Pressable
                  key={plot.id}
                  onPress={() => handlePlotPress(plot.id)}
                  className={`w-[48%] aspect-square mb-4 border-4 rounded-lg relative overflow-hidden justify-center items-center ${
                    isSelected ? 'border-white' : 'border-[#4E342E]'
                  } ${
                    plot.isPloughed ? 'bg-[#5D4037]' : 'bg-[#81C784]'
                  }`}
                >
                  {!plot.isPloughed ? (
                    <Text className="text-[#388E3C] font-black text-xs">Wild Soil</Text>
                  ) : plot.plant ? (
                    <View className="items-center">
                      <Image source={getPlantImage(plot.plant.stage)} className="w-16 h-16" resizeMode="contain" />
                      <View className="bg-black/50 px-2 py-0.5 rounded-full mt-1">
                        <Text className="text-white font-bold text-[8px] uppercase">{plot.plant.type}</Text>
                      </View>
                    </View>
                  ) : (
                    <Text className="text-[#3E2723] font-bold text-sm opacity-50">Ready</Text>
                  )}

                  {/* Overlays */}
                  {actionPlotId === plot.id && actionType === 'water' && (
                    <View className="absolute inset-0 bg-blue-500/30 justify-center items-center">
                      <Droplet color="#3B82F6" fill="#3B82F6" size={24} />
                    </View>
                  )}
                  {actionPlotId === plot.id && actionType === 'plow' && (
                    <View className="absolute inset-0 bg-yellow-500/30 justify-center items-center">
                      <Hammer color="#EAB308" fill="#EAB308" size={24} />
                    </View>
                  )}
                  
                  {floatingTexts.map(t => (
                    <FloatingText 
                      key={t.id} 
                      x={t.x} 
                      y={t.y} 
                      text={t.text} 
                      color={t.color} 
                      onComplete={() => setFloatingTexts(prev => prev.filter(p => p.id !== t.id))} 
                    />
                  ))}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* TOOLBELT HUD */}
      <View className="absolute bottom-6 left-0 right-0 items-center z-30" pointerEvents="box-none">
        <View className="bg-[#8B5A2B] border-4 border-[#5C3A21] rounded-2xl p-2 flex-row shadow-xl">
          <ToolButton 
            icon={<Hammer color={activeTool === 'hoe' ? '#FFF' : '#EAB308'} size={24} />} 
            isActive={activeTool === 'hoe'} 
            onPress={() => setActiveTool('hoe')} 
          />
          <ToolButton 
            icon={<Droplet color={activeTool === 'watering' ? '#FFF' : '#3B82F6'} size={24} />} 
            isActive={activeTool === 'watering'} 
            onPress={() => setActiveTool('watering')} 
            badge={waterPoints} 
          />
          <ToolButton 
            icon={<Axe color={activeTool === 'scythe' ? '#FFF' : '#619B36'} size={24} />} 
            isActive={activeTool === 'scythe'} 
            onPress={() => setActiveTool('scythe')} 
          />
          
          <View className="w-1 bg-[#5C3A21] mx-1 rounded-full" />
          
          <ToolButton 
            icon={<Sprout color={activeTool === 'seeds_tomato' ? '#FFF' : '#EF4444'} size={24} />} 
            isActive={activeTool === 'seeds_tomato'} 
            onPress={() => setActiveTool('seeds_tomato')} 
            badge={seeds.tomato} 
          />
          <ToolButton 
            icon={<Leaf color={activeTool === 'seeds_mint' ? '#FFF' : '#10B981'} size={24} />} 
            isActive={activeTool === 'seeds_mint'} 
            onPress={() => setActiveTool('seeds_mint')} 
            badge={seeds.mint} 
          />
        </View>
      </View>
    </View>
  );
}

function ToolButton({ icon, isActive, onPress, badge }: { icon: any, isActive: boolean, onPress: () => void, badge?: number }) {
  return (
    <Pressable 
      onPress={onPress}
      className={`w-14 h-14 rounded-xl m-1 justify-center items-center border-2 ${
        isActive ? 'bg-[#D97706] border-[#FDE047]' : 'bg-[#5C3A21] border-[#3E2723]'
      }`}
    >
      {icon}
      {badge !== undefined && (
        <View className="absolute -top-2 -right-2 bg-red-500 border-2 border-white rounded-full min-w-[20px] h-5 justify-center items-center px-1">
          <Text className="text-white font-black text-[10px]">{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

function FloatingText({ text, x, y, color, onComplete }: { text: string, x: number, y: number, color: string, onComplete: () => void }) {
  const animatedY = useSharedValue(y);
  const opacity = useSharedValue(1);

  useEffect(() => {
    animatedY.value = withTiming(y - 40, { duration: 800 });
    opacity.value = withTiming(0, { duration: 800 }, (finished) => {
      if (finished) {
        runOnJS(onComplete)();
      }
    });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: animatedY.value }, { translateX: x }],
    opacity: opacity.value
  }));

  return (
    <Animated.Text 
      className="absolute font-black text-sm z-50 drop-shadow-md" 
      style={[{ color }, style]}
    >
      {text}
    </Animated.Text>
  );
}
