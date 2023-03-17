
export enum PasswordRegexError {
    charOrNumberDuplicated = "the password contains characters or numbers duplicated",
    policyRequirements = "the password must meet the password policy requirements"
}

export enum PasswordError {
    samePassword = "the password confirmation does not match",
    maxLen = "the password must be max 20 characters"
}

export enum CredentialsValidatorError {
    email = "Invalid email address"
}

export enum Auth {
    justAuthenticated = "You have already authenticated"
}

// invalid type error messages
export const invalid_type = (constant: string, name?: string) => `${name ?? ""} ${constant}`;

export const invalid_type_email = (name?: string) => invalid_type("must be a valid email", name);
export const invalid_type_url = (name?: string) => invalid_type("must be a valid url", name);
export const invalid_type_string = (name?: string) => invalid_type("must be a string", name);  
export const invalid_type_number = (name?: string) => invalid_type("must be a number", name);
export const invalid_type_positive_number = (name?: string) => invalid_type("must be a positive number", name);
export const invalid_type_boolean = (name?: string) => invalid_type("must be a boolean", name);
export const invalid_type_array = (name?: string) => invalid_type("must be an array", name);
export const invalid_type_bigint = (name?: string) => invalid_type("must be a bigint", name);
export const invalid_type_int = (name?: string) => invalid_type("must be a int", name);
export const invalid_type_date = (name?: string) => invalid_type("must be a date", name);
export const invalid_type_regex = (name?: string) => invalid_type("must be a regex", name);
export const invalid_type_function = (name?: string) => invalid_type("must be a function", name);
export const invalid_type_symbol = (name?: string) => invalid_type("must be a symbol", name);
export const invalid_type_string_array = (name?: string) => invalid_type("must be an array of strings", name);
export const invalid_type_number_array = (name?: string) => invalid_type("must be an array of numbers", name);
export const invalid_type_boolean_array = (name?: string) => invalid_type("must be an array of booleans", name);
export const invalid_type_bigint_array = (name?: string) => invalid_type("must be an array of bigints", name);
export const invalid_type_int_array = (name?: string) => invalid_type("must be an array of ints", name);
export const invalid_type_date_array = (name?: string) => invalid_type("must be an array of dates", name);
export const invalid_type_regex_array = (name?: string) => invalid_type("must be an array of regexes", name);


export const invalid_min_length = (min: number, name?: string) => `${name ?? ""} must be at least ${min} characters`;
export const invalid_max_length = (max: number, name?: string) => `${name ?? ""} must be at most ${max} characters`;
export const required_error = (name?: string) => `${name ?? ""} is required`;