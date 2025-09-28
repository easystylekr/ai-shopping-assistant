import React, { useState, useEffect } from 'react';
import type { Message, User, Product } from './types';
import { getAIResponse, generateProductImage } from './services/geminiService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import AuthModal from './components/AuthModal';

/**
 * Fetches a product image by generating it on-the-fly using an AI model.
 * This approach bypasses all CORS and hotlinking issues by creating a unique
 * image for each product recommendation.
 *
 * @param productName The name of the product to generate an image for.
 * @returns A promise that resolves to the product image URL (typically a base64 data URL).
 */
async function fetchProductImage(productName: string): Promise<string> {
  console.log(`[AI Image Gen] Generating image for: "${productName}"`);
  try {
    const imageUrl = await generateProductImage(productName);
    console.log(`[AI Image Gen] Image generation successful.`);
    return imageUrl;
  } catch (error) {
    console.error(`[AI Image Gen] Image generation failed:`, error);
    // Return a fallback placeholder if the generation fails.
    return `https://placehold.co/600x400/EFEFEF/333333?text=Image+Not+Available`;
  }
}


const parseProductFromResponse = (text: string): Omit<Product, 'imageUrl'> | null => {
  const nameMatch = text.match(/\*\*상품명:\*\*\s*(.*)/);
  const categoryMatch = text.match(/\*\*카테고리:\*\*\s*(.*)/);
  const priceMatch = text.match(/\*\*가격:\*\*\s*(.*)/);
  const ratingMatch = text.match(/\*\*상품평:\*\*\s*(.*)/);
  const reasonMatch = text.match(/\*\*추천 이유:\*\*\s*([\s\S]*)/);
  const linkMatch = text.match(/\*\*구매 링크:\*\*\s*(https?:\/\/[^\s]+)/);

  if (nameMatch && categoryMatch && priceMatch && linkMatch && reasonMatch && ratingMatch) {
    let description = reasonMatch[1].trim();
    
    const otherSections = ['**구매 링크:**'];
    for (const section of otherSections) {
      const index = description.indexOf(section);
      if (index !== -1) {
        description = description.substring(0, index).trim();
      }
    }

    return {
      name: nameMatch[1].trim(),
      category: categoryMatch[1].trim(),
      price: priceMatch[1].trim(),
      rating: ratingMatch[1].trim(),
      description: description,
      link: linkMatch[1].trim(),
    };
  }

  return null;
};


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      content: '안녕하세요! AI 쇼핑 구매 대행 서비스입니다. 어떤 상품을 찾아드릴까요? 당신에게 딱 맞는 최고의 상품 하나를 찾아드리겠습니다.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Effect to fetch product images when a new product is recommended
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'ai' && lastMessage.product && !lastMessage.product.imageUrl) {
      fetchProductImage(lastMessage.product.name).then(imageUrl => {
        setMessages(currentMessages => 
          currentMessages.map(msg => 
            msg.id === lastMessage.id 
            ? { ...msg, product: { ...msg.product!, imageUrl: imageUrl } } 
            : msg
          )
        );
      });
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    if (!user) {
        setShowAuthModal(true);
        return;
    }

    const newUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
    };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const aiResponseData = await getAIResponse(updatedMessages);
      const parsedProduct = parseProductFromResponse(aiResponseData.content);
      
      const newAiMessage: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: aiResponseData.content || "죄송합니다, 답변을 생성하지 못했습니다.",
        sources: aiResponseData.sources,
        product: parsedProduct ? { ...parsedProduct, imageUrl: '' } : undefined, // Initially set imageUrl to empty
      };
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseRequest = (product: Product) => {
    const systemMessage: Message = {
        id: Date.now(),
        role: 'system',
        content: `'${product.name}' 상품에 대한 구매 대행 요청이 관리자에게 전송되었습니다. 곧 연락드리겠습니다.`
    };
    setMessages(prev => [...prev, systemMessage]);
    console.log(`Purchase proxy request for ${product.name} with link ${product.link} sent to admin.`);
  };

  const handleLogin = (email: string) => {
    setUser({ email });
    setShowAuthModal(false);
    const welcomeMessage: Message = {
        id: Date.now(),
        role: 'system',
        content: `환영합니다, ${email}님! 이제부터 쇼핑을 시작할 수 있습니다.`
    };
    setMessages(prev => [...prev, welcomeMessage]);
  };

  const handleLogout = () => {
    setUser(null);
     const logoutMessage: Message = {
        id: Date.now(),
        role: 'system',
        content: `로그아웃되었습니다. 다음에 또 만나요!`
    };
    setMessages(prev => [prev[0], logoutMessage]);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
      <Header user={user} onLogin={() => setShowAuthModal(true)} onLogout={handleLogout} />
      <ChatWindow messages={messages} isLoading={isLoading} onPurchaseRequest={handlePurchaseRequest} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
      {showAuthModal && <AuthModal onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default App;