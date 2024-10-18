"use client";

import { TestLog } from "~~/types/gamza/AnalysisResult";

export default function LogBox(props: { key: string; data: TestLog }) {
  const id: string = props.data.title + props.key;
  const openModal = () => (document.getElementById(id) as HTMLDialogElement).showModal();
  return (
    // TODO: clean up the classes
    <div className="collapse bg-base-200 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
      <input type="radio" name="my-accordion-1" defaultChecked />
      <div className="collapse-title text-xl font-medium">
        {props.data.title} <Badge type={props.data.pass ? "passed" : "error"} />
      </div>
      <div className="collapse-content">
        <LogButton openModal={openModal} data={props.data} />
        <LogModal id={id} data={props.data} />
      </div>
    </div>
  );
}

function LogButton({ openModal, data }: { openModal: () => void; data: TestLog }) {
  const { title, pass, type, summary } = data;

  return (
    <button className="btn" onClick={openModal}>
      {title} <Badge type={pass ? "passed" : "error"} /> {type} {summary}
    </button>
  );
}

function LogModal(props: { id: string; data: TestLog }) {
  const { id, data } = props;
  const { title, summary, description, trace } = data;

  return (
    <dialog id={id} className="modal">
      {/* Notes: title of each test should be unique */}
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{summary}</p>
        <p className="py-4">{description}</p>
        <p className="py-4">{trace}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

type BadgeProps = {
  type: "passed" | "error";
};

function Badge({ type }: BadgeProps) {
  const className = type === "passed" ? "badge badge-success gap-2" : "badge badge-error gap-2";
  const text = type === "passed" ? "passed" : "error";

  return <div className={className}>{text}</div>;
}
