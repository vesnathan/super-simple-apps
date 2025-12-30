"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@super-simple-apps/shared-assets";
import { Client, CreateClientInput, ClientFormSchema, ClientFormInput } from "@/types";

interface ClientFormProps {
  client?: Client | null;
  onSubmit: (data: CreateClientInput) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ClientForm({ client, onSubmit, onCancel, onDelete }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormInput>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      notes: "",
      hourlyRate: "",
      tagsInput: "",
    },
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        company: client.company || "",
        address: client.address || "",
        notes: client.notes || "",
        hourlyRate: client.hourlyRate?.toString() || "",
        tagsInput: client.tags.join(", "),
      });
    }
  }, [client, reset]);

  const onFormSubmit = (data: ClientFormInput) => {
    const tags = (data.tagsInput || "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      name: data.name.trim(),
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      company: data.company?.trim() || undefined,
      address: data.address?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Client name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="email@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            {...register("company")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Company name"
          />
        </div>

        {/* Hourly Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              {...register("hourlyRate")}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            {...register("address")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Street address, City, State, ZIP"
            rows={2}
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            {...register("tagsInput")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="vip, active, priority (comma-separated)"
          />
          <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Additional notes about this client..."
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          {onDelete && client && (
            <Button variant="danger" onClick={onDelete} type="button">
              Delete Client
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="bg-purple-600 hover:bg-purple-700">
            {client ? "Save Changes" : "Add Client"}
          </Button>
        </div>
      </div>
    </form>
  );
}
