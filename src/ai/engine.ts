export interface Insight {
  title: string;
  message: string;
  actionable: boolean;
}

const GEMINI_API_KEY = "AIzaSyCsaiQzQuqbL7H5ppMaRr_gyOQEx91cwx8";

export const getFocusInsight = (recentSessions: any[]): Insight => {
  if (!recentSessions || recentSessions.length === 0) {
    return {
      title: "AI Recommendation",
      message: "Start logging your sessions to get personalized insights from BloomMind.",
      actionable: false,
    };
  }

  const socialMediaTime = recentSessions
    .filter((s) => ['Instagram', 'TikTok', 'YouTube', 'X', 'WhatsApp'].includes(s.app_name))
    .reduce((acc, curr) => acc + curr.duration_minutes, 0);

  if (socialMediaTime > 60) {
    return {
      title: "AI Recommendation",
      message: "You've been on communication apps more than usual. Try a 20 min focus block to earn water drops.",
      actionable: true,
    };
  }

  return {
    title: "AI Recommendation",
    message: "Your focus is solid today! Keep planting and growing your garden.",
    actionable: false,
  };
};

export const getCoachResponse = async (userMessage: string, chatHistory: { text: string; sender: string }[] = []): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemInstruction = `You are a world-class Focus, Productivity & Time Management coach for BloomMind. 
  Your goal is to help users manage their screen time, set boundaries for social media/communication apps, and encourage them to focus so they can earn water drops for their simulator garden.
  Keep your answers encouraging, concise, and highly practical. 
  Respond in the same language the user uses (usually Arabic or English).`;

  const contents = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  
  // Append current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API returned an error:", data.error);
      return `API Error: ${data.error.message}`;
    }

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    
    return "I'm here to support you! Let's get back on track and reduce distractions.";
  } catch (error: any) {
    console.error("Gemini API Network Error:", error);
    return `Network Error: ${error.message}`;
  }
};
