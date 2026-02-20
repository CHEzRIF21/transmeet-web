"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShipmentRequestForm } from "@/components/forms/ShipmentRequestForm";
import type { ShipmentRequestInput } from "@/validations/shipment-request";
import type { ShipmentRequest } from "@/types/database.types";

interface DemandEditFormProps {
  request: ShipmentRequest;
}

export function DemandEditForm({ request }: DemandEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: ShipmentRequestInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/shipment-requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ShipmentRequestForm
      defaultValues={request}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
