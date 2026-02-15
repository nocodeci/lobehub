"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CalendarCheck,
  CalendarX,
  Bell,
  Clock,
} from "lucide-react";

// Bloc Check Availability
export function CheckAvailabilityConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    calendarId: "",
    duration: 30,
    bufferBefore: 0,
    bufferAfter: 0,
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    workingDays: [1, 2, 3, 4, 5],
    timezone: "Africa/Abidjan",
  });

  const daysOfWeek = [
    { value: 0, label: "Dim" },
    { value: 1, label: "Lun" },
    { value: 2, label: "Mar" },
    { value: 3, label: "Mer" },
    { value: 4, label: "Jeu" },
    { value: 5, label: "Ven" },
    { value: 6, label: "Sam" },
  ];

  const toggleDay = (day: number) => {
    const newDays = config.workingDays.includes(day)
      ? config.workingDays.filter((d: number) => d !== day)
      : [...config.workingDays, day].sort();
    updateConfig({ ...config, workingDays: newDays });
  };

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Vérifier Disponibilité</h4>
            <p className="text-[10px] text-blue-400/60">Consulter le calendrier</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            ID du calendrier (optionnel)
          </label>
          <Input
            value={config.calendarId}
            onChange={(e) => updateConfig({ ...config, calendarId: e.target.value })}
            placeholder="primary ou email@gmail.com"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Durée RDV (min)
            </label>
            <Input
              type="number"
              min={15}
              step={15}
              value={config.duration}
              onChange={(e) => updateConfig({ ...config, duration: parseInt(e.target.value) || 30 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Buffer avant (min)
            </label>
            <Input
              type="number"
              min={0}
              value={config.bufferBefore}
              onChange={(e) => updateConfig({ ...config, bufferBefore: parseInt(e.target.value) || 0 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Heure début
            </label>
            <Input
              type="time"
              value={config.workingHoursStart}
              onChange={(e) => updateConfig({ ...config, workingHoursStart: e.target.value })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Heure fin
            </label>
            <Input
              type="time"
              value={config.workingHoursEnd}
              onChange={(e) => updateConfig({ ...config, workingHoursEnd: e.target.value })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60 mb-2 block">
            Jours ouvrés
          </label>
          <div className="flex gap-1">
            {daysOfWeek.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  config.workingDays.includes(day.value)
                    ? "bg-blue-500 text-white"
                    : "bg-black/20 text-white/50 hover:bg-black/30"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Book Appointment
export function BookAppointmentConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    title: "",
    description: "",
    duration: 30,
    location: "",
    sendConfirmation: true,
    sendReminder: true,
    reminderBefore: 60,
    calendarId: "",
    attendeeEmail: "{{email}}",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <CalendarCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Réserver RDV</h4>
            <p className="text-[10px] text-emerald-400/60">Créer un rendez-vous</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Titre du RDV
          </label>
          <Input
            value={config.title}
            onChange={(e) => updateConfig({ ...config, title: e.target.value })}
            placeholder="Consultation avec {{nom}}"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Description
          </label>
          <textarea
            value={config.description}
            onChange={(e) => updateConfig({ ...config, description: e.target.value })}
            className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="Détails du rendez-vous..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Durée (min)
            </label>
            <Input
              type="number"
              min={15}
              step={15}
              value={config.duration}
              onChange={(e) => updateConfig({ ...config, duration: parseInt(e.target.value) || 30 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Email participant
            </label>
            <Input
              value={config.attendeeEmail}
              onChange={(e) => updateConfig({ ...config, attendeeEmail: e.target.value })}
              placeholder="{{email}}"
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Lieu (optionnel)
          </label>
          <Input
            value={config.location}
            onChange={(e) => updateConfig({ ...config, location: e.target.value })}
            placeholder="Adresse ou lien visio"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
            <span className="text-[10px] text-white/70">Envoyer confirmation</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.sendConfirmation}
                onChange={(e) => updateConfig({ ...config, sendConfirmation: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition-all"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
            <span className="text-[10px] text-white/70">Envoyer rappel</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.sendReminder}
                onChange={(e) => updateConfig({ ...config, sendReminder: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition-all"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Cancel Appointment
export function CancelAppointmentConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    appointmentId: "{{appointment_id}}",
    sendNotification: true,
    reason: "",
    allowReschedule: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <CalendarX className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Annuler RDV</h4>
            <p className="text-[10px] text-red-400/60">Supprimer un rendez-vous</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            ID du rendez-vous
          </label>
          <Input
            value={config.appointmentId}
            onChange={(e) => updateConfig({ ...config, appointmentId: e.target.value })}
            placeholder="{{appointment_id}}"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Raison (optionnel)
          </label>
          <textarea
            value={config.reason}
            onChange={(e) => updateConfig({ ...config, reason: e.target.value })}
            className="w-full mt-1 h-16 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="Raison de l'annulation..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
            <span className="text-[10px] text-white/70">Notifier le participant</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.sendNotification}
                onChange={(e) => updateConfig({ ...config, sendNotification: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-red-500 transition-all"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
            <span className="text-[10px] text-white/70">Proposer replanification</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowReschedule}
                onChange={(e) => updateConfig({ ...config, allowReschedule: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-red-500 transition-all"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Send Reminder
export function SendReminderConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    type: "appointment",
    beforeMinutes: 60,
    message: "",
    channel: "whatsapp",
    includeDetails: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Bell className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Envoyer Rappel</h4>
            <p className="text-[10px] text-amber-400/60">Notification de rappel</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Type de rappel
          </label>
          <select
            value={config.type}
            onChange={(e) => updateConfig({ ...config, type: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="appointment">Rendez-vous</option>
            <option value="payment">Paiement</option>
            <option value="followup">Suivi</option>
            <option value="custom">Personnalisé</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Envoyer X minutes avant
          </label>
          <Input
            type="number"
            min={5}
            value={config.beforeMinutes}
            onChange={(e) => updateConfig({ ...config, beforeMinutes: parseInt(e.target.value) || 60 })}
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Canal
          </label>
          <select
            value={config.channel}
            onChange={(e) => updateConfig({ ...config, channel: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="all">Tous les canaux</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Message personnalisé
          </label>
          <textarea
            value={config.message}
            onChange={(e) => updateConfig({ ...config, message: e.target.value })}
            className="w-full mt-1 h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
            placeholder="Rappel: votre RDV est dans {{minutes}} minutes..."
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Inclure les détails</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeDetails}
              onChange={(e) => updateConfig({ ...config, includeDetails: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-amber-500 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
