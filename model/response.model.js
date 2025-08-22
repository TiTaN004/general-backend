import z from "zod";


export const responseModel = z.object({
    name: z.string().min(2,"name must be at lest 2 character long").max(50),
    email: z.string().email("invalid email address"),
    mobile: z.string().regex(/^[6-9]\d{9}$/,"mobile number must be 10 digits"),
    message: z.string().max(500).optional(),
})