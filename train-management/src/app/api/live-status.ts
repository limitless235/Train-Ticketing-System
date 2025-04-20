import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const RAPIDAPI_HOST = "indian-railway-irctc.p.rapidapi.com";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { trainNo, startDay } = req.query;

  // Validate input
  if (!trainNo || isNaN(Number(startDay))) {
    return res.status(400).json({ success: false, error: "Invalid parameters" });
  }

  try {
    // Convert startDay to YYYYMMDD format
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + Number(startDay));
    const departureDate = baseDate.toISOString().slice(0,10).replace(/-/g, '');

    const response = await axios.get("https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/status", {
      params: {
        departure_date: departureDate,
        isH5: "true",
        client: "web",
        train_number: trainNo
      },
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
      }
    });

    res.status(200).json({ 
      success: true,
      data: response.data 
    });
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      error: error.response?.data?.message || "Failed to fetch train status" 
    });
  }
}
