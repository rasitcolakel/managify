import React, { useContext, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { ReactQuillProps } from "react-quill";
import styled from "@emotion/styled";
import { ColorModeContext } from "@contexts/index";

// add dark mode support

type EditorWrapperProps = {
  isDark: boolean;
};
const EditorWrapper = styled.div(`
`);

// @ts-ignore - quill is not typed
const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

const StyledReactQuill = styled(ReactQuill)<EditorWrapperProps>`
  .ql-editor {
    min-height: 200px;
  }
  .ql-container {
    border-bottom-left-radius: 0.4em;
    border-bottom-right-radius: 0.4em;
  }
  .ql-toolbar {
    border-top-left-radius: 0.4em;
    border-top-right-radius: 0.4em;
  }
  .ql-stroke {
    stroke: ${(props) =>
      props.isDark ? "#fff !important" : "#000 !important"};
  }

  .ql-fill {
    fill: ${(props) => (props.isDark ? "#fff !important" : "#000 !important")};
  }
`;

type Props = {
  // eslint-disable-next-line no-unused-vars
  onChange: (value: any) => void;
  defaultValue?: string;
  theme?: string;
  placeholder?: string;
  className?: string;
};

export default function QuillEditor({
  onChange,
  defaultValue,
  placeholder,
  theme = "snow",
}: Props): JSX.Element {
  const colorModeCOntext = useContext(ColorModeContext);
  const isDark = colorModeCOntext.mode === "dark";
  const editor = useRef<any>();
  const quillProps: ReactQuillProps = {
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link"],
        ["clean"],
      ],
    },
    theme,
    onChange,
    defaultValue,
    placeholder,
  };

  useEffect(() => {
    if (defaultValue) {
      const delta = editor.current.editor.clipboard.convert(defaultValue);
      editor.current.editor.setContents(delta, "silent");
    }
  }, [defaultValue]);

  return (
    <EditorWrapper>
      <StyledReactQuill {...quillProps} isDark={isDark} />
    </EditorWrapper>
  );
}
