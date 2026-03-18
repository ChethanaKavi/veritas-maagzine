import React, { useRef, useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);
  const [unorderedActive, setUnorderedActive] = useState(false);
  const [orderedActive, setOrderedActive] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("left");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
      // normalize any existing images so they aren't huge
      const imgs = editorRef.current.querySelectorAll("img");
      imgs.forEach((img) => {
        const i = img as HTMLImageElement;
        if (i.complete) {
          const desired = Math.min(i.naturalWidth || 600, 600);
          i.style.width = desired + "px";
          i.style.maxWidth = "100%";
          i.style.height = "auto";
        } else {
          i.onload = () => {
            const desired = Math.min(i.naturalWidth || 600, 600);
            i.style.width = desired + "px";
            i.style.maxWidth = "100%";
            i.style.height = "auto";
          };
        }
      });
      // normalize lists so markers are visible even if global CSS hides them
      const normalizeLists = () => {
        const lists = editorRef.current?.querySelectorAll("ul, ol") || [];
        lists.forEach((list) => {
          const l = list as HTMLElement;
          l.style.listStyleType = l.tagName.toLowerCase() === "ul" ? "disc" : "decimal";
          if (!l.style.paddingLeft || l.style.paddingLeft === "") l.style.paddingLeft = "1.25rem";
          l.style.margin = l.style.margin || "0 0 0.5rem 0";
        });
      };
      normalizeLists();
    }
  }, [value]);

  useEffect(() => {
    const onSelectionChange = () => {
      try {
        setBoldActive(document.queryCommandState("bold"));
        setItalicActive(document.queryCommandState("italic"));
        setUnderlineActive(document.queryCommandState("underline"));
        setUnorderedActive(document.queryCommandState("insertUnorderedList"));
        setOrderedActive(document.queryCommandState("insertOrderedList"));
        if (document.queryCommandState("justifyCenter")) setAlign("center");
        else if (document.queryCommandState("justifyRight")) setAlign("right");
        else setAlign("left");
      } catch (e) {
        // ignore
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const exec = (cmd: string, arg?: string) => {
    try {
      if (editorRef.current) {
        editorRef.current.focus();
        const sel = window.getSelection();
        if (sel && sel.rangeCount === 0) {
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      document.execCommand(cmd, false, arg);
    } catch (e) {
      document.execCommand(cmd, false, arg);
    }
    notifyChange();
    // update toggle states immediately
    setTimeout(() => {
      setBoldActive(document.queryCommandState("bold"));
      setItalicActive(document.queryCommandState("italic"));
      setUnderlineActive(document.queryCommandState("underline"));
      setUnorderedActive(document.queryCommandState("insertUnorderedList"));
      setOrderedActive(document.queryCommandState("insertOrderedList"));
      if (document.queryCommandState("justifyCenter")) setAlign("center");
      else if (document.queryCommandState("justifyRight")) setAlign("right");
      else setAlign("left");
    }, 50);
  };

  const notifyChange = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    // ensure lists have visible markers after changes
    try {
      const lists = editorRef.current?.querySelectorAll("ul, ol") || [];
      lists.forEach((list) => {
        const l = list as HTMLElement;
        l.style.listStyleType = l.tagName.toLowerCase() === "ul" ? "disc" : "decimal";
        if (!l.style.paddingLeft || l.style.paddingLeft === "") l.style.paddingLeft = "1.25rem";
        l.style.margin = l.style.margin || "0 0 0.5rem 0";
      });
    } catch (e) {
      // ignore
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const data = reader.result as string;
      const tmp = new Image();
      tmp.onload = () => {
        const desired = Math.min(tmp.naturalWidth || 600, 600);
        // insert HTML with inline styles to constrain size
        const html = `<img src="${data}" style="width:${desired}px;max-width:100%;height:auto" />`;
        try {
          if (editorRef.current) {
            editorRef.current.focus();
            const sel = window.getSelection();
            if (sel && sel.rangeCount === 0) {
              const range = document.createRange();
              range.selectNodeContents(editorRef.current);
              range.collapse(false);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
          document.execCommand("insertHTML", false, html);
        } catch (e) {
          document.execCommand("insertHTML", false, html);
        }
        setTimeout(() => notifyChange(), 50);
      };
      tmp.src = data;
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  const btnClass = (active?: boolean) =>
    `px-2 py-1 border rounded ${active ? "bg-blue-50 border-blue-200" : "bg-white"}`;

  return (
    <div>
      <div className="mb-2 flex gap-2 items-center">
        <button type="button" onClick={() => exec("bold")} className={btnClass(boldActive)} aria-pressed={boldActive}><strong>B</strong></button>
        <button type="button" onClick={() => exec("italic")} className={btnClass(italicActive)} aria-pressed={italicActive}><em>I</em></button>
        <button type="button" onClick={() => exec("underline")} className={btnClass(underlineActive)} aria-pressed={underlineActive}><u>U</u></button>
        <button type="button" onClick={() => exec("insertUnorderedList")} className={btnClass(unorderedActive)} aria-pressed={unorderedActive}>• List</button>
        <button type="button" onClick={() => exec("insertOrderedList")} className={btnClass(orderedActive)} aria-pressed={orderedActive}>1. List</button>
        <button type="button" onClick={() => exec("justifyLeft")} className={btnClass(align === "left")}>Left</button>
        <button type="button" onClick={() => exec("justifyCenter")} className={btnClass(align === "center")}>Center</button>
        <button type="button" onClick={() => exec("justifyRight")} className={btnClass(align === "right")}>Right</button>
        <label className="px-2 py-1 border rounded cursor-pointer">
          Image
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        <button type="button" onClick={() => { if (editorRef.current) { editorRef.current.innerHTML = ""; notifyChange(); } }} className="px-2 py-1 border rounded">Clear</button>
      </div>
      <div
        ref={editorRef}
        onInput={notifyChange}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[200px] border rounded p-3 bg-white prose max-w-none"
      />
    </div>
  );
};

export default RichTextEditor;
