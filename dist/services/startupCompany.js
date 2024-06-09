"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseNumberingEnum = void 0;
const csvReader_1 = __importDefault(require("../utils/csvReader"));
class StartupCompanyService {
    getCompanyInfoFromExcel(companyNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvData = yield csvReader_1.default.readCSVFile('../../assets/Startup_Dataset.csv');
            let result = [];
            companyNames.forEach((companyName) => {
                const companyInfo = csvData.filter((company) => company.Company_Name === companyName);
                let companyInvestmentHistory = [];
                companyInfo.forEach((info) => {
                    const { Investment_Date, Investor_Company, Funding_Money, } = info;
                    const investmentHistory = {
                        Investment_Date,
                        Investor_Company,
                        Funding_Money,
                    };
                    companyInvestmentHistory.push(investmentHistory);
                });
                const finalCompanyInfo = Object.assign(Object.assign({}, companyInfo[0]), { InvestmentHistory: companyInvestmentHistory });
                result.push(finalCompanyInfo);
            });
            console.log(result);
            return result;
        });
    }
    getCompanyNameFromApiResponse(apiResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const ApiNumberingArray = Object.values(ApiResponseNumberingEnum);
            let companyNames = [];
            apiResponse.split('\n').forEach((line) => {
                if (ApiNumberingArray.includes(line.substring(0, 2))) {
                    companyNames.push(line.substring(3));
                }
            });
            return companyNames;
        });
    }
}
exports.default = StartupCompanyService;
var ApiResponseNumberingEnum;
(function (ApiResponseNumberingEnum) {
    ApiResponseNumberingEnum["First"] = "1.";
    ApiResponseNumberingEnum["Second"] = "2.";
    ApiResponseNumberingEnum["Third"] = "3.";
    ApiResponseNumberingEnum["Fourth"] = "4.";
    ApiResponseNumberingEnum["Fifith"] = "5.";
})(ApiResponseNumberingEnum || (exports.ApiResponseNumberingEnum = ApiResponseNumberingEnum = {}));
