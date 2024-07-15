enum ResponseCode{
    SUCCESS = 'SU',
    VALIDATION_FAIL = 'VF',
    DATABASE_ERROR = 'DBE',
    DUPPLICATE_FESTIVAL = 'DF',
    DUPLICATE_NICKNAME = "DN",
    MAIL_FAIL = "MF",
    DUPLICATE_EMAIL = "DE",
    CERTIFICATION_FAIL = "CF",
    DUPLICATE_PHONE = "DP",
    DO_NOT_HAVE_PERMISSION = "DNHP",
    SING_IN_FAIL = "SIF",
    NOT_EXISTED_USER = "NU",
    DUPLICATE_ID = "DI",
    FALSE_AGREEMENT = "FA"
};

export default ResponseCode;