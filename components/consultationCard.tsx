"use client"

import { Calendar, Clock, Check, Undo2, Loader2 } from "lucide-react";
import type { Consultation } from "@/types/consultation";
import { formatDate, formatTime } from "@/lib/utils/date";
import { toggleConsultationComplete } from "@/app/actions/consultation";
import { useState } from "react";

type ConsultationCardProps = {
  consultation: Consultation
  onToggle: (id: string) => void
}

export function ConsultationCard({
  consultation,
  onToggle,
}: ConsultationCardProps) {
  const { is_complete } = consultation;
  const [loading, setLoading] = useState(false);

  async function handleMarkAsComplete() {
    setLoading(true);

    // Put a 2 sec delay for visualization
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await toggleConsultationComplete(
      consultation.id,
      consultation.is_complete,
    );

    if (result?.error) {
      setLoading(false);
      return;
    }

    // If database update is success, provide the consultation id to the parent to update the is_complete status
    onToggle(consultation.id);
    setLoading(false);
  }

  return (
    <div className={`rounded-xl border px-6 py-5 ${
      is_complete ? "border-border bg-background opacity-75" : "border-border bg-surface"
    }`}>
      <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
        <span className={`text-[15px] font-semibold ${
          is_complete ? "text-muted line-through" : "text-foreground"
        }`}>
          {consultation.first_name} {consultation.last_name}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
          is_complete ? "bg-foreground/5 text-muted" : "bg-primary/10 text-primary"
        }`}>
          {is_complete ? "Completed" : "Pending"}
        </span>
      </div>

      <p className={`mb-2.5 text-sm leading-relaxed ${
        is_complete ? "text-muted/70 line-through" : "text-muted"
      }`}>
        {consultation.reason}
      </p>

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-3.5 text-[13px] ${
          is_complete ? "text-border" : "text-muted/80"
        }`}>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(consultation.datetime)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {formatTime(consultation.datetime)}
          </span>
        </div>

        <button
          onClick={handleMarkAsComplete}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium ${
            is_complete ? "border-border text-muted" : "border-success text-success"
          }`}
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin" /> Updating...</>
          ) : is_complete ? (
            <><Undo2 size={14} /> Mark Incomplete</>
          ) : (
            <><Check size={14} /> Mark Complete</>
          )}
        </button>
      </div>
    </div>
  )
}
