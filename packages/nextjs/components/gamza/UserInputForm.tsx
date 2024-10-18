"use client";

import { useState } from "react";
import Link from "next/link";
import { Address } from "viem";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth/Input";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth/common";

export default function UserInputForm() {
  const [addressCurrency0, setAddressCurrency0] = useState<Address>("");
  const [addressCurrency1, setAddressCurrency1] = useState<Address>("");
  const [uint24Fee, setUint24Fee] = useState<string>("");
  const [int24TickSpacing, setInt24TickSpacing] = useState<string>("");
  const [addressHooks, setAddressHooks] = useState<Address>("");

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(event.type);
  };

  const onClickLinkSetSampleHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // @see https://unichain-sepolia.blockscout.com/tx/0x51bf9fdd076d4076212562d50caf012fccc7efc3a10e93efb358c30e08855f0a
    setAddressCurrency0(ZERO_ADDRESS);
    setAddressCurrency1("0x6f0cd9ac99c852bdba06f72db93078cba80a32f5");
    setUint24Fee("0");
    setInt24TickSpacing("60");
    setAddressHooks("0x7d61d057dd982b8b0a05a5871c7d40f8b96dd040");
  };

  return (
    <form className="card-body" onSubmit={onSubmitHandler}>
      {/* Input PoolKey Form */}
      <div className="card-title">Input PoolKey Form</div>

      {/* Currency currency0 */}
      <label className="form-control">
        <span className="label-text">Currency currency0</span>
        <AddressInput
          placeholder="address 0x..."
          value={addressCurrency0}
          onChange={value => setAddressCurrency0(value)}
        />
      </label>

      {/* Currency currency1 */}
      <label className="form-control">
        <div className="label">
          <span className="label-text">Currency currency1</span>
        </div>
        <AddressInput
          placeholder="address 0x..."
          value={addressCurrency1}
          onChange={value => setAddressCurrency1(value)}
        />
      </label>

      {/* uint24 fee */}
      <label className="form-control">
        <div className="label">
          <span className="label-text">uint24 fee</span>
        </div>
        <IntegerInput
          placeholder="uint24 fee"
          value={uint24Fee}
          onChange={value => setUint24Fee(value as string)}
          disableMultiplyBy1e18
        />
      </label>

      {/* int24 tickSpacing */}
      <label className="form-control">
        <div className="label">
          <span className="label-text">int24 tickSpacing</span>
        </div>
        <IntegerInput
          placeholder="int24 tickSpacing"
          value={int24TickSpacing}
          onChange={value => setInt24TickSpacing(value as string)}
          disableMultiplyBy1e18
        />
      </label>

      {/* IHooks hooks */}
      <label className="form-control">
        <div className="label">
          <span className="label-text">IHooks hooks</span>
        </div>
        <AddressInput placeholder="address 0x..." value={addressHooks} onChange={value => setAddressHooks(value)} />
      </label>

      {/* Submit Button */}
      <div className="form-control mt-6">
        <label className="label">
          <Link href="#" className="label-text-alt link-hover" onClick={onClickLinkSetSampleHandler}>
            Need a sample?
          </Link>
        </label>
        <button className="btn btn-active">Submit</button>
      </div>
    </form>
  );
}
