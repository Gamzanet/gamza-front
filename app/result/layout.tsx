import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMockedComponent2ResponseByIndex } from "@/utils/ResponseMapper";

export default function Layout({
  children,
  comp0,
  comp1,
  EstimatedGasUsage,
  PoolKey,
  TokenPrice,
  erc6909deltaBurn,
  ERCDeltaQueryTable,
}: {
  children: React.ReactNode;
  comp0: React.ReactNode;
  comp1: React.ReactNode;
  EstimatedGasUsage: React.ReactNode;
  PoolKey: React.ReactNode;
  TokenPrice: React.ReactNode;
  erc6909deltaBurn: React.ReactNode;
  ERCDeltaQueryTable: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Collapsible>
        <CollapsibleTrigger className="font-bold color-primary opacity-50 hover:opacity-100">
          Trace Log (click to expand)
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="min-h-[400px] max-h-600[px] rounded-lg border md:min-w-[450px] hover:overflow-auto">
            {/* // TODO: enable later <CodeHighlighter codeString={sampleTrace} /> */}
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      <div>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px] rounded-lg border md:min-w-[450px]"
        >
          <ResizablePanel>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                {PoolKey}
                {TokenPrice}
              </div>
              {erc6909deltaBurn}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={32}>{EstimatedGasUsage}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px] rounded-lg border md:min-w-[450px]"
        >
          <ResizablePanel>{erc6909deltaBurn}</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>ERC6909</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

const sampleTrace: string =
  getMockedComponent2ResponseByIndex(1)?.result.result.failList[0].trace!;
