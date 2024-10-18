"use client";

import { TestLog } from "~~/types/gamza/AnalysisResult";

export default function LogBox(props: { key: string; data: TestLog }) {
  const id: string = props.data.title + props.key;
  const openModal = () => (document.getElementById(id) as HTMLDialogElement).showModal();
  return (
    <>
      <LogButton openModal={openModal} data={props.data} />
      <LogModal id={id} data={props.data} />
    </>
  );
}

function LogButton({ openModal, data }: { openModal: () => void; data: TestLog }) {
  const { title, pass, type, summary } = data;

  return (
    <button className="btn" onClick={openModal}>
      {title} {pass ? "✅" : "❌"} {type} {summary}
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
