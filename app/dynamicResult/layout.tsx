"use client";

import { SSEProvider } from "@/components/request/SSEManager";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Layout({
  children,
  StaticAnalysis,
  TraceLog,
  poolKey,
  TokenPrice,
  EstimatedGasUsage,
  AmountDeltaSummary,
}: {
  children: React.ReactNode;
  StaticAnalysis: React.ReactNode;
  TraceLog: React.ReactNode;
  poolKey: React.ReactNode;
  TokenPrice: React.ReactNode;
  EstimatedGasUsage: React.ReactNode;
  AmountDeltaSummary: React.ReactNode;
}) {
  return (
    <SSEProvider>
      <div className="flex flex-col rounded-[15px]">
        {StaticAnalysis}
        {TraceLog}
        <div className="z-49 rounded-[15px]">
          <ResizablePanelGroup direction="horizontal" className="min-h-[200px]">
            <ResizablePanel className="rounded-[15px]">
              <div className="flex flex-col gap-4 overflow-x-auto border-2 border-dotted">
                <div className="flex overflow-x-auto m-2 min-w-[1040px] rounded-[15px]">
                  {poolKey}
                  {TokenPrice}
                </div>
                {AmountDeltaSummary}
              </div>
            </ResizablePanel>
            <ResizablePanel className="overflow-x-auto min-w-[370px] max-w-[450px] md:min-w-[370px] border-2 border-dotted">
              {EstimatedGasUsage}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        {children}
      </div>
    </SSEProvider>
  );
}
