import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Send, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { getCoachResponse } from '../../ai/engine';

export default function Coach() {
  const [messages, setMessages] = useState([
    { id: '1', text: "كيف يمكنني تقليل استخدام وسائل التواصل الاجتماعي؟", sender: 'user' },
    { id: '2', text: "ابدأ بتحديد فترات تركيز صغيرة مدتها 25 دقيقة (تقنية البومودورو). المزرعة السعيدة تحتاج رعاية مستمرة، واكتسابك لقطرات المياه يأتي من إتمام جلسات التركيز هذه. دعنا نحدد هدفاً اليوم!", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Pass the message and history to Gemini API
      const responseText = await getCoachResponse(userMsg.text, messages);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai' }]);
    } catch (error) {
      console.log('Gemini Coach error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#0F0B15]"
    >
      {/* Premium Header */}
      <View className="flex-row items-center px-5 pt-16 pb-4 border-b border-[#252529] bg-[#1C1A22]/50">
        <Sparkles color="#619B36" size={24} />
        <View className="ml-4 flex-1">
          <Text className="text-white font-bold text-lg">BloomMind AI Coach</Text>
          <View className="flex-row items-center gap-x-1 mt-0.5">
            <View className="w-1.5 h-1.5 bg-[#619B36] rounded-full" />
            <Text className="text-[#8D8B91] text-[10px] font-semibold uppercase tracking-wider">Online Coach</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            className={`mb-4 max-w-[85%] rounded-2xl p-4 shadow-md ${
              msg.sender === 'user' 
                ? 'bg-[#1C1A22] border border-[#252529] self-end rounded-br-sm' 
                : 'bg-[#619B36]/10 border border-[#619B36]/20 self-start rounded-bl-sm'
            }`}
          >
            <Text className="text-white text-sm leading-6">{msg.text}</Text>
          </View>
        ))}
        {isTyping && (
          <View className="bg-[#619B36]/10 border border-[#619B36]/20 self-start rounded-2xl rounded-bl-sm p-4 mb-4 flex-row items-center gap-x-2">
            <ActivityIndicator size="small" color="#619B36" />
            <Text className="text-[#8D8B91] text-xs">المدرب يفكر...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input container */}
      <View className="px-5 py-5 border-t border-[#252529] flex-row items-center bg-[#0F0B15]">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="اسأل المدرب أي شيء عن التركيز..."
          placeholderTextColor="#8D8B91"
          className="flex-1 bg-[#1C1A22] text-white border border-[#252529] rounded-2xl px-5 py-3.5 mr-3 text-sm focus:border-[#619B36]/50"
          onSubmitEditing={handleSend}
        />
        <Pressable 
          onPress={handleSend}
          className="w-12 h-12 bg-[#619B36] rounded-2xl justify-center items-center active:opacity-90 shadow-lg shadow-[#619B36]/20"
        >
          <Send color="white" size={16} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
