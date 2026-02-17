"use client"

import { useState } from "react"
import Image from "next/image"
import { ConsultationCard } from "@/components/consultationCard"
import type { Consultation } from "@/types/consultation"
import { logout } from "@/app/actions/auth";

type ConsultationDashboardProps = {
  firstName: string
  lastName: string
  consultations: Consultation[]
}

export function ConsultationDashboard({
    firstName,
    lastName,
    consultations: initialConsultations,
  }: ConsultationDashboardProps) {

  const sortByDatetime = (a: Consultation, b: Consultation): number => {
    return (new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  }

  const [consultations, setConsultations] = useState(initialConsultations);
  const [showModal, setShowModal] = useState(false);

  const toggleComplete = (id: string): void => {
    console.log("toggling complete.....");
  }

  const sortedConsultations = consultations.toSorted(sortByDatetime)

  return (
      <div className="min-h-screen bg-background">
        <div className="relative overflow-hidden bg-foreground pb-12">
          <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full"/>
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex items-center justify-between pb-9 pt-5">
              <Image
                  src="/Contour-Education-2023-Logo.png"
                  alt="Contour Education"
                  width={200}
                  height={40}
                  className="h-7 w-auto brightness-0 invert"
              />
              <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">
                Hi, {firstName} {lastName}
              </span>
              <button
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={logout}
              >
                Sign out
              </button>
              </div>
            </div>

            <h1 className="text-[34px] font-bold tracking-tight text-white">
              My Consultations
            </h1>
            <p className="mt-1.5 text-[15px] text-white/45">
              Manage your consultation bookings
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 pt-7">
          <div className="mb-5 flex justify-end">
            <button
                className="rounded-[10px] bg-primary px-7 py-3 text-[15px] font-semibold text-white transition-all duration-200"
                onClick={() => setShowModal(true)}
            >
              Book Consultation
            </button>
          </div>

          {/* List of consultations from database */}
          <div className="flex flex-col gap-2.5 pb-16">
            {sortedConsultations.length === 0 && (
                <div className="py-12 text-center text-muted">
                  No consultations yet. Book your first!
                </div>
            )}
            {sortedConsultations.map((consultation) => (
                <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    onToggle={toggleComplete}
                />
            ))}
          </div>


      </div>
    </div>
  )
}
