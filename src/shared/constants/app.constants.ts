import path from 'path';

export default class AppConstants {
    public static readonly APP_STATIC_UPLOAD_POST_ESTATE: string = 'public';
    public static readonly APP_PATH_FILE_POST_ESTATE_DEFAULT: string = '/public/post-estate/';
    public static readonly APP_STATIC: string = path?.join(__dirname, '../../public');
    public static readonly APP_STATIC_DELETE: string = path?.join(__dirname, '../..');
    public static readonly APP_PATH_FILE_DEFAULT: string = path?.join(__dirname + './../../public/post-estate');

    public static readonly APP_DEFAULT_LIMIT: number = 10;
    public static readonly APP_DEFAULT_PAGE: number = 1;
    public static readonly APP_DEFAULT_IS_DELETE: number = 0;

    public static readonly PATH_SERVICE_PRODUCT_POST_ESTATE: string = '/service-event/post-estate-warning';

    // Cookie
    public static readonly KEY_COOKIE_AUTHENTICATION: string = 'authorization';
    public static readonly KEY_COOKIE_AUTHENTICATION_ADMIN: string = 'authorization-admin';
    public static readonly KEY_COOKIE_ADMIN_SETTING_SECRET_KEY: string = 'secretKey';
    public static readonly KEY_COOKIE_PRIVATEKEY: string = 'secrete';

    // Message socket tcp notification
    public static readonly TCP_VERIFY_EMAIL_OTP: string = 'VERIFY_EMAIL_OTP';
    public static readonly TCP_CUSTOMER_REGISTER_SUCCESS: string = 'CUSTOMER_REGISTER_SUCCESS';

    // message
    public static readonly MESSAGE_SEVER_SUCCESS: string = 'Success';
    public static readonly MESSAGE_SEVER_NOT_FOUND: string = 'Not found';
    public static readonly MESSAGE_SEVER_ERROR: string = 'Internal Server Error';
    public static readonly MESSAGE_BAD_REQUEST: string = 'Bad Request';
    public static readonly MESSAGE_BAD_AUTHORIZATION: string = 'Not authorized';
    public static readonly MESSAGE_BAD_FORBIDDEN: string = 'Forbidden resource';
    public static readonly MESSAGE_UNAUTHORIZED: string = 'Unauthorized';

    public static readonly MESSAGE_CUSTOMER_NOT_EXIST: string = 'Customer not exist';
    public static readonly MESSAGE_CUSTOMER_OTP_INVALID: string = 'Opt invalid';
    public static readonly MESSAGE_CUSTOMER_EMAIL_INVALID: string = 'Email invalid';
    public static readonly MESSAGE_CUSTOMER_AUTH_INVALID: string = 'Username or password invalid';
    public static readonly MESSAGE_CUSTOMER_AUTH_IS_LOCKED: string = 'Your account has been locked';
    public static readonly MESSAGE_ADMIN_AUTH_NOT_EXIST: string = 'Account Admin does not exist';
    public static readonly MESSAGE_ADMIN_REFRESH_TOKEN_INVALID: string = 'Refresh token invalid';
    public static readonly MESSAGE_REQUIRE_PROVINCE: string = 'Province code is require';
    public static readonly MESSAGE_REQUIRE_DISTRICT_OR_TYPE: string = 'Code district is require or type number';

    // Provider
    public static readonly PROVIDER_REDIS_CLIENT: string = 'REDIS_CLIENT';

    // Key redis
    public static readonly KEY_REDIS_PROVINCE: string = 'province';
    public static readonly KEY_REDIS_DISTRICT: string = 'district';
    public static readonly KEY_REDIS_WARD: string = 'ward';
    public static readonly KEY_REDIS_USER: string = 'user';
    public static readonly KEY_REDIS_ADMIN: string = 'admin';
    public static readonly KEY_REDIS_USER_EX: number = 136800;
}
