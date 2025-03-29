import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useTranslation } from "react-i18next";

const RichTextEditor = ({ value, onChange, height = 300}) => {
  const editor = useRef(null);
  const { t } = useTranslation();

  const config = useMemo(() => ({
    height,
    readonly: false,
    toolbarAdaptive: true,
    toolbarSticky: false,
    askBeforePasteHTML: false,
    defaultActionOnPaste: "insert_clear_html",
    placeholder: "Start typing...",
  }), [t, height]);

  const handleEditorChange = (newContent) => {
    const cleanedContent = newContent.replace(/<!DOCTYPE[^>]*>/gi, "");
    onChange(cleanedContent);
  };

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onChange={handleEditorChange}
    />
  );
};

export default RichTextEditor;
