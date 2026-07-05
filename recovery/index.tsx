import { View, Text, Image, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ArrowRight, EyeOff, Home } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';

type Step = 'launch1' | 'onboarding' | 'authSelection' | 'login' | 'signup';

const ONBOARDING_SLIDES = [
  { id: 0, title: 'Comfortable Space', desc: 'Create your perfect digital sanctuary away from distractions and achieve your goals.' },
  { id: 1, title: 'Modern Design', desc: 'Plant seeds of productivity and watch them grow into a beautiful virtual garden.' },
  { id: 2, title: 'Styled Living', desc: 'Your personal AI coach guides you through your daily tasks and challenges.' },
  { id: 3, title: 'Relaxing Furniture', desc: 'Harvest your rewards and stay consistent every single day to build a better you.' }
];

export default function Root() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('launch1');
  const [onboardingIndex, setOnboardingIndex] = useState(0);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Auto transition from solid peach launch to onboarding
  useEffect(() => {
    if (step === 'launch1') {
      const timer = setTimeout(() => {
        setStep('onboarding');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNextOnboarding = () => {
    if (onboardingIndex < ONBOARDING_SLIDES.length - 1) {
      setOnboardingIndex(prev => prev + 1);
    } else {
      setStep('authSelection');
    }
  };

  const handleSkip = () => {
    setStep('authSelection');
  };

  const handleLogin = () => {
    router.replace('/(tabs)/home');
  };

  const handleSignUp = () => {
    setStep('login');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#FFFFFF]"
    >
      {/* 1. SOLID PEACH LAUNCH */}
      {step === 'launch1' && (
        <Animated.View entering={FadeIn} className="flex-1 bg-[#F4B5A4] justify-center items-center">
          <View className="items-center">
            <Home color="#FFFFFF" size={80} strokeWidth={1.5} />
            <Text className="text-white font-black text-4xl tracking-widest mt-4">BLOOM</Text>
            <Text className="text-white font-black text-4xl tracking-widest">MIND</Text>
          </View>
        </Animated.View>
      )}

      {/* 2. ONBOARDING */}
      {step === 'onboarding' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-[#FFFFFF]">
          {/* Top Image Area */}
          <View className="w-full h-[55%] bg-[#FAF0E6] rounded-b-[40px] overflow-hidden relative">
            <Image 
              source={require('@/assets/images/realistic_garden_bg.png')} 
              className="w-full h-full opacity-60"
              resizeMode="cover"
            />
            {/* Skip Button */}
            <Pressable onPress={handleSkip} className="absolute top-16 right-6 flex-row items-center pt-2">
              <Text className="text-[#666666] font-medium mr-1 text-base">Skip</Text>
              <ArrowRight color="#666666" size={16} />
            </Pressable>
          </View>

          {/* Bottom Content Area */}
          <View className="flex-1 px-8 pt-10 pb-12 justify-between">
            <Animated.View 
              key={onboardingIndex} 
              entering={SlideInRight.duration(300)} 
              className="items-center"
            >
              <Text className="text-[#F4B5A4] font-bold text-3xl mb-4 text-center">
                {ONBOARDING_SLIDES[onboardingIndex].title}
              </Text>
              <Text className="text-[#999999] text-center text-base leading-6 px-4">
                {ONBOARDING_SLIDES[onboardingIndex].desc}
              </Text>
            </Animated.View>

            {/* Pagination & Next Button */}
            <View className="flex-row justify-between items-center w-full">
              {/* Dots */}
              <View className="flex-row items-center gap-x-1.5">
                {ONBOARDING_SLIDES.map((_, idx) => (
                  <View 
                    key={idx} 
                    className={`h-1.5 rounded-full ${idx === onboardingIndex ? 'w-6 bg-[#F4B5A4]' : 'w-2 bg-[#F4B5A4]/30'}`}
                  />
                ))}
              </View>

              {/* Next Button */}
              <Pressable 
                onPress={handleNextOnboarding}
                className="bg-[#F4B5A4] px-8 py-3.5 rounded-full shadow-sm"
              >
                <Text className="text-white font-bold text-base">
                  {onboardingIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}

      {/* 3. AUTH SELECTION (White Background Launch) */}
      {step === 'authSelection' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-[#FFFFFF] justify-center items-center px-10">
          <View className="items-center mb-16">
            <Home color="#F4B5A4" size={80} strokeWidth={1.5} />
            <Text className="text-[#F4B5A4] font-black text-4xl tracking-widest mt-4">BLOOM</Text>
            <Text className="text-[#F4B5A4] font-black text-4xl tracking-widest">MIND</Text>
          </View>
          
          <Text className="text-[#999999] text-center text-sm leading-5 mb-10 px-4">
            Create your perfect digital sanctuary away from distractions and achieve your goals.
          </Text>

          <Pressable 
            onPress={() => setStep('login')}
            className="w-full bg-[#F4B5A4] py-4 rounded-full mb-4 shadow-sm items-center active:opacity-90"
          >
            <Text className="text-white font-bold text-lg">Log In</Text>
          </Pressable>
          
          <Pressable 
            onPress={() => setStep('signup')}
            className="w-full bg-[#FAF0E6] py-4 rounded-full shadow-sm items-center active:opacity-90"
          >
            <Text className="text-[#F4B5A4] font-bold text-lg">Sign Up</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* 4. LOGIN SCREEN */}
      {step === 'login' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-white px-8 pt-16">
          {/* Top Bar */}
          <View className="flex-row items-center mb-10">
            <Pressable onPress={() => setStep('authSelection')} className="p-2 -ml-2">
              <ArrowRight color="#333333" size={24} style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <Text className="flex-1 text-center text-[#F4B5A4] font-black text-2xl mr-8">Log In</Text>
          </View>

          {/* Welcome Text */}
          <View className="mb-10">
            <Text className="text-[#333333] font-black text-3xl mb-1">Welcome</Text>
            <Text className="text-[#666666] text-base">Please enter your details to proceed.</Text>
          </View>

          {/* Form inputs */}
          <View className="mb-8">
            <Text className="text-[#666666] text-sm font-bold mb-2 ml-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
              placeholderTextColor="#DCBEB6"
              className="w-full h-14 bg-[#FAF0E6] rounded-full px-5 text-[#333333] text-base mb-5 font-medium"
              autoCapitalize="none"
            />

            <Text className="text-[#666666] text-sm font-bold mb-2 ml-1">Password</Text>
            <View className="w-full h-14 bg-[#FAF0E6] rounded-full px-5 flex-row items-center mb-4">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#DCBEB6"
                secureTextEntry
                className="flex-1 text-[#333333] text-base font-medium h-full"
                autoCapitalize="none"
              />
              <EyeOff color="#DCBEB6" size={20} />
            </View>

            <View className="items-center mt-6">
              <Pressable 
                onPress={handleLogin}
                className="bg-[#F4B5A4] w-2/3 h-14 rounded-full justify-center items-center active:opacity-90 shadow-sm"
              >
                <Text className="text-white font-black text-xl tracking-wide">Log In</Text>
              </Pressable>
              
              <Pressable className="mt-4">
                <Text className="text-[#333333] font-bold text-sm">Forgot Password?</Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-1 justify-end pb-12 items-center">
            <Text className="text-[#999999] text-sm mb-4">or log in with</Text>
            <View className="flex-row gap-x-4 mb-8">
              <View className="w-10 h-10 rounded-full border border-[#DDDDDD] justify-center items-center">
                <Text className="font-bold text-[#666666]">f</Text>
              </View>
              <View className="w-10 h-10 rounded-full border border-[#DDDDDD] justify-center items-center">
                <Text className="font-bold text-[#666666]">G</Text>
              </View>
            </View>
            
            <View className="flex-row justify-center items-center">
              <Text className="text-[#999999] text-sm mr-1">Don't have an account?</Text>
              <Pressable onPress={() => setStep('signup')}>
                <Text className="text-[#F4B5A4] font-black text-sm">Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}

      {/* 5. SIGN UP SCREEN */}
      {step === 'signup' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-white px-8 pt-16">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Top Bar */}
            <View className="flex-row items-center mb-8">
              <Pressable onPress={() => setStep('authSelection')} className="p-2 -ml-2">
                <ArrowRight color="#333333" size={24} style={{ transform: [{ rotate: '180deg' }] }} />
              </Pressable>
              <Text className="flex-1 text-center text-[#F4B5A4] font-black text-2xl mr-8">Create Account</Text>
            </View>

            {/* Form inputs */}
            <View className="mb-6">
              <Text className="text-[#666666] font-bold text-sm mb-1.5 ml-1">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Example Name"
                placeholderTextColor="#DCBEB6"
                className="w-full h-14 bg-[#FAF0E6] rounded-full px-5 text-[#333333] text-base mb-4 font-medium"
              />

              <Text className="text-[#666666] font-bold text-sm mb-1.5 ml-1">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@example.com"
                placeholderTextColor="#DCBEB6"
                className="w-full h-14 bg-[#FAF0E6] rounded-full px-5 text-[#333333] text-base mb-4 font-medium"
                autoCapitalize="none"
              />

              <Text className="text-[#666666] font-bold text-sm mb-1.5 ml-1">Password</Text>
              <View className="w-full h-14 bg-[#FAF0E6] rounded-full px-5 flex-row items-center mb-6">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#DCBEB6"
                  secureTextEntry
                  className="flex-1 text-[#333333] text-base font-medium h-full"
                  autoCapitalize="none"
                />
                <EyeOff color="#DCBEB6" size={20} />
              </View>

              <View className="items-center px-4 mb-4 mt-2">
                <Text className="text-[#333333] text-xs text-center mb-4">
                  By continuing, you agree to{'\n'}<Text className="font-bold">Terms of Use</Text> and <Text className="font-bold">Privacy Policy.</Text>
                </Text>
                <Pressable 
                  onPress={handleSignUp}
                  className="bg-[#F4B5A4] w-2/3 h-14 rounded-full justify-center items-center active:opacity-90 shadow-sm"
                >
                  <Text className="text-white font-black text-xl tracking-wide">Sign Up</Text>
                </Pressable>
              </View>
            </View>

            <View className="items-center">
              <Text className="text-[#999999] text-sm mb-3">or sign up with</Text>
              <View className="flex-row gap-x-4 mb-6">
                <View className="w-10 h-10 rounded-full border border-[#DDDDDD] justify-center items-center">
                  <Text className="font-bold text-[#666666]">f</Text>
                </View>
                <View className="w-10 h-10 rounded-full border border-[#DDDDDD] justify-center items-center">
                  <Text className="font-bold text-[#666666]">G</Text>
                </View>
              </View>
              
              <View className="flex-row justify-center items-center">
                <Text className="text-[#999999] text-sm mr-1">Already have an account?</Text>
                <Pressable onPress={() => setStep('login')}>
                  <Text className="text-[#F4B5A4] font-black text-sm">Log in</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}
