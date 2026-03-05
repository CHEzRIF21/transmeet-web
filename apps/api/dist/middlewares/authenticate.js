"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const supabase_js_1 = require("@supabase/supabase-js");
const errors_js_1 = require("../utils/errors.js");
const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
const supabase = supabaseUrl && supabaseServiceKey ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey) : null;
async function authenticate(request, reply) {
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        throw new errors_js_1.UnauthorizedError();
    }
    if (!supabase) {
        throw new errors_js_1.UnauthorizedError();
    }
    const { data: { user }, error, } = await supabase.auth.getUser(token);
    if (error || !user) {
        throw new errors_js_1.UnauthorizedError();
    }
    request.user = {
        id: user.id,
        email: user.email ?? undefined,
        role: user.user_metadata?.role ?? undefined,
    };
}
//# sourceMappingURL=authenticate.js.map