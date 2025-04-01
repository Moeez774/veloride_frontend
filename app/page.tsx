import NearRides from "@/components/main/NearRides"
import RideConnect from "@/components/main/RideConnect"

export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-20">
      <RideConnect />

      <div className="w-full max-w-6xl mx-auto h-[1px] bg-[#c9c9c954]"></div>

      <NearRides />
    </div>
  )
}
