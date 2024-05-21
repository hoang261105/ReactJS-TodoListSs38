type Job = {
  id: string;
  name: string;
  status: boolean;
};

type Jobs = {
  job: Job;
  handleChangeStatus: (id: string) => void;
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
};
export default function JobItem({
  job,
  handleChangeStatus,
  handleDelete,
  handleEdit,
}: Jobs) {
  const handleChecked = (id: string) => {
    handleChangeStatus(id);
  };
  return (
    <>
      <li key={job.id}>
        <input
          type="checkbox"
          id="task1"
          checked={job.status}
          onChange={() => handleChecked(job.id)}
        />
        <label htmlFor="task1">
          {job.status ? <s>{job.name}</s> : <p>{job.name}</p>}
        </label>
        {job.status === true ? (
          <></>
        ) : (
          <button onClick={() => handleEdit(job.id)}>Sửa</button>
        )}
        <button onClick={() => handleDelete(job.id)}>Delete</button>
      </li>
    </>
  );
}
