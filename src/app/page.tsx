import Image from "next/image";

export default async function Home() {
  let mockData = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h"
  );
  let json = (await mockData.json()) as any;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {json.map((item: any, index: number) => {
        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-32 bg-gradient-to-b from-zinc-200 to-white rounded-xl p-4 backdrop-blur-2xl dark:from-inherit dark:to-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-semibold">{item.name}</div>
                  </div>
                  <div className="text-2xl font-semibold">
                    {item.current_price}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {item.price_change_percentage_24h}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.market_cap_change_24h}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
