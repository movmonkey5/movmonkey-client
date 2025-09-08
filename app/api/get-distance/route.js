// app/api/get-distance/route.js

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Origin and destination are required" },
      { status: 400 },
    );
  }

  const apiKey = "AIzaSyCjIiFKDCLg52pdIpDJTvmghhSFO0ywqZM";
  
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Google Distance Matrix API Response:", data);
    
    if (data.status === "OK") {
      const result = data.rows[0].elements[0];
      
      if (result.status === "OK") {
        // Extract the numeric part of distance.text
        const distanceValue = parseFloat(
          result.distance.text.replace(/[^\d.]/g, ""),
        );
        return NextResponse.json({
          distance: distanceValue,
          duration: result.duration.text,
        });
      } else {
        return NextResponse.json({ 
          error: `Route calculation failed: ${result.status}`,
          details: result 
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({ 
        error: data.error_message || `API Error: ${data.status}`,
        details: data,
        apiKey: apiKey ? "API key present" : "API key missing"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Distance Matrix API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
