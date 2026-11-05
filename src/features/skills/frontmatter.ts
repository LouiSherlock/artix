import { dump, load } from "js-yaml";

export interface SkillMetadata {
  name: string;
  description: string;
  license: string;
  compatibility: string;
  allowedTools: string;
  metadata: Record<string, string>;
  extraFields: Record<string, unknown>;
}

export const EMPTY_SKILL_METADATA: SkillMetadata = {
  name: "",
  description: "",
  license: "",
  compatibility: "",
  allowedTools: "",
  metadata: {},
  extraFields: {},
};

const KNOWN_FIELDS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "allowed-tools",
  "metadata",
]);

function asText(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function asStringMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, asText(entry)]),
  );
}

export function parseSkillDocument(source: string) {
  if (!source.startsWith("---")) return null;

  const match = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) {
    throw new Error("SKILL.md 的 YAML Frontmatter 缺少结束标记 ---");
  }

  const parsed = load(match[1]);
  if (parsed !== undefined && (!parsed || typeof parsed !== "object" || Array.isArray(parsed))) {
    throw new Error("SKILL.md 的 YAML Frontmatter 必须是键值对象");
  }

  const fields = (parsed ?? {}) as Record<string, unknown>;
  const rawMetadata = fields.metadata;
  const extraFields = Object.fromEntries(
    Object.entries(fields).filter(([key]) => !KNOWN_FIELDS.has(key)),
  );

  return {
    metadata: {
      name: asText(fields.name),
      description: asText(fields.description),
      license: asText(fields.license),
      compatibility: asText(fields.compatibility),
      allowedTools: asText(fields["allowed-tools"]),
      metadata: asStringMap(rawMetadata),
      extraFields,
    } satisfies SkillMetadata,
    body: source.slice(match[0].length).replace(/^\r?\n/, ""),
  };
}

export function serializeSkillDocument(metadata: SkillMetadata, body: string) {
  const fields: Record<string, unknown> = { ...metadata.extraFields };
  fields.name = metadata.name.trim();
  fields.description = metadata.description.trim();

  if (metadata.license.trim()) fields.license = metadata.license.trim();
  if (metadata.compatibility.trim()) {
    fields.compatibility = metadata.compatibility.trim();
  }
  if (metadata.allowedTools.trim()) {
    fields["allowed-tools"] = metadata.allowedTools.trim();
  }

  const customMetadata = Object.fromEntries(
    Object.entries(metadata.metadata)
      .map(([key, value]) => [key.trim(), value.trim()] as const)
      .filter(([key]) => key.length > 0),
  );
  if (Object.keys(customMetadata).length > 0) fields.metadata = customMetadata;

  const yaml = dump(fields, { lineWidth: -1, noRefs: true });
  return `---\n${yaml}---\n\n${body.replace(/^\r?\n/, "")}`;
}

export function validateSkillMetadata(metadata: SkillMetadata) {
  const errors: string[] = [];
  const name = metadata.name.trim();
  const description = metadata.description.trim();
  const compatibility = metadata.compatibility.trim();

  if (!name) {
    errors.push("name 为必填项");
  } else if (
    name.length > 64 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)
  ) {
    errors.push("name 须为 1–64 位小写字母、数字或单连字符分隔的组合");
  }

  if (!description) {
    errors.push("description 为必填项");
  } else if ([...description].length > 1024) {
    errors.push("description 不能超过 1024 个字符");
  }

  if ([...compatibility].length > 500) {
    errors.push("compatibility 不能超过 500 个字符");
  }

  const metadataKeys = Object.keys(metadata.metadata)
    .map((key) => key.trim())
    .filter(Boolean);
  if (new Set(metadataKeys).size !== metadataKeys.length) {
    errors.push("metadata 的键不能重复");
  }

  return errors;
}
