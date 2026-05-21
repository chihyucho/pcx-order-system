import type { RecipientTemplate } from "./types";

const TEMPLATES_KEY = "pcx_recipient_templates";

type StoredTemplate = RecipientTemplate & { contact?: string };

function normalizeTemplate(raw: StoredTemplate): RecipientTemplate {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    phoneNumber: raw.phoneNumber ?? raw.contact ?? "",
  };
}

export function getRecipientTemplates(): RecipientTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredTemplate[];
    return parsed.map(normalizeTemplate);
  } catch {
    return [];
  }
}

export function saveRecipientTemplate(
  template: Omit<RecipientTemplate, "id">,
): RecipientTemplate {
  const templates = getRecipientTemplates();
  const existing = templates.find(
    (t) =>
      t.name === template.name &&
      t.address === template.address &&
      t.phoneNumber === template.phoneNumber,
  );
  if (existing) return existing;

  const entry: RecipientTemplate = {
    id: `tpl-${Date.now()}`,
    ...template,
  };
  localStorage.setItem(
    TEMPLATES_KEY,
    JSON.stringify([entry, ...templates]),
  );
  return entry;
}
