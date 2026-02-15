import { LucideIcon } from "lucide-react";

export type ConnectorStatus = "connected" | "disconnected" | "available" | "active";

export type ConnectorColor = "emerald" | "blue" | "purple" | "orange" | "pink" | "cyan";

export interface ConnectorCategory {
    id: string;
    name: string;
    icon: LucideIcon;
}

export interface Connector {
    id: string;
    name: string;
    description: string;
    status: ConnectorStatus;
    category: string;
    type: string;
    icon: LucideIcon;
    color: ConnectorColor;
}
