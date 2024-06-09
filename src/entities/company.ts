export interface ICompany {
    X_ID: number,
    Company_Name: string,
    Description: string,
    Company_Focus: string,
    Industry: string,
    Company_Address: string,
    Valuation: number,
    City: string,
    Country: string,
    State: string,
    Company_Reg_No: string,
    Founded_Date: Date,
    Operational_Status: string, //enum
    Company_Size: string, //enum
    Ownership: string, //enum
    Funding_Round: string; //enum
    Investment: string; //enum
    Investment_Date: Date,
    Investor_Company: string;
    Funding_Money: number;
}

export interface IGetCompanyInfoResponse {
    X_ID: number,
    Company_Name: string,
    Description: string,
    Company_Focus: string,
    Industry: string,
    Company_Address: string,
    Valuation: number,
    City: string,
    Country: string,
    State: string,
    Company_Reg_No: string,
    Founded_Date: Date,
    Operational_Status: string, //enum
    Company_Size: string, //enum
    Ownership: string, //enum
    Funding_Round: string; //enum
    Investment: string; //enum
    InvestmentHistory: ICompanyInvestmentHistory[];
}

export interface ICompanyInvestmentHistory {
    Investment_Date: Date,
    Investor_Company: string;
    Funding_Money: number;
}