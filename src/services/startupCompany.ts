import { ICompany, ICompanyInvestmentHistory, IGetCompanyInfoResponse } from "../entities/company"
import csvReader from "../utils/csvReader"

export default class StartupCompanyService {
    async getCompanyInfoFromExcel(companyNames: string[]): Promise<IGetCompanyInfoResponse[]> {
        const csvData = await csvReader.readCSVFile('../../assets/Startup_Dataset.csv')
        
        let result: IGetCompanyInfoResponse[] = [];
        companyNames.forEach((companyName) => {
            const companyInfo = csvData.filter((company: ICompany) => company.Company_Name === companyName)
            
            let companyInvestmentHistory: ICompanyInvestmentHistory[] = [];
            companyInfo.forEach((info: ICompany) => {
                const {
                    Investment_Date,
                    Investor_Company,  
                    Funding_Money,
                } = info;

                const investmentHistory = {
                    Investment_Date,
                    Investor_Company,
                    Funding_Money,
                }

                companyInvestmentHistory.push(investmentHistory);
            })

            const finalCompanyInfo: IGetCompanyInfoResponse = { ...companyInfo[0], InvestmentHistory: companyInvestmentHistory }

            result.push(finalCompanyInfo);
        })

        console.log(result);

        return result;
    }

    async getCompanyNameFromApiResponse(apiResponse: string) {
        const ApiNumberingArray: string[] = Object.values(ApiResponseNumberingEnum);
        
        let companyNames: string[] = [];
        apiResponse.split('\n').forEach((line) => {
            if (ApiNumberingArray.includes(line.substring(0,2))) {
                companyNames.push(line.substring(3))
            }
        })

        return companyNames;
    }
}

export enum ApiResponseNumberingEnum {
    First = '1.',
    Second = '2.',
    Third = '3.',
    Fourth = '4.',
    Fifith = '5.'
}