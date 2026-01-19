export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string | Date;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    updatedAt: string | Date;
    createdAt?: string | Date;
    isArchived?: boolean;
    icon?: string;
}

export const mockChats: Chat[] = [
    {
        id: "1",
        title: "E-commerce Platform",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isArchived: false,
        icon: "zap",
        messages: [
            {
                id: "1",
                role: "user",
                content: "I need an e-commerce platform for selling shoes.",
                timestamp: new Date().toISOString(),
            },
            {
                id: "2",
                role: "assistant",
                content: "That sounds like a great project! Do you have a specific design in mind or any preferred features like a dark mode or specific payment gateways?",
                timestamp: new Date().toISOString(),
            },
        ],
    },
    {
        id: "2",
        title: "Portfolio Website",
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isArchived: false,
        icon: "message-circle-dashed",
        messages: [
            {
                id: "1",
                role: "user",
                content: "Can you help me build a portfolio website?",
                timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                id: "2",
                role: "assistant",
                content: "Absolutely! Let's start by discussing the style. Do you prefer a minimalist look or something more vibrant and interactive?",
                timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
        ],
    },
];
