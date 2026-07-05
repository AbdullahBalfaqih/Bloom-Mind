import { View, Text, Image, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ArrowRight, EyeOff, Home, ShieldCheck, Sprout, Sparkles, Trophy, ScanFace } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, SlideInRight, ZoomIn } from 'react-native-reanimated';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Notifications from 'expo-notifications';

type Step = 'launch1' | 'onboarding' | 'authSelection' | 'login' | 'signup' | 'forgotPassword' | 'resetPassword';

const ONBOARDING_SLIDES = [
  { id: 0, title: 'Privacy First', desc: 'Your data never leaves your device. BloomMind runs locally using On-Device AI for complete offline privacy.', icon: ShieldCheck },
  { id: 1, title: 'Focus to Grow', desc: 'Stay away from distractions. Your focus time plants seeds that grow into a beautiful virtual garden.', icon: Sprout },
  { id: 2, title: 'Intelligent Coach', desc: 'Your personal Gemma-powered AI coach analyzes your habits and guides you towards digital well-being.', icon: Sparkles },
  { id: 3, title: 'Build Habits', desc: 'Harvest your rewards, earn water drops, and stay consistent every single day to build a better you.', icon: Trophy }
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

  // Notification Permissions
  useEffect(() => {
    const requestPermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    };
    requestPermissions();
  }, []);

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

  const handleBiometricAuth = async () => {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();
      if (!isAvailable) {
        Alert.alert('Unsupported', 'Biometrics not supported on this device.');
        return;
      }
      
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Not Set Up', 'No biometrics enrolled on this device.');
        return;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login to Bloom mind',
        fallbackLabel: 'Use Password',
      });
      
      if (result.success) {
        handleLogin();
      }
    } catch (e) {
      console.log('Biometric auth error', e);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#FFFFFF]"
    >
      {/* 1. SOLID PEACH LAUNCH */}
      {step === 'launch1' && (
        <Animated.View entering={FadeIn} className="flex-1 bg-[#E29578] justify-center items-center">
          <Animated.View entering={ZoomIn.duration(800).springify()} className="items-center">
            <Home color="#FFFFFF" size={80} strokeWidth={1.5} />
            <Text className="text-white font-black text-4xl tracking-widest mt-4">Bloom mind</Text>
          </Animated.View>
        </Animated.View>
      )}

      {/* 2. ONBOARDING */}
      {step === 'onboarding' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-[#FFFFFF]">
          {/* Top Image Area */}
          <View className="w-full h-[55%] bg-[#FAF0E6] rounded-b-[40px] relative justify-center items-center">
            <Animated.View key={onboardingIndex} entering={FadeIn.duration(400)}>
              {(() => {
                const Icon = ONBOARDING_SLIDES[onboardingIndex].icon;
                return <Icon color="#E29578" size={120} strokeWidth={1.5} />;
              })()}
            </Animated.View>
            
            {/* Skip Button */}
            <Pressable onPress={handleSkip} className="absolute top-16 right-6 flex-row items-center pt-2 z-10">
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
              <Text className="text-[#E29578] font-bold text-3xl mb-4 text-center">
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
                    className={`h-1.5 rounded-full ${idx === onboardingIndex ? 'w-6 bg-[#E29578]' : 'w-2 bg-[#E29578]/30'}`}
                  />
                ))}
              </View>

              {/* Next Button */}
              <Pressable 
                onPress={handleNextOnboarding}
                className="bg-[#E29578] px-8 py-3.5 rounded-full shadow-sm"
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
          <Animated.View entering={ZoomIn.duration(800).springify()} className="items-center mb-16">
            <Home color="#E29578" size={80} strokeWidth={1.5} />
            <Text className="text-[#E29578] font-black text-4xl tracking-widest mt-4">Bloom mind</Text>
          </Animated.View>
          
          <Text className="text-[#999999] text-center text-sm leading-5 mb-10 px-4">
            Reclaim your time. Let our 100% Offline AI help you build a thriving digital sanctuary away from distractions.
          </Text>

          <Pressable 
            onPress={() => setStep('login')}
            className="w-full bg-[#E29578] py-4 rounded-full mb-4 shadow-sm items-center active:opacity-90"
          >
            <Text className="text-white font-bold text-lg">Log In</Text>
          </Pressable>
          
          <Pressable 
            onPress={() => setStep('signup')}
            className="w-full bg-[#FAF0E6] py-4 rounded-full shadow-sm items-center active:opacity-90"
          >
            <Text className="text-[#E29578] font-bold text-lg">Sign Up</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* 4. LOGIN SCREEN */}
      {step === 'login' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-white pt-16">
          <View className="px-8 flex-1">
            {/* Top Bar */}
            <View className="flex-row items-center mb-8">
              <Pressable onPress={() => setStep('authSelection')} className="p-2 -ml-2">
                <ArrowRight color="#333333" size={24} style={{ transform: [{ rotate: '180deg' }] }} />
              </Pressable>
              <Text className="flex-1 text-center text-[#E29578] font-black text-2xl mr-8">Log In</Text>
            </View>

            <View className="flex-1 justify-center pb-20">

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
              <View className="w-full flex-row items-center justify-center gap-x-4">
                <Pressable 
                  onPress={handleLogin}
                  className="bg-[#E29578] flex-1 h-14 rounded-full justify-center items-center active:opacity-90 shadow-sm"
                >
                  <Text className="text-white font-black text-xl tracking-wide">Log In</Text>
                </Pressable>

                <Pressable 
                  onPress={handleBiometricAuth}
                  className="bg-[#FAF0E6] w-14 h-14 rounded-full justify-center items-center active:opacity-90 shadow-sm border border-[#E29578]/20"
                >
                  <ScanFace color="#E29578" size={24} />
                </Pressable>
              </View>
              
              <Pressable onPress={() => setStep('forgotPassword')} className="mt-5">
                <Text className="text-[#333333] font-bold text-sm">Forgot Password?</Text>
              </Pressable>
            </View>
          </View>

              <View className="mt-8 items-center">
                <Text className="text-[#999999] text-sm mb-4">or log in with</Text>
                <View className="flex-row gap-x-4 mb-6">
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
                    <Text className="text-[#E29578] font-black text-sm">Sign Up</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* 5. SIGN UP SCREEN */}
      {step === 'signup' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-white pt-16">
          <View className="px-8 pb-4">
            {/* Top Bar */}
            <View className="flex-row items-center">
              <Pressable onPress={() => setStep('authSelection')} className="p-2 -ml-2">
                <ArrowRight color="#333333" size={24} style={{ transform: [{ rotate: '180deg' }] }} />
              </Pressable>
              <Text className="flex-1 text-center text-[#E29578] font-black text-2xl mr-8">Create Account</Text>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 40, paddingTop: 10, flexGrow: 1, justifyContent: 'center' }}>

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
                  className="bg-[#E29578] w-2/3 h-14 rounded-full justify-center items-center active:opacity-90 shadow-sm"
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
                  <Text className="text-[#E29578] font-black text-sm">Log in</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {/* 6. FORGOT PASSWORD */}
      {step === 'forgotPassword' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-[#121212] pt-16">
          <View className="px-8 flex-1">
            {/* Top Bar */}
            <View className="flex-row items-center mb-10">
              <Pressable onPress={() => setStep('login')} className="p-2 -ml-2">
                <ArrowRight color="#FFFFFF" size={24} style={{ transform: [{ rotate: '180deg' }] }} />
              </Pressable>
              <Text className="flex-1 text-center text-[#E29578] font-black text-xl mr-8 tracking-wide">Forgot Password</Text>
            </View>

            {/* Title & Subtitle */}
            <View className="mb-10">
              <Text className="text-white font-black text-2xl mb-3 tracking-wide">Reset Password?</Text>
              <Text className="text-[#CCCCCC] text-sm leading-6 font-medium">
                Enter the email address associated with your account. We will send you a secure link to reset your password.
              </Text>
            </View>
          </View>

          {/* Lower half with dark bg */}
          <View className="bg-[#1A1A1A] flex-[1.5] rounded-t-[40px] px-8 pt-12 items-center shadow-md">
            <View className="w-full mb-8">
              <Text className="text-white text-sm font-bold mb-3 ml-1">Enter Your Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@example.com"
                placeholderTextColor="#666666"
                className="w-full h-14 bg-[#252525] rounded-full px-6 text-white text-base font-medium shadow-sm border border-[#333333]"
                autoCapitalize="none"
              />
            </View>

            <Pressable 
              onPress={() => {
                if (!email.trim()) {
                  Alert.alert('Required', 'Please enter your email address to continue.');
                  return;
                }
                setStep('resetPassword');
              }}
              className="bg-[#E29578] w-2/3 h-14 rounded-full justify-center items-center active:opacity-90 shadow-sm"
            >
              <Text className="text-white font-bold text-lg tracking-wide">Next</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* 7. RESET PASSWORD */}
      {step === 'resetPassword' && (
        <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-[#121212] px-8 pt-16">
          {/* Top Bar */}
          <View className="flex-row items-center mb-10">
            <Pressable onPress={() => setStep('forgotPassword')} className="p-2 -ml-2">
              <ArrowRight color="#FFFFFF" size={24} style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <Text className="flex-1 text-center text-[#E29578] font-black text-xl mr-8 tracking-wide">Set Password</Text>
          </View>

          {/* Title & Subtitle */}
          <View className="mb-10">
            <Text className="text-white font-black text-2xl mb-3 tracking-wide">Change The Password</Text>
            <Text className="text-[#CCCCCC] text-sm leading-6 font-medium">
              Create a strong new password that you haven't used before to secure your account.
            </Text>
          </View>

          {/* Form inputs */}
          <View className="mb-6">
            <Text className="text-[#CCCCCC] font-bold text-sm mb-1.5 ml-1">Password</Text>
            <View className="w-full h-14 bg-[#252525] rounded-full px-5 flex-row items-center mb-5 border border-[#333333]">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#666666"
                secureTextEntry
                className="flex-1 text-white text-base font-medium h-full"
                autoCapitalize="none"
              />
              <EyeOff color="#666666" size={20} />
            </View>

            <Text className="text-[#CCCCCC] font-bold text-sm mb-1.5 ml-1">Confirm Password</Text>
            <View className="w-full h-14 bg-[#252525] rounded-full px-5 flex-row items-center mb-8 border border-[#333333]">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#666666"
                secureTextEntry
                className="flex-1 text-white text-base font-medium h-full"
                autoCapitalize="none"
              />
              <EyeOff color="#666666" size={20} />
            </View>

            <View className="items-center mt-2">
              <Pressable 
                onPress={() => {
                  if (!password || !confirmPassword) {
                    Alert.alert('Required', 'Please fill in all password fields.');
                    return;
                  }
                  if (password !== confirmPassword) {
                    Alert.alert('Mismatch', 'The passwords you entered do not match.');
                    return;
                  }
                  Alert.alert('Success', 'Password changed successfully!');
                  setStep('login');
                }}
                className="bg-[#E29578] w-2/3 h-14 rounded-full justify-center items-center active:opacity-90 shadow-sm"
              >
                <Text className="text-white font-bold text-lg tracking-wide">Reset Password</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}
