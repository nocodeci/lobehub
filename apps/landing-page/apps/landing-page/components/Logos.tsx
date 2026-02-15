import React from 'react';

export const WhatsAppLogo = ({ size = 24, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export const GoogleCalendarLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 4H17V2H15V4H9V2H7V4H6C4.9 4 4 4.9 4 6V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V6C20 4.9 19.1 4 18 4Z" fill="#4285F4" />
        <path d="M6 22H18C19.1 22 20 21.1 20 20V9H4V20C4 21.1 4.9 22 6 22Z" fill="#FFFFFF" />
        <path d="M4 9H20V6C20 4.9 19.1 4 18 4H6C4.9 4 4 4.9 4 6V9Z" fill="#EA4335" />
        <text x="12" y="17" textAnchor="middle" fill="#4285F4" fontSize="8" fontWeight="bold" fontFamily="Arial">18</text>
    </svg>
);

export const GoogleSheetsLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#0F9D58" />
        <path d="M14 2V8H20L14 2Z" fill="#87CEAC" />
        <rect x="7" y="11" width="10" height="1.5" fill="white" />
        <rect x="7" y="14" width="10" height="1.5" fill="white" />
        <rect x="7" y="17" width="6" height="1.5" fill="white" />
    </svg>
);

export const GmailLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M2 6L12 13L22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="#EA4335" />
        <path d="M22 6L12 13L2 6V4C2 2.9 2.9 2 4 2H20C21.1 2 22 2.9 22 4V6Z" fill="#FBBC05" />
        <path d="M4 2H2V6L12 13V13L4 7V2Z" fill="#34A853" />
        <path d="M20 2H22V6L12 13V13L20 7V2Z" fill="#4285F4" />
    </svg>
);

export const IntercomLogo = ({ size = 24, color = 'currentColor' }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM8 14H6V12H8V14ZM8 11H6V9H8V11ZM8 8H6V6H8V8ZM13 14H11V12H13V14ZM13 11H11V9H13V11ZM13 8H11V6H13V8ZM18 14H16V12H18V14ZM18 11H16V9H18V11ZM18 8H16V6H18V8Z" />
    </svg>
);

export const ChromeLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#4285F4" />
        <circle cx="12" cy="12" r="4" fill="white" />
        <path d="M12 2C6.48 2 2 6.48 2 12H8C8 9.79 9.79 8 12 8V2Z" fill="#EA4335" />
        <path d="M22 12C22 6.48 17.52 2 12 2V8C14.21 8 16 9.79 16 12H22Z" fill="#FBBC05" />
        <path d="M12 22C17.52 22 22 17.52 22 12H16C16 14.21 14.21 16 12 16V22Z" fill="#34A853" />
    </svg>
);
