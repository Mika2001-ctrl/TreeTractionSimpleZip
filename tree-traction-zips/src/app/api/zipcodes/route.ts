import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const zip = searchParams.get('zip');

    if (!zip) {
        return NextResponse.json({ error: 'ZIP code is required' }, { status: 400 });
    }

    try {
        // Fetch Census data
        const censusResponse = await axios.get(
            `https://api.census.gov/data/2021/acs/acs5?get=NAME,B01003_001E,B25001_001E,B25077_001E,B25003_002E,B19013_001E,B19301_001E&for=zip%20code%20tabulation%20area:${zip}&key=${process.env.CENSUS_API_KEY}`
        );

        const censusData = censusResponse.data[1] || [];

        // Fetch Zipcodestack data
        const zipResponse = await axios.get(`https://api.zipcodestack.com/v1/search?codes=${zip}&country=us`, {
            headers: { apikey: process.env.ZIPCODESTACK_API_KEY },
        });

        const zipData = zipResponse.data?.results?.[zip]?.[0] || {};
        const city = zipData.city || "N/A";
        const state = zipData.state || "N/A";

        return NextResponse.json({
            postalCode: zip,
            city,
            state,
            population: parseInt(censusData[1] || "0"),
            housingUnits: parseInt(censusData[2] || "0"),
            medianHomeValue: parseInt(censusData[3] || "0"),
            homeownershipRate: ((parseFloat(censusData[4] || "0") / parseFloat(censusData[2] || "1")) * 100).toFixed(2),
            medianHouseholdIncome: parseInt(censusData[5] || "0"),
            perCapitaIncome: parseInt(censusData[6] || "0"),
        });
    } catch (error) {
        console.error('Error fetching ZIP code data:', error);
        return NextResponse.json({ error: 'Failed to fetch ZIP code data' }, { status: 500 });
    }
}
