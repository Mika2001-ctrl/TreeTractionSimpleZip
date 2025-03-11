import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const zip = searchParams.get('zip');

    if (!zip) {
        return NextResponse.json({ error: 'ZIP code is required' }, { status: 400 });
    }

    try {
        const CENSUS_API_KEY = process.env.CENSUS_API_KEY;
        if (!CENSUS_API_KEY) {
            return NextResponse.json({ error: 'Missing Census API Key' }, { status: 500 });
        }

        // Fetch Year Structure Built Data from the Census API
        const censusUrl = `https://api.census.gov/data/2023/acs/acs5?get=NAME,B25034_002E,B25034_003E,B25034_004E,B25034_005E,B25034_006E,B25034_007E,B25034_008E,B25034_009E,B25034_010E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_API_KEY}`;
        const response = await axios.get(censusUrl);
        console.log("✅ Census API Response:", response.data); // Debugging

        if (!Array.isArray(response.data) || response.data.length < 2) {
            return NextResponse.json({ error: "Invalid Census data" }, { status: 500 });
        }

        const keys = response.data[0];
        const values = response.data[1];

        const housingData = {
            "2020 or later": parseInt(values[keys.indexOf("B25034_002E")]) || 0,
            "2010-2019": parseInt(values[keys.indexOf("B25034_003E")]) || 0,
            "2000-2009": parseInt(values[keys.indexOf("B25034_004E")]) || 0,
            "1990-1999": parseInt(values[keys.indexOf("B25034_005E")]) || 0,
            "1980-1989": parseInt(values[keys.indexOf("B25034_006E")]) || 0,
            "1970-1979": parseInt(values[keys.indexOf("B25034_007E")]) || 0,
            "1960-1969": parseInt(values[keys.indexOf("B25034_008E")]) || 0,
            "1950-1959": parseInt(values[keys.indexOf("B25034_009E")]) || 0,
            "Before 1950": parseInt(values[keys.indexOf("B25034_010E")]) || 0,
        };

        return NextResponse.json({ zip, housingData });

    } catch (error) {
        console.error("❌ Housing API Error:", error);
        return NextResponse.json({ error: "Failed to fetch housing data" }, { status: 500 });
    }
}
