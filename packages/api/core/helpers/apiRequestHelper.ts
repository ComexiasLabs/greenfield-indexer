import { Tag } from "@core/types/api";

type TagFormat = "KeyValue" | "Key" | "Value";

export const determineTagFormat = (tags: Tag[]): TagFormat => {
  let hasKey = false;
  let hasValue = false;

  if (tags.length > 0) {
    hasKey = "key" in tags[0];
    hasValue = "value" in tags[0];
  }

  if (hasKey && hasValue) return "KeyValue";
  if (hasKey) return "Key";
  if (hasValue) return "Value";

  return "KeyValue";
};
