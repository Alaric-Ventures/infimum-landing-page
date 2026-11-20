"use client";

import { useEffect, useRef, useState, type BaseSyntheticEvent } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import {
  enquiryServiceOptions,
  enquiryServiceValues,
  type EnquiryServiceValue,
} from "@/data/services";
import { siteConfig } from "@/data/site-config";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";

const defaultValues: ContactFormValues = {
  fullName: "",
  email: "",
  company: "",
  service: "general",
  message: "",
};

const labelClass = "mb-2 block text-[13px] font-medium text-ink";
const fieldClass =
  "h-12 w-full rounded-lg border border-line bg-white px-4 text-[15px] text-ink placeholder:text-slate-500 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100";

type ApiResponse = {
  ok?: boolean;
  error?: string;
  code?: string;
};

type ServerError = {
  message: string;
  code?: string;
};

const fallbackPhone = siteConfig.phones[0];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-red-700"
    >
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [serverError, setServerError] = useState<ServerError | null>(null);
  const [submittedName, setSubmittedName] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const requestedService = searchParams.get("service");

  useEffect(() => {
    if (
      requestedService &&
      (enquiryServiceValues as readonly string[]).includes(requestedService)
    ) {
      setValue("service", requestedService as EnquiryServiceValue, {
        shouldValidate: false,
      });
    }
  }, [requestedService, setValue]);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  async function onSubmit(
    values: ContactFormValues,
    event?: BaseSyntheticEvent,
  ) {
    if (isSubmitting) return;

    setServerError(null);

    const formData =
      event?.target instanceof HTMLFormElement
        ? new FormData(event.target)
        : null;
    const companyWebsite = String(formData?.get("companyWebsite") ?? "");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, companyWebsite }),
      });

      let payload: ApiResponse = {};
      try {
        payload = (await response.json()) as ApiResponse;
      } catch {
        payload = {};
      }

      if (!response.ok) {
        setServerError({
          message:
            payload.error ??
            "We couldn’t send your enquiry right now. Please try again.",
          code: payload.code,
        });
        return;
      }

      setSubmittedName(values.fullName.trim().split(" ")[0] ?? "");
      setStatus("success");
      reset(defaultValues);
    } catch {
      setServerError({
        message:
          "We couldn’t reach the server. Please check your connection and try again.",
      });
    }
  }

  if (status === "success") {
    return (
      <div className="mt-7" role="status" aria-live="polite">
        <div
          ref={successRef}
          tabIndex={-1}
          className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 outline-none sm:p-8"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <h4 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
            Enquiry received.
          </h4>
          <p className="mt-2.5 max-w-md text-sm leading-6 text-slate-700">
            Thank you{submittedName ? `, ${submittedName}` : ""}. Your details
            are with our team. We’ll review them and get in touch to arrange a
            conversation.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setServerError(null);
            }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            Send another enquiry
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative mt-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name{" "}
            <span className="text-brand" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Your full name"
            className={fieldClass}
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
          <FieldError id="fullName-error" message={errors.fullName?.message} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Business email{" "}
            <span className="text-brand" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={160}
            placeholder="you@company.com"
            className={fieldClass}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="company" className={labelClass}>
            Company name{" "}
            <span className="font-normal text-muted">Optional</span>
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            maxLength={120}
            placeholder="Your organisation"
            className={fieldClass}
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? "company-error" : undefined}
            {...register("company")}
          />
          <FieldError id="company-error" message={errors.company?.message} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="service" className={labelClass}>
            Service interested in
          </label>
          <div className="relative">
            <select
              id="service"
              className={cn(fieldClass, "appearance-none pr-10")}
              aria-describedby="service-hint"
              {...register("service")}
            >
              {enquiryServiceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </div>
          <p id="service-hint" className="mt-1.5 text-xs leading-5 text-muted">
            Choose the closest match — we can refine it together.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Project details{" "}
            <span className="text-brand" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="message"
            rows={5}
            required
            maxLength={4000}
            placeholder="Tell us about the project, the challenge and what a good outcome would look like…"
            className={cn(fieldClass, "h-auto min-h-[8.5rem] resize-y py-3 leading-6")}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "message-error" : "message-hint"}
            {...register("message")}
          />
          {errors.message ? (
            <FieldError id="message-error" message={errors.message.message} />
          ) : (
            <p id="message-hint" className="mt-1.5 text-xs leading-5 text-muted">
              A short overview is enough. Please avoid sharing passwords or
              sensitive credentials.
            </p>
          )}
        </div>
      </div>

      {/* Honeypot: kept off-screen for people, visible to simple bots. */}
      <div
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="companyWebsite">Leave this field empty</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {serverError ? (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-red-600"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">We couldn’t send your enquiry.</p>
            <p className="mt-0.5">{serverError.message}</p>
            {fallbackPhone ? (
              <p className="mt-1.5">
                You can also call us on{" "}
                <a
                  href={`tel:${fallbackPhone.href}`}
                  className="font-semibold underline underline-offset-2"
                >
                  {fallbackPhone.display}
                </a>
                .
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[17rem] text-xs leading-5 text-muted">
          We’ll only use your details to respond to this enquiry.
        </p>
        <Button
          type="submit"
          size="md"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
