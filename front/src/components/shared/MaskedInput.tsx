import * as React from "react";
import { useIMask } from "react-imask";
import { type ControllerRenderProps } from "react-hook-form";

import { Input } from "@/components/ui/input";

type InputProps = React.ComponentProps<typeof Input>;

interface MaskedInputProps extends Omit<InputProps, "value" | "onChange"> {
  mask: string;
  field: ControllerRenderProps<any, any>;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, field, ...props }) => {
    const { ref: iMaskRef } = useIMask(
      { mask },
      { onAccept: (value: any) => field.onChange(value) }
    );

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        const formRef = field.ref as React.RefCallback<HTMLInputElement>;
        formRef(node);

        const iMaskRefObject =
          iMaskRef as React.MutableRefObject<HTMLInputElement | null>;
        if (node) {
          iMaskRefObject.current = node;
        }
      },
      [iMaskRef, field.ref]
    );

    return (
      <Input
        {...props}
        ref={setRefs}
        name={field.name}
        onBlur={field.onBlur}
        defaultValue={field.value}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
