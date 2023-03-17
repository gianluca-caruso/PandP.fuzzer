import { CredentialsValidatorError, invalid_min_length, invalid_type, invalid_type_email, invalid_type_number, invalid_type_string, PasswordError, PasswordRegexError, required_error } from "@/utils/error";
import z from 'zod';
import { regexFindDuplicated, regexPasswordStrong } from "@/utils/auth/password";

export const PasswordValidator = z
    .string({ required_error: required_error("password"), invalid_type_error: invalid_type_string("password") })
    .max(20, { message: PasswordError.maxLen })
    .regex(regexPasswordStrong, { message: PasswordRegexError.policyRequirements })
    .refine((str) => !regexFindDuplicated.test(str), { message: PasswordRegexError.charOrNumberDuplicated });

export const EmailValidator = z
    .string()
    .email({ message: invalid_type_email() });

export const NameValidator = z
    .string({ invalid_type_error: invalid_type_string("name") })
    .min(3, { message: invalid_min_length(3, "name") });

export const CredentialsValidator = z.object({
    email: EmailValidator,
    password: PasswordValidator
});

export const UserValidator = CredentialsValidator.extend({ name: NameValidator });


export type UserValidator = z.infer<typeof UserValidator>;
export type Credentials = z.infer<typeof CredentialsValidator>;
