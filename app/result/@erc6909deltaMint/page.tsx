"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function TetherLogo() {
  return (
    <Avatar>
      <AvatarImage
        src='https://cdn.worldvectorlogo.com/logos/tether.svg'
        alt='tether'
      />
      <AvatarFallback>Tether</AvatarFallback>
    </Avatar>
  );
}

export function EtherLogo() {
  return (
    <Avatar>
      <AvatarImage
        src='https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg'
        alt='tether'
      />
      <AvatarFallback>Ether</AvatarFallback>
    </Avatar>
  );
}

export default function ERC6909DeltaBurnResultPage() {
  const [assetType, setAssetType] = useState<"ERC20" | "ERC6909">("ERC6909");
  const [methodType, setMethodType] = useState<"Swap" | "AddLiquidity" | "RemoveLiquidity" | "Donate">("Swap");
  const [mintBurn, setMintBurn] = useState<"Mint" | "Burn">("Mint");
  const [swapExactInOut, setSwapExactInOut] = useState<"ExactIn" | "ExactOut">(
    "ExactIn"
  );

  return (
    <>
      <RadioStateHandler/>
    </>
  );
}

export function RadioStateHandler() {
  const [selectedValue, setSelectedValue] = useState("comfortable");

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <RadioGroup
        defaultValue={selectedValue}
        onValueChange={handleValueChange}
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='default' id='r1' />
          <Label htmlFor='r1'>Default</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='comfortable' id='r2' />
          <Label htmlFor='r2'>Comfortable</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='compact' id='r3' />
          <Label htmlFor='r3'>Compact</Label>
        </div>
      </RadioGroup>
      <div className='mt-4'>Selected Value: {selectedValue}</div>
    </div>
  );
}
