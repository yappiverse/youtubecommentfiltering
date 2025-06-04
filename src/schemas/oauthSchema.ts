import z from "zod";

export const oauthSchema = z.object({
    web: z.object({
        client_id: z.string().min(1, "client_id is required"),
        project_id: z.string(),
        auth_uri: z.string().url("auth_uri must be a valid URL"),
        token_uri: z.string().url("token_uri must be a valid URL"),
        auth_provider_x509_cert_url: z.string().url("cert_url must be a valid URL"),
        client_secret: z.string().min(1, "client_secret is required"),
        redirect_uris: z.array(z.string().url()),
        javascript_origins: z.array(z.string().url()),
    }),
});
