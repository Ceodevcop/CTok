import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PI_API_KEY = Deno.env.get("PI_API_KEY")!

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      }
    })
  }

  try {
    const { paymentId } = await req.json()
    
    // Validate payment ID format
    if (!/^[a-f0-9\-]{36}$/.test(paymentId)) {
      throw new Error("Invalid payment ID")
    }

    // Verify with Pi API
    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}`,
      {
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    if (!piResponse.ok) {
      throw new Error("Pi API request failed")
    }

    const paymentData = await piResponse.json()
    
    // Additional validation checks
    const isValid = paymentData.status === "completed" &&
                   paymentData.amount === 1 &&
                   paymentData.direction === "user_to_app"

    return new Response(
      JSON.stringify({ verified: isValid }),
      {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      }
    )
  }
})
