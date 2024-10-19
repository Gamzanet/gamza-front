"use client";

import { Badge, LogButton, LogModal } from "./LogContent";
import { TestLog } from "~~/types/gamza/AnalysisResult";

export default function LogBox(props: { key: string; data: TestLog }) {
  const id: string = props.data.title + props.key;
  const openModal = () => (document.getElementById(id) as HTMLDialogElement).showModal();
  return (
    // TODO: clean up the classes
    <div className="collapse border bg-base-300 hover:bg-violet-200 dark:hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
      <input type="radio" name="my-accordion-1" defaultChecked />
      <div className="collapse-title">
        <header className="text-xl font-bold text-ellipsis">{props.data.summary}</header>
        <Badge type={props.data.pass ? "pass" : props.data.type} />
      </div>
      <div className="collapse-content">
        <LogButton openModal={openModal} data={props.data} />
        <LogModal id={id} data={props.data} />
      </div>
    </div>
  );
}
