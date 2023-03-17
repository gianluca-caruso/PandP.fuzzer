import { invalid_type, invalid_type_number, required_error } from '@/utils/error';
import z, { boolean } from 'zod';


//generate z.rawcreateparams from the validator
export const itemsParams: z.RawCreateParams = {
    description: "Items",
    required_error: required_error("Items"),
    invalid_type_error: invalid_type_number("Items"),
};

export const pageParams: z.RawCreateParams = {
    description: "Page",
    required_error: required_error("Page"),
    invalid_type_error: invalid_type_number("Page"),
};

export const ItemsValidator = z
    .number(itemsParams)
    .nonnegative({ message: required_error("Items") });
export const PageValidator = z
    .number(pageParams)
    .nonnegative({ message: required_error("Page") });

// extract the pagination params from the validator
export const paginationParams: z.RawCreateParams = {
    description: "Pagination",
    required_error: required_error("Pagination"),
};

export const Pagination = z.object({
    items: ItemsValidator,
    page: PageValidator,
}, paginationParams);

export type Pagination = z.infer<typeof Pagination> & { stop?: boolean };