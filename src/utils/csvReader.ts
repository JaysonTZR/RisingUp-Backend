import fs = require('fs');
import path from 'path';
import csv from 'csv-parser';


const  readCSVFile = async (filename: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(path.join(__dirname, filename))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

export default {
    readCSVFile,
}