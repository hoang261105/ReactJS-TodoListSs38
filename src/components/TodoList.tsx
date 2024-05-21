import React, { ChangeEvent, useState } from "react";
import JobItem from "./JobItem";
import { v4 as uuidv4 } from "uuid";

type Job = {
  id: string;
  name: string;
  status: boolean;
};

export default function TodoList() {
  const [inputValue, setValue] = useState<string>(""); // State để lưu trữ trong input
  const [showError, setError] = useState<boolean>(false); // State để kiểm tra trạng thái ẩn hiện lỗi
  const [stateFake, setStateFake] = useState<number>(0);
  const [typeButton, setTypeButton] = useState<string>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [jobLocal, setJobLocal] = useState<Job[]>(() => {
    // Lấy dữ liệu lên local
    const jobs = localStorage.getItem("jobs");

    // Kiểm tra xem trên local có dữ liệu k, nếu có ép kiểu từ JSON thành JS, nếu không có sẽ là []
    const listJob = jobs ? JSON.parse(jobs) : [];
    return listJob;
  });
  console.log(inputValue);

  const saveToLocal = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
    setJobLocal(value);
  };

  // Lấy giá trị trong ô input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Cập nhật giá trị của state
    setValue(e.target.value);

    // Validate dữ liệu
    if (!e.target.value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  // Hàm thêm mới cv
  const handleCreate = () => {
    // Kiểm tra điều kiên input đã có dữ liệu chưa
    if (inputValue) {
      // Tạo đối tượng job
      const job: Job = {
        id: uuidv4(),
        name: inputValue,
        status: false,
      };
      // console.log(job);
      // setJobLocal([...jobLocal, job])

      jobLocal.push(job);

      // Lưu lên local
      saveToLocal("jobs", jobLocal);

      // Reset lại giá trị trong ô input
      setValue("");
    }
  };

  // Hàm xử lý thay đổi trạng thái cv
  const handleChangeStatus = (id: string) => {
    const findIndex = jobLocal.findIndex((job: Job) => job.id === id);

    // Thay đổi trạng thái công việc
    if (findIndex === -1) {
      alert("Không tìm thấy");
    } else {
      jobLocal[findIndex].status = !jobLocal[findIndex].status;

      // Lưu dữ liệu lên local
      saveToLocal("jobs", jobLocal);

      // Cập nhật lại state của component
      setStateFake(Math.random());
    }
  };

  // Hàm xóa công việc
  const handleDelete = (id: string) => {
    const findJob = jobLocal.find((job: Job) => job.id === id);

    if (findJob) {
      const confirmDelete = confirm(
        `Bạn có chắc chắn muốn xóa công việc ${findJob.name} không?`
      );
      if (confirmDelete) {
        const filterJob = jobLocal.filter((job: Job) => job.id !== id);
        saveToLocal("jobs", filterJob);
      }
    }
  };

  // Hàm tính tổng số công việc đã hoàn thành
  const totalCount = () => {
    // Lọc ra những công việc có status = true
    const filteSuccess = jobLocal.filter((job: Job) => {
      return job.status === true;
    });

    // Trả về độ dài của mảng
    return filteSuccess.length;
  };

  // Sửa công việc
  const handleEdit = (id: string) => {
    const editJobs = jobLocal.find((job: Job) => job.id === id);
    if (editJobs) {
      // Gán tên công việc lên ô input
      setValue(editJobs.name);
      setTypeButton("update");
      setEditingId(id);
    } else {
      alert("Không tìm thấy");
    }
  };

  // Lưu tên công việc sau khi sửa
  const handleSave = () => {
    const index = jobLocal.findIndex((job: Job) => job.id === editingId);
    if (index !== -1) {
      jobLocal[index].name = inputValue;
      saveToLocal("jobs", jobLocal);
      setTypeButton("add");
      setValue("");
      setEditingId(null);
    } else {
      alert("Không tìm thấy");
    }
  };

  // Cập nhật lại state của component
  return (
    <div className="todo-container">
      <h2>ToDo List</h2>
      <div className="input-container">
        <input
          type="text"
          id="taskInput"
          placeholder="Add new task..."
          onChange={handleChange}
          value={inputValue}
        />

        {typeButton === "add" ? (
          <>
            <button className="button" onClick={handleCreate}>
              Add Task
            </button>
          </>
        ) : (
          <>
            <button className="button" onClick={handleSave}>
              Update
            </button>
          </>
        )}
      </div>
      {showError && (
        <span className="error">Tên công việc không được để trống</span>
      )}

      <ul id="taskList">
        {/* Render danh sách công việc ra ngoài công việc */}
        {jobLocal.map((job: Job) => (
          <JobItem
            job={job}
            handleChangeStatus={handleChangeStatus}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </ul>
      <p>
        Tasks completed:{" "}
        <span id="completedTasks">
          {totalCount()}/{jobLocal.length}
        </span>
      </p>
    </div>
  );
}
