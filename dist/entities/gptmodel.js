"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyMaturityEnum = exports.CompanyTypeEnum = void 0;
var CompanyTypeEnum;
(function (CompanyTypeEnum) {
    CompanyTypeEnum[CompanyTypeEnum["B2B"] = 1] = "B2B";
    CompanyTypeEnum[CompanyTypeEnum["B2C"] = 2] = "B2C";
    CompanyTypeEnum[CompanyTypeEnum["Others"] = 3] = "Others";
})(CompanyTypeEnum || (exports.CompanyTypeEnum = CompanyTypeEnum = {}));
var CompanyMaturityEnum;
(function (CompanyMaturityEnum) {
    CompanyMaturityEnum[CompanyMaturityEnum["Infant"] = 1] = "Infant";
    CompanyMaturityEnum[CompanyMaturityEnum["Adoloscent"] = 2] = "Adoloscent";
    CompanyMaturityEnum[CompanyMaturityEnum["Matured"] = 3] = "Matured";
})(CompanyMaturityEnum || (exports.CompanyMaturityEnum = CompanyMaturityEnum = {}));
