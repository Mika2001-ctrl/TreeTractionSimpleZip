/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const zip = searchParams.get("zip");

    if (!zip) {
        return NextResponse.json({ error: "ZIP is required" }, { status: 400 });
    }

    try {
        // Census Data
        const censusRes = await axios.get(
            `https://api.census.gov/data/2023/acs/acs5/subject?get=NAME,S0101_C01_001E,S1901_C01_012E,S1901_C01_013E,S1901_C01_001E,S2501_C01_010E,S2501_C01_001E,S1501_C02_015E,S1501_C02_016E,S1501_C02_017E&for=zip%20code%20tabulation%20area:${zip}&key=${process.env.CENSUS_API_KEY}`
        );
        const censusData = censusRes.data[1] || [];

        // City & State
        const zipRes = await axios.get(`https://api.zippopotam.us/us/${zip}`);
        const zipData = zipRes.data || {};
        const city = zipData.places?.[0]?.["place name"] || "N/A";
        const state = zipData.places?.[0]?.["state abbreviation"] || "N/A";
        const lat = zipData.places?.[0]?.latitude;
        const lon = zipData.places?.[0]?.longitude;

        // County from FCC API
        let county = "TBD";
        if (lat && lon) {
            const fccRes = await axios.get(
                `https://geo.fcc.gov/api/census/block/find?format=json&latitude=${lat}&longitude=${lon}`
            );
            county = fccRes.data?.County?.name || "TBD";
        }

        // Clean & check Bachelor's value
        let bachelorsRaw = parseFloat(censusData[8]);
        const bachelors =
            isNaN(bachelorsRaw) || bachelorsRaw < 0 ? null : bachelorsRaw;

        return NextResponse.json({
            zip,
            city,
            state,
            county,
            households: parseInt(censusData[1] || "0"),
            avgHouseholdIncome: parseInt(censusData[2] || "0"),
            avgPersonalIncome: parseInt(censusData[3] || "0"),
            medianHouseholdIncome: parseInt(censusData[4] || "0"),
            avgRent: parseInt(censusData[5] || "0"),
            avgHomeValue: parseInt(censusData[6] || "0"),
            highSchoolGrad: parseFloat(censusData[7] || "0"),
            bachelors,
            graduateDegree: parseFloat(censusData[9] || "0"),
        });
    } catch (error) {
        console.error("Error fetching ZIP data:", error);
        return NextResponse.json({ error: "Failed to fetch ZIP data" }, { status: 500 });
    }
}
