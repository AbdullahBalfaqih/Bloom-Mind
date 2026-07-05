import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Send, Sparkles } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { useMemoryEngine } from '../../ai/memory';
import { LocalGemmaProvider } from '../../ai/providers';

const gemma = new LocalGemmaProvider();

export default function Coach() {
  const chatHistory = useMemoryEngine(state => state.chatHistory);
  const addMessage = useMemoryEngine(state => state.addMessage);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatHistory]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input.trim();
    addMessage({ text: userText, sender: 'user' });
    setInput('');
    setIsTyping(true);
    
    try {
      // Pass the message and history to the on-device Gemma simulation
      const responseText = await gemma.chat(userText, chatHistory);
      addMessage({ text: responseText, sender: 'ai' });
    } catch (error) {
      console.error('Local Gemma Error:', error);
      addMessage({ text: "I'm having trouble thinking right now. Let's just focus for 10 minutes!", sender: 'ai' });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#FFFFFF]"
    >
      {/* Premium Header */}
      <View className="flex-row items-center px-6 pt-16 pb-5 border-b border-[#F5F5F5] bg-[#FFFFFF]">
        <View className="w-12 h-12 bg-[#E29578]/10 rounded-2xl items-center justify-center mr-4">
          <Sparkles color="#E29578" size={24} />
        </View>
        <View className="flex-1">
          <Text className="text-[#333333] font-black text-xl tracking-wide">AI Coach</Text>
          <View className="flex-row items-center gap-x-1.5 mt-1">
            <View className="w-2 h-2 bg-[#86C053] rounded-full" />
            <Text className="text-[#999999] text-[11px] font-bold uppercase tracking-widest">Online</Text>
          </View>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} className="flex-1 px-5 pt-6 bg-[#FAFAFA]" showsVerticalScrollIndicator={false}>
        {chatHistory.map((msg) => (
          <View 
            key={msg.id} 
            className={`mb-4 max-w-[85%] rounded-3xl p-5 shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-[#E29578] self-end rounded-br-sm' 
                : 'bg-[#FFFFFF] border border-[#EEEEEE] self-start rounded-bl-sm'
            }`}
          >
            <Text className={`text-sm leading-6 font-medium ${msg.sender === 'user' ? 'text-white' : 'text-[#333333]'}`}>{msg.text}</Text>
          </View>
        ))}
        {isTyping && (
          <View className="bg-[#FFFFFF] border border-[#EEEEEE] self-start rounded-3xl rounded-bl-sm p-4 mb-4 flex-row items-center gap-x-3 shadow-sm">
            <ActivityIndicator size="small" color="#E29578" />
            <Text className="text-[#999999] text-xs font-bold">Coach is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input container */}
      <View className="px-5 py-5 border-t border-[#F5F5F5] flex-row items-center bg-[#FFFFFF]">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask your coach anything..."
          placeholderTextColor="#BBBBBB"
          className="flex-1 bg-[#FAF0E6] text-[#333333] border border-[#EEEEEE] rounded-full px-6 py-4 mr-3 text-sm font-medium focus:border-[#E29578]/50"
          onSubmitEditing={handleSend}
        />
        <Pressable 
          onPress={handleSend}
          className="w-14 h-14 bg-[#E29578] rounded-full justify-center items-center active:opacity-90 shadow-sm"
        >
          <Send color="white" size={20} style={{ marginLeft: 3 }} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
