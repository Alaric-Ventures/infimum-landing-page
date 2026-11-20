import { z } from "zod";

import { enquiryServiceValues } from "@/data/services";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name." })
    .max(80, { message: "Please keep your name under 80 characters." }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Please enter your business email address." })
    .max(160, { message: "Please keep your email under 160 characters." })
    .email({ message: "Please enter a valid email address." }),
  company: z
    .string()
    .trim()
    .max(120, { message: "Please keep the company name under 120 characters." })
    .optional(),
  service: z.enum(enquiryServiceValues, {
    message: "Please choose a service.",
  }),
  message: z
    .string()
    .trim()
    .min(20, { message: "Please add a little more detail (at least 20 characters)." })
    .max(4000, { message: "Please keep your message under 4,000 characters." }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Server-side payload. Includes a honeypot field that is never used to populate
 * the visible form and must remain empty.
 */
export const contactRequestSchema = contactFormSchema.extend({
  companyWebsite: z.string().max(0).optional().default(""),
});

export type ContactRequestValues = z.infer<typeof contactRequestSchema>;
