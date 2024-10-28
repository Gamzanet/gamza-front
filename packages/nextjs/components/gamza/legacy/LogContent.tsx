import { TestLog } from "~~/types/gamza/AnalysisResult";

function LogButton({ openModal, data }: { openModal: () => void; data: TestLog }) {
  const { title, description } = data;

  return (
    <>
      <p className="inline px-2">{title}</p>
      <button className="btn btn-info" onClick={openModal}>
        details
      </button>
      <p className="inline px-2">{description}</p>
    </>
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

function Badge({ type }: { type: string }) {
  const className = type === "pass" ? "badge badge-success gap-2" : "badge badge-error gap-2";
  const text = type === "pass" ? "pass" : type;

  return <div className={className}>{text}</div>;
}

export { LogButton, LogModal, Badge };
