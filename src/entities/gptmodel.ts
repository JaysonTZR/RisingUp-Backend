export interface IAIPrompt {
    minimumBudget: number,
    maximumBudget: number,
    industryField: string,
    companySize: number,
    state: string,
    companyType: CompanyTypeEnum,
    companyMaturity: CompanyMaturityEnum,
}

export enum CompanyTypeEnum {
    B2B = 1,
    B2C = 2,
    Others = 3,
}

export enum CompanyMaturityEnum {
    Infant = 1,
    Adoloscent = 2,
    Matured = 3,
}