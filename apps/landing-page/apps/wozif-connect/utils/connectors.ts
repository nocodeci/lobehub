import { ConnectorColor, ConnectorStatus } from "../types/connectors";

export const getConnectorColorClasses = (color: ConnectorColor) => {
    const mapping = {
        emerald: "bg-emerald-400/10 text-emerald-400",
        blue: "bg-blue-400/10 text-blue-400",
        purple: "bg-purple-400/10 text-purple-400",
        orange: "bg-orange-400/10 text-orange-400",
        pink: "bg-pink-400/10 text-pink-400",
        cyan: "bg-cyan-400/10 text-cyan-400",
    };
    return mapping[color] || mapping.emerald;
};

export const getConnectorGlowClasses = (color: ConnectorColor) => {
    const mapping = {
        emerald: "bg-emerald-400",
        blue: "bg-blue-400",
        purple: "bg-purple-400",
        orange: "bg-orange-400",
        pink: "bg-pink-400",
        cyan: "bg-cyan-400",
    };
    return mapping[color] || mapping.emerald;
};

export const getStatusBadgeConfig = (status: ConnectorStatus) => {
    switch (status) {
        case "connected":
            return {
                label: "Connecté",
                className: "bg-emerald-400/10 text-emerald-400",
                showDot: true,
            };
        case "disconnected":
            return {
                label: "Configuration requise",
                className: "bg-zinc-400/10 text-zinc-400",
                showDot: false,
            };
        default:
            return {
                label: "Disponible",
                className: "bg-primary/10 text-primary",
                showDot: false,
            };
    }
};
