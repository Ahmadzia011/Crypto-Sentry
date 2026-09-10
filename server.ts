import express from "express";
import "dotenv/config";
import { prisma } from "./app/lib/prisma";
import cors from "cors";
import { Resend } from "resend";


const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY)
const PORT = Number(process.env.PORT || 3001);
const HOST = "0.0.0.0";




const coingeckoURL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,tether,solana,&vs_currencies=usd&include_24hr_change=true";
let currentPrices: number[] = [];
let baselinePrices: number[] = [];
let assets: any = [];
let change: any = null
let user_mail: any = null


//API Endpoint

app.post("/price", (req,res)=> {
  console.log(priceCache)
 user_mail = req.body.email
 console.log(user_mail)
res.json({priceCache}
)
})

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    hasPriceCache: Boolean(priceCache),
    lastUpdated: priceCache?.lastUpdated ?? null,
  });
});


// --- 1. Helpers ---


async function sendEmail(name:string, price:number, percnt:number) {
    try{
  console.log("Email sent")
  const {data, error} = await resend.emails.send({
    from: "Crypto Sentry <onboarding@resend.dev>",
    to: user_mail,
    subject: `⚠️ ALERT: ${name} dropped ${percnt}%`,
    react:`<div> ${name} is dropped by ${percnt} now the current price is ${price}`
  })
  }
  catch{
    console.log("Error sending mail")
  }
}


async function creatAlert(id:number, name:string, price:number, percnt:number) {
    await prisma.cryptoAlert.create({
        data: {
            asset_id: id.toString(),
            asset_name: name,
            price_at_drop: price,
            drop_percentage: percnt
      },
    });
    sendEmail(name, price, percnt)

}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// This is your "MemoryCache" for now
let priceCache: any = null;

async function fetchWithRetry(url: string, retries: number = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        const wait_time = Math.pow(2, i) * 1000;
        console.log(`⚠️ Rate limited. Waiting ${wait_time}ms...`);
        await sleep(wait_time);
        continue;
      }

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error(`❌ Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await sleep(1000); // Small pause for network errors
    }
  }
}



// ---------------------------------------------------- 2. Background Worker --------------------------------------------------------------


async function main() {
   try {
    assets = [];
    console.log("--- Checking Prices ---");
    const data = await fetchWithRetry(coingeckoURL);
   
    
    let j = 0;
    Object.entries(data).forEach(([name, value]: [string, any]) => {
      let asset = {
        asset_name: name,
        asset_id: j,
        asset_price: value["usd"],
        asset_24h: value["usd_24h_change"],
        safe_state: ((((value["usd"]- baselinePrices[j])/ baselinePrices[j]) * 100) <= -2)?false : true
      };
      baselinePrices = [...currentPrices]
      console.log('checking baseprices', baselinePrices)
      if (baselinePrices.length > 0) {
      console.log('found baseprices')

        change =
          ((value["usd"] - ( + baselinePrices[j])) / (10000 + baselinePrices[j])) * 100;
        if (change <= -2) {
          console.log(`🚨 ALERT: ${name} dropped ${change.toFixed(2)}%`);
          creatAlert(asset.asset_id, asset.asset_name, asset.asset_price, change)
          console.log('danger zone')
        } else if (change >= 2) {
          console.log(`🚀 MOON: ${name} rose ${change.toFixed(2)}%`);
        } else {
          console.log(`✅ ${name} is stable at ${value["usd"]}`);
        }
      }
        currentPrices[j] = value["usd"];
        j = j + 1;
        assets.push(asset);
    });

    // Save to cache
    priceCache = {
      data: assets,
      lastUpdated: new Date().toISOString(),
      change,
  
    };

    console.log(priceCache, 'this is price cache')

  } catch (err) {
    console.log(err);
    console.error(
      "🚨 Worker Error: All retries failed. Will try again in 30s.",
    );
  }
}

// -----------------------------------------------------------------------------------------


// To run the function immediately on first run and then after 30 seconds
main();
setInterval(main, 30000); // 30-second interval


app.listen(PORT, HOST, () => {
  console.log(`Sentry Worker active on http://${HOST}:${PORT}`);
});
