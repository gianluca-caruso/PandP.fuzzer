import { Themes } from '@/context/global/theme';
import z, { boolean } from 'zod';

//generate z.rawcreateparams from the validator 
export const themeParams: z.RawCreateParams = {
    description: "Theme",
    required_error: "Theme is required",
    invalid_type_error: "Theme must be a string",
};

export const apiKeyParams: z.RawCreateParams = {
    description: "API Key",
    required_error: "API Key is required",
    invalid_type_error: "API Key must be a string",
};

export const URLEndpointParams: z.RawCreateParams = {
    description: "URL Endpoint",
    required_error: "URL Endpoint is required",
    invalid_type_error: "URL Endpoint must be a string",
};

export const ThemeValidator = z.enum(Themes, themeParams);
export const ApiKeyValidator = z.string(apiKeyParams);
export const URLEndpointValidator = z.string(URLEndpointParams).url({ message: "URL Endpoint must be a valid URL" });

// generate a type from the validator adn export 
export type Theme = z.infer<typeof ThemeValidator>;
export type ApiKey = z.infer<typeof ApiKeyValidator>;
export type URLEndpoint = z.infer<typeof URLEndpointValidator>;


export const SettingsValidator = z.object({
    theme: ThemeValidator.optional(),
    apiKey: ApiKeyValidator,
    URLEndpoint: URLEndpointValidator
});

export type Settings = z.infer<typeof SettingsValidator>;