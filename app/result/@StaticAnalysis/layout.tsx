import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function StaticAnalysisLayout({
  children,
  Code,
  List,
}: {
  children: React.ReactNode;

  Code: React.ReactNode;
  List: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {children}

      <div>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px] rounded-lg border md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={75}>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">{Code}</div>
              {/* add here */}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35}>{List}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* add here */}
    </div>
  );
}
