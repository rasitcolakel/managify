import React, { useContext } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { ReactQuillProps } from "react-quill";
import { ColorModeContext } from "@contexts/index";
import { styled } from "@mui/material";

// add dark mode support

type EditorWrapperProps = {
  isDark?: boolean;
  minHeight?: string;
};

const ReactQuill = dynamic(
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  (_types: any) => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

const StyledReactQuill = styled(ReactQuill)<EditorWrapperProps>`
  .ql-editor {
    min-height: ${(props) => (props.minHeight ? props.minHeight : "200px")};
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
  value?: string;
  theme?: string;
  placeholder?: string;
  className?: string;
  quillEditorProps?: ReactQuillProps & Partial<EditorWrapperProps>;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function QuillEditor({
  onChange,
  value,
  placeholder,
  theme = "snow",
  quillEditorProps,
  ...props
}: Props): JSX.Element {
  const colorModeContext = useContext(ColorModeContext);
  const isDark = colorModeContext.mode === "dark";
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
    value,
    placeholder,
  };

  return (
    <div
      style={{
        width: "100%",
      }}
      {...props}
    >
      {/* @ts-ignore */}
      <StyledReactQuill
        {...quillProps}
        {...quillEditorProps}
        isDark={isDark}
        value={value}
      />
    </div>
  );
}
