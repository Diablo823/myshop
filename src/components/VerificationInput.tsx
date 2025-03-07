import React from 'react';
import { Label } from "@/components/ui/label";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

interface VerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <LabelInputContainer className="mb-4">
      <Label className="text-center block">Verification Code</Label>
      <div className="flex justify-center items-center">
        <InputOTP
          value={value}
          onChange={onChange}  // Directly use the onChange prop
          maxLength={6}
          className="mt-2"
          disabled={disabled}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {error && <p className="text-sm text-red-500 mt-1 text-center">{error}</p>}
    </LabelInputContainer>
  );
};

export default VerificationInput;