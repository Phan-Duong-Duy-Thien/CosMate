import { cn } from "@/lib/utils"

/** Lucide icons inside Ant `Input` prefix / suffix */
export const authInputAffixIconClassName = "h-4 w-4 shrink-0 text-cosmate-mauve"

/**
 * Neo-style classes for Ant Design `Input` / `Input.Password` (outlined affix wrapper).
 * Applied via `className` on the component root.
 */
export const authAffixInputClassName = cn(
  "!min-h-12 !rounded-xl !border-[3px] !border-indigo-950 !bg-white !px-3 !py-2",
  "!shadow-[3px_3px_0_0_rgba(30,27,75,0.12)]",
  "transition-[border-color,box-shadow]",
  "hover:!border-indigo-950",
  "[&:not(.ant-input-affix-wrapper-disabled):focus-within]:!border-cosmate-pink/85",
  "[&:not(.ant-input-affix-wrapper-disabled):focus-within]:!shadow-[4px_4px_0_0_rgba(30,27,75,0.18)]",
  "[&.ant-input-affix-wrapper-disabled]:!cursor-not-allowed [&.ant-input-affix-wrapper-disabled]:!opacity-55",
  "[&.ant-input-status-error]:!border-red-600 [&.ant-input-status-error]:!shadow-[3px_3px_0_0_rgba(220,38,38,0.28)]",
  "[&_.ant-input]:!min-h-0 [&_.ant-input]:!border-none [&_.ant-input]:!bg-transparent [&_.ant-input]:!shadow-none",
  "[&_.ant-input]:!font-semibold [&_.ant-input]:!text-indigo-950",
  "[&_.ant-input::placeholder]:!text-indigo-900/45",
  "[&_.ant-input-password-icon]:!text-indigo-950/80 [&_.ant-input-password-icon:hover]:!text-cosmate-pink"
)
