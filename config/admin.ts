export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'hm1733d33y0tcv2cp3sk7bikupadkl4g'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', '4hpkrrkv02w65d7hwl46cwsfjm7dn97g'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', '3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
