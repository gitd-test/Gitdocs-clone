import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LoadingAnimation from "../common/LoadingAnimation"

export default function Checkout({ plan, activePlanId, isLoading, handleCreateOrder }: { plan: any, activePlanId: number, isLoading: boolean, handleCreateOrder: () => void }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button disabled={plan.isActive || isLoading || plan.id < activePlanId} 
                variant="outline" 
                className={`w-full my-6 px-4 py-2 border-none rounded-lg transition-all duration-150 ${plan.isActive ? "bg-[#ededed]/50 text-black" : "bg-gradient-to-r from-[#8D61F6] to-[#1FABEB] text-[#ededed] hover:from-[#8D61F6]/80 hover:to-[#1FABEB]/80"}`}
        >{isLoading ? 
                    <span className="flex items-center gap-3 justify-center w-full"> 
                        <LoadingAnimation /> Processing...
                    </span>  
                    : plan.isActive ? "Current Plan" : plan.id > activePlanId ? "Upgrade" : "Downgrade"}
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[500px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold text-[#ededed] text-center">Checkout</SheetTitle>
          <SheetDescription className="text-center">
            Please fill in the details below to checkout.
          </SheetDescription>
        </SheetHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input id="name" value="Pedro Duarte" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                    Username
                    </Label>
                    <Input id="username" value="@peduarte" className="col-span-3" />
                </div>
            </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" onClick={handleCreateOrder}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
